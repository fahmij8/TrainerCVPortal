import { getUserInfo } from "./app-login.js";

const addUserData = () => {
    let obj;
    getUserInfo().then((data) => {
        obj = {
            name: data.displayName,
            mail: data.email,
            module1_score: 0,
            module2_score: 0,
            module3_score: 0,
            module4_score: 0,
        };
        firebase
            .database()
            .ref(data.uid)
            .once("value", (snapshot) => {
                if (!snapshot.exists()) {
                    firebase.database().ref(data.uid).set(obj);
                }
            });
    });
};

export { addUserData };
