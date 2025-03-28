// PasswordReset.js
import React, { useState } from 'react';
import { doPasswordReset } from './authService';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsResetting(true);
      await doPasswordReset(email);
      setMessage('Password reset email sent. Please check your inbox.');
      setError(null);
    } catch (err) {
      setError(err.message);
      setMessage(null);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isResetting}>
          {isResetting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;