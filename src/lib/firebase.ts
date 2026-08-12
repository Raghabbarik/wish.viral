import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCFy2EmBwFdCxvVewljH9WceAbzxdGh0V8",
  authDomain: "wish-93610.firebaseapp.com",
  projectId: "wish-93610",
  storageBucket: "wish-93610.firebasestorage.app",
  messagingSenderId: "751523966790",
  appId: "1:751523966790:web:152379e7356fe2f0bf7f47",
  measurementId: "G-E2RKCY123N",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Only init analytics in browser (not SSR)
if (typeof window !== "undefined") {
  getAnalytics(app);
}

export default app;
