import React from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import EmptyState from "../../components/EmptyState/EmptyState";
import "./Notes.css";

export default function Notes() {
  const hasNotes = true; // Simulating data state

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search="" setSearch={() => {}} />
        <main className="main-content notes-page page-enter">
          <div className="notes-header">
            <h2>Generated Notes</h2>
            {hasNotes && (
              <div className="notes-actions">
                <button className="btn btn-outline">Copy</button>
                <button className="btn btn-primary">Download</button>
              </div>
            )}
          </div>
          
          {!hasNotes ? (
            <EmptyState 
              icon="notes"
              title="No Notes Generated"
              description="Upload a PDF and generate notes to see them here."
              actionText="Go to Dashboard"
            />
          ) : (
            <div className="notes-body">
              <div className="card summary-card">
                <h3>Summary</h3>
                <p>This document covers the fundamental concepts of cell biology, including cell structure, function, and division. It highlights the differences between eukaryotic and prokaryotic cells.</p>
              </div>
              <div className="card key-points">
                <h3>Key Points</h3>
                <ul>
                  <li>Cells are the basic unit of life.</li>
                  <li>Eukaryotic cells have a nucleus, prokaryotic cells do not.</li>
                  <li>Mitosis is the process of cell division.</li>
                  <li>Meiosis occurs in reproductive cells.</li>
                </ul>
              </div>
              <div className="card definitions">
                <h3>Important Definitions</h3>
                <p><strong>Mitochondria:</strong> Powerhouse of the cell.</p>
                <p><strong>Ribosome:</strong> Site of protein synthesis.</p>
                <p><strong>Chloroplast:</strong> Site of photosynthesis in plant cells.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
