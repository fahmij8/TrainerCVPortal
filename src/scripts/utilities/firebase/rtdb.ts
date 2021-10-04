/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDatabase, ref, set, get, DataSnapshot, remove } from "firebase/database";
import { tcv_HandlerError } from "../display/handler";
import { tcv_FirebaseAuth } from "./auth";
import { displayInitUser } from "../../ui/tcv-init-user";

export const tcv_FirebaseDB = {
    getUserData: async (): Promise<DataSnapshot> => {
        const user = tcv_FirebaseAuth.currentUser();
        const mailEdited = user.email.replace(".", "");
        const db = getDatabase();
        return await get(ref(db, `users/${mailEdited}`));
    },
    getSBCStatus: async (): Promise<DataSnapshot> => {
        const db = getDatabase();
        return await get(ref(db, `sbc/status`));
    },
    getScheduleData: async (): Promise<DataSnapshot> => {
        const db = getDatabase();
        return await get(ref(db, `schedule`));
    },
    getSBCData: async (): Promise<DataSnapshot> => {
        const db = getDatabase();
        return await get(ref(db, `sbc`));
    },
    getCamData: async (): Promise<DataSnapshot> => {
        const db = getDatabase();
        return await get(ref(db, `campassword`));
    },
    postData: async (dir: string, data: any): Promise<void> => {
        const db = getDatabase();
        return await set(ref(db, dir), data);
    },
    removeData: async (dir: string): Promise<void> => {
        const db = getDatabase();
        return await remove(ref(db, dir));
    },
    async initUserData(): Promise<boolean> {
        const user = tcv_FirebaseAuth.currentUser();
        const mailEdited = user.email.replace(".", "");
        const db = getDatabase();
        let resultInit = false;
        await get(ref(db, `users/${mailEdited}`))
            .then(async (snapshot) => {
                await displayInitUser(snapshot, mailEdited)
                    .then((result) => (resultInit = result))
                    .catch((error) => {
                        console.error(error);
                        tcv_HandlerError.show_NoConfirm("Firebase RTDB failed to initialize user data");
                    });
            })
            .catch((error) => {
                console.error(error);
                tcv_HandlerError.show_NoConfirm("Firebase RTDB failed to check user data");
            });
        return resultInit;
    },
};
