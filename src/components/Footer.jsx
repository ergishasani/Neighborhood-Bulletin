import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} Neighborhood Bulletin Board. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;