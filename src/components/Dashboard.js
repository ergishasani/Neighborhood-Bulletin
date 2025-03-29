import React from 'react';
import { FaBell, FaMapMarkerAlt, FaUsers, FaClipboardList, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import '../styles/dashboard.scss';

export default function Dashboard() {
  // Sample data - replace with real API calls
  const recentAlerts = [
    { id: 1, type: 'Suspicious Activity', location: 'Maple St', time: '2h ago', status: 'new' },
    { id: 2, type: 'Power Outage', location: 'Central Park', time: '5h ago', status: 'resolved' },
    { id: 3, type: 'Lost Pet', location: 'Oak Ave', time: '1d ago', status: 'active' }
  ];

  const safetyMetrics = {
    responseTime: '28 min',
    incidentsThisMonth: 12,
    resolvedCases: '92%'
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <h1><FaShieldAlt /> Neighborhood Safety Dashboard</h1>
        <div className="alert-badge">
          <FaBell /> <span>3 New Alerts</span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="dashboard-grid">
        {/* Alert Summary Card */}
        <section className="card alert-summary">
          <h2><FaBell /> Recent Alerts</h2>
          <div className="alert-list">
            {recentAlerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.status}`}>
                <div className="alert-type">{alert.type}</div>
                <div className="alert-meta">
                  <span><FaMapMarkerAlt /> {alert.location}</span>
                  <span>{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="view-all">View All Alerts</button>
        </section>

        {/* Safety Metrics Card */}
        <section className="card metrics">
          <h2><FaChartLine /> Community Safety Metrics</h2>
          <div className="metric-grid">
            <div className="metric-item">
              <div className="metric-value">{safetyMetrics.responseTime}</div>
              <div className="metric-label">Avg. Response Time</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{safetyMetrics.incidentsThisMonth}</div>
              <div className="metric-label">Incidents This Month</div>
            </div>
            <div className="metric-item">
              <div className="metric-value">{safetyMetrics.resolvedCases}</div>
              <div className="metric-label">Cases Resolved</div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="card quick-actions">
          <h2><FaClipboardList /> Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn report-incident">
              <FaMapMarkerAlt /> Report Incident
            </button>
            <button className="action-btn notify-neighbors">
              <FaUsers /> Notify Neighbors
            </button>
            <button className="action-btn safety-tips">
              <FaShieldAlt /> Safety Tips
            </button>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="card map-container">
          <h2><FaMapMarkerAlt /> Neighborhood Map</h2>
          <div className="map-placeholder">
            [Interactive Map Component Here]
            <div className="map-overlay">
              <span>3 active incidents in your area</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}