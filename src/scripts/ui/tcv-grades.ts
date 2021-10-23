import * as bootstrap from "../../vendor/soft-ui-dashboard/js/core/bootstrap.min";
import * as simpleDatatables from "../../vendor/soft-ui-dashboard/js/plugins/datatables";
import grades from "../../templates/grades.html";
import { tcv_Display, tcv_Templates } from "../utilities/display/components";
import { tcv_FirebaseFirestore } from "../utilities/firebase/firestore";
import { tcv_FirebaseAuth } from "../utilities/firebase/auth";
import { tcv_HandlerError } from "../utilities/display/handler";
import { tcv_Util } from "../utilities/display/util";
import { Chart } from "../../vendor/soft-ui-dashboard/js/plugins/chartjs.min";

export const displayGrades = (toRemove: string): void => {
    tcv_Display.displayContent(async () => {
        $(".tcv-content").append(grades).addClass("invisible");
        // Fetching Data
        tcv_FirebaseFirestore
            .getData("users", tcv_FirebaseAuth.currentUser().email.replace(".", ""))
            .then(async (data) => {
                if (data.exists()) {
                    const userData = data.data();
                    // Count & Charts overall progress
                    let modules_finished = 0;
                    let modules_inprogress = 0;
                    let modules_notworked = 0;
                    const module_scores = [userData.module1_score, userData.module2_score, userData.module3_score, userData.module4_score, userData.module5_score];
                    module_scores.forEach((modules, index) => {
                        const checkResult = tcv_Util.checkModulesOverall(modules);
                        if (checkResult[0] === "finished") {
                            modules_finished += 1;
                            $(`.tcv-progress-module${index + 1}`).addClass("bg-gradient-success w-100");
                        } else if (checkResult[0] === "in progress") {
                            modules_inprogress += 1;
                            $(`.tcv-progress-module${index + 1}`).addClass(`bg-gradient-warning w-${checkResult[1] * 25}`);
                        } else {
                            modules_notworked += 1;
                            $(`.tcv-progress-module${index + 1}`).addClass("bg-gradient-secondary w-5");
                        }
                        // Details progress bar
                        $(`.tcv-progress-module${index + 1}-text`).html(`${checkResult[1] * 25}%`);
                        // Render data on tables
                        $(".tcv-scores").append(tcv_Templates.scoresSumary(modules, checkResult[0], index));
                    });
                    $(".tcv-grades-overall").html(`${modules_finished} Modules`);

                    const chartGradeOveralll: HTMLCanvasElement = <HTMLCanvasElement>$("#tcv-chart-grade-overall").get(0);
                    const ctx1: CanvasRenderingContext2D = chartGradeOveralll.getContext("2d");

                    new Chart(ctx1, {
                        type: "doughnut",
                        data: {
                            labels: ["Done", "In progress", "Incompleted"],
                            datasets: [
                                {
                                    label: "Computer Vision Modules - Overall Progress",
                                    weight: 9,
                                    cutout: 50,
                                    tension: 0.9,
                                    pointRadius: 2,
                                    borderWidth: 2,
                                    backgroundColor: ["#8CE62E", "#F9A035", "#a8b8d8"],
                                    data: [modules_finished, modules_inprogress, modules_notworked],
                                    fill: false,
                                },
                            ],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false,
                                },
                            },
                            interaction: {
                                intersect: false,
                                mode: "index",
                            },
                            scales: {
                                y: {
                                    grid: {
                                        drawBorder: false,
                                        display: false,
                                        drawOnChartArea: false,
                                        drawTicks: false,
                                    },
                                    ticks: {
                                        display: false,
                                    },
                                },
                                x: {
                                    grid: {
                                        drawBorder: false,
                                        display: false,
                                        drawOnChartArea: false,
                                        drawTicks: false,
                                    },
                                    ticks: {
                                        display: false,
                                    },
                                },
                            },
                        },
                    });

                    // Initializing datatables
                    await new simpleDatatables.DataTable("#tcv-grades", {
                        searchable: false,
                        fixedHeight: true,
                    });
                }
            })
            .catch((error) => {
                console.error(error);
                tcv_HandlerError.show_NoConfirm("Failed to fetch user data, please check your internet connection");
            });

        $(() => {
            // Tootltip Initialization
            setTimeout(() => {
                const tooltipTriggerList: [] = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
            }, 1000);
        });
    }, toRemove);
};
