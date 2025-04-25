// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config"; // Ensure this path is correct
import { onAuthStateChanged } from "firebase/auth";

// Define and Export the Context (only ONCE)
export const AuthContext = createContext(undefined);

// Define and Export the AuthProvider Component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start loading

  useEffect(() => {
    // Listen for authentication state changes from Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update state with the user object or null
      setLoading(false);    // Set loading to false once the check is complete
    });

    // Cleanup subscription when the component unmounts
    return unsubscribe;
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // The value object to be provided by the context
  const value = {
    currentUser,
    loading, // Components can use this to show loading indicators
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
}

// Define and Export the useAuth Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
