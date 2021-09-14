/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Handler Modules :
 * - Success Alert, modals, etc...
 * - Error Alert, modals, etc...
 * - Warning Alert, modals, etc...
 * - Basically anything that require users interaction/acknowledgments
 */

import Swal from "sweetalert2";
import { tcv_Util } from "./util";

export const tcv_HandlerError = {
    show_NoConfirm: (message: string): void => {
        Swal.fire({
            icon: "error",
            title: "Something is happened!",
            text: messageTemplate.fatalError(message),
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
        });
        throw new Error(message);
    },
};

export const tcv_HandleWarning = {
    show_pleaseWait: (): void => {
        Swal.fire({
            icon: "info",
            text: "Your request is being processed...",
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
        });
    },
};

export const tcv_HandleSuccess = {
    show_Confirm: (message: string): void => {
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: message,
            allowOutsideClick: false,
        });
    },
    show_SuccessRedirect: (message: string, destination: string): void => {
        let timerInterval: NodeJS.Timer;
        Swal.fire({
            icon: "success",
            title: "Request Success!",
            html: `${message}, page will be refreshed in <b></b> seconds`,
            showConfirmButton: false,
            allowEscapeKey: false,
            allowOutsideClick: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                const b = Swal.getHtmlContainer().querySelector("b");
                timerInterval = setInterval(() => {
                    (b as any).textContent = Math.floor(Swal.getTimerLeft() / 1000);
                }, 100);
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
            didDestroy: () => {
                window.location.href = `./#${destination}`;
                tcv_Util.goToPage();
            },
        });
    },
};

const messageTemplate = {
    fatalError: (message: string): string => {
        return `Error message : ${message} \n Please contact the administrator regarding this issue.`;
    },
};
