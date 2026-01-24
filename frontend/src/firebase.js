import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBKtoWREU3vGux_wIO0pjeOgNmnHXRZE1A",
    authDomain: "narrativeml.firebaseapp.com",
    projectId: "narrativeml",
    storageBucket: "narrativeml.firebasestorage.app",
    messagingSenderId: "782454655868",
    appId: "1:782454655868:web:9f6c7a48cec378ced9f2f9",
    measurementId: "G-7DFCVM3BF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
