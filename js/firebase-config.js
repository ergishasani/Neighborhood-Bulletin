import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = { 
  apiKey: "AIzaSy...",
  authDomain: "taskmanager-d686c.firebaseapp.com",
  projectId: "taskmanager-d686c",
  storageBucket: "taskmanager-d686c.firebasestorage.app",
  messagingSenderId: "282175604056",
  appId: "1:282175604056:web:76f699630ff8f1fc9e512d",
  measurementId: "G-SZVHSH8JGN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign in anonymously (for testing)
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");
  })
  .catch((error) => {
    console.error("Authentication error:", error);
  });

export { app, auth };
