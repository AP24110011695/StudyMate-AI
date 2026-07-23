import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import EmptyState from "../../components/EmptyState/EmptyState";
import { usePdf } from "../../context/PdfContext";
import { api } from "../../services/api";
import "./Notes.css";

export default function Notes() {
  const { pdfs, loading: pdfsLoading } = usePdf();
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pdfs.length > 0 && !selectedPdf) {
      setSelectedPdf(pdfs[0]);
    }
  }, [pdfs]);

  const generateNotes = async () => {
    if (!selectedPdf) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.post(`/study/${selectedPdf._id}/notes`);
      setNotes(data.content);
    } catch (err) {
      setError(err.message || 'Failed to generate notes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search="" setSearch={() => {}} />
        <main className="main-content notes-page page-enter">
          <div className="notes-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2>Generated Notes</h2>
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
                onClick={generateNotes} 
                disabled={!selectedPdf || loading}
              >
                {loading ? 'Generating...' : 'Generate Notes'}
              </button>
            </div>
            {notes && (
              <div className="notes-actions">
                <button className="btn btn-outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(notes))}>Copy</button>
              </div>
            )}
          </div>
          
          {error && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', marginBottom: '16px', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              <div className="loader" style={{ margin: 'auto', marginBottom: '16px' }}></div>
              Generating notes with AI... This might take a few seconds.
            </div>
          ) : !notes ? (
            <EmptyState 
              icon="notes"
              title="No Notes Generated"
              description="Select a PDF and click Generate Notes to see them here."
            />
          ) : (
            <div className="notes-body">
              {notes.summary && (
                <div className="card summary-card">
                  <h3>Summary</h3>
                  <p>{notes.summary}</p>
                </div>
              )}
              {notes.keyPoints && notes.keyPoints.length > 0 && (
                <div className="card key-points">
                  <h3>Key Points</h3>
                  <ul>
                    {notes.keyPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                  </ul>
                </div>
              )}
              {notes.concepts && notes.concepts.length > 0 && (
                <div className="card concepts">
                  <h3>Concepts</h3>
                  <ul>
                    {notes.concepts.map((concept, i) => <li key={i}>{concept}</li>)}
                  </ul>
                </div>
              )}
              {notes.definitions && notes.definitions.length > 0 && (
                <div className="card definitions">
                  <h3>Important Definitions</h3>
                  {notes.definitions.map((def, i) => (
                    <p key={i}><strong>{def.term}:</strong> {def.definition}</p>
                  ))}
                </div>
              )}
              {notes.formulas && notes.formulas.length > 0 && (
                <div className="card formulas">
                  <h3>Formulas</h3>
                  <ul>
                    {notes.formulas.map((f, i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
