import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, BookOpen, LogOut, PlusCircle, Users, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleName = user.role || 'Student';

  return (
    <header style={{
      position: 'sticky',
      top: '12px',
      zIndex: 100,
      padding: '0 1.5rem',
      maxWidth: '1280px',
      margin: '0 auto'
    }}>
      <nav style={{
        background: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-xl)',
        padding: '0.75rem 1.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(99, 102, 241, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
        >
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'var(--grad-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Award size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff 30%, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ExamSystem
              </span>
              <Sparkles size={14} color="var(--secondary)" />
            </div>
            <span style={{ fontSize: '0.68rem', display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--secondary)', fontWeight: 700, letterSpacing: '0.04em' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block', boxShadow: '0 0 8px var(--success)' }}></span>
              PRO PLATFORM
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '0.35rem 0.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <button
            className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <BookOpen size={16} />
            <span>Exams</span>
          </button>

          <button
            className={`btn btn-sm ${activeTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('results')}
            style={{ borderRadius: 'var(--radius-md)' }}
          >
            <Award size={16} />
            <span>My Results</span>
          </button>

          {(roleName === 'Teacher' || roleName === 'Admin') && (
            <button
              className={`btn btn-sm ${activeTab === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('teacher')}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <PlusCircle size={16} />
              <span>Manage Exams</span>
            </button>
          )}

          {roleName === 'Admin' && (
            <button
              className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('admin')}
              style={{ borderRadius: 'var(--radius-md)' }}
            >
              <Users size={16} />
              <span>Users</span>
            </button>
          )}
        </div>

        {/* User Info & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(255, 255, 255, 0.04)',
            padding: '0.4rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: roleName === 'Admin' ? 'var(--grad-gold)' : roleName === 'Teacher' ? 'var(--grad-primary)' : 'var(--grad-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: roleName === 'Admin' ? '#000' : '#fff'
            }}>
              {(user.fullName || 'U').charAt(0).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.2 }}>
                {user.fullName}
              </div>
              <span className={`badge badge-${roleName.toLowerCase()}`} style={{ padding: '0.1rem 0.45rem', fontSize: '0.65rem', marginTop: '0.15rem' }}>
                {roleName}
              </span>
            </div>
          </div>

          <button 
            onClick={logout} 
            className="btn btn-secondary btn-sm"
            title="Sign Out"
            style={{
              padding: '0.55rem',
              borderRadius: 'var(--radius-md)',
              color: '#f87171',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.08)'
            }}
          >
            <LogOut size={17} />
          </button>
        </div>
      </nav>
    </header>
  );
}
