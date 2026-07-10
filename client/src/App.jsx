import Sidebar from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";
import DashboardCard from "./components/DashboardCard/DashboardCard";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="content">
        <Navbar />

        <main className="main-content">

          <h1>Dashboard</h1>

          <div className="cards">

            <DashboardCard
              title="Uploaded PDFs"
              value="12"
              icon="📄"
            />

            <DashboardCard
              title="AI Chats"
              value="48"
              icon="💬"
            />

            <DashboardCard
              title="Quizzes"
              value="19"
              icon="📝"
            />

            <DashboardCard
              title="Flashcards"
              value="240"
              icon="🃏"
            />

          </div>

        </main>
      </div>
    </div>
  );
}

export default App;