import "./Register.css";
import { useNavigate, Link } from "react-router-dom";

function Register(){
  const navigate = useNavigate();

return(

<div className="auth-page">

<div className="auth-card">

<h1>Create Account</h1>

<input
placeholder="Full Name"
/>

<input
placeholder="Email"
/>

<input
type="password"
placeholder="Password"
/>

        <button onClick={() => navigate("/dashboard")}>

Create Account

        </button>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>

</div>

</div>

)

}

export default Register;