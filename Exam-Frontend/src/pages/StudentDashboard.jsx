import React, { useEffect, useState } from 'react';
import { fetchActiveExamsApi } from '../api/exams';
import { BookOpen, Clock, Target, Play, Sparkles, Award, HelpCircle } from 'lucide-react';

export default function StudentDashboard({ onStartExam }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    try {
      const data = await fetchActiveExamsApi();
      setExams(data);
    } catch (err) {
      setError(err.message || 'Failed to load exams.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2.5rem auto 0 auto', padding: '0 1.5rem' }} className="animate-fade-in-up">
      {/* Hero Welcome Header */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.2)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#a5b4fc', marginBottom: '0.75rem' }}>
              <Sparkles size={14} color="var(--secondary)" />
              <span>ONLINE ASSESSMENT CENTER</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Available Examinations
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '600px' }}>
              Select an active examination below to test your skills, earn official certificates, and track your progress.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="stat-card" style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(6, 182, 212, 0.3)' }}>
              <div className="stat-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                <BookOpen size={24} color="var(--secondary)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{exams.length}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Active Tests</div>
              </div>
            </div>

            <div className="stat-card" style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <div className="stat-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                <Award size={24} color="var(--success)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>Certificates</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Auto-Generated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'var(--danger-bg)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem'
        }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          <div className="animate-pulse-slow" style={{ fontSize: '1.1rem' }}>Loading available exams...</div>
        </div>
      ) : exams.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <BookOpen size={36} color="var(--text-subtle)" />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Hozircha faol imtihonlar yo'q</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto 0 auto' }}>
            O'qituvchilar yangi imtihon yaratganida bu yerda paydo bo'ladi.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {exams.map((exam) => (
            <div 
              key={exam.id} 
              className="glass-card glass-card-interactive" 
              style={{
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                padding: '1.75rem',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span className="badge badge-student">Active Exam</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
                    👤 {exam.createdByName || 'Teacher'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.6rem', lineHeight: 1.3 }}>
                  {exam.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', minHeight: '44px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {exam.description || 'Ushbu imtihon bo\'yicha bilimingizni sinab ko\'ring va sertifikatga ega bo\'ling.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.75rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Clock size={18} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Davomiyligi</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>{exam.durationMinutes} daqiqa</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '0.75rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Target size={18} color="var(--secondary)" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)', fontWeight: 600 }}>O'tish bali</div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--secondary)' }}>{exam.passPercentage}%</div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-primary btn-lg"
                onClick={() => onStartExam(exam.id)}
                style={{ width: '100%' }}
              >
                <Play size={19} fill="currentColor" />
                <span>Boshlash ({exam.questionsCount ?? (exam.questions ? exam.questions.length : 0)} savol)</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
