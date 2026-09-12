import React, { useEffect, useState, useCallback } from 'react';
import { fetchExamByIdApi } from '../api/exams';
import { submitExamApi } from '../api/results';
import TimerBadge from '../components/TimerBadge';
import { CheckCircle2, ArrowLeft, Send, AlertTriangle } from 'lucide-react';

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
        // Single choice
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem', color: 'var(--text-muted)' }}>
        Loading exam session...
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
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Top Header Bar */}
      <div className="glass-card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <button className="btn btn-secondary btn-sm" onClick={onCancel} style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Exit
          </button>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {exam.title}
          </h2>
        </div>

        {/* Security & Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {tabSwitchCount > 0 && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '0.45rem 0.85rem', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
              <AlertTriangle size={15} />
              <span>Tab Switch: {tabSwitchCount} Warning{tabSwitchCount > 1 ? 's' : ''}</span>
            </div>
          )}

          <TimerBadge 
            durationMinutes={exam.durationMinutes} 
            onTimeUp={handleSubmit} 
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          <span>Question Progress</span>
          <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
            {answeredCount} of {totalQuestions} Answered ({Math.round(progressPercent)}%)
          </span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', color: '#f87171', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {exam.questions.map((q, index) => {
          const isMultiple = q.type === 'MultipleChoice' || q.type === 1;
          const currentSelected = selectedAnswers[q.id] || [];

          return (
            <div key={q.id} className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                  <span style={{
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontWeight: 800,
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}>
                    Q{index + 1}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {q.text}
                  </h3>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '9999px', whitespace: 'nowrap' }}>
                  {q.points} pt{q.points > 1 ? 's' : ''} • {isMultiple ? 'Multiple Choice' : 'Single Choice'}
                </span>
              </div>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {q.answers.map((ans) => {
                  const isChecked = currentSelected.includes(ans.id);

                  return (
                    <div 
                      key={ans.id}
                      onClick={() => handleSelectAnswer(q.id, ans.id, isMultiple)}
                      style={{
                        padding: '0.85rem 1.1rem',
                        borderRadius: 'var(--radius-md)',
                        background: isChecked ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${isChecked ? 'var(--primary)' : 'rgba(255, 255, 255, 0.06)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: isMultiple ? '4px' : '50%',
                        border: `2px solid ${isChecked ? 'var(--primary)' : 'var(--text-subtle)'}`,
                        background: isChecked ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease'
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
                      <span style={{ fontSize: '0.95rem', color: isChecked ? '#fff' : 'var(--text-main)', fontWeight: isChecked ? 600 : 400 }}>
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
      <div style={{ marginTop: '2.5rem', marginBottom: '4rem', textAlign: 'center' }}>
        <button 
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={submitting}
          style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
        >
          <Send size={20} />
          <span>{submitting ? 'Submitting Answers...' : 'Submit Final Exam'}</span>
        </button>
      </div>
    </div>
  );
}
