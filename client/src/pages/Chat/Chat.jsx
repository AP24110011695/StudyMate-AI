import React, { useState, useEffect, useRef } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import EmptyState from "../../components/EmptyState/EmptyState";
import { usePdf } from "../../context/PdfContext";
import { api } from "../../services/api";
import "./Chat.css";

export default function Chat() {
  const { pdfs, loading: pdfsLoading } = usePdf();
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (pdfs.length > 0 && !selectedPdf) {
      setSelectedPdf(pdfs[0]);
    }
  }, [pdfs]);

  useEffect(() => {
    if (selectedPdf) {
      loadHistory();
    }
  }, [selectedPdf]);

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      setError(null);
      const data = await api.get(`/chat/${selectedPdf._id}/history`);
      setMessages(data.history || []);
    } catch (err) {
      setError(err.message || 'Failed to load chat history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedPdf) return;
    const userMessage = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const data = await api.post(`/chat/${selectedPdf._id}`, { message: userMessage.content });
      setMessages(prev => [...prev, { role: 'model', content: data.reply, timestamp: new Date() }]);
    } catch (err) {
      setError(err.message || 'Failed to send message. Gemini might be down or unavailable.');
    } finally {
      setIsTyping(false);
    }
  };

  const clearHistory = async () => {
    if (!selectedPdf) return;
    try {
      await api.delete(`/chat/${selectedPdf._id}/history`);
      setMessages([]);
    } catch (err) {
      setError(err.message || 'Failed to clear history');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search="" setSearch={() => {}} />
        <main className="main-content chat-page page-enter">
          <div className="card chat-sidebar">
            <h3>Your PDFs</h3>
            {pdfsLoading ? (
              <div className="loader">Loading...</div>
            ) : pdfs.length === 0 ? (
              <div style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>No PDFs uploaded yet.</div>
            ) : (
              pdfs.map(pdf => (
                <div 
                  key={pdf._id} 
                  className={`chat-history-item ${selectedPdf?._id === pdf._id ? 'active' : ''}`}
                  onClick={() => setSelectedPdf(pdf)}
                  style={{ cursor: 'pointer', background: selectedPdf?._id === pdf._id ? '#e0e7ff' : 'transparent', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}
                >
                  {pdf.name}
                </div>
              ))
            )}
            {selectedPdf && messages.length > 0 && (
               <button onClick={clearHistory} className="btn btn-outline" style={{ width: '100%', marginTop: '16px' }}>
                 Clear History
               </button>
            )}
          </div>
          <div className="card chat-main" style={{ padding: 0 }}>
            {error && (
              <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', textAlign: 'center', borderBottom: '1px solid #f87171' }}>
                {error}
              </div>
            )}
            <div className="chat-messages">
              {loadingHistory ? (
                <div className="loader" style={{ margin: 'auto', padding: '20px' }}>Loading chat history...</div>
              ) : messages.length === 0 ? (
                <div style={{ margin: 'auto' }}>
                  <EmptyState 
                    icon="chat" 
                    title={selectedPdf ? "No Messages Yet" : "Select a PDF"} 
                    description={selectedPdf ? "Start a conversation with StudyMate AI about this document." : "Choose a PDF from the sidebar to start chatting."} 
                  />
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`message-bubble ${msg.role === 'model' || msg.role === 'ai' ? 'ai' : 'user'} page-enter`} style={{ animationDuration: '0.3s' }}>
                    <div>{msg.content || msg.text}</div>
                    {msg.timestamp && (
                      <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px', textAlign: 'right' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    )}
                  </div>
                ))
              )}
              {isTyping && (
                <div className="message-bubble ai typing page-enter" style={{ animationDuration: '0.3s' }}>
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="chat-input-area">
              <input 
                className="form-input"
                style={{ borderRadius: '24px' }}
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder={selectedPdf ? "Ask a question about your PDF..." : "Select a PDF first..."} 
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={!selectedPdf || isTyping}
              />
              <button className="btn btn-primary" onClick={handleSend} style={{ borderRadius: '24px' }} disabled={!selectedPdf || isTyping || !input.trim()}>Send</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
