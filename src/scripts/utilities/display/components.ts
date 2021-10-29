/**
 * Components Modules :
 * - Global display handler
 * - HTML Templates (Components)
 */

import { tcv_FirebaseAuth } from "../firebase/auth";
import { QueueDataValueType, ScoresSummaryType } from "../interface";
import { tcv_HandlerError } from "./handler";
import { tcv_Util } from "./util";
import userPic from "../../../assets/user.png";

export const tcv_Display = {
    appShellHandler(): void {
        $(".nav-link")
            .not("[aria-expanded]")
            .on("click", (event) => {
                const destination = event.currentTarget.dataset;
                if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
                    window.history.pushState({ state: true }, "", `${destination.localhost}`);
                } else {
                    window.history.pushState(null, null, `/`);
                    window.history.pushState({ state: true }, "", `${destination.remote}`);
                }
                tcv_Util.goToPage();
            });
        $(".tcv-email-user").html(tcv_FirebaseAuth.currentUser().email);
        $(".tcv-logout").on("click", (): void => {
            tcv_FirebaseAuth.logout();
        });
        this.appShellPhoto();
    },
    appShellPhoto(): void {
        $(".appshell-image").attr("src", tcv_FirebaseAuth.currentUser().photoURL);
        $(".appshell-image").on("error", () => {
            $(".appshell-image").attr("src", userPic);
        });
    },
    async displayContent(content: () => void, toRemove: string): Promise<void> {
        const load = await new Promise((resolve: (value: boolean | PromiseLike<boolean>) => void, reject: (reason?: unknown) => void): void => {
            try {
                Promise.all([content()])
                    .then(async () => {
                        Promise.all([await import("@popperjs/core"), await import("../../../vendor/soft-ui-dashboard/js/core/bootstrap.min"), await import("../../../vendor/soft-ui-dashboard/js/plugins/smooth-scrollbar.min"), await import("../../../vendor/soft-ui-dashboard/js/soft-ui-dashboard")]).then(() => {
                            resolve(true);
                        });
                    })
                    .catch((error) => reject(error));
            } catch (error: unknown) {
                reject(error);
            }
        });
        if (load === true) {
            this.removeLoader(toRemove);
        } else {
            console.error(load);
            tcv_HandlerError.show_NoConfirm("Failed to display pages");
        }
    },
    removeLoader(target: string): void {
        if (target !== "nothing") {
            $(".center-content")
                .delay(500)
                .slideUp(500, () => {
                    $(".center-content").remove();
                });
            $(target)
                .delay(500)
                .fadeOut(300, () => {
                    $(".tcv-content").fadeOut(1, () => {
                        $(".tcv-content").removeClass("invisible").fadeIn(500);
                    });
                    $(target).remove();
                });
            // Restore body scroll
            $("body").removeAttr("style");
        }
    },
};

export const tcv_Templates = {
    newUsers: `
    <div class="container">
        <div class="row">
            <p>Please fill the data carefully!</p>
            <form class="needs-validation d-block mx-auto text-start">
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
                <div class="row">
                    <div class="col-12">
                        <div class="form-group">
                            <label for="tcv-photos">Personal Photos</label>
                            <input type="file" class="form-control filepond" id="tcv-photos" name="tcv-photos[]" accept="image/*" required />
                            <div class="tcv-photos-warn invalid-feedback">Please upload an image file contains your face photo</div>
                            <div class="tcv-photos-container d-none"></div> 
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div> 
    `,
    scoresSumary(modules: ScoresSummaryType, status: string, index: number): string {
        const avgScores: number = (modules.step1 + modules.step2 + modules.step3 + modules.step4) / 4;
        let moduleStatus: string;
        if (status === "finished") {
            moduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-success">Completed</h5>`;
        } else if (status === "in progress") {
            moduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-warning">In Progress</h5>`;
        } else {
            moduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-danger">Incompleted</h5>`;
        }
        let avgScoresRender: string;
        if (avgScores >= 90) {
            avgScoresRender = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-success">${avgScores}</h5>`;
        } else if (avgScores >= 75 && avgScores <= 89) {
            avgScoresRender = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-warning">${avgScores}</h5>`;
        } else {
            avgScoresRender = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-danger">${avgScores}</h5>`;
        }
        let badgeModule = ``;
        if (modules.bonus_score > 0 || modules.bonus_score != 0) {
            badgeModule = `<i class='fas fa-badge-check text-success text-gradient ms-2' data-bs-toggle="tooltip" data-bs-placement="right" title="Badges rewarded after using module IoT Dashboard"></i>`;
        }
        return `
        <tr>
            <td class="text-sm font-weight-normal">Module ${index + 1}${badgeModule}</td>
            <td class="text-sm font-weight-normal">${modules.step1}</td>
            <td class="text-sm font-weight-normal">${modules.step2}</td>
            <td class="text-sm font-weight-normal">${modules.step3}</td>
            <td class="text-sm font-weight-normal">${modules.step4}</td>
            <td class="text-sm font-weight-normal">${moduleStatus}</td>
            <td class="text-sm font-weight-normal">${avgScoresRender}</td>
        </tr>
        `;
    },
    accessSBCTableHeaderUser: `
    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Date & time</th>
    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Username</th>
    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Email</th>
    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
    `,
    accessSBCTableHeaderAdmin: `
    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Date & time</th>
    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Username</th>
    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Email</th>
    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Status</th>
    <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Action</th>
    `,
    accessSBCTableBodyUser(key: string, value: QueueDataValueType): string {
        let scheduleStatus: string;
        if (value.status === "Awaiting approval") {
            scheduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-warning">${value.status}</h5>`;
        } else if (value.status === "Rejected") {
            scheduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-danger">${value.status}</h5>`;
        } else if (value.status === "Approved") {
            scheduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-success">${value.status}</h5>`;
        } else if (value.status === "Ongoing") {
            scheduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-primary">${value.status}</h5>`;
        } else if (value.status === "Finished") {
            scheduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-secondary">${value.status}</h5>`;
        }
        return `
        <tr>
            <td class="text-sm font-weight-normal">${new Date(parseInt(key)).toLocaleString()} - ${new Date(parseInt(key) + 60 * 60 * 1000).toLocaleTimeString()}</td>
            <td class="text-sm font-weight-normal">${value.name}</td>
            <td class="text-sm font-weight-normal">${value.email}</td>
            <td class="text-sm font-weight-normal">${scheduleStatus}</td>
        </tr>
        `;
    },
    accessSBCTableBodyAdmin(key: string, value: QueueDataValueType): string {
        let scheduleStatus: string;
        if (value.status === "Awaiting approval") {
            scheduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-warning">${value.status}</h5>`;
        } else if (value.status === "Rejected") {
            scheduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-danger">${value.status}</h5>`;
        } else if (value.status === "Approved") {
            scheduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-success">${value.status}</h5>`;
        } else if (value.status === "Ongoing") {
            scheduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-primary">${value.status}</h5>`;
        } else if (value.status === "Finished") {
            scheduleStatus = `<h5 class="font-weight-bolder mb-0 badge badge-sm bg-gradient-secondary">${value.status}</h5>`;
        }
        return `
        <tr>
            <td class="text-sm font-weight-normal">${new Date(parseInt(key)).toLocaleString()} - ${new Date(parseInt(key) + 60 * 60 * 1000).toLocaleTimeString()}</td>
            <td class="text-sm font-weight-normal">${value.name}</td>
            <td class="text-sm font-weight-normal">${value.email}</td>
            <td class="text-sm font-weight-normal">${scheduleStatus}</td>
            <td class="text-sm font-weight-normal">
                <div class="dropstart">
                    <a href="javascript:void(0)" class="text-secondary" id="tcvScheduleAction" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-ellipsis-v"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-lg-start px-2 py-3" aria-labelledby="tcvScheduleAction">
                        <li><a class="dropdown-item border-radius-md tcv-schapprove" href="javascript:void(0)" data-key="${key}" data-user="${value.email}">Approve</a></li>
                        <li><a class="dropdown-item border-radius-md tcv-schreject" href="javascript:void(0)" data-key="${key}" data-user="${value.email}">Reject</a></li>
                        <li><a class="dropdown-item border-radius-md tcv-schgoing" href="javascript:void(0)" data-key="${key}" data-user="${value.email}">On-going</a></li>
                        <li><a class="dropdown-item border-radius-md tcv-schfinish" href="javascript:void(0)" data-key="${key}" data-user="${value.email}">Finish</a></li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li><a class="dropdown-item border-radius-md text-danger tcv-schremove" href="javascript:void(0)" data-key="${key}">Remove Entry</a></li>
                    </ul>
                </div>
            </td>
        </tr>
        `;
    },
    modulesIntroduction: `
    <div class="row mb-4">
        <div class="col-md-6 col-12 mb-4">
            <div class="card shadow-card">
                <div class="card-header bg-gradient-dark py-3">
                    <h6 class="text-white my-0"><i class="fas fa-question-circle me-2"></i>How to use the IoT Dashboard</h6>
                </div>
                <div class="card-body p-3">
                    <div class="timeline timeline-one-side" data-timeline-axis-style="dashed">
                        <div class="timeline-block mb-3">
                            <span class="timeline-step">
                                <i class="fas fa-clipboard-list text-primary text-gradient"></i>
                            </span>
                            <div class="timeline-content">
                                <h6 class="text-dark text-sm font-weight-bold mb-0">Fill the Antares Application Data</h6>
                                <p class="text-sm mt-3 mb-2"><strong>[IMPORTANT]</strong> please fill the application data according to your Antares application & devices data. Otherwise, monitoring will be error. But, feel free to restart again after you filling the right details.</p>
                            </div>
                        </div>
                        <div class="timeline-block mb-3">
                            <span class="timeline-step">
                                <i class="fas fa-desktop text-primary text-gradient"></i>
                            </span>
                            <div class="timeline-content">
                                <h6 class="text-dark text-sm font-weight-bold mb-0">Start Monitoring</h6>
                                <p class="text-sm mt-3 mb-2">If it's valid, there will be an automatic monitoring data to your application from this dashboard every 3-5 seconds interval.</p>
                            </div>
                        </div>
                        <div class="timeline-block mb-3">
                            <span class="timeline-step">
                                <i class="fas fa-hand-paper text-primary text-gradient"></i>
                            </span>
                            <div class="timeline-content">
                                <h6 class="text-dark text-sm font-weight-bold mb-0">Stop Monitoring</h6>
                                <p class="text-sm mt-3 mb-2">When you're done, don't forget to stop monitoring your Antares Application.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-md-6 col-12 mb-4">
            <div class="card shadow-card">
                <div class="card-header bg-gradient-dark py-3">
                    <h6 class="text-white my-0"><i class="fas fa-clipboard-list me-2"></i>Antares Application Data</h6>
                </div>
                <div class="card-body p-3">
                    <p class="module-monitor-status">Monitoring Status : <span class="badge badge-secondary">Stopped</span></p>
                    <form class="needs-validation d-block mx-auto text-start" novalidate>
                        <div class="form-floating form-group mb-3">
                            <input type="text" class="form-control" id="module-app" placeholder="TrainerComputerVision" required autocomplete="off" />
                            <label for="module-app" class="form-label">Application Name</label>
                            <div class="invalid-feedback">Please input a correct application name</div>
                        </div>
                        <div class="form-floating form-group mb-3">
                            <input type="text" class="form-control" id="module-device" placeholder="IoT-1" required autocomplete="off" />
                            <label for="module-device" class="form-label">Device Name</label>
                            <div class="invalid-feedback">Please input a correct device name</div>
                        </div>
                        <div class="form-floating form-group mb-3">
                            <input type="text" class="form-control" id="module-m2m" placeholder="id:pass" required autocomplete="off" />
                            <label for="module-m2m" class="form-label">Access Key</label>
                            <div class="invalid-feedback">Please input a correct access key</div>
                        </div>
                        <div class="col-12">
                            <button class="btn bg-gradient-primary module-monitor" type="submit" data-monitoring="0">Start Monitoring</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    `,
    toastConnection(title: string, body: string): string {
        return `
        <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index:1000">
            <div role="alert" aria-live="assertive" aria-atomic="true" class="toast bg-dark" data-bs-autohide="false" style="filter: drop-shadow(2px 4px 6px #00000040);">
                <div class="toast-header">
                    <i class="fas fa-exclamation-triangle me-2"></i><strong class="me-auto">${title}</strong>
                </div>
                <div class="toast-body text-light">
                    ${body}
                </div>
            </div>
        </div>
        `;
    },
};
