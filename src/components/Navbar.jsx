// src/components/Navbar.jsx

import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaSearch,
  FaPlus,
  FaUser,
  FaTachometerAlt,
  FaBars
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { logout } from "../firebase/auth";
import "../styles/components/_navbar.scss";

const ADMIN_UID = "P96SuPRCKad8h8eSkvsF2LD2aew2";

export default function Navbar() {
  const { currentUser } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = Boolean(
      currentUser?.admin === true ||
      currentUser?.uid === ADMIN_UID
  );

  return (
      <nav className="navbar">
        <div className="navbar-container container">
          <Link to="/" className="navbar-brand">
            Neighborhood Bulletin
          </Link>

          <button
              className="navbar-burger"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
          >
            <FaBars />
          </button>

          <div className={`navbar-links ${mobileOpen ? "open" : ""}`}>
            <NavLink to="/" className="nav-link" onClick={() => setMobileOpen(false)}>
              <FaHome /> Home
            </NavLink>
            <NavLink to="/events" className="nav-link" onClick={() => setMobileOpen(false)}>
              <FaCalendarAlt /> Events
            </NavLink>
            <NavLink to="/search" className="nav-link" onClick={() => setMobileOpen(false)}>
              <FaSearch /> Search
            </NavLink>

            {currentUser && (
                <>
                  <NavLink to="/create-post" className="nav-link" onClick={() => setMobileOpen(false)}>
                    <FaPlus /> Create Post
                  </NavLink>
                  <NavLink to={`/profile/${currentUser.uid}`} className="nav-link" onClick={() => setMobileOpen(false)}>
                    <FaUser /> Profile
                  </NavLink>
                </>
            )}

            {isAdmin && (
                <NavLink to="/admin" className="nav-link admin-link" onClick={() => setMobileOpen(false)}>
                  <FaTachometerAlt /> Dashboard
                </NavLink>
            )}
          </div>

          <div className="navbar-auth">
            {currentUser ? (
                <button onClick={logout} className="btn btn-logout">
                  Logout
                </button>
            ) : (
                <>
                  <Link to="/login" className="btn btn-login">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-register">
                    Register
                  </Link>
                </>
            )}
          </div>
        </div>
      </nav>
  );
}
