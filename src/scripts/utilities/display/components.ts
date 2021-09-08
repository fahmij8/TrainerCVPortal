/**
 * Components Modules :
 * - Global display handler
 * - HTML Templates (Components)
 */

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
            tcv_HandlerError.show_NoConfirm("Failed to display pages");
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

export const tcv_Templates = {
    newUsers: `
    <p>Please fill the data carefully!</p>
    <form class="needs-validation d-block mx-auto text-start" style="max-width:400px">
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label for="tcv-nim">NIM</label>
                    <input type="number" min="1800000" class="form-control" id="tcv-nim" placeholder="1801389" required>
                    <div class="invalid-feedback">Please type a valid NIM</div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label for="tcv-tel">WhatsApp Number</label>
                    <div class="row">
                        <div class="col-3">
                            <input type="text" value="62" class="form-control" disabled="">
                        </div>
                        <div class="col-9">
                            <input type="tel" class="form-control" id="tcv-tel" placeholder="8123456789" minlength="10" required="">
                            <div class="invalid-feedback">Please type a valid WhatsApp Number</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label for="tcv-major">Major</label>
                    <select class="form-select" id="tcv-major" aria-label="Major" required>
                        <option value="" selected disabled>Please select one of the option</option>
                        <option value="Electrical Engineering & Education">Electrical Engineering & Education</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Automation Engineering & Robotics Education">Automation Engineering & Robotics Education</option>
                    </select>
                    <div class="invalid-feedback">Please choose one of the options above</div>
                </div>
            </div>
        </div>
    </form>
    `,
};
