// src/components/ProtectedRoute.js
import { useAuth } from '../services/authListener';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return currentUser ? children : <Navigate to="/login" replace />;
}