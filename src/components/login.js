import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doPasswordReset } from '../services/authService';
import phoneImage from '../assets/login.png'; // Update path as needed
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await doSignInWithEmailAndPassword(email, password);
      navigate('/greeting');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await doPasswordReset(resetEmail);
      alert(`Password reset email sent to ${resetEmail}`);
      setShowResetForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Column - Login Form */}
      <div style={styles.loginColumn}>
      <div style={styles.nav}>
         <a href="../WelcomeScreen.js" style={styles.logo}>Neighborhood Lookout</a>
      </div>
        <div style={styles.card}>
          <h2 style={styles.title}>Sign in</h2>
          <p style={styles.subtitle}>
            If you don't have an account register<br />
            You can <a href="/register" style={styles.registerLink}>Register here!</a>
          </p>

          {error && <p style={styles.error}>{error}</p>}

          {!showResetForm ? (
            <form onSubmit={handleLogin} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.passwordContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.showPasswordButton}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div style={styles.rememberContainer}>
                <label style={styles.rememberLabel}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={styles.checkbox}
                  />
                  Remember me
                </label>
                <a 
                  href="#reset" 
                  onClick={(e) => { e.preventDefault(); setShowResetForm(true); }}
                  style={styles.forgotLink}
                >
                  Forgot Password?
                </a>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                style={styles.loginButton}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.buttonGroup}>
                <button 
                  type="submit"
                  style={styles.loginButton}
                >
                  Send Reset Link
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetForm(false)}
                  style={styles.secondaryButton}
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Column - Contact Info */}
      <div style={styles.infoColumn}>
        <div style={styles.infoCard}>
          <div style={styles.contactInfo}>
          <img 
        src={phoneImage} 
        alt="Contact Phone Number" 
        style={styles.phoneImage} 
          />
            <h3 style={styles.infoTitle}>Sign in to Neighborhood Lookout</h3>
            <p style={styles.infoText}>Sign in to a place where we prioritize the safety of people</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: "'Inter', sans-serif"
  },
  loginColumn: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    maxWidth: '600px'
  },
  infoColumn: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    borderRadius: '12px',
    height: '85vh',
    background: 'linear-gradient(135deg, #000842 0%, #7c3aed 100%)',
    color: 'white',
     maxWidth: '550px'
  },
  phoneImage: {
    width: '400px', // Adjust based on your image dimensions
    height: 'auto',
    marginBottom: '24px',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  infoCard: {
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '32px',
    textAlign: 'center',
    lineHeight: '1.5'
  },
  registerLink: {
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '500',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1e293b'
  },
  input: {
    width: '362px',
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    transition: 'all 0.2s',
    ':focus': {
      borderColor: '#4f46e5',
      outline: 'none',
      boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)'
    }
  },
  passwordContainer: {
    position: 'relative'
  },
  showPasswordButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4f46e5',
    padding: '4px 8px',
    borderRadius: '4px',
    ':hover': {
      backgroundColor: '#f1f5f9'
    }
  },
  rememberContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '-8px'
  },
  rememberLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#334155'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    accentColor: '#4f46e5'
  },
  forgotLink: {
    fontSize: '14px',
    color: '#4f46e5',
    textDecoration: 'none',
    fontWeight: '500',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  loginButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#4338ca'
    },
    ':disabled': {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    }
  },
  secondaryButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'white',
    color: '#4f46e5',
    border: '1px solid #4f46e5',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#f5f3ff'
    }
  },
  error: {
    color: '#ef4444',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '16px'
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  contactInfo: {
    color: 'white',
    textAlign: 'center'
  },
  infoTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  infoText: {
    fontSize: '16px',
    opacity: '0.9',
    lineHeight: '1.5'
  },
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 5%', // Responsive padding
    backgroundColor: 'white',
    boxShadow: '0 2px 15px rgba(0, 0, 0, 0.08)', // Subtle shadow
    zIndex: 1000,
    borderBottom: '1px solid #f0f0f0', // Light border
    transition: 'all 0.3s ease' // Smooth transitions
  },

  
};

export default Login;