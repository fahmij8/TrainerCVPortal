import { getAuth, User } from "firebase/auth";

export const firebaseGetCurrentUser = (): null | User => {
    const auth = getAuth();
    const user = auth.currentUser;
    return user;
};
