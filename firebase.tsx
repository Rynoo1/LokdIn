// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBcXRqZPINgKNHzV9vBHzCEDmHNWikmIjk",
  authDomain: "lokdin-57a58.firebaseapp.com",
  projectId: "lokdin-57a58",
  storageBucket: "lokdin-57a58.firebasestorage.app",
  messagingSenderId: "223052389056",
  appId: "1:223052389056:web:a859846d6106174f372b25"    
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialise Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);