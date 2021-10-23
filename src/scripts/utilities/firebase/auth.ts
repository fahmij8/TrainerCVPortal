import { getAuth, User, onAuthStateChanged, Auth, GoogleAuthProvider, AuthProvider, signInWithRedirect, signOut } from "firebase/auth";
import { tcv_Util } from "../display/util";

export const tcv_FirebaseAuth = {
    currentUser: (): User => {
        const auth: Auth = getAuth();
        const user: User = auth.currentUser;
        return user;
    },

    checkSession: async (): Promise<boolean> => {
        const auth: Auth = getAuth();
        return new Promise((resolve: (value: boolean | PromiseLike<boolean>) => void, reject: (reason?: Error) => void): void => {
            try {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    login: (): void => {
        const auth: Auth = getAuth();
        const provider: AuthProvider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
    },
    logout: async (): Promise<void> => {
        const auth: Auth = getAuth();
        signOut(auth).then(() => {
            if (window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost") {
                window.history.pushState(null, null, `/`);
                window.history.pushState({ state: true }, "", `#login`);
            } else {
                window.history.pushState(null, null, `/`);
                window.history.pushState({ state: true }, "", `/login`);
            }
            tcv_Util.goToPage("hard");
        });
    },
};
