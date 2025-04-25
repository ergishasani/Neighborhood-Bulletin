import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./config";  // Ensure your config file is correctly set up and initialized

const googleProvider = new GoogleAuthProvider();

// Register new user with email and password
export const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    // Create user
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Update profile with name
    await updateProfile(user, {
      displayName: name,
    });

    // Return success
    return { success: true, user };
  } catch (err) {
    // Handle errors
    return { success: false, error: err.message };
  }
};

// Log in with email and password
export const logInWithEmailAndPassword = async (email, password) => {
  try {
    // Sign in with email and password
    const res = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: res.user };
  } catch (err) {
    // Handle errors
    return { success: false, error: err.message };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    // Google login via popup
    const res = await signInWithPopup(auth, googleProvider);
    return { success: true, user: res.user };
  } catch (err) {
    // Handle errors
    return { success: false, error: err.message };
  }
};

// Send password reset email
export const sendPasswordReset = async (email) => {
  try {
    // Send reset email
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (err) {
    // Handle errors
    return { success: false, error: err.message };
  }
};

// Logout the current user
export const logout = async () => {
  try {
    // Sign out the user
    await signOut(auth);
    return { success: true };
  } catch (err) {
    // Handle errors
    return { success: false, error: err.message };
  }
};
