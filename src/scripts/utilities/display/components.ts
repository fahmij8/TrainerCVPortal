/**
 * Components Modules :
 * - Global display handler
 * - HTML Templates (Components)
 */

import { tcv_FirebaseAuth } from "../firebase/auth";
import { QueueDataValueType, ScoresSummaryType } from "../interface";
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
                .delay(500)
                .fadeOut(300, () => {
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
};
