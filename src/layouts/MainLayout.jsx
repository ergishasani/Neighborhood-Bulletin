import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
    const location = useLocation();

    // Define an array of routes where Navbar and Footer should not be shown
    const noLayoutPages = ['/login', '/register', '/forgot-password'];

    // Check if the current route is one of the routes where Navbar/Footer should be hidden
    const isNoLayoutPage = noLayoutPages.includes(location.pathname);

    return (
        <div className="app-container">
            {/* Conditionally render Navbar and Footer */}
            {!isNoLayoutPage && <Navbar />}
            <main className="main-content">
                <Outlet />
            </main>
            {!isNoLayoutPage && <Footer />}
        </div>
    );
}

export default MainLayout;
