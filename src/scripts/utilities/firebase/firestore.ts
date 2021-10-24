import { getFirestore, doc, setDoc, getDoc, updateDoc, enableNetwork, disableNetwork, DocumentSnapshot, DocumentData } from "firebase/firestore";
import { displayInitUser } from "../../ui/tcv-init-user";
import { tcv_FirebaseAuth } from "./auth";
import { tcv_HandlerError } from "../display/handler";

export const tcv_FirebaseFirestore = {
    getData: (parentCollection: string, childDocument: string): Promise<DocumentSnapshot<DocumentData>> => {
        return getDoc(doc(getFirestore(), parentCollection, childDocument));
    },
    postData: (parentCollection: string, childDocument: string, data): Promise<void> => {
        return setDoc(doc(getFirestore(), parentCollection, childDocument), data);
    },
    updateData: (parentCollection: string, childDocument: string, data): Promise<void> => {
        return updateDoc(doc(getFirestore(), parentCollection, childDocument), data);
    },
    initUserData: async (): Promise<boolean> => {
        const user = tcv_FirebaseAuth.currentUser();
        const mailEdited = user.email.replace(".", "");
        let resultInit = false;
        await tcv_FirebaseFirestore
            .getData("users", mailEdited)
            .then(async (snapshot) => {
                await displayInitUser(snapshot, mailEdited)
                    .then((result) => (resultInit = result))
                    .catch((error) => {
                        console.error(error);
                        tcv_HandlerError.show_NoConfirm("Firestore failed to initialize user data");
                    });
            })
            .catch((error) => {
                console.error(error);
                if (error.message === "Failed to get document because the client is offline.") {
                    console.log("Test offline");
                    resultInit = true;
                } else {
                    tcv_HandlerError.show_NoConfirm("Firestore failed to check user data");
                }
            });
        return resultInit;
    },
};
