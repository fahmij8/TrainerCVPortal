import { Toast } from "./app-display-utilities.js";

const parseData = (data) => {
    try {
        data = JSON.parse(JSON.parse(data));
        data = JSON.parse(data["m2m:cin"].con);
        return data;
    } catch (error) {
        Toast.fire({
            icon: "error",
            title: "Parsing data failed!",
        });
        console.error(error);
    }
};

const getData = (destination, accesskey) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://antares-gp.herokuapp.com/get-data.php",
            method: "POST",
            crossDomain: true,
            data: {
                endpoint: destination,
                accesskey: accesskey,
            },
            success: (res) => {
                console.log(`[G : ${new Date().toLocaleTimeString()}] = `, parseData(res));
                resolve(parseData(res));
            },
            error: (res) => {
                console.error(res);
                reject(res);
                Toast.fire({
                    icon: "error",
                    title: "Getting data failed!",
                });
            },
        });
    });
};

const doHeavyTask = (params) => {
    let totalMillisAllotted = params.totalMillisAllotted;
    let totalTasks = params.totalTasks;
    let tasksPerTick = params.tasksPerTick;
    let tasksCompleted = 0;
    let totalTicks = Math.ceil(totalTasks / tasksPerTick);
    let interval = null;

    if (totalTicks === 0) return;

    let doTick = function () {
        let totalByEndOfTick = Math.min(tasksCompleted + tasksPerTick, totalTasks);

        do {
            params.task(tasksCompleted++);
        } while (tasksCompleted < totalByEndOfTick);

        if (tasksCompleted >= totalTasks) clearInterval(interval);
    };

    doTick();
    if (totalTicks > 1) interval = setInterval(doTick, totalMillisAllotted / totalTicks);
};

const clearHeavyTask = (cond = "") => {
    for (var i = 1; i < 9999; i++) window.clearInterval(i);
    if (cond === "module1_warn" || cond === "module2_warn") {
        Toast.fire({
            icon: "error",
            title: "Finish step 3 first!",
        });
    } else if (cond === "endpoint") {
        Toast.fire({
            icon: "error",
            title: "Check your data & endpoint!",
        });
    }
};

export { getData, doHeavyTask, clearHeavyTask };
