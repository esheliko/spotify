import { signInWithPopup, signOut, User } from "firebase/auth";
import { auth, authProvider } from "../globals";

export class Auth {
    public static async signIn(): Promise<User | undefined> {
        localStorage.removeItem('authUser');
        return signInWithPopup(auth, authProvider)
            .then(result => {
                const user = result.user;
                localStorage.setItem('authUser', JSON.stringify(user));
                console.log(user)
                return user
            }).catch(error => {
                localStorage.removeItem('authUser');
                console.log(error)
                return undefined
            });
    }

    public static async autoSignIn(): Promise<User | undefined> {
        const user = localStorage.getItem('authUser')
        if (user) {
            return (JSON.parse(localStorage.getItem('authUser') ?? "{}") as (User | undefined))
        } else {
            return await Auth.signIn()
        }
    }
}