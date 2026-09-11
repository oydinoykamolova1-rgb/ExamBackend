import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, BookOpen, LogOut, ShieldAlert, UserCheck, PlusCircle, Users } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const roleName = user.role || 'Student';

  return (
    <nav style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.85rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand */}
      <div 
        onClick={() => setActiveTab('dashboard')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
        }}>
          <Award size={22} color="#fff" />
        </div>
        <div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ExamSystem
          </span>
          <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--secondary)', fontWeight: 600, marginTop: '-3px' }}>
            PRO BACKEND CONNECTED
          </span>
        </div>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BookOpen size={16} />
          <span>Exams</span>
        </button>

        <button
          className={`btn btn-sm ${activeTab === 'results' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('results')}
        >
          <Award size={16} />
          <span>My Results</span>
        </button>

        {(roleName === 'Teacher' || roleName === 'Admin') && (
          <button
            className={`btn btn-sm ${activeTab === 'teacher' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('teacher')}
          >
            <PlusCircle size={16} />
            <span>Manage Exams</span>
          </button>
        )}

        {roleName === 'Admin' && (
          <button
            className={`btn btn-sm ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('admin')}
          >
            <Users size={16} />
            <span>Users</span>
          </button>
        )}
      </div>

      {/* User Info & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {user.fullName}
          </div>
          <span className={`badge badge-${roleName.toLowerCase()}`}>
            {roleName}
          </span>
        </div>

        <button 
          onClick={logout} 
          className="btn btn-secondary btn-sm"
          title="Sign Out"
          style={{ padding: '0.5rem 0.75rem', color: '#f87171' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </nav>
  );
}
