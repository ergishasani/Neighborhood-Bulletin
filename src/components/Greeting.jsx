// src/components/Greeting.js
import { useEffect, useState } from 'react';
import { useAuth } from '../services/authListener';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../services/authService';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const Greeting = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };
    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    await doSignOut();
    navigate('/');
  };

  return (
    <div className="greeting-container">
      {userData ? (
        <>
          <h1>Welcome, {userData.firstName}!</h1>
          <p>Neighborhood: {userData.neighborhood}</p>
          <p>Address: {userData.address.street} {userData.address.houseNumber}</p>
        </>
      ) : (
        <h1>Welcome!</h1>
      )}
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Greeting;