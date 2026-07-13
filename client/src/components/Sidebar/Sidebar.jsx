import "./Sidebar.css";
import { useState } from "react";
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
  const [active, setActive] = useState("Dashboard");

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My PDFs", icon: <FileText size={20} /> },
    { name: "AI Chat", icon: <MessageSquare size={20} /> },
    { name: "Notes", icon: <NotebookPen size={20} /> },
    { name: "Quiz", icon: <Brain size={20} /> },
    { name: "Flashcards", icon: <Layers3 size={20} /> },
    { name: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>StudyMate AI</h2>
      </div>

      <ul>
        {menu.map((item) => (
          <li
            key={item.name}
            className={active === item.name ? "active" : ""}
            onClick={() => setActive(item.name)}
          >
            {item.icon}
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;