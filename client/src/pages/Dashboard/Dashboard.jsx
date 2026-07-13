import DashboardCard from "../../components/DashboardCard/DashboardCard";
import WelcomeCard from "../../components/WelcomeCard/WelcomeCard";
import RecentPDFs from "../../components/RecentPDFs/RecentPDFs";
import StudyProgress from "../../components/StudyProgress/StudyProgress";

function Dashboard({
  pdfs,
  filteredPdfs,
  onUpload,
  onDelete,
}) {
  return (
    <main className="main-content">
      <WelcomeCard onUpload={onUpload} />

      <div className="cards">
        <DashboardCard title="Uploaded PDFs" value={pdfs.length} icon="📄" />
        <DashboardCard title="AI Chats" value="0" icon="💬" />
        <DashboardCard title="Quizzes" value="0" icon="📝" />
        <DashboardCard title="Flashcards" value="0" icon="🃏" />
      </div>

      <div className="bottom-section">
        <RecentPDFs
          pdfs={filteredPdfs}
          onDelete={onDelete}
        />

        <StudyProgress />
      </div>
    </main>
  );
}

export default Dashboard;