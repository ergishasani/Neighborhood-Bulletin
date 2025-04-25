import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signOut,
    updateProfile,
  } from "firebase/auth";
  import { auth } from "./config";
  
  const googleProvider = new GoogleAuthProvider();
  
  export const registerWithEmailAndPassword = async (name, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await updateProfile(user, {
        displayName: name,
      });
      return { success: true, user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const logInWithEmailAndPassword = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const signInWithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      return { success: true, user: res.user };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const sendPasswordReset = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
  
  export const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };