// src/context/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

// Firestore helpers
import {
  getUserByUid,
  setUser,     // creates new doc with admin:false
  updateUser   // merges fields into existing doc
} from "../firebase/firestore";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      setLoading(true);

      const basic = {
        displayName: fbUser.displayName || "",
        email:       fbUser.email       || "",
        photoURL:    fbUser.photoURL    || ""
      };

      try {
        // 1) Check if a Firestore profile exists
        const res = await getUserByUid(fbUser.uid);

        if (res.success) {
          // 2a) Existing user: merge new basic fields, keep their admin/role
          await updateUser(fbUser.uid, basic);

          // support both admin boolean and legacy role string
          const rawAdmin = res.data.admin === true || res.data.role === "admin";
          const { admin, role, ...rest } = res.data;

          setCurrentUser({
            uid:   fbUser.uid,
            admin: Boolean(rawAdmin),
            ...rest,
            ...basic
          });
        } else {
          // 2b) New user: create doc with admin:false
          await setUser(fbUser.uid, { ...basic, admin: false });

          setCurrentUser({
            uid:   fbUser.uid,
            admin: false,
            ...basic
          });
        }
      } catch (err) {
        console.error("AuthContext sync error:", err);
        // fallback to non-admin
        setCurrentUser({
          uid:   fbUser.uid,
          admin: false,
          ...basic
        });
      } finally {
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
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
