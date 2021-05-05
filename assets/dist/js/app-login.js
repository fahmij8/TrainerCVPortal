import { routePage } from "./app-route.js";

const firebaseInit = async () => {
    let firebaseConfig = {
        apiKey: "AIzaSyD9ZCpMxxFM6tqglgUJlwNp54HkJuXUaOY",
        authDomain: "trainercv-dpte.firebaseapp.com",
        projectId: "trainercv-dpte",
        storageBucket: "trainercv-dpte.appspot.com",
        messagingSenderId: "1000586840327",
        appId: "1:1000586840327:web:32a6870366327b0cde5da2",
        measurementId: "G-CSWZXZZB6K",
    };
    await firebase.initializeApp(firebaseConfig);
    await firebase.analytics();
};

const getUserInfo = async () => {
    return await firebase.auth().currentUser;
};

const logOut = () => {
    firebase
        .auth()
        .signOut()
        .then(() => {
            window.location.href = "./index.html";
            routePage();
        })
        .catch((error) => {
            console.error(error);
        });
};

export { firebaseInit, getUserInfo, logOut };
