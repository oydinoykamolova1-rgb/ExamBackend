import React, { useEffect, useState } from 'react';
import { fetchMyResultsApi } from '../api/results';
import { Award, Calendar, CheckCircle, XCircle, ChevronRight, ShieldCheck } from 'lucide-react';
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

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' }}>
      {selectedCertResult && (
        <CertificateModal result={selectedCertResult} onClose={() => setSelectedCertResult(null)} />
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
          My Exam Results & History
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Review your past test scores, official certificates, and performance feedback.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', color: '#f87171', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading your exam history...
        </div>
      ) : results.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <Award size={48} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
          <h3>No Exam History Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Complete an exam from the Available Exams tab to see your scores here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results.map((res) => (
            <div 
              key={res.id} 
              className="glass-card glass-card-interactive" 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem 1.75rem',
                cursor: 'pointer'
              }}
            >
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}
                onClick={() => onViewResultDetails(res)}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: res.isPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {res.isPassed ? <CheckCircle size={24} color="var(--success)" /> : <XCircle size={24} color="var(--danger)" />}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {res.examTitle || `Exam #${res.examId}`}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '0.2rem' }}>
                    <Calendar size={13} />
                    <span>{new Date(res.submittedAt).toLocaleDateString()} at {new Date(res.submittedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right' }} onClick={() => onViewResultDetails(res)}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: res.isPassed ? 'var(--success)' : 'var(--danger)' }}>
                    {res.percentage}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                    {res.score} / {res.totalPoints} pts
                  </div>
                </div>

                <span className={`badge ${res.isPassed ? 'badge-pass' : 'badge-fail'}`} onClick={() => onViewResultDetails(res)}>
                  {res.isPassed ? 'PASSED' : 'FAILED'}
                </span>

                {res.isPassed && (
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCertResult(res);
                    }}
                    style={{ background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.4)', color: '#fbbf24', padding: '0.35rem 0.65rem' }}
                    title="Rasmiy Sertifikatni Ko'rish"
                  >
                    <Award size={15} />
                    <span>Sertifikat</span>
                  </button>
                )}

                <ChevronRight size={18} color="var(--text-subtle)" onClick={() => onViewResultDetails(res)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
