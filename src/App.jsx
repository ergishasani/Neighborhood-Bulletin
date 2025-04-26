// src/App.jsx

import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import AppRoutes from "./routes/AppRoutes";

function App() {
    return (
        <Router>
            <AuthProvider>
                <OnboardingProvider>
                    <AppRoutes />
                </OnboardingProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
