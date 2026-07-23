import React, { useState, useEffect } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import EmptyState from "../../components/EmptyState/EmptyState";
import { usePdf } from "../../context/PdfContext";
import { api } from "../../services/api";
import "./Quiz.css";

export default function Quiz() {
  const { pdfs, loading: pdfsLoading } = usePdf();
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pdfs.length > 0 && !selectedPdf) {
      setSelectedPdf(pdfs[0]);
    }
  }, [pdfs]);

  const generateQuiz = async () => {
    if (!selectedPdf) return;
    try {
      setLoading(true);
      setError(null);
      setQuestions(null);
      setCurrent(0);
      setSelected(null);
      setShowResult(false);
      setScore(0);
      const data = await api.post(`/study/${selectedPdf._id}/quiz`);
      setQuestions(data.content.questions);
    } catch (err) {
      setError(err.message || 'Failed to generate quiz.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (questions[current].options[idx] === questions[current].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setCurrent(current + 1);
    setSelected(null);
    setShowResult(false);
  };

  const hasQuiz = questions && questions.length > 0;

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search="" setSearch={() => {}} />
        <main className="main-content quiz-page page-enter">
          <div className="quiz-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2>Quiz</h2>
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
                onClick={generateQuiz} 
                disabled={!selectedPdf || loading}
              >
                {loading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </div>
            {hasQuiz && <div className="score-section card" style={{ padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold' }}>Score: {score} / {questions.length}</div>}
          </div>

          {error && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#991b1b', marginBottom: '16px', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              <div className="loader" style={{ margin: 'auto', marginBottom: '16px' }}></div>
              Generating quiz with AI... This might take a few seconds.
            </div>
          ) : !hasQuiz ? (
            <EmptyState 
              icon="quiz" 
              title="No Quizzes Available" 
              description="Select a PDF and generate a quiz to start testing your knowledge." 
            />
          ) : (
            current < questions.length ? (
              <div className="card quiz-card page-enter" style={{ animationDuration: '0.4s' }}>
                <div className="progress-indicator" style={{ color: '#6b7280', marginBottom: '16px', fontWeight: '500' }}>Question {current + 1} of {questions.length}</div>
                <h3 className="question-text" style={{ fontSize: '20px', marginBottom: '24px' }}>{questions[current].question}</h3>
                <div className="options" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {questions[current].options.map((opt, i) => {
                    let className = 'btn-outline';
                    if (showResult) {
                      if (opt === questions[current].answer) {
                        className = 'btn-success';
                      } else if (selected === i) {
                        className = 'btn-danger';
                      }
                    } else if (selected === i) {
                      className = 'btn-primary';
                    }
                    return (
                      <button 
                        key={i} 
                        className={`btn ${className} option-btn`}
                        style={{ justifyContent: 'flex-start', padding: '16px', border: showResult && opt === questions[current].answer ? '2px solid #10b981' : '' }}
                        onClick={() => handleSelect(i)}
                        disabled={showResult}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
                {showResult && questions[current].explanation && (
                  <div style={{ padding: '16px', background: '#f3f4f6', borderRadius: '8px', marginBottom: '24px', color: '#374151' }}>
                    <strong>Explanation:</strong> {questions[current].explanation}
                  </div>
                )}
                <div className="quiz-controls" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {showResult && (
                    <button 
                      className="btn btn-primary"
                      onClick={handleNext}
                    >
                      {current === questions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="card text-center" style={{ padding: '48px', maxWidth: '500px', margin: '0 auto' }}>
                <h3>Quiz Completed!</h3>
                <p style={{ fontSize: '24px', margin: '24px 0', fontWeight: 'bold' }}>Your Score: {score} / {questions.length}</p>
                <button className="btn btn-primary" onClick={generateQuiz}>Restart Quiz</button>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
