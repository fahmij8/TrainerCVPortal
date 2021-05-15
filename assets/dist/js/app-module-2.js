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
            $("#module2-monitor").hide();
            $("#module2-stopmonitor").show();
            doHeavyTask({
                totalMillisAllotted: 999999 * 5000,
                totalTasks: 999999,
                tasksPerTick: 1,
                task: (n) => {
                    getData(endpoint, accesskey)
                        .then((data) => {
                            if (data.led1 !== undefined && data.led2 !== undefined && data.led3 !== undefined && data.motor !== undefined) {
                                secondModuleGrading();
                                if (data.led1 === 1) {
                                    $("#led1-check").prop("checked", true);
                                    $(".led1-status").html("On");
                                    $("#led1-src").attr("src", "./assets/images/comp-ledon.png");
                                } else {
                                    $("#led1-check").prop("checked", false);
                                    $(".led1-status").html("Off");
                                    $("#led1-src").attr("src", "./assets/images/comp-ledoff.png");
                                }
                                if (data.led2 === 1) {
                                    $("#led2-check").prop("checked", true);
                                    $(".led2-status").html("On");
                                    $("#led2-src").attr("src", "./assets/images/comp-ledon.png");
                                } else {
                                    $("#led2-check").prop("checked", false);
                                    $(".led2-status").html("Off");
                                    $("#led2-src").attr("src", "./assets/images/comp-ledoff.png");
                                }
                                if (data.led3 === 1) {
                                    $("#led3-check").prop("checked", true);
                                    $(".led3-status").html("On");
                                    $("#led3-src").attr("src", "./assets/images/comp-ledon.png");
                                } else {
                                    $("#led3-check").prop("checked", false);
                                    $(".led3-status").html("Off");
                                    $("#led3-src").attr("src", "./assets/images/comp-ledoff.png");
                                }
                                if (data.motor === 1) {
                                    $("#motor-check").prop("checked", true);
                                    $(".motor-status").html("On");
                                } else {
                                    $("#motor-check").prop("checked", false);
                                    $(".motor-status").html("Off");
                                }
                            } else {
                                console.error("Error!");
                                secondModuleStop("endpoint");
                            }
                            $("#led1-lu").html(`Last Updated : Today, ${new Date().toLocaleTimeString()}`);
                            $("#led2-lu").html(`Last Updated : Today, ${new Date().toLocaleTimeString()}`);
                            $("#led3-lu").html(`Last Updated : Today, ${new Date().toLocaleTimeString()}`);
                            $("#motor-lu").html(`Last Updated : Today, ${new Date().toLocaleTimeString()}`);
                        })
                        .catch((error) => {
                            secondModuleStop();
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

const secondModuleStart = () => {
    $("#module2-stopmonitor").hide();
    $("#module2-monitor").click(() => {
        checkInput();
    });
    $("#module2-stopmonitor").click(() => {
        secondModuleStop();
    });
};

const secondModuleStop = (arg = "") => {
    clearHeavyTask(arg);
    $("#module2-monitor").show();
    $("#module2-stopmonitor").hide();
};

const secondModuleGrading = () => {
    getUserInfo()
        .then((data) => {
            let mailEdited = data.email.replace(".", "");
            firebase
                .database()
                .ref(`users/${mailEdited}`)
                .once("value", (snapshot) => {
                    let dbJson = snapshot.val();
                    if (dbJson.module2_score.step3 !== 0 && dbJson.module2_score.step4 === 0) {
                        firebase
                            .database()
                            .ref(`users/${mailEdited}/module2_score/step4`)
                            .set(100, (error) => {
                                if (error) {
                                    secondModuleStop();
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
                    } else if (dbJson.module2_score.step4 !== 0) {
                        //pass this
                    } else {
                        secondModuleStop("module2_warn");
                    }
                });
        })
        .catch((error) => {
            secondModuleStop();
            Toast.fire({
                icon: "error",
                title: "Error in getting user data",
            });
            console.log(error);
        });
};

export { secondModuleStart };
