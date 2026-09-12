import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, XCircle, Award, ArrowLeft, RotateCcw, Sparkles, ShieldCheck, BookOpen } from 'lucide-react';
import CertificateModal from '../components/CertificateModal';
import { generateAIPerformanceFeedbackSkill } from '../api/aiSkillService';

export default function ExamResultPage({ result, onBackToExams }) {
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (result && result.isPassed) {
      // Fire confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  if (!result) return null;

  const details = result.detailsJson ? JSON.parse(result.detailsJson) : [];
  const aiFeedback = generateAIPerformanceFeedbackSkill(result);

  return (
    <div style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal result={result} onClose={() => setShowCertificate(false)} />
      )}

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

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onBackToExams}>
            <ArrowLeft size={18} />
            <span>Return to Dashboard</span>
          </button>

          {result.isPassed && (
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowCertificate(true)}
              style={{ background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(202, 138, 4, 0.2))', border: '1px solid rgba(234, 179, 8, 0.5)', color: '#fbbf24' }}
            >
              <Award size={18} />
              <span>📜 Rasmiy Sertifikatni Ko'rish / Yuklash</span>
            </button>
          )}
        </div>
      </div>

      {/* Gemini AI Performance Skill Feedback */}
      <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid rgba(99, 102, 241, 0.3)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.05) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#a855f7', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          <Sparkles size={18} /> 🤖 AI O'quv Murabbiyi Maslahati (Gemini Skill)
        </div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.3rem' }}>
          {aiFeedback.status}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1rem' }}>
          {aiFeedback.summary}
        </p>

        <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            🎯 Rivojlanish uchun Tavsiyalar:
          </div>
          <ul style={{ paddingLeft: '1.2rem', margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {aiFeedback.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Analysis */}
      {details.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem' }}>
            Detailed Question Breakdown
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
