import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return children;
};

export default ProtectedRoute;