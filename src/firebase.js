import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsk-G3gYLEFbPJ9j12MNBMo2VH6KFEvmE",
    authDomain: "noor-store-980e6.firebaseapp.com",
    projectId: "noor-store-980e6",
    storageBucket: "noor-store-980e6.firebasestorage.app",
    messagingSenderId: "982730865046",
    appId: "1:982730865046:web:17c1d47aa1b9e2ff1c85b7",
    measurementId: "G-J7E187DSLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const db = getFirestore(app);
export const auth = getAuth(app);
