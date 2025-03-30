// LogoutButton.js
import { doSignOut } from './authService';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await doSignOut();
      // Redirect to login or home page
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;