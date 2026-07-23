import "./StudyProgress.css";

function StudyProgress(){

return(

<div className="progress-card">

<h2>Study Progress</h2>

<div className="progress">

<div className="progress-fill" style={{width: '0%'}}>
0%
</div>
</div>
<p>0 hours studied this week.</p>

</div>

)

}

export default StudyProgress;