import { tcv_FirebaseAuth } from "../firebase/auth";
import { tcv_HandlerError } from "./handler";
import { tcv_Util } from "./util";

export const tcv_Display = {
    appShellHandler(): void {
        $(".nav-link")
            .not("[aria-expanded]")
            .on("click", () => {
                tcv_Util.goToPage();
            });
        $(".tcv-logout").on("click", (): void => {
            tcv_FirebaseAuth.logout();
        });
        this.appShellPhoto();
    },
    appShellPhoto(): void {
        $(".appshell-image").attr("src", tcv_FirebaseAuth.currentUser().photoURL);
    },
    displayContent(content: () => void, toRemove: string): void {
        const load = new Promise((resolve: (value: boolean | PromiseLike<boolean>) => void, reject: (reason?: unknown) => void): void => {
            try {
                Promise.all([content()])
                    .then(() => resolve(true))
                    .catch((error) => reject(error));
            } catch (error: unknown) {
                reject(error);
            }
        });
        load.then((result: boolean) => {
            result ? this.removeLoader(toRemove) : undefined;
        }).catch((error) => {
            console.error(error);
            tcv_HandlerError.show_NoConfirm("Error message : Failed to display pages\n Please contact the administrator regarding this issue.");
        });
    },
    removeLoader(target: string): void {
        if (target !== "nothing") {
            $(".tcv-content").removeClass("invisible");
            $(target)
                .delay(1000)
                .fadeOut(1000, () => {
                    $(target).remove();
                });
        }
    },
};
