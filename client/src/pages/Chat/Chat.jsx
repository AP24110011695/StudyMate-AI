import React, { useState } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import EmptyState from "../../components/EmptyState/EmptyState";
import "./Chat.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "This is a dummy AI response. I can help you understand the document better.", sender: 'ai' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search="" setSearch={() => {}} />
        <main className="main-content chat-page page-enter">
          <div className="card chat-sidebar">
            <h3>Previous Conversations</h3>
            <div className="chat-history-item">Biology Chapter 4</div>
            <div className="chat-history-item">History Essay Prep</div>
            <div className="chat-history-item">Calculus Notes</div>
          </div>
          <div className="card chat-main" style={{ padding: 0 }}>
            <div className="chat-messages">
              {messages.length === 0 ? (
                <div style={{ margin: 'auto' }}>
                  <EmptyState 
                    icon="chat" 
                    title="No Messages Yet" 
                    description="Start a conversation with StudyMate AI about your documents." 
                  />
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className={`message-bubble ${msg.sender} page-enter`} style={{ animationDuration: '0.3s' }}>
                    {msg.text}
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
            </div>
            <div className="chat-input-area">
              <input 
                className="form-input"
                style={{ borderRadius: '24px' }}
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Ask a question about your PDF..." 
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="btn btn-primary" onClick={handleSend} style={{ borderRadius: '24px' }}>Send</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
