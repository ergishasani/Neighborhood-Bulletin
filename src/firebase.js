// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyDQLD9EuDCXu_yJWdFUF3umukkg2NrJ3lg",
  authDomain: "neighborhood-bulletin.firebaseapp.com",
  projectId: "neighborhood-bulletin",
  storageBucket: "neighborhood-bulletin.appspot.com", // Firebase storage bucket
  messagingSenderId: "936396161914",
  appId: "1:936396161914:web:a866dfb7af28777ae2ccc3",
  measurementId: "G-VGQG53ZLQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

// Export services


export { auth, db, storage }; // Export Firestore and Firebase Storage
export default app;
