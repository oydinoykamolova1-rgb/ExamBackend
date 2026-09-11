import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, XCircle, Award, ArrowLeft, RotateCcw } from 'lucide-react';

export default function ExamResultPage({ result, onBackToExams }) {
  useEffect(() => {
    if (result && result.isPassed) {
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  if (!result) return null;

  const details = result.detailsJson ? JSON.parse(result.detailsJson) : [];

  return (
    <div style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Score Header Card */}
      <div className="glass-card" style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '300px',
          height: '150px',
          background: result.isPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          filter: 'blur(50px)',
          borderRadius: '50%'
        }} />

        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: result.isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `2px solid ${result.isPassed ? 'var(--success)' : 'var(--danger)'}`,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}>
          {result.isPassed ? (
            <CheckCircle size={38} color="var(--success)" />
          ) : (
            <XCircle size={38} color="var(--danger)" />
          )}
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
          {result.isPassed ? 'Congratulations! You Passed 🎉' : 'Exam Completed'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '1rem' }}>
          {result.examTitle || 'Exam Submission'}
        </p>

        {/* Score Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1.5rem',
          margin: '2rem 0',
          padding: '1rem 2rem',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Score Earned</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {result.score} / {result.totalPoints}
            </div>
          </div>

          <div style={{ width: '1px', height: '40px', background: 'var(--border-color)' }} />

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Percentage</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: result.isPassed ? 'var(--success)' : 'var(--danger)' }}>
              {result.percentage}%
            </div>
          </div>

          <div style={{ width: '1px', height: '40px', background: 'var(--border-color)' }} />

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase' }}>Result</div>
            <span className={`badge ${result.isPassed ? 'badge-pass' : 'badge-fail'}`} style={{ marginTop: '4px' }}>
              {result.isPassed ? 'PASSED' : 'FAILED'}
            </span>
          </div>
        </div>

        <div>
          <button className="btn btn-primary" onClick={onBackToExams}>
            <ArrowLeft size={18} />
            <span>Return to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Detailed Analysis */}
      {details.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Detailed Breakdown
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {details.map((item, index) => (
              <div key={index} className="glass-card" style={{
                borderLeft: `4px solid ${item.IsCorrect ? 'var(--success)' : 'var(--danger)'}`,
                padding: '1.25rem 1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Question {index + 1}
                  </span>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: item.IsCorrect ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {item.PointsEarned} / {item.TotalQuestionPoints} pts ({item.IsCorrect ? 'Correct' : 'Incorrect'})
                  </span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  {item.QuestionText}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
