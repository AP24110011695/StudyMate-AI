import "./WelcomeCard.css";

function WelcomeCard({ onUpload }) {
  return (
    <div className="card welcome-card">
      <div>
        <h1>Welcome back, Ayush 👋</h1>
        <p>Ready to continue learning today?</p>
      </div>

      <button className="btn btn-primary" onClick={onUpload}>
        Upload New PDF
      </button>
    </div>
  );
}

export default WelcomeCard;