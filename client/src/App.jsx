import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const MyPDFs = lazy(() => import("./pages/MyPDFs/MyPDFs"));
const Chat = lazy(() => import("./pages/Chat/Chat"));
const Notes = lazy(() => import("./pages/Notes/Notes"));
const Quiz = lazy(() => import("./pages/Quiz/Quiz"));
const Flashcards = lazy(() => import("./pages/Flashcards/Flashcards"));
const Settings = lazy(() => import("./pages/Settings/Settings"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}><div className="loader"></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const FallbackLoader = () => (
  <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
    <div className="loader"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<FallbackLoader />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/my-pdfs" element={<ProtectedRoute><MyPDFs /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
        <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;