import React from 'react';
import { Award, Download, CheckCircle, ShieldCheck, Printer, X, Sparkles } from 'lucide-react';

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
      background: 'rgba(4, 7, 13, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }} className="animate-fade-in-up">
      <div style={{
        maxWidth: '840px',
        width: '100%',
        position: 'relative'
      }}>
        {/* Action Header */}
        <div className="no-print" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fbbf24', fontWeight: 800, fontSize: '1.05rem' }}>
            <Award size={22} />
            <span>Rasmiy Imtihon Sertifikati</span>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem' }}>
            <button className="btn btn-gold btn-sm" onClick={handlePrint}>
              <Printer size={16} />
              <span>Chop etish / PDF Yuklash</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.5rem' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Card Frame */}
        <div className="printable-certificate" style={{
          background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #0f172a 70%, #090d16 100%)',
          border: '3px solid #eab308',
          borderRadius: '24px',
          padding: '3.5rem 3rem',
          boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.8), inset 0 0 50px rgba(234, 179, 8, 0.15), 0 0 35px rgba(234, 179, 8, 0.2)',
          position: 'relative',
          color: '#f8fafc',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          {/* Outer Gold Accent Border Line */}
          <div style={{
            position: 'absolute',
            inset: '10px',
            border: '1px solid rgba(234, 179, 8, 0.35)',
            borderRadius: '16px',
            pointerEvents: 'none'
          }} />

          {/* Background Decorative Seals */}
          <div style={{
            position: 'absolute',
            top: '-70px',
            right: '-70px',
            width: '220px',
            height: '220px',
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.18) 0%, transparent 70%)',
            borderRadius: '50%'
          }} />

          {/* Header Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.45)', padding: '0.45rem 1.35rem', borderRadius: '9999px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.75rem' }}>
            <ShieldCheck size={18} /> Verified Official Certificate
          </div>

          {/* Main Title */}
          <h1 style={{ fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff 0%, #fef08a 50%, #eab308 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            CERTIFICATE OF ACHIEVEMENT
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '3px', marginBottom: '2.25rem', fontWeight: 700 }}>
            This is proudly presented to
          </p>

          {/* Recipient Name */}
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#38bdf8', paddingBottom: '0.6rem', borderBottom: '2px dashed rgba(255, 255, 255, 0.2)', display: 'inline-block', minWidth: '340px', marginBottom: '1.75rem' }}>
            {result.studentName || 'Alex Student'}
          </div>

          {/* Achievement Description */}
          <p style={{ fontSize: '1.1rem', color: '#e2e8f0', maxWidth: '620px', margin: '0 auto 2.25rem auto', lineHeight: 1.6 }}>
            for successfully passing the official examination in <br />
            <strong style={{ color: '#fbbf24', fontSize: '1.3rem' }}>{result.examTitle || 'Exam'}</strong><br />
            with an outstanding score of <strong style={{ color: '#4ade80' }}>{result.percentage}% ({result.score}/{result.totalPoints} pts)</strong>.
          </p>

          {/* Footer Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginTop: '2.5rem', paddingTop: '1.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Certificate ID</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, fontFamily: 'monospace', color: '#94a3b8' }}>{certId}</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '58px', height: '58px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(245, 158, 11, 0.5)', border: '2px solid rgba(255, 255, 255, 0.3)' }}>
                <Award size={32} color="#fff" />
              </div>
              <div style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 800, marginTop: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>VERIFIED & PASSED</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Issue Date</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#e2e8f0' }}>{issueDate}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
