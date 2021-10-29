import dashboard from "../../templates/module-4-dashboard.html";
import { tcv_Display, tcv_Templates } from "../utilities/display/components";
import { tcv_Util } from "../utilities/display/util";
import { tcv_FirebaseFirestore } from "../utilities/firebase/firestore";
import LCD from "dot-matrix-lcd";

export const displayModuleFourDashboard = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $(".tcv-content").append(dashboard).addClass("invisible");
        $(".module-intro").append(tcv_Templates.modulesIntroduction);
        $(() => {
            if (!navigator.onLine) {
                $(".module-monitor").attr("disabled", "");
            }
            const lcd = new LCD({
                elem: document.getElementById("lcd-container"),
                rows: 3,
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
                                tcv_FirebaseFirestore.updateData("users", mailEdited, { "module4_score.bonus_score": 1 });
                                setInterval(async () => {
                                    await tcv_Util.getDataAntares(antaresApp, antaresDevice, antaresKey).then((data) => {
                                        const datas = JSON.parse(data["m2m:cin"]["con"]);
                                        const fruit = datas["fruit"];
                                        const ripeness = datas["ripeness"];
                                        let confidence = datas["confidence"];
                                        if (typeof fruit === "string" && typeof ripeness === "string" && (typeof confidence === "number" || typeof confidence === "string")) {
                                            if (typeof confidence === "number") {
                                                confidence = confidence.toString();
                                            }
                                            lcd.clearScreen();
                                            lcd.writeString({
                                                string: fruit,
                                                offset: 0,
                                            });
                                            lcd.writeString({
                                                string: ripeness,
                                                offset: 16,
                                            });
                                            lcd.writeString({
                                                string: `${confidence}%`,
                                                offset: 32,
                                            });
                                            lcd.blinkCursor({
                                                blockIndex: 33 + confidence.length,
                                                stop: true,
                                            });
                                            $(".module-4-lcd-lu").html(`Last updated : ${new Date().toLocaleString()}`);
                                        } else {
                                            tcv_Util.stopMonitoring(`<span class="badge badge-danger">Error</span>`);
                                            throw new Error("[ERROR] Monitoring could not be continued due to invalid payload");
                                        }
                                    });
                                }, 4000);
                            },
                            ["fruit", "ripeness", "confidence"]
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
