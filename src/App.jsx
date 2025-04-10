// src/App.jsx
// This file defines the main routes for your application.
// It does NOT need to change to include the Feed component,
// as Feed is rendered *inside* the Dashboard component.

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import Login from './components/login'; // Ensure component file names match case if needed (e.g., Login.jsx)
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard'; // This is the component that will render CreatePost and Feed
import ProtectedRoute from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Route */}
        {/* When the path is /dashboard, it renders the Dashboard component */}
        {/* (if the ProtectedRoute allows it based on authentication) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard /> {/* Dashboard component handles rendering CreatePost and Feed */}
            </ProtectedRoute>
          }
        />

        {/* Add other routes here if needed, e.g., for a profile page */}
        {/* <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} /> */}

        {/* Optional: Add a 404 Not Found route */}
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </Router>
  );
}

export default App;