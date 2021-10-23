import dashboard from "../../templates/module-3-dashboard.html";
import { tcv_Display, tcv_Templates } from "../utilities/display/components";
import { tcv_Util } from "../utilities/display/util";
import { tcv_FirebaseFirestore } from "../utilities/firebase/firestore";
import LCD from "dot-matrix-lcd";

export const displayModuleThreeDashboard = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $(".tcv-content").append(dashboard).addClass("invisible");
        $(".module-intro").append(tcv_Templates.modulesIntroduction);
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
                        tcv_Util.buildMonitoring(
                            (mailEdited, antaresApp, antaresDevice, antaresKey) => {
                                tcv_FirebaseFirestore.updateData("users", mailEdited, { "module3_score.bonus_score": 1 });
                                setInterval(async () => {
                                    await tcv_Util.getDataAntares(antaresApp, antaresDevice, antaresKey).then((data) => {
                                        const datas = JSON.parse(data["m2m:cin"]["con"]);
                                        const result = datas["color"];
                                        if (typeof result === "string") {
                                            lcd.clearScreen();
                                            lcd.writeString({
                                                string: result,
                                                offset: 0,
                                            });
                                            if (result.length < 15) {
                                                lcd.blinkCursor({
                                                    blockIndex: result.length,
                                                    stop: true,
                                                });
                                            }
                                            $(".module-3-lcd-lu").html(`Last updated : ${new Date().toLocaleString()}`);
                                        } else {
                                            tcv_Util.stopMonitoring(`<span class="badge badge-danger">Error</span>`);
                                            throw new Error("[ERROR] Monitoring could not be continued due to invalid payload");
                                        }
                                    });
                                }, 4000);
                            },
                            ["color"]
                        );
                    } else {
                        tcv_Util.stopMonitoring(`<span class="badge badge-secondary">Stopped</span>`);
                    }
                },
                async () => {
                    console.info("[INFO] Antares Application Data is not valid");
                }
            );
        });
    }, toRemove);
};
