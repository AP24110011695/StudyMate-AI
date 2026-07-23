import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import EmptyState from "../../components/EmptyState/EmptyState";
import { usePdf } from "../../context/PdfContext";
import { api } from "../../services/api";
import "./Flashcards.css";

export default function Flashcards() {
  const { pdfs, loading: pdfsLoading } = usePdf();
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [flashcards, setFlashcards] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pdfs.length > 0 && !selectedPdf) {
      setSelectedPdf(pdfs[0]);
    }
  }, [pdfs]);

  const generateFlashcards = async () => {
    if (!selectedPdf) return;
    try {
      setLoading(true);
      setError(null);
      setFlashcards(null);
      setCurrent(0);
      setFlipped(false);
      const data = await api.post(`/study/${selectedPdf._id}/flashcards`);
      setFlashcards(data.content.flashcards);
    } catch (err) {
      setError(err.message || 'Failed to generate flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const hasFlashcards = flashcards && flashcards.length > 0;

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search="" setSearch={() => {}} />
        <main className="main-content flashcards-page page-enter">
          <div className="flashcards-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h2>Flashcards</h2>
            <select 
              className="form-input" 
              style={{ width: '250px' }}
              value={selectedPdf?._id || ''} 
              onChange={(e) => setSelectedPdf(pdfs.find(p => p._id === e.target.value))}
            >
              <option value="" disabled>Select PDF</option>
              {pdfs.map(pdf => <option key={pdf._id} value={pdf._id}>{pdf.name}</option>)}
            </select>
            <button 
              className="btn btn-primary" 
              onClick={generateFlashcards} 
              disabled={!selectedPdf || loading}
            >
              {loading ? 'Generating...' : 'Generate Flashcards'}
            </button>
          </div>

          {error && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', marginBottom: '16px', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              <div className="loader" style={{ margin: 'auto', marginBottom: '16px' }}></div>
              Generating flashcards with AI... This might take a few seconds.
            </div>
          ) : !hasFlashcards ? (
            <EmptyState 
              icon="flashcards" 
              title="No Flashcards Created" 
              description="Select a PDF and click Generate Flashcards to start studying." 
            />
          ) : (
            <div className="page-enter" style={{ animationDuration: '0.4s' }}>
              <div className="flashcard-container" onClick={() => setFlipped(!flipped)}>
                <div className={`flashcard card ${flipped ? 'flipped' : ''}`} style={{ padding: 0 }}>
                  <div className="flashcard-front" style={{ padding: '40px' }}>
                    <h3 style={{ fontSize: '24px' }}>{flashcards[current].question}</h3>
                    <p style={{ color: '#6b7280', marginTop: '20px' }}>Click to flip</p>
                  </div>
                  <div className="flashcard-back" style={{ padding: '40px' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: '500', lineHeight: 1.6 }}>{flashcards[current].answer}</h3>
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
                <span style={{ fontWeight: '600', color: '#4b5563', minWidth: '60px', textAlign: 'center' }}>{current + 1} / {flashcards.length}</span>
                <button 
                  className="btn btn-outline"
                  onClick={() => { setFlipped(false); setTimeout(() => setCurrent(Math.min(flashcards.length - 1, current + 1)), 150); }}
                  disabled={current === flashcards.length - 1}
                >
                  Next
                </button>
                <button className="btn btn-primary" onClick={() => {
                  setFlipped(false);
                  setTimeout(() => setCurrent(Math.floor(Math.random() * flashcards.length)), 150);
                }}>Shuffle</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
