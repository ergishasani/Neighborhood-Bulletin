import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.scss';  // Ensure this path is correct

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />  {/* Make sure this line exists */}
  </React.StrictMode>
);