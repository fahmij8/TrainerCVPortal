/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Handler Modules :
 * - Success Alert, modals, etc...
 * - Error Alert, modals, etc...
 * - Warning Alert, modals, etc...
 * - Basically anything that require users interaction/acknowledgments
 */

import Swal from "sweetalert2";

const Toast = Swal.mixin({
    toast: true,
    position: "top",
});

export const tcv_HandlerError = {
    show_NoConfirm: (message: string): void => {
        Toast.fire({
            icon: "error",
            title: messageTemplate.fatalError(message),
            showConfirmButton: false,
            allowEscapeKey: false,
            showCloseButton: false,
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
    show_commonWarning: (message: string): void => {
        Swal.fire({
            icon: "warning",
            title: "Attention!",
            text: message,
        });
    },
    show_waitSW: (): void => {
        Swal.fire({
            icon: "info",
            text: "Please wait while we're precaching the data...",
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
    show_SuccessRedirect: (message: string): void => {
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
                window.location.reload();
            },
        });
    },
};

const messageTemplate = {
    fatalError: (message: string): string => {
        return `Error message : ${message} \n Please contact the administrator regarding this issue.`;
    },
};
