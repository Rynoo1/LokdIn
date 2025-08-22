import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in: ", userCredential.user.email);
        return {
            success: true,
            message: 'Login Success!'
        };
    } catch (error: any) {
        console.log("Error ", error.code, ": ", error.message);
        return {
            success: false,
            message: error.code,
        };
    }
}

export const registerUser = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User Created: ", userCredential.user.email);
        return {
            success: true,
            message: 'Successfully registered',
        };
    } catch (error: any) {
        console.log("Error ", error.code, ": ", error.message);
        return {
            success: false,
            message: error.code,
        };
    };
}

export const logoutUser = () => {
    signOut(auth)
        .then(() => {
            console.log("User logged out");
        })
}

export const getUserInfo = () => {
    const user = auth.currentUser;

    if (user) {
        return user;
    } else {
        return null;
    }
}