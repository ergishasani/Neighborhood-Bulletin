import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doPasswordReset } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
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
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      
      {!showResetForm ? (
        // Login Form
        <form onSubmit={handleLogin} style={styles.form}>
          {error && <p style={styles.error}>{error}</p>}
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password:</label>
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
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
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={styles.submitButton}
          >
            {isLoading ? 'Logging in...' : 'Sign In'}
          </button>
          
          <div style={styles.linksContainer}>
            <button
              type="button"
              onClick={() => setShowResetForm(true)}
              style={styles.linkButton}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={styles.linkButton}
            >
              Create New Account
            </button>
          </div>
        </form>
      ) : (
        // Password Reset Form
        <form onSubmit={handlePasswordReset} style={styles.form}>
          <h3 style={styles.resetTitle}>Reset Password</h3>
          <p style={styles.resetText}>Enter your email to receive a reset link</p>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email:</label>
            <input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          
          <div style={styles.buttonGroup}>
            <button 
              type="submit"
              style={styles.submitButton}
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
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    textAlign: 'center',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontWeight: 'bold'
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd'
  },
  passwordContainer: {
    position: 'relative',
    display: 'flex'
  },
  showPasswordButton: {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  },
  submitButton: {
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  secondaryButton: {
    padding: '12px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  linksContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px'
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#2196F3',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  error: {
    color: 'red',
    textAlign: 'center'
  },
  resetTitle: {
    textAlign: 'center',
    marginBottom: '5px'
  },
  resetText: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#666'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  }
};

export default Login;