// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";  // Add this import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQLD9EuDCXu_yJWdFUF3umukkg2NrJ3lg",
  authDomain: "neighborhood-bulletin.firebaseapp.com",
  projectId: "neighborhood-bulletin",
  storageBucket: "neighborhood-bulletin.appspot.com",
  messagingSenderId: "936396161914",
  appId: "1:936396161914:web:a866dfb7af28777ae2ccc3",
  measurementId: "G-VGQG53ZLQR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);  // Initialize Authentication

// Export what you need
export { auth };  // Must export this for other files
export default app;