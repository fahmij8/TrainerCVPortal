import { getFirestore, doc, setDoc, getDoc, updateDoc, getDocFromCache, getDocsFromCache, deleteDoc, collection, getDocs, DocumentSnapshot, DocumentData, QuerySnapshot } from "firebase/firestore";
import { displayInitUser } from "../../ui/tcv-init-user";
import { tcv_FirebaseAuth } from "./auth";
import { tcv_HandlerError } from "../display/handler";

export const tcv_FirebaseFirestore = {
    getData: (parentCollection: string, childDocument?: string): Promise<DocumentSnapshot<DocumentData>> | Promise<QuerySnapshot<DocumentData>> => {
        if (navigator.onLine) {
            if (childDocument !== "" && childDocument !== undefined && childDocument !== null) {
                return getDoc(doc(getFirestore(), parentCollection, childDocument));
            } else {
                return getDocs(collection(getFirestore(), parentCollection));
            }
        } else {
            if (childDocument !== "" && childDocument !== undefined && childDocument !== null) {
                return getDocFromCache(doc(getFirestore(), parentCollection, childDocument));
            } else {
                return getDocsFromCache(collection(getFirestore(), parentCollection));
            }
        }
    },
    postData: (parentCollection: string, childDocument: string, data): Promise<void> => {
        return setDoc(doc(getFirestore(), parentCollection, childDocument), data);
    },
    updateData: (parentCollection: string, childDocument: string, data): Promise<void> => {
        return updateDoc(doc(getFirestore(), parentCollection, childDocument), data);
    },
    deleteData: (parentCollection: string, childDocument: string): Promise<void> => {
        return deleteDoc(doc(getFirestore(), parentCollection, childDocument));
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
                    resultInit = true;
                } else {
                    tcv_HandlerError.show_NoConfirm("Firestore failed to check user data");
                }
            });
        return resultInit;
    },
};
