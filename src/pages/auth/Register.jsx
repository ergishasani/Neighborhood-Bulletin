import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmailAndPassword } from '../../firebase/auth'; // Corrected import
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { ReactComponent as GoogleIcon } from '../../assets/google.svg';
import neighborhoodImage from '../../assets/login.png';
import '../../styles/pages/_register.scss';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await registerWithEmailAndPassword(
          formData.firstName, // name parameter
          formData.email,
          formData.password
      );

      await addDoc(collection(db, 'users'), {
        uid: userCredential.user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: new Date(),
        rememberMe
      });

      navigate('/greeting');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
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
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
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
                <a href="/forgot-password" className="forgot-password">Forgot password?</a>
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
