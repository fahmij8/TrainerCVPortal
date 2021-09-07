/**
 * Handler Modules :
 * - Success Alert, modals, etc...
 * - Error Alert, modals, etc...
 * - Warning Alert, modals, etc...
 * - Basically anything that require users interaction/acknowledgments
 */

import Swal from "sweetalert2";

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

export const tcv_HandleSuccess = {
    show_Confirm: (message: string): void => {
        Swal.fire({
            icon: "success",
            title: "Success!",
            text: message,
            allowOutsideClick: false,
        });
    },
};

const messageTemplate = {
    fatalError: (message: string): string => {
        return `Error message : ${message} \n Please contact the administrator regarding this issue.`;
    },
};
