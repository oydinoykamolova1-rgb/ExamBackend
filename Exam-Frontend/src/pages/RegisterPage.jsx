import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, UserPlus, User, Mail, Lock, ShieldCheck } from 'lucide-react';

export default function RegisterPage({ onNavigateLogin }) {
  const { register, loading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('0'); // 0: Student, 1: Teacher, 2: Admin
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(fullName, email, password, role);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div className="glass-card animate-fade-in-up" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '2.75rem 2.25rem',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 30px rgba(99, 102, 241, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.12)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'var(--grad-primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.45)',
            marginBottom: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.25)'
          }}>
            <Award size={34} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Join ExamSystem Platform
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '0.85rem 1.1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.88rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <User size={15} color="var(--primary)" />
              <span>Full Name</span>
            </label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Mail size={15} color="var(--primary)" />
              <span>Email Address</span>
            </label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="name@exam.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={15} color="var(--primary)" />
              <span>Password</span>
            </label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <ShieldCheck size={15} color="var(--secondary)" />
              <span>Account Role</span>
            </label>
            <select 
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="0" style={{ background: '#111827', color: '#fff' }}>Student (Talaba)</option>
              <option value="1" style={{ background: '#111827', color: '#fff' }}>Teacher (O'qituvchi)</option>
              <option value="2" style={{ background: '#111827', color: '#fff' }}>Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%', marginTop: '0.75rem' }}
            disabled={loading}
          >
            <UserPlus size={20} />
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <span 
            onClick={onNavigateLogin}
            style={{ color: 'var(--secondary)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
}
