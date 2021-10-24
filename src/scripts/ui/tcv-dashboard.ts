import dashboard from "../../templates/dashboard.html";
import userPic from "../../assets/user.png";
import { tcv_Display } from "../utilities/display/components";
import { tcv_HandleWarning } from "../utilities/display/handler";
import { tcv_FirebaseAuth } from "../utilities/firebase/auth";
import { tcv_FirebaseFirestore } from "../utilities/firebase/firestore";

export const displayDashboard = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $(".tcv-content").append(dashboard).addClass("invisible");
        $(".dashboard-image").attr("src", tcv_FirebaseAuth.currentUser().photoURL);
        $(".dashboard-image").on("error", () => {
            $(".dashboard-image").attr("src", userPic);
        });
        $(".dashboard-name").html(`${tcv_FirebaseAuth.currentUser().displayName}`);
        tcv_FirebaseFirestore.getData("users", tcv_FirebaseAuth.currentUser().email.replace(".", "")).then((data) => {
            if (data.exists()) {
                $(".dashboard-major").html(`${data.data().major}`);
            }
        });
        $(() => {
            $(".tcv-dash-module").on("click", () => {
                tcv_HandleWarning.show_commonWarning("The module will be available soon!");
            });
        });
    }, toRemove);
};
