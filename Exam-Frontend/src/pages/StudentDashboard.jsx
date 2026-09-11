import React, { useEffect, useState } from 'react';
import { fetchActiveExamsApi } from '../api/exams';
import { BookOpen, Clock, Target, Play, CheckCircle } from 'lucide-react';

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
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Available Exams
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Select an active examination to test your knowledge.
        </p>
      </div>

      {error && (
        <div style={{
          background: 'var(--danger-bg)',
          color: '#f87171',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading available exams...
        </div>
      ) : exams.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
          <BookOpen size={48} color="var(--text-subtle)" style={{ marginBottom: '1rem' }} />
          <h3>No Active Exams Available</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Check back later for new exams created by teachers.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {exams.map((exam) => (
            <div key={exam.id} className="glass-card glass-card-interactive" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span className="badge badge-student">Active</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                    By {exam.createdByName || 'Teacher'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  {exam.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineClamp: 2 }}>
                  {exam.description || 'No description provided.'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={16} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Duration</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{exam.durationMinutes} mins</div>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Target size={16} color="var(--secondary)" />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>Pass Score</div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{exam.passPercentage}%</div>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-primary"
                onClick={() => onStartExam(exam.id)}
                style={{ width: '100%' }}
              >
                <Play size={18} />
                <span>Start Exam ({exam.questionsCount} Questions)</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
