import { tcv_FirebaseAuth } from "../firebase/auth";
import { tcv_HandlerError } from "./handler";
import { tcv_Route } from "./route";
import splashScreen from "../../../templates/splash-screen.html";
import splashScreenLoading from "../../../templates/loading-2.html";
import contentLoading from "../../../templates/loading.html";
import appShell from "../../../templates/appshell.html";
import { tcv_Display } from "./components";

export const tcv_Util = {
    noScrollRestoration: (): void => {
        // Remove scroll restoration
        if (history.scrollRestoration) {
            history.scrollRestoration = "manual";
        } else {
            window.onbeforeunload = () => {
                window.scrollTo(0, 0);
            };
        }
    },
    unbindAll: (): void => {
        $().off();
        $(window).off();
        $("body").removeAttr("class").removeAttr("id");
    },
    call(): void {
        this.noScrollRestoration();
        this.unbindAll();
        // Check login state
        tcv_FirebaseAuth
            .checkSession()
            .then((loginState: boolean) => {
                let toRemove: string;
                if (loginState) {
                    if (!$("aside").length) {
                        $("body").addClass("g-sidenav-show bg-gray-100").append(appShell);
                        import("@popperjs/core");
                        import("../../../vendor/soft-ui-dashboard/js/core/bootstrap.min");
                        import("../../../vendor/soft-ui-dashboard/js/soft-ui-dashboard");
                        tcv_Display.appShellHandler();
                    } else {
                        $("body").addClass("g-sidenav-show bg-gray-100");
                    }
                }
                if ($(".tcv-content").length) {
                    $(".tcv-content").html(contentLoading);
                    $("body").addClass("overflow-hidden");
                    toRemove = ".content-loading";
                } else {
                    if (sessionStorage.getItem("splash-screen") !== null) {
                        $("body").html(splashScreenLoading).addClass("overflow-hidden");
                        toRemove = ".center-content";
                    } else {
                        $("body").html(splashScreen).addClass("overflow-hidden");
                        sessionStorage.setItem("splash-screen", "true");
                        toRemove = ".splash-screen";
                    }
                }

                tcv_Route.init(loginState, toRemove);
            })
            .catch((error) => {
                console.error(error);
                tcv_HandlerError.show_NoConfirm("Error message : Firebase auth failed to check user session\n Please contact the administrator regarding this issue.");
            });
    },
    goToPage(): void {
        setTimeout(() => {
            this.call();
        }, 300);
    },
};
