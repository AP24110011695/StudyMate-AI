import "./Register.css";

function Register(){

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

<button>

Create Account

</button>

</div>

</div>

)

}

export default Register;