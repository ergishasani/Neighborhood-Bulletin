// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { setUser } from "../firebase/firestore"; // ← import our helper

// Create the AuthContext
export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    // Subscribe to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        // Ensure we have a Firestore user doc (creates or merges)
        setUser(user.uid, {
          displayName: user.displayName || "",
          email:       user.email || "",
          photoURL:    user.photoURL || "",
        }).catch((err) => {
          console.error("Error writing user doc:", err);
        }).finally(() => {
          setLoading(false);
        });
      } else {
        // No user signed in
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
      <AuthContext.Provider value={{ currentUser, loading }}>
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
