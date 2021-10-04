/**
 * Route Modules
 * - Handle routing mechanism
 * - Handle appshell display mechanism
 */

import { displayNotFound } from "../../ui/tcv-404";
import { displayAccessSBC } from "../../ui/tcv-access-sbc";
import { displayDashboard } from "../../ui/tcv-dashboard";
import { displayGrades } from "../../ui/tcv-grades";
import { displayLogin } from "../../ui/tcv-login";
import { displayModuleOneDashboard } from "../../ui/tcv-module-1-dashboard";
import { displayModuleTwoDashboard } from "../../ui/tcv-module-2-dashboard";
import { displayUnderConstruction } from "../../ui/tcv-under-construction";
import { tcv_FirebaseDB } from "../firebase/rtdb";

export const tcv_Route = {
    init(loginState: boolean, toRemove: string): void {
        if (!loginState) {
            displayLogin(toRemove);
        } else {
            tcv_FirebaseDB.initUserData().then((result) => {
                if (result) {
                    let page: string = window.location.hash.substr(1);
                    if (page === "login") {
                        window.location.href = "./#dashboard";
                        page = "dashboard";
                    }
                    if (page === "") page = "dashboard";
                    this.navDisplay(page);
                    if (page === "dashboard") {
                        displayDashboard(toRemove);
                    } else if (page === "grades") {
                        displayGrades(toRemove);
                    } else if (page === "remote-sbc") {
                        displayAccessSBC(toRemove);
                    } else if (page === "module-1-iot") {
                        displayModuleOneDashboard(toRemove);
                    } else if (page === "module-2-iot") {
                        displayModuleTwoDashboard(toRemove);
                    } else if (page === "module-1-instruction" || page === "module-2-instruction" || page === "module-3-instruction" || page === "module-4-instruction" || page === "module-5-instruction" || page === "references") {
                        displayUnderConstruction(toRemove);
                    } else {
                        $(".appshell-title").html("");
                        displayNotFound(toRemove);
                    }
                }
            });
        }
    },
    navDisplay(page: string): void {
        $(".nav-link").removeClass("active");
        $(".icon").children("i").removeClass("text-white");
        $(".nav-item > .collapse").removeClass("show");
        $(".nav-link[aria-expanded]").attr("aria-expanded", "false");

        switch (page) {
            case "dashboard":
                $(".appshell-title").html("Dashboard");
                handleNav(false, 0);
                break;
            case "grades":
                $(".appshell-title").html("Grades");
                handleNav(false, 1);
                break;
            case "remote-sbc":
                $(".appshell-title").html("Access SBC");
                handleNav(false, 2);
                break;
            case "module-1-instruction": {
                $(".appshell-title").html("Module 1 Instruction");
                handleNav(true, 3);
                break;
            }
            case "module-1-iot": {
                $(".appshell-title").html("Module 1 IoT Dashboard");
                handleNav(true, 4);
                break;
            }
            case "module-2-instruction": {
                $(".appshell-title").html("Module 2 Instruction");
                handleNav(true, 5);
                break;
            }
            case "module-2-iot": {
                $(".appshell-title").html("Module 2 IoT Dashboard");
                handleNav(true, 6);
                break;
            }
            case "module-3-instruction": {
                $(".appshell-title").html("Module 3 Instruction");
                handleNav(true, 7);
                break;
            }
            case "module-3-iot": {
                $(".appshell-title").html("Module 3 IoT Dashboard");
                handleNav(true, 8);
                break;
            }
            case "module-4-instruction": {
                $(".appshell-title").html("Module 4 Instruction");
                handleNav(true, 9);
                break;
            }
            case "module-4-iot": {
                $(".appshell-title").html("Module 4 IoT Dashboard");
                handleNav(true, 10);
                break;
            }
            case "module-5-instruction": {
                $(".appshell-title").html("Module 5 Instruction");
                handleNav(true, 11);
                break;
            }
            case "module-5-iot": {
                $(".appshell-title").html("Module 5 IoT Dashboard");
                handleNav(true, 12);
                break;
            }
            case "documentation":
                $(".appshell-title").html("Documentation");
                handleNav(false, 13);
                break;
        }
    },
};

const handleNav = (withChild: boolean, elementOrder: number): void => {
    const navElement: JQuery = $(".nav-link").not("[aria-expanded]");
    if (withChild) {
        const destination = $(navElement.get(elementOrder)).parents(".nav-item").length - 1;
        $(navElement.get(elementOrder)).addClass("active");
        $($(navElement.get(elementOrder)).parents(".nav-item").get(destination))
            .children(".nav-link")
            .addClass("active")
            .attr("aria-expanded", "true");
        $($(navElement.get(elementOrder)).parents(".nav-item").get(destination))
            .children(".nav-link")
            .children(".icon")
            .children("i")
            .addClass("text-white");
        $($(navElement.get(elementOrder)).parents(".nav-item").get(destination))
            .children(".collapse")
            .addClass("show");
    } else {
        $(navElement.get(elementOrder)).addClass("active");
        $(navElement.get(elementOrder)).children(".icon").children("i").addClass("text-white");
    }
};
