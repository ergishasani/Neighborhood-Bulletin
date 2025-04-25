import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { logInWithEmailAndPassword, signInWithGoogle } from '../../firebase/auth';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import googleIcon from '../../assets/google.png';
import '../../styles/main.scss';
import '../../styles/pages/_login.scss';
import '../../styles/pages/_backButton.scss';

const Login = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Prevent redirect loop if user is already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('../');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await logInWithEmailAndPassword(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password'); // You can customize this error message
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Failed to sign in with Google');
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
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button
                type="submit"
                className="signin-button"
                disabled={isLoading}
            >
              {isLoading ? <Loader small /> : 'Sign in'}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <button
                type="button"
                className="google-signin"
                onClick={handleGoogleLogin}
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
          <img
              src={require('../../assets/login.png')}
              alt="Welcome illustration"
              className="login-image"
          />
        </div>
      </div>
  );
};

export default Login;
