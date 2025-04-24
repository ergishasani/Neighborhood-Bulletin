// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.scss"; // Make sure this path is correct for your styles
import { AuthProvider } from "./context/AuthContext"; // Correct import

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider> {/* Keep this single provider wrap */}
            <App />
        </AuthProvider>
    </React.StrictMode>
);