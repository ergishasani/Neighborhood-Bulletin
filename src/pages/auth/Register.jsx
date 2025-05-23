// src/pages/register/Register.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  registerWithEmailAndPassword,
  signInWithGoogle,
} from "../../firebase/auth";
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "../../firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ReactComponent as GoogleIcon } from "../../assets/google.svg";
import neighborhoodImage from "../../assets/login.png";
import "../../styles/pages/_register.scss";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError]           = useState("");
  const [isLoading, setIsLoading]   = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  }

  async function handleEmailSignup(e) {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);

    try {
      // 1. Create auth user
      const cred = await registerWithEmailAndPassword(
          formData.email,
          formData.password
      );

      // 2. Set displayName
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      await updateProfile(cred.user, { displayName: fullName });

      // 3. Write Firestore user doc
      await setDoc(doc(db, "users", cred.user.uid), {
        uid:       cred.user.uid,
        firstName: formData.firstName,
        lastName:  formData.lastName,
        email:     formData.email,
        createdAt: new Date(),
        rememberMe,
      });

      // 4. Navigate
      navigate("/greeting");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignup() {
    setError("");
    setIsLoading(true);

    try {
      // 1. Sign in with Google
      const cred = await signInWithGoogle();

      // 2. If first-time, write user doc
      const uref = doc(db, "users", cred.user.uid);
      const snap = await getDoc(uref);
      if (!snap.exists()) {
        const [firstName, ...rest] = (cred.user.displayName || "").split(" ");
        const lastName = rest.join(" ");
        await setDoc(uref, {
          uid:       cred.user.uid,
          firstName: firstName || "",
          lastName:  lastName  || "",
          email:     cred.user.email,
          createdAt: new Date(),
          rememberMe,
        });
      }

      // 3. Navigate
      navigate("/greeting");
    } catch (err) {
      console.error(err);
      setError("Google signup failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div className="register-container">
        {/* Image + overlay */}
        <div className="image-section">
          <div className="image-wrapper">
            <img src={neighborhoodImage} alt="Neighborhood" />
          </div>
          <div className="image-overlay">
            <h1>Your Neighborhood, Your Watch</h1>
            <p className="lead">Together we build safer communities</p>
            <div className="features">
              <div className="feature-item">
                <span className="icon">👁️</span> Real-time alerts
              </div>
              <div className="feature-item">
                <span className="icon">🤝</span> Trusted neighbors
              </div>
              <div className="feature-item">
                <span className="icon">🔒</span> Secure platform
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="form-section">
          <div className="auth-container">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Sign up to start monitoring your neighborhood</p>
            </div>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleEmailSignup}>
              <div className="form-row">
                <div className="form-group form-group-name">
                  <label>First name</label>
                  <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                  />
                </div>
                <div className="form-group form-group-lastname">
                  <label>Last name</label>
                  <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                />
              </div>

              <div className="form-options">
                <div className="checkbox-group">
                  <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>

              <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <div className="divider"><span>or</span></div>

            <button
                type="button"
                className="social-btn"
                onClick={handleGoogleSignup}
                disabled={isLoading}
            >
              <GoogleIcon />
              {isLoading ? "Please wait..." : "Sign up with Google"}
            </button>

            <div className="login-link">
              Already have an account? <Link to="/login">Log in!</Link>
            </div>
          </div>
        </div>
      </div>
  );
}
