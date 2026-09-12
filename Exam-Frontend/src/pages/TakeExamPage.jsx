import React, { useEffect, useState, useCallback } from 'react';
import { fetchExamByIdApi } from '../api/exams';
import { submitExamApi } from '../api/results';
import TimerBadge from '../components/TimerBadge';
import { CheckCircle2, ArrowLeft, Send, AlertTriangle, Layers, HelpCircle } from 'lucide-react';

export default function TakeExamPage({ examId, onCancel, onExamSubmitted }) {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Selected answers state: { questionId: [selectedAnswerId1, selectedAnswerId2] }
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  useEffect(() => {
    loadExam();
  }, [examId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !submitting && loading === false) {
        setTabSwitchCount((prev) => prev + 1);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [submitting, loading]);

  const loadExam = async () => {
    setLoading(true);
    try {
      const data = await fetchExamByIdApi(examId);
      setExam(data);
    } catch (err) {
      setError(err.message || 'Failed to load exam details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId, answerId, isMultipleChoice) => {
    setSelectedAnswers((prev) => {
      const current = prev[questionId] || [];
      if (isMultipleChoice) {
        if (current.includes(answerId)) {
          return { ...prev, [questionId]: current.filter((id) => id !== answerId) };
        } else {
          return { ...prev, [questionId]: [...current, answerId] };
        }
      } else {
        return { ...prev, [questionId]: [answerId] };
      }
    });
  };

  const handleSubmit = useCallback(async () => {
    if (submitting || !exam) return;
    setSubmitting(true);
    setError('');

    try {
      const payloadAnswers = exam.questions.map((q) => ({
        questionId: q.id,
        selectedAnswerIds: selectedAnswers[q.id] || []
      }));

      const result = await submitExamApi(exam.id, payloadAnswers);
      if (onExamSubmitted) {
        onExamSubmitted(result);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit exam.');
      setSubmitting(false);
    }
  }, [submitting, exam, selectedAnswers, onExamSubmitted]);

  const scrollToQuestion = (index) => {
    const elem = document.getElementById(`question-${index}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
        <div className="animate-pulse-slow">Loading exam session & questions...</div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <div className="glass-card">
          <p style={{ color: '#f87171' }}>{error || 'Exam not found.'}</p>
          <button className="btn btn-secondary" onClick={onCancel} style={{ marginTop: '1rem' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = exam.questions.length;
  const answeredCount = Object.keys(selectedAnswers).filter(
    (qId) => selectedAnswers[qId] && selectedAnswers[qId].length > 0
  ).length;
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1.5rem' }} className="animate-fade-in-up">
      {/* Top Header Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1.25rem 1.75rem' }}>
        <div>
          <button className="btn btn-secondary btn-sm" onClick={onCancel} style={{ marginBottom: '0.6rem' }}>
            <ArrowLeft size={14} /> Exit Session
          </button>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
            {exam.title}
          </h2>
        </div>

        {/* Security & Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {tabSwitchCount > 0 && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.5rem 0.95rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <AlertTriangle size={16} />
              <span>Tab Switch: {tabSwitchCount} Warning{tabSwitchCount > 1 ? 's' : ''}</span>
            </div>
          )}

          <TimerBadge 
            durationMinutes={exam.durationMinutes} 
            onTimeUp={handleSubmit} 
          />
        </div>
      </div>

      {/* Progress & Quick Navigation Bar */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.25rem 1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
            <Layers size={16} color="var(--primary)" />
            Question Progress
          </span>
          <span style={{ fontWeight: 800, color: 'var(--secondary)' }}>
            {answeredCount} of {totalQuestions} Answered ({Math.round(progressPercent)}%)
          </span>
        </div>

        <div className="progress-container" style={{ marginBottom: '1.25rem' }}>
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Quick Jump Buttons Grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
          {exam.questions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] && selectedAnswers[q.id].length > 0;
            return (
              <button
                key={q.id}
                onClick={() => scrollToQuestion(idx)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: isAnswered ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                  background: isAnswered ? 'var(--grad-primary)' : 'rgba(255, 255, 255, 0.04)',
                  color: isAnswered ? '#ffffff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title={`Jump to Q${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {exam.questions.map((q, index) => {
          const isMultiple = q.type === 'MultipleChoice' || q.type === 1;
          const currentSelected = selectedAnswers[q.id] || [];

          return (
            <div key={q.id} id={`question-${index}`} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'baseline' }}>
                  <span style={{
                    background: 'var(--primary-light)',
                    color: '#a5b4fc',
                    border: '1px solid var(--border-highlight)',
                    fontWeight: 800,
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem'
                  }}>
                    Q{index + 1}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.4 }}>
                    {q.text}
                  </h3>
                </div>
                <span className="badge badge-student" style={{ whitespace: 'nowrap' }}>
                  {q.points} pt{q.points > 1 ? 's' : ''} • {isMultiple ? 'Multiple Choice' : 'Single Choice'}
                </span>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {q.answers.map((ans) => {
                  const isChecked = currentSelected.includes(ans.id);

                  return (
                    <div 
                      key={ans.id}
                      onClick={() => handleSelectAnswer(q.id, ans.id, isMultiple)}
                      style={{
                        padding: '1rem 1.25rem',
                        borderRadius: 'var(--radius-md)',
                        background: isChecked ? 'rgba(99, 102, 241, 0.14)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isChecked ? 'var(--primary)' : 'rgba(255, 255, 255, 0.07)'}`,
                        boxShadow: isChecked ? '0 0 16px rgba(99, 102, 241, 0.25)' : 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                      onMouseEnter={(e) => {
                        if (!isChecked) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isChecked) {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)';
                        }
                      }}
                    >
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: isMultiple ? '6px' : '50%',
                        border: `2px solid ${isChecked ? 'var(--primary)' : 'var(--text-subtle)'}`,
                        background: isChecked ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}>
                        {isChecked && (
                          <div style={{
                            width: isMultiple ? '10px' : '8px',
                            height: isMultiple ? '10px' : '8px',
                            background: '#fff',
                            borderRadius: isMultiple ? '2px' : '50%'
                          }} />
                        )}
                      </div>
                      <span style={{ fontSize: '0.98rem', color: isChecked ? '#ffffff' : 'var(--text-main)', fontWeight: isChecked ? 600 : 400 }}>
                        {ans.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <div style={{ marginTop: '3rem', marginBottom: '5rem', textAlign: 'center' }}>
        <button 
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ padding: '1rem 3.5rem', fontSize: '1.15rem', boxShadow: '0 10px 30px rgba(99, 102, 241, 0.5)' }}
        >
          <Send size={22} />
          <span>{submitting ? 'Submitting Answers...' : 'Submit Final Exam'}</span>
        </button>
      </div>
    </div>
  );
}
