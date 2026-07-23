import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="card auth-card">
        <h1>StudyMate AI</h1>
        <p>Welcome Back</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', textAlign: 'left' }}>
          <input
            type="email"
            className={`form-input ${error && !email ? 'error' : ''}`}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <input
              type="password"
              className={`form-input ${error && !password ? 'error' : ''}`}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <span className="error-text">{error}</span>}
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleLogin} disabled={loading} style={{ width: '100%' }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="auth-link">Don't have an account? <Link to="/register">Create Account</Link></p>
      </div>
    </div>
  );
}

export default Login;