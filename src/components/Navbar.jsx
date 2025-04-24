import { Link, NavLink } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaSearch, FaPlus, FaUser } from "react-icons/fa";
import { useAuth } from '../context/AuthContext';
import { logout } from "../firebase/auth";

function Navbar() {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Neighborhood Bulletin
        </Link>

        <div className="navbar-links">
          <NavLink to="/" className="nav-link">
            <FaHome /> Home
          </NavLink>
          <NavLink to="/events" className="nav-link">
            <FaCalendarAlt /> Events
          </NavLink>
          <NavLink to="/search" className="nav-link">
            <FaSearch /> Search
          </NavLink>

          {currentUser && (
            <>
              <NavLink to="/create-post" className="nav-link">
                <FaPlus /> Create Post
              </NavLink>
              <NavLink to={`/profile/${currentUser.uid}`} className="nav-link">
                <FaUser /> Profile
              </NavLink>
            </>
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

export default Navbar;