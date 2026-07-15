import React, { useState } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import EmptyState from "../../components/EmptyState/EmptyState";
import "./Flashcards.css";

export default function Flashcards() {
  const [flipped, setFlipped] = useState(false);
  const [current, setCurrent] = useState(0);

  const dummyCards = [
    { front: "Mitochondria", back: "The powerhouse of the cell." },
    { front: "Photosynthesis", back: "Process by which plants use sunlight to synthesize foods from carbon dioxide and water." },
    { front: "DNA", back: "Deoxyribonucleic acid, the carrier of genetic information." }
  ];

  const hasFlashcards = dummyCards.length > 0;

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search="" setSearch={() => {}} />
        <main className="main-content flashcards-page page-enter">
          <div className="flashcards-header" style={{ marginBottom: '24px' }}>
            <h2>Flashcards</h2>
          </div>

          {!hasFlashcards ? (
            <EmptyState 
              icon="flashcards" 
              title="No Flashcards Created" 
              description="Upload a PDF and generate flashcards to start studying." 
              actionText="Go to Dashboard"
            />
          ) : (
            <div className="page-enter" style={{ animationDuration: '0.4s' }}>
              <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
                <div className={`flashcard card ${flipped ? 'flipped' : ''}`} style={{ padding: 0 }}>
                  <div className="flashcard-front" style={{ padding: '40px' }}>
                    <h3 style={{ fontSize: '24px' }}>{dummyCards[current].front}</h3>
                    <p style={{ color: '#6b7280', marginTop: '20px' }}>Click to flip</p>
                  </div>
                  <div className="flashcard-back" style={{ padding: '40px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '500', lineHeight: 1.6 }}>{dummyCards[current].back}</h3>
                  </div>
                </div>
              </div>
              <div className="flashcard-controls card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '32px', padding: '16px 24px', maxWidth: '600px', margin: '32px auto 0' }}>
                <button 
                  className="btn btn-outline"
                  onClick={() => { setFlipped(false); setTimeout(() => setCurrent(Math.max(0, current - 1)), 150); }}
                  disabled={current === 0}
                >
                  Previous
                </button>
                <span style={{ fontWeight: '600', color: '#4b5563', minWidth: '60px', textAlign: 'center' }}>{current + 1} / {dummyCards.length}</span>
                <button 
                  className="btn btn-outline"
                  onClick={() => { setFlipped(false); setTimeout(() => setCurrent(Math.min(dummyCards.length - 1, current + 1)), 150); }}
                  disabled={current === dummyCards.length - 1}
                >
                  Next
                </button>
                <button className="btn btn-primary" onClick={() => {
                  setFlipped(false);
                  setTimeout(() => setCurrent(Math.floor(Math.random() * dummyCards.length)), 150);
                }}>Shuffle</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
