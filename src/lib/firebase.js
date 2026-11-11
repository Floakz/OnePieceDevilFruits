
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

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

let signInRequest;
export async function ensureFirebaseUser() {
    await auth.authStateReady();
    if (auth.currentUser) return auth.currentUser;

    signInRequest ??= signInAnonymously(auth)
        .then(({ user }) => user)
        .finally(() => { signInRequest = undefined; });
    return signInRequest;
}

// Daily Fight also relies on sign-in starting when this module loads.
ensureFirebaseUser().catch(console.error);

// 4️⃣ Export both so other files can use them
export { db, auth };
