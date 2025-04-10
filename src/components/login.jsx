import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../services/authService';
import '../styles/main.scss';
import '../styles/login.scss'; 
import '../styles/backButton.scss';
import googleIcon from '../assets/google.png';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await doSignInWithEmailAndPassword(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await doSignInWithGoogle();
      navigate('../pages/Feed.jsx');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <button 
        className={`back-button ${hovered ? 'expanded' : ''}`} 
        onClick={() => navigate('/')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={isLoading}
      >
        <ArrowLeft size={20} />
        <span className="back-text">Main Page</span>
      </button>

      <div className="login-form-container">
        <div className="login-header">
          <h1>WELCOME TO NEIGHBORHOOD LOOKOUT</h1>
          <p>We're glad to see you again! Sign in to continue keeping your community safe.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="***********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot password
            </Link>
          </div>

          <button 
            type="submit" 
            className="signin-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <button 
            type="button" 
            className="google-signin"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <img src={googleIcon} alt="Google" />
            <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
          </button>

          <div className="signup-link">
            Don't have an account? <Link to="/register">Sign up for free!</Link>
          </div>
        </form>
      </div>

      <div className="login-image-container">
        <img src={require('../assets/login.png')} alt="Welcome illustration" className="login-image" />
      </div>
    </div>
  );
};

export default Login;

