import dashboard from "../../templates/module-2-dashboard.html";
import { tcv_Display, tcv_Templates } from "../utilities/display/components";
import { tcv_Util } from "../utilities/display/util";
import { tcv_FirebaseFirestore } from "../utilities/firebase/firestore";

export const displayModuleTwoDashboard = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $(".tcv-content").append(dashboard).addClass("invisible");
        $(".module-intro").append(tcv_Templates.modulesIntroduction);
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
                        tcv_Util.buildMonitoring(
                            (mailEdited, antaresApp, antaresDevice, antaresKey) => {
                                tcv_FirebaseFirestore.updateData("users", mailEdited, { "module2_score.bonus_score": 1 });
                                setInterval(async () => {
                                    await tcv_Util.getDataAntares(antaresApp, antaresDevice, antaresKey).then((data) => {
                                        const ledStates = JSON.parse(data["m2m:cin"]["con"]);
                                        if (typeof ledStates["decision"] === "string" || typeof ledStates["decision"] === "number") {
                                            let statesToShow = ledStates["decision"];
                                            if (typeof statesToShow === "string") {
                                                statesToShow = parseInt(statesToShow);
                                            }
                                            if (statesToShow == 1) {
                                                $(".module-2-lamp-card-1").addClass("bg-gradient-primary text-white");
                                                $(".module-2-lamp-status-1").html("On");
                                                $("#module-2-lamp-1").prop("checked", true);
                                                $(".module-2-lamp-lu-1").html(`Last updated : ${new Date().toLocaleString()}`);
                                                $(".module-2-lamp-card-2").removeClass("bg-gradient-primary text-white");
                                                $(".module-2-lamp-status-2").html("Off");
                                                $("#module-2-lamp-2").prop("checked", false);
                                                $(".module-2-lamp-lu-2").html(`Last updated : ${new Date().toLocaleString()}`);
                                            } else if (statesToShow == 2) {
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
                                        } else {
                                            tcv_Util.stopMonitoring(`<span class="badge badge-danger">Error</span>`);
                                            throw new Error("[ERROR] Monitoring could not be continued due to invalid payload");
                                        }
                                    });
                                }, 4000);
                            },
                            ["decision"]
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
