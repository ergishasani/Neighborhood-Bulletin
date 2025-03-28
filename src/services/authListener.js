// authListener.js
import { useEffect, useState } from 'react';
import { auth } from '../firebase';  // Fixed import path
import { onAuthStateChanged } from 'firebase/auth';

export function useAuth() {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set up the auth state listener
        const unsubscribe = onAuthStateChanged(
            auth,
            (user) => {
                setCurrentUser(user);
                setLoading(false);
            },
            (error) => {
                console.error('Auth state error:', error);
                setLoading(false);
            }
        );

        // Cleanup function
        return () => {
            unsubscribe();
        };
    }, []);

    return { currentUser, loading };
}