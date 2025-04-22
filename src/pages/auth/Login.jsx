import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logInWithEmailAndPassword, signInWithGoogle } from "../../firebase/auth";
import { useAuth } from '../../context/AuthContext';
import Loader from "../../components/Loader";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  if (currentUser) {
    navigate("/");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const result = await logInWithEmailAndPassword(email, password);
    
    if (result.success) {
      navigate("/");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    
    const result = await signInWithGoogle();
    
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login to your account</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <Loader small /> : "Login"}
          </button>
        </form>
        
        <div className="auth-divider">or</div>
        
        <button 
          onClick={handleGoogleLogin} 
          className="btn btn-google"
          disabled={loading}
        >
          Sign in with Google
        </button>
        
        <div className="auth-links">
          <Link to="/register">Don't have an account? Register</Link>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;