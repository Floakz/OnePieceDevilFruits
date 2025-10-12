
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FB_API_KEY,
    authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FB_PROJECT_ID,
    appId: import.meta.env.VITE_FB_APP_ID,
};

// 1️⃣ Initialize app first
const app = initializeApp(firebaseConfig);

// 2️⃣ Then get Firestore + Auth
const db = getFirestore(app);
const auth = getAuth(app);

// 3️⃣ Sign in anonymously once (no UI needed)
signInAnonymously(auth).catch(console.error);

// 4️⃣ Export both so other files can use them
export { db, auth };
