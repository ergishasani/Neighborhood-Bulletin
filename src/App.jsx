import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes"; // use your proper routing system

function App() {
    return (
        <Router>
            <AuthProvider>
                <AppRoutes /> {/* This handles ALL routes and layout logic */}
            </AuthProvider>
        </Router>
    );
}

export default App;
