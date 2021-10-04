import dashboard from "../../templates/module-2-dashboard.html";
import { tcv_Display } from "../utilities/display/components";
import { tcv_Util } from "../utilities/display/util";
import { tcv_FirebaseAuth } from "../utilities/firebase/auth";
import { tcv_FirebaseDB } from "../utilities/firebase/rtdb";

export const displayModuleTwoDashboard = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $(".tcv-content").append(dashboard).addClass("invisible");
        $(() => {
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
                                tcv_FirebaseDB.postData(`users/${mailEdited}/module2_score/bonus_score`, 1);
                                setInterval(async () => {
                                    await tcv_Util.getDataAntares(antaresApp, antaresDevice, antaresKey).then((data) => {
                                        const ledStates = JSON.parse(data["m2m:cin"]["con"]);
                                        if (ledStates["decision"] == 1) {
                                            $(".module-2-lamp-card-1").addClass("bg-gradient-primary text-white");
                                            $(".module-2-lamp-status-1").html("On");
                                            $("#module-2-lamp-1").prop("checked", true);
                                            $(".module-2-lamp-lu-1").html(`Last updated : ${new Date().toLocaleString()}`);
                                            $(".module-2-lamp-card-2").removeClass("bg-gradient-primary text-white");
                                            $(".module-2-lamp-status-2").html("Off");
                                            $("#module-2-lamp-2").prop("checked", false);
                                            $(".module-2-lamp-lu-2").html(`Last updated : ${new Date().toLocaleString()}`);
                                        } else if (ledStates["decision"] == 2) {
                                            $(".module-2-lamp-card-1").removeClass("bg-gradient-primary text-white");
                                            $(".module-2-lamp-status-1").html("Off");
                                            $("#module-2-lamp-1").prop("checked", false);
                                            $(".module-2-lamp-lu-1").html(`Last updated : ${new Date().toLocaleString()}`);
                                            $(".module-2-lamp-card-2").addClass("bg-gradient-primary text-white");
                                            $(".module-2-lamp-status-2").html("On");
                                            $("#module-2-lamp-2").prop("checked", true);
                                            $(".module-2-lamp-lu-2").html(`Last updated : ${new Date().toLocaleString()}`);
                                        } else {
                                            $(".module-2-lamp-card-1").removeClass("bg-gradient-primary text-white");
                                            $(".module-2-lamp-status-1").html("Off");
                                            $("#module-2-lamp-1").prop("checked", false);
                                            $(".module-2-lamp-lu-1").html(`Last updated : ${new Date().toLocaleString()}`);
                                            $(".module-2-lamp-card-2").removeClass("bg-gradient-primary text-white");
                                            $(".module-2-lamp-status-2").html("Off");
                                            $("#module-2-lamp-2").prop("checked", false);
                                            $(".module-2-lamp-lu-2").html(`Last updated : ${new Date().toLocaleString()}`);
                                        }
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
