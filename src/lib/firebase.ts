import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyACCY1ryA1e95hNQjaBoZ2R17mqwDkQwJw",
    authDomain: "jashan-edge.firebaseapp.com",
    projectId: "jashan-edge",
    storageBucket: "jashan-edge.firebasestorage.app",
    messagingSenderId: "274254249065",
    appId: "1:274254249065:web:86402ca892981d541cb6f8",
    measurementId: "G-826V6SGFYK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Use initializeFirestore to enable "long polling" which is more reliable on certain networks
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

export const storage = getStorage(app);
export default app;
