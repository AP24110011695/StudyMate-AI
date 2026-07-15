import { useState } from "react";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import WelcomeCard from "../../components/WelcomeCard/WelcomeCard";
import RecentPDFs from "../../components/RecentPDFs/RecentPDFs";
import StudyProgress from "../../components/StudyProgress/StudyProgress";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import UploadModal from "../../components/UploadModal/UploadModal";
import "./Dashboard.css";

function Dashboard() {
  const [pdfs, setPdfs] = useState([
    { name: "Physics Chapter 1.pdf", size: "3.2", uploadedAt: "2 hours ago" },
    { name: "Biology Notes.pdf", size: "1.5", uploadedAt: "Yesterday" },
    { name: "Math Assignment.pdf", size: "2.1", uploadedAt: "3 days ago" }
  ]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredPdfs = pdfs.filter(pdf => 
    pdf.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = () => setModalOpen(true);

  const handleFileSelect = (file) => {
    const newPdf = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1),
      uploadedAt: "Just now"
    };
    setPdfs([newPdf, ...pdfs]);
  };

  const handleDelete = (indexToDelete) => {
    const pdfToDelete = filteredPdfs[indexToDelete];
    setPdfs(pdfs.filter(pdf => pdf !== pdfToDelete));
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search={search} setSearch={setSearch} />
        
        <main className="main-content">
          <WelcomeCard onUpload={handleUpload} />

          <div className="cards">
            <DashboardCard title="Uploaded PDFs" value={pdfs.length} icon="📄" />
            <DashboardCard title="AI Chats" value="12" icon="💬" />
            <DashboardCard title="Notes" value="28" icon="📓" />
            <DashboardCard title="Quizzes" value="5" icon="📝" />
          </div>

          <div className="bottom-section">
            <RecentPDFs
              pdfs={filteredPdfs}
              onDelete={handleDelete}
            />
            <StudyProgress />
          </div>
        </main>
      </div>

      <UploadModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onFileSelect={handleFileSelect} 
      />
    </div>
  );
}

export default Dashboard;