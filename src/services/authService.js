import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  AuthErrorCodes
} from "firebase/auth";
import { auth } from "../firebase"; // Import auth directly

// Error messages configuration
const ERROR_MESSAGES = {
  // Email/Password errors
  [AuthErrorCodes.INVALID_EMAIL]: 'Please enter a valid email address',
  [AuthErrorCodes.USER_DISABLED]: 'This account has been disabled',
  [AuthErrorCodes.USER_DELETED]: 'No account found with this email',
  [AuthErrorCodes.INVALID_PASSWORD]: 'Incorrect password',
  [AuthErrorCodes.EMAIL_EXISTS]: 'This email is already registered',
  [AuthErrorCodes.WEAK_PASSWORD]: 'Password should be at least 6 characters',
  [AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER]: 'Too many attempts. Please try again later',
  
  // Google auth errors
  [AuthErrorCodes.POPUP_CLOSED_BY_USER]: 'Sign in cancelled',
  [AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE]: 'Account already exists with different login method',
  
  // Network errors
  [AuthErrorCodes.NETWORK_REQUEST_FAILED]: 'Network error. Please check your connection',
  
  // Default fallback
  DEFAULT: 'An error occurred. Please try again'
};

// Enhanced error handler
const getFriendlyErrorMessage = (code) => {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;
};

// Authentication functions
export const authService = {
  async createUser(email, password) {
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error.code));
    }
  },

  async signIn(email, password) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error.code));
    }
  },

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      return await signInWithPopup(auth, provider);
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error.code));
    }
  },

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error('Failed to sign out. Please try again.');
    }
  },

  async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw new Error(getFriendlyErrorMessage(error.code));
    }
  },

  getCurrentUser() {
    return auth.currentUser;
  }
};

// Legacy exports (keep these for backward compatibility)
export const doCreateUserWithEmailAndPassword = authService.createUser;
export const doSignInWithEmailAndPassword = authService.signIn;
export const doSignInWithGoogle = authService.signInWithGoogle;
export const doSignOut = authService.signOut;
export const doPasswordReset = authService.resetPassword;