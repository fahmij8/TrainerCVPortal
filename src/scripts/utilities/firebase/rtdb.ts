import { getDatabase, ref, set, get, DataSnapshot } from "firebase/database";
import { tcv_HandlerError, tcv_HandleSuccess } from "../display/handler";
import { tcv_FirebaseAuth } from "./auth";
import Swal from "sweetalert2";

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
                    const { value: formValues } = await Swal.fire({
                        title: "Student Data",
                        html: `
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
                                        <input type="tel" class="form-control" id="tcv-tel" placeholder="628123456789" value="62" minlength="12" required>
                                        <div class="invalid-feedback">Please type a valid WhatsApp Number</div>
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
                        await set(ref(db, `users/${mailEdited}`), {
                            name: data.displayName,
                            email: data.email,
                            tel: formValues[2],
                            nim: formValues[0],
                            major: formValues[1],
                            module1_score: {
                                step1: 0,
                                step2: 0,
                                step3: 0,
                                step4: 0,
                                bonus_score: 0,
                            },
                            module2_score: {
                                step1: 0,
                                step2: 0,
                                step3: 0,
                                step4: 0,
                                bonus_score: 0,
                            },
                            module3_score: {
                                step1: 0,
                                step2: 0,
                                step3: 0,
                                step4: 0,
                                bonus_score: 0,
                            },
                            module4_score: {
                                step1: 0,
                                step2: 0,
                                step3: 0,
                                step4: 0,
                                bonus_score: 0,
                            },
                            module5_score: {
                                step1: 0,
                                step2: 0,
                                step3: 0,
                                step4: 0,
                                bonus_score: 0,
                            },
                        })
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
