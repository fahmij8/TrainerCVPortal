import { getDatabase, ref, set, get, DataSnapshot } from "firebase/database";
import { tcv_HandlerError } from "../display/handler";
import { tcv_FirebaseAuth } from "./auth";
import Swal from "sweetalert2";

export const tcv_FirebaseDB = {
    getUserData: async (): Promise<DataSnapshot> => {
        const user = tcv_FirebaseAuth.currentUser();
        const mailEdited = user.email.replace(".", "");
        const db = getDatabase();
        return await get(ref(db, `users/${mailEdited}`));
    },
    initUserData: (): void => {
        const user = tcv_FirebaseAuth.currentUser();
        const mailEdited = user.email.replace(".", "");
        const db = getDatabase();
        get(ref(db, `users/${mailEdited}`))
            .then(async (snapshot) => {
                if (!snapshot.exists()) {
                    const { value: formValues } = await Swal.fire({
                        title: "Student Data",
                        html: `
                        <p>Please fill the data carefully!</p>
                        <form class="needs-validation d-block mx-auto text-start was-validated" style="max-width:400px">
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
                            const nimValue: string | number | string[] = $("#tcv-nim").val();
                            const majorValue: string | number | string[] = $("#tcv-major").val();
                            if (nimValue !== "" && majorValue !== null) {
                                return [nimValue, majorValue];
                            }
                            return false;
                        },
                    });

                    if (formValues) {
                        const data = tcv_FirebaseAuth.currentUser();
                        set(ref(db, `users/${mailEdited}`), {
                            name: data.displayName,
                            nim: formValues[0],
                            major: formValues[1],
                            module1_score: {
                                step1: 0,
                                step2: 0,
                                step3: 0,
                                step4: 0,
                            },
                            module2_score: {
                                step1: 0,
                                step2: 0,
                                step3: 0,
                                step4: 0,
                            },
                            module3_score: {
                                step1: 0,
                                step2: 0,
                                step3: 0,
                                step4: 0,
                            },
                            module4_score: {
                                step1: 0,
                                step2: 0,
                                step3: 0,
                                step4: 0,
                            },
                            module5_score: {
                                step1: 0,
                                step2: 0,
                                step3: 0,
                                step4: 0,
                            },
                        })
                            .then(() => {
                                Swal.fire("Thank you, have a good day!");
                            })
                            .catch((error) => {
                                console.error(error);
                                tcv_HandlerError.show_NoConfirm("Error message : Firebase RTDB failed to submit user data\n Please contact the administrator regarding this issue.");
                            });
                    }
                }
            })
            .catch((error) => {
                console.error(error);
                tcv_HandlerError.show_NoConfirm("Error message : Firebase RTDB failed to check user data\n Please contact the administrator regarding this issue.");
            });
    },
};
