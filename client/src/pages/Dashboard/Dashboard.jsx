import { useState } from "react";
import DashboardCard from "../../components/DashboardCard/DashboardCard";
import WelcomeCard from "../../components/WelcomeCard/WelcomeCard";
import RecentPDFs from "../../components/RecentPDFs/RecentPDFs";
import StudyProgress from "../../components/StudyProgress/StudyProgress";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import UploadModal from "../../components/UploadModal/UploadModal";
import { usePdf } from "../../context/PdfContext";
import "./Dashboard.css";

function Dashboard() {
  const { pdfs, loading: isLoading, uploadPdf } = usePdf();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredPdfs = pdfs.filter(pdf => 
    pdf.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = () => setModalOpen(true);

  const handleFileSelect = async (file) => {
    try {
      await uploadPdf(file);
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to upload', error);
      alert(error.message || 'Failed to upload PDF');
    }
  };

  const { deletePdf } = usePdf();
  const handleDelete = async (indexToDelete) => {
    if (window.confirm("Are you sure you want to delete this PDF?")) {
      const pdfToDelete = filteredPdfs[indexToDelete];
      try {
        await deletePdf(pdfToDelete._id);
      } catch (error) {
        console.error('Failed to delete', error);
      }
    }
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
            <DashboardCard title="AI Chats" value={0} icon="💬" isLoading={isLoading} />
            <DashboardCard title="Notes" value={0} icon="📓" isLoading={isLoading} />
            <DashboardCard title="Quizzes" value={0} icon="📝" isLoading={isLoading} />
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