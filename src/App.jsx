import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Your context provider
import Navbar from "./components/Navbar"; // Component using useAuth

function App() {
    return (
        <Router>
            <AuthProvider>
                <Navbar />
                {/* Other components */}
            </AuthProvider>
        </Router>
    );
}

export default App;
