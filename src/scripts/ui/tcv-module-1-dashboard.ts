import dashboard from "../../templates/module-1-dashboard.html";
import { tcv_Display, tcv_Templates } from "../utilities/display/components";
import { tcv_Util } from "../utilities/display/util";
import { tcv_FirebaseDB } from "../utilities/firebase/rtdb";

export const displayModuleOneDashboard = (toRemove: string): void => {
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
                    tcv_Util.buildMonitoring(
                        (mailEdited, antaresApp, antaresDevice, antaresKey) => {
                            tcv_FirebaseDB.postData(`users/${mailEdited}/module1_score/bonus_score`, 1);
                            setInterval(async () => {
                                await tcv_Util.getDataAntares(antaresApp, antaresDevice, antaresKey).then((data) => {
                                    const ledStates = JSON.parse(data["m2m:cin"]["con"]);
                                    if (typeof ledStates["led"] === "string" || typeof ledStates["led"] === "number") {
                                        let statesToShow = ledStates["led"];
                                        if (typeof statesToShow === "string") {
                                            statesToShow = parseInt(statesToShow);
                                        }
                                        if (statesToShow) {
                                            $(".module-1-lamp-card").addClass("bg-gradient-primary text-white");
                                            $(".module-1-lamp-status").html("On");
                                            $("#module-1-lamp").prop("checked", true);
                                            $(".module-1-lamp-lu").html(`Last updated : ${new Date().toLocaleString()}`);
                                        } else {
                                            $(".module-1-lamp-card").removeClass("bg-gradient-primary text-white");
                                            $(".module-1-lamp-status").html("Off");
                                            $("#module-1-lamp").prop("checked", false);
                                            $(".module-1-lamp-lu").html(`Last updated : ${new Date().toLocaleString()}`);
                                        }
                                    } else {
                                        tcv_Util.stopMonitoring(`<span class="badge badge-danger">Error</span>`);
                                        throw new Error("[ERROR] Monitoring could not be continued due to invalid payload");
                                    }
                                });
                            }, 4000);
                        },
                        ["led"]
                    );
                },
                async () => {
                    console.info("[INFO] Antares Application Data is not valid");
                }
            );
        });
    }, toRemove);
};
