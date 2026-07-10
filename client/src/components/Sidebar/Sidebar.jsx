import "./Sidebar.css";
function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>StudyMate AI</h2>
      </div>

      <nav>
        <ul>
          <li>📊 Dashboard</li>
          <li>📄 My PDFs</li>
          <li>💬 AI Chat</li>
          <li>📝 Notes</li>
          <li>❓ Quiz</li>
          <li>🃏 Flashcards</li>
          <li>⚙️ Settings</li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;