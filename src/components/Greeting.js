// src/components/Greeting.js
import { useAuth } from '../services/authListener';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../services/authService';

const Greeting = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await doSignOut();
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h1>Welcome, {currentUser?.email}!</h1>
      <p>You're successfully logged in.</p>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px'
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '20px'
  }
};

export default Greeting;