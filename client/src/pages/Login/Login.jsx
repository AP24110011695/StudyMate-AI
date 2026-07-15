import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

function Login() {


  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>StudyMate AI</h1>

        <p>Welcome Back</p>

        <input
          type="email"
          placeholder="Email"
        />

        <input
          type="password"
          placeholder="Password"
        />

        <button onClick={() => navigate("/dashboard")}>Login</button>
<p className="auth-link">Don't have an account? <Link to="/register">Create Account</Link></p>

      </div>

    </div>
  );
}

export default Login;