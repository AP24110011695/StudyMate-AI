import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  NotebookPen,
  Brain,
  Layers3,
  Settings,
} from "lucide-react";

function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My PDFs", path: "/my-pdfs", icon: <FileText size={20} /> },
    { name: "AI Chat", path: "/chat", icon: <MessageSquare size={20} /> },
    { name: "Notes", path: "/notes", icon: <NotebookPen size={20} /> },
    { name: "Quiz", path: "/quiz", icon: <Brain size={20} /> },
    { name: "Flashcards", path: "/flashcards", icon: <Layers3 size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>StudyMate AI</h2>
      </div>

      <ul>
        {menu.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;