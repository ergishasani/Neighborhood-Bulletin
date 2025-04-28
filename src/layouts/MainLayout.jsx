// src/layouts/MainLayout.jsx

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
    const { pathname } = useLocation();

    // List any route prefixes where you don't want the nav/footer:
    const hiddenLayoutPrefixes = [
        "/login",
        "/register",
        "/forgot-password",
        "/onboarding",
    ];

    // If the current path starts with any of those, hide the layout:
    const hideLayout = hiddenLayoutPrefixes.some((prefix) =>
        pathname.startsWith(prefix)
    );

    return (
        <div className="app-container">
            {!hideLayout && <Navbar />}
            <main className="main-content">
                <Outlet />
            </main>
            {!hideLayout && <Footer />}
        </div>
    );
}
