import { getDatabase, ref, set, get, DataSnapshot } from "firebase/database";
import { tcv_HandlerError, tcv_HandleSuccess } from "../display/handler";
import { tcv_FirebaseAuth } from "./auth";
import Swal, { SweetAlertResult } from "sweetalert2";
import { tcv_Templates } from "../display/components";
import { userData } from "../interface";

export const tcv_FirebaseDB = {
    getUserData: async (): Promise<DataSnapshot> => {
        const user = tcv_FirebaseAuth.currentUser();
        const mailEdited = user.email.replace(".", "");
        const db = getDatabase();
        return await get(ref(db, `users/${mailEdited}`));
    },
    async initUserData(): Promise<boolean> {
        const user = tcv_FirebaseAuth.currentUser();
        const mailEdited = user.email.replace(".", "");
        const db = getDatabase();
        let resultInit = false;
        await get(ref(db, `users/${mailEdited}`))
            .then(async (snapshot) => {
                const setInputFilter = (textbox: Element, inputFilter: (value: string) => boolean): void => {
                    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach((event) => {
                        textbox.addEventListener(event, function (this: (HTMLInputElement | HTMLTextAreaElement) & { oldValue: string; oldSelectionStart: number | null; oldSelectionEnd: number | null }) {
                            if (inputFilter(this.value)) {
                                this.oldValue = this.value;
                            }
                        });
                    });
                };

                if (!snapshot.exists()) {
                    const { value: formValues }: SweetAlertResult = await Swal.fire({
                        title: "Student Data",
                        html: tcv_Templates.newUsers,
                        focusConfirm: false,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        showConfirmButton: true,
                        preConfirm: () => {
                            $(".needs-validation").addClass("was-validated");
                            const nimValue: string | number | string[] = $("#tcv-nim").val();
                            const majorValue: string | number | string[] = $("#tcv-major").val();
                            const telValue: string | number | string[] = $("#tcv-tel").val();
                            if (nimValue !== "" && majorValue !== null && telValue !== "62" && telValue !== "6") {
                                return [nimValue, majorValue, telValue];
                            }
                            return false;
                        },
                        didOpen: (): void => {
                            setInputFilter(document.getElementById("tcv-tel"), (value) => {
                                return /^\d+$/.test(value);
                            });
                        },
                    });

                    if (formValues) {
                        const data = tcv_FirebaseAuth.currentUser();
                        await set(ref(db, `users/${mailEdited}`), userData(data, formValues))
                            .then(() => {
                                tcv_HandleSuccess.show_Confirm("Thank you, have a good day!");
                                resultInit = true;
                            })
                            .catch((error) => {
                                console.error(error);
                                tcv_HandlerError.show_NoConfirm("Firebase RTDB failed to submit user data");
                                resultInit = false;
                            });
                    }
                } else {
                    resultInit = true;
                }
            })
            .catch((error) => {
                console.error(error);
                tcv_HandlerError.show_NoConfirm("Firebase RTDB failed to check user data");
            });
        return resultInit;
    },
};
