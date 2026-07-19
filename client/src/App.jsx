import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import MyPDFs from "./pages/MyPDFs/MyPDFs";
import Chat from "./pages/Chat/Chat";
import Notes from "./pages/Notes/Notes";
import Quiz from "./pages/Quiz/Quiz";
import Flashcards from "./pages/Flashcards/Flashcards";
import Settings from "./pages/Settings/Settings";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/my-pdfs" element={<MyPDFs />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/flashcards" element={<Flashcards />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;