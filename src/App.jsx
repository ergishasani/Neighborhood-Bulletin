// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomeScreen from './components/WelcomeScreen';
import Login from './components/login'; // Ensure correct case of filenames (Login.jsx)
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard'; // Dashboard handles Feed and CreatePost
import ProtectedRoute from './routes/ProtectedRoute';
import Feed from './pages/Feed'; // Feed is the page showing posts

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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard /> {/* Dashboard renders Feed and PostForm */}
            </ProtectedRoute>
          }
        />

        {/* Public Route to see posts */}
        <Route path="/feed" element={<Feed />} /> {/* Display posts on /feed */}

        {/* Optional: Homepage Route */}
        <Route path="/" element={<Feed />} /> {/* This can also be set as the homepage */}

        {/* Add other routes here if needed */}
        {/* <Route path="/profile/:userId" element={<Profile />} /> */}

        {/* Optional: 404 Not Found route */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
