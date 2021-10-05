import dashboard from "../../templates/module-3-dashboard.html";
import { tcv_Display } from "../utilities/display/components";
import { tcv_Util } from "../utilities/display/util";
import { tcv_FirebaseAuth } from "../utilities/firebase/auth";
import { tcv_FirebaseDB } from "../utilities/firebase/rtdb";
import LCD from "dot-matrix-lcd";

export const displayModuleThreeDashboard = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $(".tcv-content").append(dashboard).addClass("invisible");
        $(() => {
            const lcd = new LCD({
                elem: document.getElementById("lcd-container"),
                rows: 2,
                columns: 16,
                pixelSize: 3,
                pixelColor: "#000",
            });
            $("#lcd-container > canvas").attr("style", "width:100%");
            if (localStorage.getItem("IoT")) {
                const localCredentials = JSON.parse(localStorage.getItem("IoT"));
                $("#module-app").val(localCredentials.app);
                $("#module-m2m").val(localCredentials.m2m);
            }
            tcv_Util.formValidation(
                ".needs-validation",
                async () => {
                    if ($(".module-monitor").data("monitoring") == 0) {
                        $(".module-monitor-status").html(`Monitoring Status : <span class="badge badge-warning">Processing</span>`);
                        const antaresApp = $("#module-app").val();
                        const antaresDevice = $("#module-device").val();
                        const antaresKey = $("#module-m2m").val();
                        await tcv_Util
                            .getDataAntares(antaresApp, antaresDevice, antaresKey)
                            .then(() => {
                                $(".module-monitor").data("monitoring", "1");
                                $(".module-monitor-status").html(`Monitoring Status : <span class="badge badge-success">Running</span>`);
                                $(".module-monitor").html(`Stop Monitoring`);
                                localStorage.setItem(
                                    "IoT",
                                    JSON.stringify({
                                        app: antaresApp,
                                        m2m: antaresKey,
                                    })
                                );
                                const user = tcv_FirebaseAuth.currentUser();
                                const mailEdited = user.email.replace(".", "");
                                tcv_FirebaseDB.postData(`users/${mailEdited}/module3_score/bonus_score`, 1);
                                setInterval(async () => {
                                    await tcv_Util.getDataAntares(antaresApp, antaresDevice, antaresKey).then((data) => {
                                        const ledStates = JSON.parse(data["m2m:cin"]["con"]);
                                        const result = ledStates["color"];
                                        lcd.writeString({
                                            string: result,
                                            offset: 0,
                                        });
                                        if (result.length < 15) {
                                            lcd.blinkCursor({
                                                blockIndex: result.length,
                                                stop: false,
                                            });
                                        }
                                        $(".module-3-lcd-lu").html(`Last updated : ${new Date().toLocaleString()}`);
                                    });
                                }, 4000);
                            })
                            .catch((error) => {
                                $(".module-monitor").data("monitoring", "0");
                                $(".module-monitor-status").html(`Monitoring Status : <span class="badge badge-danger">Error</span>`);
                                $(".module-monitor").html(`Start Monitoring`);
                                console.error(error);
                            });
                    } else {
                        for (let i = 0; i < 9999; i++) {
                            window.clearInterval(i);
                        }
                        $(".module-monitor").data("monitoring", "0");
                        $(".module-monitor-status").html(`Monitoring Status : <span class="badge badge-secondary">Stopped</span>`);
                        $(".module-monitor").html(`Start Monitoring`);
                    }
                },
                async () => {
                    console.info("[INFO] Antares Application Data is not valid");
                }
            );
        });
    }, toRemove);
};
