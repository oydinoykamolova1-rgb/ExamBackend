import React, { useEffect, useState } from 'react';
import { fetchMyResultsApi } from '../api/results';
import { Award, Calendar, CheckCircle, XCircle, ChevronRight, ShieldCheck, TrendingUp, BarChart2 } from 'lucide-react';
import CertificateModal from '../components/CertificateModal';

export default function MyResultsPage({ onViewResultDetails }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCertResult, setSelectedCertResult] = useState(null);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    try {
      const data = await fetchMyResultsApi();
      setResults(data);
    } catch (err) {
      setError(err.message || 'Failed to load exam history.');
    } finally {
      setLoading(false);
    }
  };

  const totalTaken = results.length;
  const passedCount = results.filter(r => r.isPassed).length;
  const avgPercentage = totalTaken > 0 
    ? Math.round(results.reduce((acc, r) => acc + (r.percentage || 0), 0) / totalTaken)
    : 0;

  return (
    <div style={{ maxWidth: '1100px', margin: '2.5rem auto 0 auto', padding: '0 1.5rem' }} className="animate-fade-in-up">
      {selectedCertResult && (
        <CertificateModal result={selectedCertResult} onClose={() => setSelectedCertResult(null)} />
      )}

      {/* Header Banner */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          My Exam Results & History
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
          Review your past test scores, official certificates, and performance analytics.
        </p>

        {/* Stats Summary Bar */}
        {results.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginTop: '1.75rem' }}>
            <div className="stat-card">
              <div className="stat-icon-box" style={{ background: 'var(--primary-light)' }}>
                <BarChart2 size={24} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{totalTaken}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Jami Imtihonlar</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box" style={{ background: 'var(--success-bg)' }}>
                <CheckCircle size={24} color="var(--success)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success)' }}>{passedCount}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Muvaffaqiyatli O'tgan</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)' }}>
                <TrendingUp size={24} color="var(--secondary)" />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--secondary)' }}>{avgPercentage}%</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600 }}>O'rtacha Ko'rsatkich</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          <div className="animate-pulse-slow" style={{ fontSize: '1.1rem' }}>Loading your exam history...</div>
        </div>
      ) : results.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Award size={36} color="var(--text-subtle)" />
          </div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Hozircha natijalar mavjud emas</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto 0 auto' }}>
            Bosh sahifadagi imtihonlardan birini topshirib natijangizni ko'ring.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {results.map((res) => (
            <div 
              key={res.id} 
              className="glass-card glass-card-interactive" 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.4rem 2rem',
                gap: '1.5rem',
                flexWrap: 'wrap'
              }}
            >
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '1.35rem', flex: 1, minWidth: '260px' }}
                onClick={() => onViewResultDetails(res)}
              >
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '16px',
                  background: res.isPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${res.isPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {res.isPassed ? <CheckCircle size={26} color="var(--success)" /> : <XCircle size={26} color="var(--danger)" />}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
                    {res.examTitle || `Exam #${res.examId}`}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.83rem', color: 'var(--text-subtle)', marginTop: '0.3rem' }}>
                    <Calendar size={14} color="var(--secondary)" />
                    <span>{new Date(res.submittedAt).toLocaleDateString()} da soat {new Date(res.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }} onClick={() => onViewResultDetails(res)}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: res.isPassed ? 'var(--success)' : 'var(--danger)', lineHeight: 1.1 }}>
                    {res.percentage}%
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', fontWeight: 600, marginTop: '0.15rem' }}>
                    {res.score} / {res.totalPoints} ball
                  </div>
                </div>

                <span className={`badge ${res.isPassed ? 'badge-pass' : 'badge-fail'}`} onClick={() => onViewResultDetails(res)} style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}>
                  {res.isPassed ? 'PASSED' : 'FAILED'}
                </span>

                {res.isPassed && (
                  <button 
                    className="btn btn-gold btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCertResult(res);
                    }}
                    title="Rasmiy Sertifikatni Ko'rish"
                    style={{ padding: '0.45rem 0.95rem' }}
                  >
                    <Award size={16} />
                    <span>Sertifikat</span>
                  </button>
                )}

                <ChevronRight size={20} color="var(--text-subtle)" onClick={() => onViewResultDetails(res)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
