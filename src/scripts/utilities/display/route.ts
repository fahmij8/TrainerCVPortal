import { displayNotFound } from "../../ui/tcv-404";
import { displayDashboard } from "../../ui/tcv-dashboard";
import { displayLogin } from "../../ui/tcv-login";
import { tcv_FirebaseDB } from "../firebase/rtdb";

export const tcv_Route = {
    init(loginState: boolean, toRemove: string): void {
        if (!loginState) {
            displayLogin(toRemove);
        } else {
            tcv_FirebaseDB.initUserData();
            let page: string = window.location.hash.substr(1);
            if (page === "") page = "dashboard";

            if (page === "dashboard") {
                displayDashboard(toRemove);
            } else {
                displayNotFound(toRemove);
            }
        }
    },
};
