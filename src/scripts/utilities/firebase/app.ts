import { FirebaseApp, initializeApp } from "firebase/app";
import { StringKeyObject } from "../interface";

export const firebaseInitApp = (): FirebaseApp => {
    const firebaseConfig: StringKeyObject = {
        apiKey: "AIzaSyD9ZCpMxxFM6tqglgUJlwNp54HkJuXUaOY",
        authDomain: "trainercv-dpte.firebaseapp.com",
        databaseURL: "https://trainercv-dpte-default-rtdb.firebaseio.com",
        projectId: "trainercv-dpte",
        storageBucket: "trainercv-dpte.appspot.com",
        messagingSenderId: "1000586840327",
        appId: "1:1000586840327:web:32a6870366327b0cde5da2",
        measurementId: "G-CSWZXZZB6K",
    };

    // Initialize Firebase
    return initializeApp(firebaseConfig);
};
