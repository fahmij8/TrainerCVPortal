import { Toast } from "./app-display-utilities.js";
import { getData, doHeavyTask, clearHeavyTask } from "./app-antares.js";
import { getUserInfo } from "./app-login.js";

const checkInput = () => {
    let endpoint = $("#antares-endpoint").val();
    let accesskey = $("#antares-access").val();
    if (endpoint === "" || accesskey === "" || (endpoint === "" && accesskey === "")) {
        Toast.fire({
            icon: "error",
            title: "Please fill all settings!",
        });
    } else {
        if ((endpoint.includes("http://") || endpoint.includes("https://")) && accesskey.includes(":")) {
            $("#module1-monitor").hide();
            $("#module1-stopmonitor").show();
            doHeavyTask({
                totalMillisAllotted: 999999 * 5000,
                totalTasks: 999999,
                tasksPerTick: 1,
                task: (n) => {
                    getData(endpoint, accesskey)
                        .then((data) => {
                            if (data.led !== undefined) {
                                firstModuleGrading();
                                if (data.led === 1) {
                                    $("#led-check").prop("checked", true);
                                    $(".led-status").html("On");
                                    $("#led-src").attr("src", "./assets/images/comp-ledon.png");
                                } else {
                                    $("#led-check").prop("checked", false);
                                    $(".led-status").html("Off");
                                    $("#led-src").attr("src", "./assets/images/comp-ledoff.png");
                                }
                            } else {
                                console.error("Error!");
                                firstModuleStop("endpoint");
                            }
                            $("#led-lu").html(`Last Updated : Today, ${new Date().toLocaleTimeString()}`);
                        })
                        .catch((error) => {
                            firstModuleStop();
                            console.error(error);
                            Toast.fire({
                                icon: "error",
                                title: "Check your internet connection and endpoint!",
                            });
                        });
                },
            });
        } else {
            Toast.fire({
                icon: "error",
                title: "Fill the settings correctly!",
            });
        }
    }
};

const firstModuleStart = () => {
    $("#module1-stopmonitor").hide();
    $("#module1-monitor").click(() => {
        checkInput();
    });
    $("#module1-stopmonitor").click(() => {
        firstModuleStop();
    });
};

const firstModuleStop = (arg = "") => {
    clearHeavyTask(arg);
    $("#module1-monitor").show();
    $("#module1-stopmonitor").hide();
};

const firstModuleGrading = () => {
    getUserInfo()
        .then((data) => {
            firebase
                .database()
                .ref(`users/${data.uid}`)
                .once("value", (snapshot) => {
                    let dbJson = snapshot.val();
                    if (dbJson.module1_score.step3 !== 0 && dbJson.module1_score.step4 === 0) {
                        firebase
                            .database()
                            .ref(`users/${data.uid}/module1_score/step4`)
                            .set(100, (error) => {
                                if (error) {
                                    firstModuleStop();
                                    Toast.fire({
                                        icon: "error",
                                        title: "Error in grading!",
                                    });
                                    console.log(error);
                                } else {
                                    Toast.fire({
                                        icon: "success",
                                        title: "You've passed module 4!",
                                    });
                                }
                            });
                    } else if (dbJson.module1_score.step4 !== 0) {
                        //pass this
                    } else {
                        firstModuleStop("module1_warn");
                    }
                });
        })
        .catch((error) => {
            firstModuleStop();
            Toast.fire({
                icon: "error",
                title: "Error in getting user data",
            });
            console.log(error);
        });
};

export { firstModuleStart };
