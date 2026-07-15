import { useState, useEffect } from "react";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import WelcomeCard from "../../components/WelcomeCard/WelcomeCard";
import RecentPDFs from "../../components/RecentPDFs/RecentPDFs";
import StudyProgress from "../../components/StudyProgress/StudyProgress";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import UploadModal from "../../components/UploadModal/UploadModal";
import "./Dashboard.css";

function Dashboard() {
  const [pdfs, setPdfs] = useState(() => {
    const savedPdfs = localStorage.getItem("pdfs");
    if (savedPdfs) {
      return JSON.parse(savedPdfs);
    }
    return [];
  });
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem("pdfs", JSON.stringify(pdfs));
  }, [pdfs]);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredPdfs = pdfs.filter(pdf => 
    pdf.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = () => setModalOpen(true);

  const handleFileSelect = (file) => {
    const newPdf = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1),
      uploadedAt: new Date().toLocaleDateString()
    };
    setPdfs(prevPdfs => [newPdf, ...prevPdfs]);
  };

  const handleDelete = (indexToDelete) => {
    const pdfToDelete = filteredPdfs[indexToDelete];
    setPdfs(prevPdfs => prevPdfs.filter(pdf => pdf !== pdfToDelete));
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search={search} setSearch={setSearch} />
        
        <main className="main-content page-enter">
          <WelcomeCard onUpload={handleUpload} />

          <div className="cards">
            <DashboardCard title="Uploaded PDFs" value={pdfs.length} icon="📄" isLoading={isLoading} />
            <DashboardCard title="AI Chats" value="12" icon="💬" isLoading={isLoading} />
            <DashboardCard title="Notes" value="28" icon="📓" isLoading={isLoading} />
            <DashboardCard title="Quizzes" value="5" icon="📝" isLoading={isLoading} />
          </div>

          <div className="bottom-section">
            <RecentPDFs
              pdfs={filteredPdfs}
              onDelete={handleDelete}
              isLoading={isLoading}
              onUpload={handleUpload}
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