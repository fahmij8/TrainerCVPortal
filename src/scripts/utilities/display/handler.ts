import Swal from "sweetalert2";

export const tcv_HandlerError = {
    show_NoConfirm: (message: string): void => {
        Swal.fire({
            icon: "error",
            title: "Something is happened!",
            text: message,
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
        });
    },
};
