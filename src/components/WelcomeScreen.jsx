// src/components/WelcomeScreen.js
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Welcome to Neighborhood Bulletin</h1>
      <div style={styles.buttonContainer}>
        <button 
          onClick={() => navigate('/login')}
          style={styles.primaryButton}
        >
          Login
        </button>
        <button 
          onClick={() => navigate('/register')}
          style={styles.secondaryButton}
        >
          Register
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px'
  },
  buttonContainer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'center',
    gap: '20px'
  },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default WelcomeScreen;