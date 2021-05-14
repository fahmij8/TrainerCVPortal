import { getUserInfo } from "./app-login.js";

const addUserData = () => {
    let obj;
    getUserInfo().then((data) => {
        let mailEdited = data.email.replace(".", "");
        obj = {
            name: data.displayName,
            module1_score: {
                step1: 0,
                step2: 0,
                step3: 0,
                step4: 0,
            },
            module2_score: {
                step1: 0,
                step2: 0,
                step3: 0,
                step4: 0,
            },
            module3_score: {
                step1: 0,
                step2: 0,
                step3: 0,
                step4: 0,
            },
            module4_score: {
                step1: 0,
                step2: 0,
                step3: 0,
                step4: 0,
            },
        };
        firebase
            .database()
            .ref(`users/${mailEdited}`)
            .once("value", (snapshot) => {
                if (!snapshot.exists()) {
                    firebase.database().ref(`users/${mailEdited}`).set(obj);
                }
            });
    });
};

export { addUserData };
