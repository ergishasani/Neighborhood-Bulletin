// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Add Firestore import

const firebaseConfig = {
  apiKey: "AIzaSyDQLD9EuDCXu_yJWdFUF3umukkg2NrJ3lg",
  authDomain: "neighborhood-bulletin.firebaseapp.com",
  projectId: "neighborhood-bulletin", // This is your Firestore project ID
  storageBucket: "neighborhood-bulletin.appspot.com",
  messagingSenderId: "936396161914",
  appId: "1:936396161914:web:a866dfb7af28777ae2ccc3",
  measurementId: "G-VGQG53ZLQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

// Export services
export { auth, db }; // Export both auth and Firestore
export default app;