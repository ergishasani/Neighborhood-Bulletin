import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = { 
  apiKey: "AIzaSyDQLD9EuDCXu_yJWdFUF3umukkg2NrJ3lg",  // Directly hardcoded API key
  authDomain: "neighborhood-bulletin.firebaseapp.com",
  projectId: "neighborhood-bulletin",
  storageBucket: "neighborhood-bulletin.firebasestorage.app",
  messagingSenderId: "936396161914",
  appId: "1:936396161914:web:a866dfb7af28777ae2ccc3",
  measurementId: "G-VGQG53ZLQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (optional)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

export default app;
