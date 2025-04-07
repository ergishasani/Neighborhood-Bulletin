import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../services/authService';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ReactComponent as GoogleIcon } from '../assets/google.svg';
import neighborhoodImage from '../assets/login.png';
import '../styles/signUp.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    houseNumber: '',
    street: '',
    neighborhood: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await doCreateUserWithEmailAndPassword(
        formData.email, 
        formData.password
      );
      
      // Create user document with UID as document ID
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        houseNumber: formData.houseNumber,
        street: formData.street,
        neighborhood: formData.neighborhood,
        isAddressVerified: false,
        createdAt: new Date(),
        rememberMe
      });
      
      navigate('/greeting');
    } catch (err) {
      setError(err.message.includes('auth/') 
        ? formatAuthError(err.message)
        : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAuthError = (message) => {
    if (message.includes('email-already-in-use')) {
      return 'This email is already registered. Please log in.';
    }
    if (message.includes('weak-password')) {
      return 'Password should be at least 6 characters.';
    }
    return 'Registration failed. Please try again.';
  };

  return (
    <div className="register-container">
      <div className="image-section">
        <div className="image-wrapper">
          <img src={neighborhoodImage} alt="Neighborhood" />
        </div>
        <div className="image-overlay">
          <h1>Your Neighborhood, Your Watch</h1>
          <p className="lead">Together we build safer communities</p>
          <div className="features">
            <div className="feature-item">
              <span className="icon">👁️</span>
              <span>Real-time alerts</span>
            </div>
            <div className="feature-item">
              <span className="icon">🤝</span>
              <span>Trusted neighbors</span>
            </div>
            <div className="feature-item">
              <span className="icon">🔒</span>
              <span>Secure platform</span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="auth-container">
          <div className="form-header">
            <h2>Create Account</h2>
            <p>Sign up to start monitoring your neighborhood</p>
          </div>

          {error && <p className="error">{error}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group form-group-name">
                <label>First name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group form-group-lastname">
                <label>Last name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label>Password (min 6 characters)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                minLength="6"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>House Number</label>
                <input
                  type="text"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Street</label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Neighborhood</label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="remember" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <button type="button" className="social-btn">
              <GoogleIcon />
              Sign up with Google
            </button>

            <div className="login-link">
              Already have an account? <Link to="/login">Log in!</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;