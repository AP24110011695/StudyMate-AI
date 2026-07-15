import "./DashboardCard.css";

function DashboardCard({title, value, icon, isLoading}) {
  if (isLoading) {
    return (
      <div className="card dashboard-card">
        <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', marginBottom: 15 }}></div>
        <div className="skeleton" style={{ width: '60%', height: 20, marginBottom: 10 }}></div>
        <div className="skeleton" style={{ width: '40%', height: 32 }}></div>
      </div>
    );
  }

  return (
    <div className="card dashboard-card">
      <div className="card-top">
        <div className="card-icon">{icon}</div>
      </div>
      <h4>{title}</h4>
      <h1>{value}</h1>
    </div>
  )
}

export default DashboardCard;