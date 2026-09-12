import React from 'react';
import { Award, Download, CheckCircle, ShieldCheck, Printer, X } from 'lucide-react';

export default function CertificateModal({ result, onClose }) {
  if (!result || !result.isPassed) return null;

  const certId = `CERT-${String(result.id || Date.now()).padStart(7, '0')}`;
  const issueDate = new Date(result.submittedAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
        position: 'relative'
      }}>
        {/* Action Header */}
        <div className="no-print" style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 700 }}>
            <Award size={20} />
            <span>Official Examination Certificate</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} />
              <span>Chop etish / PDF Saqlash</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Certificate Card Frame */}
        <div className="printable-certificate" style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          border: '3px solid rgba(234, 179, 8, 0.5)',
          borderRadius: '24px',
          padding: '3.5rem 3rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(234, 179, 8, 0.1)',
          position: 'relative',
          color: '#f8fafc',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          {/* Background Decorative Seals */}
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.15) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />

          {/* Header Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.4)', padding: '0.4rem 1.25rem', borderRadius: '9999px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' }}>
            <ShieldCheck size={18} /> Verified Official Certificate
          </div>

          {/* Main Title */}
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            CERTIFICATE OF ACHIEVEMENT
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2rem' }}>
            This is proudly presented to
          </p>

          {/* Recipient Name */}
          <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8', paddingBottom: '0.5rem', borderBottom: '2px dashed rgba(255, 255, 255, 0.15)', display: 'inline-block', minWidth: '320px', marginBottom: '1.5rem' }}>
            {result.studentName || 'Alex Student'}
          </div>

          {/* Achievement Description */}
          <p style={{ fontSize: '1.05rem', color: '#e2e8f0', maxWidth: '600px', margin: '0 auto 2rem auto', lineHeight: 1.6 }}>
            for successfully passing the official examination in <br />
            <strong style={{ color: '#fbbf24', fontSize: '1.25rem' }}>{result.examTitle || 'Exam'}</strong><br />
            with a score of <strong style={{ color: '#4ade80' }}>{result.percentage}% ({result.score}/{result.totalPoints} pts)</strong>.
          </p>

          {/* Footer Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Certificate ID</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, fontFamily: 'monospace', color: '#94a3b8' }}>{certId}</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'linear-gradient(135deg, #eab308, #ca8a04)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(234, 179, 8, 0.4)' }}>
                <Award size={30} color="#fff" />
              </div>
              <div style={{ fontSize: '0.7rem', color: '#fbbf24', fontWeight: 800, marginTop: '0.4rem', textTransform: 'uppercase' }}>Passed & Verified</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Issue Date</div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#e2e8f0' }}>{issueDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
