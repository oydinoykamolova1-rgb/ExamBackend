import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, XCircle, Award, ArrowLeft, RotateCcw, Sparkles, ShieldCheck, BookOpen, Target, Check, X } from 'lucide-react';
import CertificateModal from '../components/CertificateModal';
import { generateAIPerformanceFeedbackSkill } from '../api/aiSkillService';

export default function ExamResultPage({ result, onBackToExams }) {
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (result && result.isPassed) {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.55 }
      });
    }
  }, [result]);

  if (!result) return null;

  const details = result.detailsJson ? JSON.parse(result.detailsJson) : [];
  const aiFeedback = generateAIPerformanceFeedbackSkill(result);

  return (
    <div style={{ maxWidth: '900px', margin: '2.5rem auto 0 auto', padding: '0 1.5rem' }} className="animate-fade-in-up">
      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateModal result={result} onClose={() => setShowCertificate(false)} />
      )}

      {/* Score Header Card */}
      <div className="glass-card" style={{
        textAlign: 'center',
        padding: '3.5rem 2rem',
        marginBottom: '2.5rem',
        position: 'relative',
        border: `1px solid ${result.isPassed ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
        boxShadow: result.isPassed ? '0 20px 50px rgba(16, 185, 129, 0.2)' : '0 20px 50px rgba(239, 68, 68, 0.2)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '350px',
          height: '180px',
          background: result.isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          filter: 'blur(60px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: result.isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: `2px solid ${result.isPassed ? 'var(--success)' : 'var(--danger)'}`,
          boxShadow: result.isPassed ? '0 0 30px rgba(16, 185, 129, 0.4)' : '0 0 30px rgba(239, 68, 68, 0.4)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.25rem'
        }}>
          {result.isPassed ? (
            <CheckCircle size={44} color="var(--success)" />
          ) : (
            <XCircle size={44} color="var(--danger)" />
          )}
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          {result.isPassed ? 'Muvaffaqiyatli topshirildi! 🎉' : 'Imtihon Yakunlandi'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem', fontSize: '1.05rem' }}>
          {result.examTitle || 'Exam Submission'}
        </p>

        {/* Score Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2rem',
          margin: '2.25rem 0',
          padding: '1.2rem 2.5rem',
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>To'plangan Ball</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {result.score} / {result.totalPoints}
            </div>
          </div>

          <div style={{ width: '1px', height: '42px', background: 'var(--border-color)' }} />

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Foiz Ko'rsatkichi</div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: result.isPassed ? 'var(--success)' : 'var(--danger)' }}>
              {result.percentage}%
            </div>
          </div>

          <div style={{ width: '1px', height: '42px', background: 'var(--border-color)' }} />

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Holat</div>
            <span className={`badge ${result.isPassed ? 'badge-pass' : 'badge-fail'}`} style={{ marginTop: '6px', padding: '0.35rem 0.85rem', fontSize: '0.8rem' }}>
              {result.isPassed ? 'PASSED' : 'FAILED'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-primary btn-lg" onClick={onBackToExams}>
            <ArrowLeft size={20} />
            <span>Bosh Sahifaga Qaytish</span>
          </button>

          {result.isPassed && (
            <button 
              className="btn btn-gold btn-lg" 
              onClick={() => setShowCertificate(true)}
            >
              <Award size={20} />
              <span>📜 Sertifikatni Ko'rish / Chop etish</span>
            </button>
          )}
        </div>
      </div>

      {/* Gemini AI Performance Feedback */}
      <div className="glass-card" style={{ marginBottom: '2.5rem', border: '1px solid rgba(99, 102, 241, 0.4)', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#c084fc', fontWeight: 800, fontSize: '0.88rem', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <Sparkles size={18} />
          <span>🤖 AI O'quv Tahlili va Maslahatlari</span>
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
          {aiFeedback.status}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', marginBottom: '1.25rem' }}>
          {aiFeedback.summary}
        </p>

        <div style={{ background: 'rgba(11, 16, 28, 0.75)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
            🎯 Rivojlanish va takomillashtirish yo'nalishlari:
          </div>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {aiFeedback.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Analysis */}
      {details.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem' }}>
            Savollar Tahlili va Natijasi
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {details.map((item, index) => (
              <div key={index} className="glass-card" style={{
                borderLeft: `5px solid ${item.IsCorrect ? 'var(--success)' : 'var(--danger)'}`,
                padding: '1.5rem 1.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {item.IsCorrect ? <Check size={16} color="var(--success)" /> : <X size={16} color="var(--danger)" />}
                    Savol {index + 1}
                  </span>
                  <span style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: item.IsCorrect ? 'var(--success)' : 'var(--danger)',
                    background: item.IsCorrect ? 'var(--success-bg)' : 'var(--danger-bg)',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '9999px'
                  }}>
                    {item.PointsEarned} / {item.TotalQuestionPoints} ball ({item.IsCorrect ? 'Tog\'ri' : 'Noto\'g\'ri'})
                  </span>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.5 }}>
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
