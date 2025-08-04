import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";

export const loginUser = (email: string, password: string) => {
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User logged in: ", user.email);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log("Error ", errorCode, ": ", errorMessage);
        });
}

export const registerUser = (email: string, password: string) => {

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("User registered: ", user.email);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            console.log("Error ", errorCode, ": ", errorMessage);
        });
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