import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import styles from "../styles/dashboard.scss"; // Assuming you have a CSS module for styling

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const alertsSnapshot = await getDocs(collection(db, "posts"));

      setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setAlerts(alertsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Welcome to Your Neighborhood Watch</h1>
        <p>Stay informed. Stay safe. Stay connected.</p>
      </section>

      {/* Residents Section */}
      <section className={styles.section}>
        <h2>Verified Residents</h2>
        <div className={styles.grid}>
          {users.map((user) => (
            <div key={user.id} className={styles.card}>
              <h3>
                {user.firstName} {user.lastName}
              </h3>
              <p>{user.street}, House #{user.houseNumber}</p>
              <p className={user.isAddressVerified ? styles.verified : styles.unverified}>
                {user.isAddressVerified ? "✅ Verified" : "❌ Unverified"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Alerts Section */}
      <section className={styles.section}>
        <h2>Recent Alerts</h2>
        <div className={styles.alerts}>
          {alerts.length === 0 ? (
            <p>No alerts yet.</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className={styles.alertCard}>
                <h4>{alert.title}</h4>
                <p>{alert.message}</p>
                <span className={styles.timestamp}>{new Date(alert.timestamp?.seconds * 1000).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
