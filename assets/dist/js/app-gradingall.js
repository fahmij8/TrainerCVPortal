import { getUserInfo } from "./app-login.js";

const displayGrading = () => {
    getUserInfo()
        .then((data) => {
            firebase
                .database()
                .ref(`users/${data.uid}`)
                .once("value", (snapshot) => {
                    let dbJson = snapshot.val();
                    moduleGrading(".mod1", "module1_score", dbJson);
                    moduleGrading(".mod2", "module2_score", dbJson);
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

let moduleGrading = (elem, node, datas) => {
    let step1 = parseInt(datas[node].step1);
    let step2 = parseInt(datas[node].step2);
    let step3 = parseInt(datas[node].step3);
    let step4 = parseInt(datas[node].step4);
    let progress = 0;
    // Table step
    $(`${elem}-1`).html(step1);
    $(`${elem}-2`).html(step2);
    $(`${elem}-3`).html(step3);
    $(`${elem}-4`).html(step4);
    // Table status
    if (step1 === 0 || step2 === 0 || step3 === 0 || step4 === 0) {
        $(`${elem}-status`).addClass("badge-warning");
        $(`${elem}-status`).html("Incomplete");
    } else {
        $(`${elem}-status`).addClass("badge-success");
        $(`${elem}-status`).html("Completed");
    }
    // Table Avg
    $(`${elem}-avg`).html((step1 + step2 + step3 + step4) / 4);
    // Track Progress
    step1 !== 0 ? (progress += 1) : progress;
    step2 !== 0 ? (progress += 1) : progress;
    step3 !== 0 ? (progress += 1) : progress;
    step4 !== 0 ? (progress += 1) : progress;
    $(`${elem}-percentagetext`).html(`${(progress / 4) * 100}%`);
    $(`${elem}-percentage`).css("width", `${(progress / 4) * 100}%`);
    if (progress <= 1) {
        $(`${elem}-percentage`).addClass("bg-danger");
    } else if (progress >= 1 && progress <= 3) {
        $(`${elem}-percentage`).addClass("bg-warning");
    } else {
        $(`${elem}-percentage`).addClass("bg-success");
    }
};

export { displayGrading };
