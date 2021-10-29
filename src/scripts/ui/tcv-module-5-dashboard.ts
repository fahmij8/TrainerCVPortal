import dashboard from "../../templates/module-5-dashboard.html";
import { tcv_Display, tcv_Templates } from "../utilities/display/components";
import { tcv_Util } from "../utilities/display/util";
import { tcv_FirebaseFirestore } from "../utilities/firebase/firestore";

export const displayModuleFiveDashboard = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $(".tcv-content").append(dashboard).addClass("invisible");
        $(".module-intro").append(tcv_Templates.modulesIntroduction);
        $(() => {
            if (!navigator.onLine) {
                $(".module-monitor").attr("disabled", "");
            }
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
                                tcv_FirebaseFirestore.updateData("users", mailEdited, { "module5_score.bonus_score": 1 });
                                setInterval(async () => {
                                    await tcv_Util.getDataAntares(antaresApp, antaresDevice, antaresKey).then((data) => {
                                        const ledStates = JSON.parse(data["m2m:cin"]["con"]);
                                        if (typeof ledStates["number"] === "string" || typeof ledStates["number"] === "number") {
                                            let statesToShow = ledStates["number"];
                                            if (typeof statesToShow === "string") {
                                                statesToShow = parseInt(statesToShow);
                                            }
                                            if (statesToShow === 1) {
                                                $(".module-5-lamp-card").removeClass("bg-gray-100 bg-gray-300 bg-gray-500 bg-gray-700 bg-gray-900 text-dark text-light");
                                                $(".module-5-lamp-card").addClass("bg-gray-100 text-dark");
                                                $(".module-5-lamp-number").html(`Number Detected : ${statesToShow}`);
                                                $("#module-5-lamp").prop("checked", true);
                                                $(".module-5-lamp-lu").html(`Last updated : ${new Date().toLocaleString()}`);
                                            } else if (statesToShow === 2) {
                                                $(".module-5-lamp-card").removeClass("bg-gray-100 bg-gray-300 bg-gray-500 bg-gray-700 bg-gray-900 text-dark text-light");
                                                $(".module-5-lamp-card").addClass("bg-gray-300 text-dark");
                                                $(".module-5-lamp-number").html(`Number Detected : ${statesToShow}`);
                                                $("#module-5-lamp").prop("checked", true);
                                                $(".module-5-lamp-lu").html(`Last updated : ${new Date().toLocaleString()}`);
                                            } else if (statesToShow === 3) {
                                                $(".module-5-lamp-card").removeClass("bg-gray-100 bg-gray-300 bg-gray-500 bg-gray-700 bg-gray-900 text-dark text-light");
                                                $(".module-5-lamp-card").addClass("bg-gray-500 text-dark");
                                                $(".module-5-lamp-number").html(`Number Detected : ${statesToShow}`);
                                                $("#module-5-lamp").prop("checked", true);
                                                $(".module-5-lamp-lu").html(`Last updated : ${new Date().toLocaleString()}`);
                                            } else if (statesToShow === 4) {
                                                $(".module-5-lamp-card").removeClass("bg-gray-100 bg-gray-300 bg-gray-500 bg-gray-700 bg-gray-900 text-dark text-light");
                                                $(".module-5-lamp-card").addClass("bg-gray-700 text-light");
                                                $(".module-5-lamp-number").html(`Number Detected : ${statesToShow}`);
                                                $("#module-5-lamp").prop("checked", true);
                                                $(".module-5-lamp-lu").html(`Last updated : ${new Date().toLocaleString()}`);
                                            } else if (statesToShow === 5) {
                                                $(".module-5-lamp-card").removeClass("bg-gray-100 bg-gray-300 bg-gray-500 bg-gray-700 bg-gray-900 text-dark text-light");
                                                $(".module-5-lamp-card").addClass("bg-gray-900 text-light");
                                                $(".module-5-lamp-number").html(`Number Detected : ${statesToShow}`);
                                                $("#module-5-lamp").prop("checked", true);
                                                $(".module-5-lamp-lu").html(`Last updated : ${new Date().toLocaleString()}`);
                                            } else {
                                                $(".module-5-lamp-card").removeClass("bg-gray-100 bg-gray-300 bg-gray-500 bg-gray-700 bg-gray-900 text-dark text-light");
                                                $(".module-5-lamp-number").html(`Number Detected : Undefined`);
                                                $("#module-5-lamp").prop("checked", false);
                                                $(".module-5-lamp-lu").html(`Last updated : ${new Date().toLocaleString()}`);
                                            }
                                        } else {
                                            tcv_Util.stopMonitoring(`<span class="badge badge-danger">Error</span>`);
                                            throw new Error("[ERROR] Monitoring could not be continued due to invalid payload");
                                        }
                                    });
                                }, 4000);
                            },
                            ["number"]
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
