import { FirebaseApp, getApps } from "@firebase/app";
import { firebaseInitApp } from "../firebase/app";

const tcvUtil = (): void => {
    // No scroll restoration, always move page to top everytime page changes
    if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
    } else {
        window.onbeforeunload = () => {
            window.scrollTo(0, 0);
        };
    }
};

export const tcvInitApp = (): void => {
    const listApp: FirebaseApp[] = getApps();
    if (listApp.length === 0) {
        firebaseInitApp();
        tcvUtil();
        console.info("[!] App initialized!");
    } else {
        console.info("[!] App already initialized!");
    }
};
