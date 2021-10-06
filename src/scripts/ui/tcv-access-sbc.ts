/* eslint-disable @typescript-eslint/no-explicit-any */
import access_sbc from "../../templates/access-sbc.html";
import { DataSnapshot } from "firebase/database";
import { tcv_FirebaseAuth } from "../utilities/firebase/auth";
import { tcv_Display, tcv_Templates } from "../utilities/display/components";
import { tcv_FirebaseDB } from "../utilities/firebase/rtdb";
import { tcv_HandlerError, tcv_HandleSuccess, tcv_HandleWarning } from "../utilities/display/handler";
import { tcv_Util } from "../utilities/display/util";
import * as simpleDatatables from "../../vendor/soft-ui-dashboard/js/plugins/datatables";
import Swal, { SweetAlertResult } from "sweetalert2";
import flatpickr from "flatpickr";
import confirmDate from "flatpickr/dist/plugins/confirmDate/confirmDate";
import PerfectScrollbar from "perfect-scrollbar";
import { FullCalendar } from "../../vendor/soft-ui-dashboard/js/plugins/fullcalendar.min";

export const displayAccessSBC = (toRemove: string): void => {
    tcv_Display.displayContent(async () => {
        $(".tcv-content").append(access_sbc).addClass("invisible");
        const userNow = tcv_FirebaseAuth.currentUser().email;
        const updateTable = async (): Promise<void> => {
            await tcv_FirebaseDB
                .getScheduleData()
                .then((data: DataSnapshot) => {
                    let queue = 0;
                    data.forEach((schedule) => {
                        if (schedule.val().status === "Awaiting approval") {
                            queue += 1;
                        }
                    });
                    $(".tcv-queue-number").html(queue.toString());
                    if (data.size > 0) {
                        if (userNow !== "fahmijabbar12@gmail.com") {
                            // User logic
                            $(".tcv-queue-tableheader").append(tcv_Templates.accessSBCTableHeaderUser);
                            Object.entries(data.val()).forEach((schedule) => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                $(".tcv-queue-data").prepend(tcv_Templates.accessSBCTableBodyUser(schedule[0] as any, schedule[1] as any));
                            });
                        } else {
                            // Admin logic
                            $(".tcv-queue-tableheader").append(tcv_Templates.accessSBCTableHeaderAdmin);
                            Object.entries(data.val()).forEach((schedule) => {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                $(".tcv-queue-data").prepend(tcv_Templates.accessSBCTableBodyAdmin(schedule[0] as any, schedule[1] as any));
                            });
                        }
                    }
                })
                .catch((error) => {
                    console.error(error);
                    tcv_HandlerError.show_NoConfirm("Failed to fetch schedule data, please check your internet connection");
                });
        };
        await tcv_FirebaseDB
            .getSBCStatus()
            .then((data: DataSnapshot) => {
                const sbcStatus = data.val();
                $(".tcv-queue-status").html(sbcStatus);
                if (sbcStatus === "On") {
                    $(".tcv-queue-status").removeClass("bg-gradient-danger").addClass("bg-gradient-success");
                } else {
                    $(".tcv-queue-status").removeClass("bg-gradient-success").addClass("bg-gradient-danger");
                }
            })
            .catch((error) => {
                console.error(error);
                tcv_HandlerError.show_NoConfirm("Failed fetch SBC Status, please check your internet connection");
            });
        await updateTable();
        $(() => {
            new simpleDatatables.DataTable("#tcv-sbc", {
                searchable: false,
                fixedHeight: true,
            });
            $(".tcv-queue-add").on("click", async () => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let fp: any;
                const { value: formValues }: SweetAlertResult = await Swal.fire({
                    title: "Reservation Data",
                    html: `
                    <div class="container w-100">
                        <div class="d-block mx-auto">
                            <div class="form-row text-start">
                                <label for="tcv-sched">Usage Schedule</label>
                                <input class="form-control datepicker" id="tcv-sched" placeholder="Please select date" type="text" autocomplete="off">
                                <div class="form-text text-dark fw-lighter"><small><strong>REMEMBER</strong> : make sure you are not going to change the schedule</small></div>
                            </div>
                        </div>
                    </div>
                    `,
                    focusConfirm: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    showConfirmButton: true,
                    showCancelButton: true,
                    position: "top",
                    didOpen: () => {
                        fp = flatpickr(".datepicker", {
                            enableTime: true,

                            dateFormat: "Y-m-d H:i",
                            minTime: "07:00",
                            maxTime: "21:00",
                            minDate: new Date(),
                            disableMobile: true,
                            plugins: [
                                confirmDate({
                                    confirmIcon: "<i class='ms-2 far fa-check'></i>",
                                    confirmText: "OK",
                                    showAlways: false,
                                    theme: "dark",
                                }),
                            ],

                            onReady: () => {
                                $(".flatpickr-calendar").addClass("d-block mx-auto mb-4 h-50 overflow-auto");
                                $(".flatpickr-confirm").addClass("text-light bg-gradient-primary py-2").attr("style", "cursor:pointer");
                                $(".flatpickr-calendar").each((element) => {
                                    new PerfectScrollbar($(".flatpickr-calendar").get(element));
                                });
                            },
                        });
                    },
                    preConfirm: () => {
                        if (fp.selectedDates.length === 0) {
                            return false;
                        }

                        return new Date(fp.selectedDates[0]).getTime().toString();
                    },
                });

                if (formValues) {
                    tcv_HandleWarning.show_pleaseWait();
                    const data = tcv_FirebaseAuth.currentUser();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    tcv_Util
                        .postData("telegram_webhook", {
                            type: "addSchedule",
                            user_mail: data.email,
                            user_name: data.displayName,
                            user_schedule: parseInt(formValues),
                        })
                        .then(() => {
                            tcv_FirebaseDB
                                .postData(`schedule/${formValues}`, {
                                    name: data.displayName,
                                    email: data.email,
                                    status: "Awaiting approval",
                                })
                                .then(() => {
                                    tcv_HandleSuccess.show_SuccessRedirect("Schedule is submitted", "remote-sbc");
                                })
                                .catch((error) => {
                                    console.error(error);
                                    tcv_HandlerError.show_NoConfirm("Failed to post schedule data, please check your internet connection");
                                });
                        })
                        .catch((error) => {
                            console.error(error);
                            tcv_HandlerError.show_NoConfirm("Failed to post schedule data, please check your internet connection");
                        });
                }
            });
            // Admin Logic
            if (userNow === "fahmijabbar12@gmail.com") {
                // Approve part
                $(".tcv-schapprove").on("click", (event) => {
                    tcv_HandleWarning.show_pleaseWait();
                    tcv_Util
                        .postData("telegram_webhook", {
                            type: "approveSchedule",
                            user_mail: event.currentTarget.dataset.user,
                        })
                        .then(() => {
                            tcv_FirebaseDB
                                .postData(`schedule/${event.currentTarget.dataset.key}/status`, "Approved")
                                .then(() => {
                                    tcv_HandleSuccess.show_SuccessRedirect("Schedule is approved", "remote-sbc");
                                })
                                .catch((error) => {
                                    console.error(error);
                                    tcv_HandlerError.show_NoConfirm("Failed to post schedule data (approve), please check your internet connection");
                                });
                        })
                        .catch((error) => {
                            console.error(error);
                            tcv_HandlerError.show_NoConfirm("Failed to post schedule data, please check your internet connection");
                        });
                });
                // Reject part
                $(".tcv-schreject").on("click", (event) => {
                    tcv_HandleWarning.show_pleaseWait();
                    tcv_Util
                        .postData("telegram_webhook", {
                            type: "rejectSchedule",
                            user_mail: event.currentTarget.dataset.user,
                        })
                        .then(() => {
                            tcv_FirebaseDB
                                .postData(`schedule/${event.currentTarget.dataset.key}/status`, "Rejected")
                                .then(() => {
                                    tcv_HandleSuccess.show_SuccessRedirect("Schedule is rejected", "remote-sbc");
                                })
                                .catch((error) => {
                                    console.error(error);
                                    tcv_HandlerError.show_NoConfirm("Failed to post schedule data (reject), please check your internet connection");
                                });
                        })
                        .catch((error) => {
                            console.error(error);
                            tcv_HandlerError.show_NoConfirm("Failed to post schedule data, please check your internet connection");
                        });
                });
                // On-going part
                $(".tcv-schgoing").on("click", (event) => {
                    try {
                        const dataSBC = tcv_FirebaseDB.getSBCData();
                        const dataCam = tcv_FirebaseDB.getCamData();
                        Promise.all([dataSBC, dataCam]).then(async (resultData: [DataSnapshot, DataSnapshot]) => {
                            const objSBC = resultData[0].val();
                            const objCam = resultData[1].val();
                            const { value: formValues }: SweetAlertResult = await Swal.fire({
                                title: "Credentials",
                                html: `
                                <div class="form-row text-start">
                                    <label for="tcv-sbchost">SBC Host</label>
                                    <input class="form-control datepicker" id="tcv-sbchost" placeholder="SBC Host" type="text" value="${objSBC.credential.hostname}">
                                </div>
                                <div class="form-row text-start">
                                    <label for="tcv-sbcpass">SBC Password</label>
                                    <input class="form-control datepicker" id="tcv-sbcpass" placeholder="SBC Password" type="text" value="${objSBC.credential.password}">
                                </div>
                                <div class="form-row text-start">
                                    <label for="tcv-campass">Camera Password</label>
                                    <input class="form-control datepicker" id="tcv-campass" placeholder="Camera Password" type="text" value="${objCam}">
                                    <div class="form-text text-dark fw-lighter"><small>Make sure all of the credentials are correct!</small></div>
                                </div>
                                `,
                                focusConfirm: false,
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                showConfirmButton: true,
                                showCancelButton: true,
                                preConfirm: () => {
                                    if ($("#tcv-campass").val() === "" || $("#tcv-sbcpass").val() === "" || $("#tcv-sbchost").val() === "") {
                                        return false;
                                    }

                                    return [$("#tcv-sbchost").val(), $("#tcv-sbcpass").val(), $("#tcv-campass").val()];
                                },
                            });

                            if (formValues) {
                                tcv_HandleWarning.show_pleaseWait();
                                tcv_Util
                                    .postData("telegram_webhook", {
                                        type: "onGoingSchedule",
                                        user_mail: event.currentTarget.dataset.user,
                                        sbchost: formValues[0],
                                        sbcpass: formValues[1],
                                        campass: formValues[2],
                                    })
                                    .then(() => {
                                        tcv_FirebaseDB.postData(`schedule/${event.currentTarget.dataset.key}/status`, "Ongoing").then(() => {
                                            tcv_HandleSuccess.show_SuccessRedirect("Schedule is Ongoing", "remote-sbc");
                                        });
                                    });
                            }
                        });
                    } catch (error) {
                        console.error(error);
                        tcv_HandlerError.show_NoConfirm("Failed to change status to on-going");
                    }
                });
                // Finish part
                $(".tcv-schfinish").on("click", (event) => {
                    tcv_HandleWarning.show_pleaseWait();
                    tcv_Util
                        .postData("telegram_webhook", {
                            type: "finishSchedule",
                            user_mail: event.currentTarget.dataset.user,
                        })
                        .then(() => {
                            tcv_FirebaseDB
                                .postData(`schedule/${event.currentTarget.dataset.key}/status`, "Finished")
                                .then(() => {
                                    tcv_HandleSuccess.show_SuccessRedirect("Schedule is Finished", "remote-sbc");
                                })
                                .catch((error) => {
                                    console.error(error);
                                    tcv_HandlerError.show_NoConfirm("Failed to post schedule data (finished), please check your internet connection");
                                });
                        })
                        .catch((error) => {
                            console.error(error);
                            tcv_HandlerError.show_NoConfirm("Failed to post schedule data, please check your internet connection");
                        });
                });
                // Remove part
                $(".tcv-schremove").on("click", (event) => {
                    tcv_HandleWarning.show_pleaseWait();
                    tcv_FirebaseDB
                        .removeData(`schedule/${event.currentTarget.dataset.key}`)
                        .then(() => {
                            tcv_HandleSuccess.show_SuccessRedirect("Schedule is Deleted", "remote-sbc");
                        })
                        .catch((error) => {
                            console.error(error);
                            tcv_HandlerError.show_NoConfirm("Failed to delete schedule data");
                        });
                });
            }
            const calendar = new (FullCalendar as any).Calendar(document.getElementById("calendar"), {
                height: "100%",
                contentHeight: "auto",
                aspectRatio: 2,
                initialView: "dayGridMonth",
                headerToolbar: {
                    start: "title", // will normally be on the left. if RTL, will be on the right
                    center: "",
                    end: "today prev,next", // will normally be on the right. if RTL, will be on the left
                },
                selectable: true,
                editable: true,
                initialDate: "2020-12-01",
                events: [
                    {
                        title: "Call with Dave",
                        start: "2020-11-18",
                        end: "2020-11-18",
                        className: "bg-gradient-danger",
                    },

                    {
                        title: "Lunch meeting",
                        start: "2020-11-21",
                        end: "2020-11-22",
                        className: "bg-gradient-warning",
                    },

                    {
                        title: "All day conference",
                        start: "2020-11-29",
                        end: "2020-11-29",
                        className: "bg-gradient-success",
                    },

                    {
                        title: "Meeting with Mary",
                        start: "2020-12-01",
                        end: "2020-12-01",
                        className: "bg-gradient-info",
                    },

                    {
                        title: "Winter Hackaton",
                        start: "2020-12-03",
                        end: "2020-12-03",
                        className: "bg-gradient-danger",
                    },

                    {
                        title: "Digital event",
                        start: "2020-12-07",
                        end: "2020-12-09",
                        className: "bg-gradient-warning",
                    },

                    {
                        title: "Marketing event",
                        start: "2020-12-10",
                        end: "2020-12-10",
                        className: "bg-gradient-primary",
                    },

                    {
                        title: "Dinner with Family",
                        start: "2020-12-19",
                        end: "2020-12-19",
                        className: "bg-gradient-danger",
                    },

                    {
                        title: "Black Friday",
                        start: "2020-12-23",
                        end: "2020-12-23",
                        className: "bg-gradient-info",
                    },

                    {
                        title: "Cyber Week",
                        start: "2020-12-02",
                        end: "2020-12-02",
                        className: "bg-gradient-warning",
                    },
                ],
                views: {
                    month: {
                        titleFormat: {
                            month: "long",
                            year: "numeric",
                        },
                    },
                    agendaWeek: {
                        titleFormat: {
                            month: "long",
                            year: "numeric",
                            day: "numeric",
                        },
                    },
                    agendaDay: {
                        titleFormat: {
                            month: "short",
                            year: "numeric",
                            day: "numeric",
                        },
                    },
                },
            });

            calendar.render();
        });
    }, toRemove);
};
