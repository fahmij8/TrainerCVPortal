/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Utilities Modules :
 * - Global logic components/elements on DOM
 */
import { tcv_FirebaseAuth } from "../firebase/auth";
import { tcv_HandlerError } from "./handler";
import { tcv_Route } from "./route";
import { tcv_Display, tcv_Templates } from "./components";
import { jQueryValue, StringKeyNumberValueObject, StringKeyObject } from "../interface";
import { Workbox } from "workbox-window";
import splashScreen from "../../../templates/splash-screen.html";
import splashScreenLoading from "../../../templates/loading-2.html";
import contentLoading from "../../../templates/loading.html";
import appShell from "../../../templates/appshell.html";
import * as bootstrapMin from "../../../vendor/soft-ui-dashboard/js/core/bootstrap.min";

export const tcv_Util = {
    noScrollRestoration: (): void => {
        // Remove scroll restoration
        window.scrollTo(0, 0);
        if (history.scrollRestoration) {
            history.scrollRestoration = "manual";
        }
    },
    unbindAll: (): void => {
        $(window).off();
        $("body").removeAttr("id").removeAttr("class");

        (window as any).Pace.restart();
    },
    serviceWorker: (): void => {
        if ("serviceWorker" in navigator) {
            window.addEventListener("load", async () => {
                const wb = new Workbox("/service-worker.js");

                wb.addEventListener("redundant", async () => {
                    console.log(`[SW] : redundant ${new Date().toLocaleTimeString()}`);
                    if (navigator.onLine) {
                        await wb
                            .register()
                            .then(async () => await wb.update())
                            .catch(() => window.location.reload);
                    }
                });

                wb.addEventListener("waiting", () => {
                    console.log(`[SW] : waiting ${new Date().toLocaleTimeString()}`);
                    wb.messageSkipWaiting();
                });

                wb.addEventListener("message", () => {
                    console.log(`[SW] : message ${new Date().toLocaleTimeString()}`);
                });

                wb.addEventListener("installing", () => {
                    console.log(`[SW] : installing ${new Date().toLocaleTimeString()}`);
                });

                wb.addEventListener("installed", () => {
                    console.log(`[SW] : installed ${new Date().toLocaleTimeString()}`);
                });

                wb.addEventListener("controlling", () => {
                    console.log(`[SW] : controlling ${new Date().toLocaleTimeString()}`);
                });

                wb.addEventListener("activating", () => {
                    console.log(`[SW] : activating ${new Date().toLocaleTimeString()}`);
                });

                wb.addEventListener("activated", () => {
                    console.log(`[SW] : activated ${new Date().toLocaleTimeString()}`);
                });

                if (navigator.onLine) {
                    if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
                        navigator.serviceWorker.getRegistrations().then((sw) => {
                            Object.entries(sw).forEach((registration) => {
                                registration[1].unregister();
                            });
                        });
                    }
                    await wb
                        .register()
                        .then(async () => await wb.update())
                        .catch(() => window.location.reload);
                }

                const showToast = (): void => {
                    const toastElList = [].slice.call(document.querySelectorAll(".toast"));
                    toastElList.map(function (toastEl) {
                        new bootstrapMin.Toast(toastEl).show();
                    });
                };

                window.addEventListener("online", () => {
                    $(".toast-container").remove();
                    $("body").append(tcv_Templates.toastConnection("Information", "You're back online!"));
                    showToast();

                    if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
                        const page = window.location.hash.substr(1);
                        if (page === "module-1-iot" || page === "module-2-iot" || page === "module-3-iot" || page === "module-4-iot" || page === "module-5-iot") {
                            $(".module-monitor").removeAttr("disabled");
                        } else if (page === "remote-sbc") {
                            $(".tcv-queue-add").removeAttr("disabled");
                        }
                    } else {
                        const page = window.location.pathname;
                        if (page === "/dashboard/module/1/jobsheet" || page === "/dashboard/module/2/jobsheet" || page === "/dashboard/module/3/jobsheet" || page === "/dashboard/module/4/jobsheet" || page === "/dashboard/module/5/jobsheet") {
                            $(".module-monitor").removeAttr("disabled");
                        } else if (page === "/dashboard/remote-sbc") {
                            $(".tcv-queue-add").removeAttr("disabled");
                        }
                    }

                    setTimeout(() => $(".toast-container").fadeOut(), 3000);
                    setTimeout(() => $(".toast-container").remove(), 5000);
                });

                window.addEventListener("offline", () => {
                    $(".toast-container").remove();
                    $("body").append(tcv_Templates.toastConnection("Information", "You're offline, some of the web app features are unavailable, please reconnect."));
                    showToast();

                    if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
                        const page = window.location.hash.substr(1);
                        if (page === "module-1-iot" || page === "module-2-iot" || page === "module-3-iot" || page === "module-4-iot" || page === "module-5-iot") {
                            $(".module-monitor").attr("disabled", "");
                        } else if (page === "remote-sbc") {
                            $(".tcv-queue-add").attr("disabled", "");
                        }
                    } else {
                        const page = window.location.pathname;
                        if (page === "/dashboard/module/1/jobsheet" || page === "/dashboard/module/2/jobsheet" || page === "/dashboard/module/3/jobsheet" || page === "/dashboard/module/4/jobsheet" || page === "/dashboard/module/5/jobsheet") {
                            $(".module-monitor").attr("disabled", "");
                        } else if (page === "/dashboard/remote-sbc") {
                            $(".tcv-queue-add").attr("disabled", "");
                        }
                    }
                });
            });
        }
    },
    call(): void {
        this.noScrollRestoration();
        this.unbindAll();
        // Check login state
        const pageAccessedByReload: boolean =
            (window.performance.navigation && window.performance.navigation.type === 1) ||
            window.performance
                .getEntriesByType("navigation")
                .map((nav) => (nav as any).type)
                .includes("reload");

        if (pageAccessedByReload) {
            if (!window.history.state) {
                $("body").html(splashScreenLoading);
            }
        }
        tcv_FirebaseAuth
            .checkSession()
            .then((loginState: boolean) => {
                let toRemove: string;
                if (loginState) {
                    if (!$("aside").length) {
                        if (!pageAccessedByReload) {
                            $("body").html(splashScreenLoading);
                            $(".center-content")
                                .delay(2000)
                                .slideUp(500, () => {
                                    $(".center-content").remove();
                                });
                        }
                        $("body").addClass("g-sidenav-show bg-gray-100").append(appShell);
                        tcv_Display.appShellHandler();
                    } else {
                        $("body").addClass("g-sidenav-show bg-gray-100");
                    }
                    document.querySelector(".main-content").scrollTop = 0;
                }
                if ($(".tcv-content").length) {
                    $(".tcv-content").html(contentLoading);
                    toRemove = ".content-loading";
                } else {
                    if (sessionStorage.getItem("splash-screen") !== null) {
                        $("body").html(splashScreenLoading);
                        toRemove = ".center-content";
                    } else {
                        $("body").html(splashScreen);
                        sessionStorage.setItem("splash-screen", "true");
                        toRemove = ".splash-screen";
                    }
                }

                tcv_Route.init(loginState, toRemove);
            })
            .catch((error) => {
                console.error(error);
                tcv_HandlerError.show_NoConfirm("Firebase auth failed to check user session");
            });
    },
    goToPage(mode?: string): void {
        if (mode === "hard") {
            setTimeout(() => {
                window.location.reload();
            }, 300);
        } else {
            const wait = new Promise((resolve) => setTimeout(resolve, 100));
            wait.then(() => this.call());
        }
    },
    checkModulesOverall(objectTochecks: StringKeyNumberValueObject): [string, number] {
        let workedModules = 0;
        Object.entries(objectTochecks).map((data) => {
            if (data[0] !== "bonus_score") {
                if (data[1] !== 0) {
                    workedModules += 1;
                }
            }
        });
        if (workedModules === 0) {
            return ["not worked", workedModules];
        } else if (workedModules > 0 && workedModules <= 3) {
            return ["in progress", workedModules];
        } else {
            return ["finished", 4];
        }
    },
    postData(mode: string, data: StringKeyObject): Promise<any> {
        let url: string;
        if (mode === "telegram_webhook") {
            url = "https://script.google.com/macros/s/AKfycbwDr1c3_Ndm-U-wuJz-CeJFzgL8_eNxAYoS7eD_d3oGWPF7Bd2u/exec";
        }
        return fetch(url, {
            method: "POST",
            mode: "no-cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    },
    getDataAntares(app: jQueryValue, device: jQueryValue, key: jQueryValue): Promise<any> {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "https://antares-gp.herokuapp.com/get-data.php",
                method: "POST",
                crossDomain: true,
                data: {
                    endpoint: `https://platform.antares.id:8443/~/antares-cse/antares-id/${app}/${device}/la`,
                    accesskey: key,
                },
                success: (res) => {
                    try {
                        resolve(JSON.parse(JSON.parse(res)));
                    } catch (error) {
                        reject(error);
                    }
                },
                error: (error) => {
                    reject(error);
                },
            });
        });
    },
    formValidation(className: string, validFunction: () => Promise<void>, InvalidFunction: () => Promise<void>): void {
        const forms = document.querySelectorAll(className);
        Array.prototype.slice.call(forms).forEach((form) => {
            form.addEventListener(
                "submit",
                async (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    if (!form.checkValidity()) {
                        await InvalidFunction();
                    } else {
                        await validFunction();
                    }
                    form.classList.add("was-validated");
                },
                false
            );
        });
    },
    stopMonitoring(status: string): void {
        for (let i = 0; i < 9999; i++) {
            window.clearInterval(i);
        }
        $(".module-monitor").data("monitoring", "0");
        $(".module-monitor-status").html(`Monitoring Status : ${status}`);
        $(".module-monitor").html(`Start Monitoring`);
    },
    async buildMonitoring(moduleFunction: (mailEdited: string, antaresApp: jQueryValue, antaresDevice: jQueryValue, antaresKey: jQueryValue) => void, indicator: string[]): Promise<void> {
        if ($(".module-monitor").data("monitoring") == 0) {
            $(".module-monitor-status").html(`Monitoring Status : <span class="badge badge-warning">Processing</span>`);
            const antaresApp = $("#module-app").val();
            const antaresDevice = $("#module-device").val();
            const antaresKey = $("#module-m2m").val();
            await tcv_Util
                .getDataAntares(antaresApp, antaresDevice, antaresKey)
                .then(async (data) => {
                    const payload = JSON.parse(data["m2m:cin"]["con"]);
                    let notIndicated = 0;
                    indicator.forEach((key) => {
                        if (!(key in payload)) {
                            notIndicated += 1;
                        }
                    });
                    if (notIndicated === 0) {
                        $(".module-monitor").data("monitoring", "1");
                        $(".module-monitor-status").html(`Monitoring Status : <span class="badge badge-success">Running</span>`);
                        $(".module-monitor").html(`Stop Monitoring`);
                        localStorage.setItem(
                            "IoT",
                            JSON.stringify({
                                app: antaresApp,
                                m2m: antaresKey,
                            })
                        );
                        const user = tcv_FirebaseAuth.currentUser();
                        const mailEdited = user.email.replace(".", "");
                        moduleFunction(mailEdited, antaresApp, antaresDevice, antaresKey);
                    } else {
                        tcv_Util.stopMonitoring(`<span class="badge badge-danger">Error</span>`);
                        throw new Error("[ERROR] Monitoring could not be continued due to invalid payload");
                    }
                })
                .catch((error) => {
                    tcv_Util.stopMonitoring(`<span class="badge badge-danger">Error</span>`);
                    throw new Error(error);
                });
        } else {
            tcv_Util.stopMonitoring(`<span class="badge badge-secondary">Stopped</span>`);
        }
    },
};
