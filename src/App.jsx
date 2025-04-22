import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/home/Home";
import Events from "./pages/categories/Events";
import Search from "./pages/posts/SearchResults";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import NotFound from "./pages/misc/NotFound";
import CreatePost from "./pages/posts/CreatePost"; // ✅ NEW

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app-container">
                    <Navbar />

                    <main style={{ minHeight: "80vh" }}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/events" element={<Events />} />
                            <Route path="/search" element={<Search />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/create" element={<CreatePost />} /> {/* ✅ NEW */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
