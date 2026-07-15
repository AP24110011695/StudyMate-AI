import React, { useState } from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import EmptyState from "../../components/EmptyState/EmptyState";
import "./Quiz.css";

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  
  const dummyQuestions = [
    {
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"],
      answer: 2
    },
    {
      question: "Which of the following is not a phase of mitosis?",
      options: ["Prophase", "Interphase", "Metaphase", "Anaphase"],
      answer: 1
    }
  ];

  const hasQuiz = dummyQuestions.length > 0;

  return (
    <div className="app">
      <Sidebar />
      <div className="content">
        <Navbar search="" setSearch={() => {}} />
        <main className="main-content quiz-page page-enter">
          <div className="quiz-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>Quiz</h2>
            {hasQuiz && <div className="score-section card" style={{ padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold' }}>Score: 0 / {dummyQuestions.length}</div>}
          </div>

          {!hasQuiz ? (
            <EmptyState 
              icon="quiz" 
              title="No Quizzes Available" 
              description="Upload a PDF and generate a quiz to start testing your knowledge." 
              actionText="Go to Dashboard"
            />
          ) : (
            <div className="card quiz-card page-enter" style={{ animationDuration: '0.4s' }}>
              <div className="progress-indicator" style={{ color: '#6b7280', marginBottom: '16px', fontWeight: '500' }}>Question {current + 1} of {dummyQuestions.length}</div>
              <h3 className="question-text" style={{ fontSize: '20px', marginBottom: '24px' }}>{dummyQuestions[current].question}</h3>
              <div className="options" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {dummyQuestions[current].options.map((opt, i) => (
                  <button 
                    key={i} 
                    className={`btn ${selected === i ? 'btn-primary' : 'btn-outline'} option-btn`}
                    style={{ justifyContent: 'flex-start', padding: '16px' }}
                    onClick={() => setSelected(i)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="quiz-controls" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button 
                  className="btn btn-outline"
                  onClick={() => { setCurrent(Math.max(0, current - 1)); setSelected(null); }}
                  disabled={current === 0}
                >
                  Previous
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => { setCurrent(Math.min(dummyQuestions.length - 1, current + 1)); setSelected(null); }}
                  disabled={current === dummyQuestions.length - 1}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
