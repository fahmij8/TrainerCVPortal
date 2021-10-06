import loginPage from "../../templates/login.html";
import { tcv_Display } from "../utilities/display/components";
import { tcv_FirebaseAuth } from "../utilities/firebase/auth";

export const displayLogin = (toRemove: string): void => {
    tcv_Display.displayContent(() => {
        $("body").append(loginPage);
        $("body").addClass("bg-gradient-dark");
        $(() => {
            $(".tcv-login").on("click", () => {
                tcv_FirebaseAuth.login();
            });
        });
    }, toRemove);
};
