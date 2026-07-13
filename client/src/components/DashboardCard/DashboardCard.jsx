import "./DashboardCard.css";

function DashboardCard({title,value,icon}){

return(

<div className="dashboard-card">

<div className="card-top">

<div className="card-icon">

{icon}

</div>

</div>

<h4>{title}</h4>

<h1>{value}</h1>

</div>

)

}

export default DashboardCard;