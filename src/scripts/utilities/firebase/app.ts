import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "@firebase/firestore";
import { getAuth, setPersistence, indexedDBLocalPersistence } from "firebase/auth";
import { tcv_HandlerError } from "../display/handler";
import { tcv_Util } from "../display/util";
import { StringKeyObject } from "../interface";

export const tcv_FirebaseApp = {
    init: (): [FirebaseApp | null, boolean] => {
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

        const app: FirebaseApp = initializeApp(firebaseConfig);
        if (typeof app !== null || typeof app !== undefined) {
            return [app, true];
        } else {
            return [null, false];
        }
    },
    getLength: (): number => {
        return getApps().length;
    },
    start(): void {
        const countApp: number = this.getLength();
        if (countApp === 0) {
            const initApp = this.init();
            if (initApp[1]) {
                enableIndexedDbPersistence(getFirestore(initApp[0]))
                    .then(() => {
                        setPersistence(getAuth(initApp[0]), indexedDBLocalPersistence);
                        tcv_Util.call();
                    })
                    .catch((error) => {
                        console.error(error);
                        tcv_HandlerError.show_NoConfirm("Firebase Firestore failed to initialize IndexedDB Persistence");
                    });
            } else {
                tcv_HandlerError.show_NoConfirm("Firebase app failed to initialize");
            }
        }
    },
};
