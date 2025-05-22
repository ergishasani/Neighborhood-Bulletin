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

  const closeMobile = () => setMobileOpen(false);

  return (
      <nav className="navbar">
        <div className="navbar-container container">
          <Link to="/" className="navbar-brand" onClick={closeMobile}>
            Neighborhood Bulletin
          </Link>

          <button
              className="navbar-burger"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
          >
            <FaBars />
          </button>

          {/* Links drawer */}
          <div
              className={`navbar-links ${mobileOpen ? "open open--active" : ""}`}
          >
            <NavLink to="/"        className="nav-link" onClick={closeMobile}>
              <FaHome /> Home
            </NavLink>
            <NavLink to="/events"  className="nav-link" onClick={closeMobile}>
              <FaCalendarAlt /> Events
            </NavLink>
            <NavLink to="/search"  className="nav-link" onClick={closeMobile}>
              <FaSearch /> Search
            </NavLink>

            {currentUser && (
                <>
                  <NavLink
                      to="/create-post"
                      className="nav-link"
                      onClick={closeMobile}
                  >
                    <FaPlus /> Create Post
                  </NavLink>
                  <NavLink
                      to={`/profile/${currentUser.uid}`}
                      className="nav-link"
                      onClick={closeMobile}
                  >
                    <FaUser /> Profile
                  </NavLink>
                </>
            )}

            {isAdmin && (
                <NavLink
                    to="/admin"
                    className="nav-link admin-link"
                    onClick={closeMobile}
                >
                  <FaTachometerAlt /> Dashboard
                </NavLink>
            )}
          </div>

          {/* Auth drawer */}
          <div
              className={`navbar-auth ${mobileOpen ? "open open--active" : ""}`}
          >
            {currentUser ? (
                <button
                    onClick={() => { logout(); closeMobile(); }}
                    className="btn btn-logout"
                >
                  Logout
                </button>
            ) : (
                <>
                  <Link
                      to="/login"
                      className="btn btn-login"
                      onClick={closeMobile}
                  >
                    Login
                  </Link>
                  <Link
                      to="/register"
                      className="btn btn-register"
                      onClick={closeMobile}
                  >
                    Register
                  </Link>
                </>
            )}
          </div>
        </div>
      </nav>
  );
}
