import React, { useState } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./Settings.css";

export default function Settings() {
  const [theme, setTheme] = useState("Light");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search="" setSearch={() => {}} />
        <main className="main-content settings-page page-enter">
          <h2>Settings</h2>
          <div className="card settings-section">
            <h3>Profile</h3>
            <div className="profile-details">
              <p><strong>Name:</strong> Ayush</p>
              <p><strong>Email:</strong> ayush@example.com</p>
            </div>
          </div>
          <div className="card settings-section">
            <h3>Preferences</h3>
            <div className="setting-item">
              <span>Theme</span>
              <select className="form-input" style={{ width: 'auto' }} value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            <div className="setting-item">
              <span>Notifications</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notifications} 
                  onChange={(e) => setNotifications(e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-item">
              <span>Language</span>
              <select className="form-input" style={{ width: 'auto' }}>
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
          <div className="card settings-section">
            <h3>Account</h3>
            <button className="btn" style={{ background: '#ef4444', color: 'white', width: '100%', marginTop: '10px' }}>Logout</button>
          </div>
        </main>
      </div>
    </div>
  );
}
