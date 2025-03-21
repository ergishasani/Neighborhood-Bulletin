// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFQXQk8BlSqdrMMmOYXDjJVoh_nwMyU7I",
  authDomain: "taskmanager-d686c.firebaseapp.com",
  projectId: "taskmanager-d686c",
  storageBucket: "taskmanager-d686c.firebasestorage.app",
  messagingSenderId: "282175604056",
  appId: "1:282175604056:web:76f699630ff8f1fc9e512d",
  measurementId: "G-SZVHSH8JGN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
