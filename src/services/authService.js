// authService.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
} from "firebase/auth";
import { auth } from "../firebase";  // Changed to ../ if this file is in services folder

// Corrected function names (capital 'S' in Sign)
export const doCreateUserWithEmailAndPassword = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error.code));
    }
  };
  
  // Helper function for user-friendly messages
  function getFriendlyErrorMessage(code) {
    switch(code) {
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      // Add more cases as needed
      default:
        return 'Login failed. Please try again';
    }
  }

export const doSignOut = () => {  // Capital S
    return signOut(auth);
};

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

