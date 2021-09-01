import { DataSnapshot } from "firebase/database";
import dashboard from "../../templates/dashboard.html";
import { tcv_Display } from "../utilities/display/components";
import { tcv_FirebaseAuth } from "../utilities/firebase/auth";
import { tcv_FirebaseDB } from "../utilities/firebase/rtdb";

export const displayDashboard = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $(".tcv-content").append(dashboard).addClass("invisible");
        $(".dashboard-image").attr("src", tcv_FirebaseAuth.currentUser().photoURL);
        $(".dashboard-name").html(`${tcv_FirebaseAuth.currentUser().displayName}`);
        tcv_FirebaseDB.getUserData().then((data: DataSnapshot) => {
            if (data.exists()) {
                $(".dashboard-major").html(`${data.val().major}`);
            }
        });
        $(() => {
            console.log("Good!");
        });
    }, toRemove);
};
