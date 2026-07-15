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

        <button>

          Login

        </button>

      </div>

    </div>
  );
}

export default Login;