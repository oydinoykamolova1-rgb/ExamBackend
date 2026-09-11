import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, LogIn, User, Shield, GraduationCap, Lock } from 'lucide-react';

export default function LoginPage({ onNavigateRegister }) {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    try {
      await login(demoEmail, demoPassword);
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
            marginBottom: '1rem'
          }}>
            <Award size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to access your Exam Platform
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: '0.88rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
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
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            <LogIn size={18} />
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Login Section */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem', textAlign: 'center' }}>
            ⚡ Fast Demo 1-Click Login
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoLogin('student@exam.com', 'Student123!')}
              style={{ flexDirection: 'column', gap: '0.2rem', padding: '0.5rem 0.25rem' }}
            >
              <GraduationCap size={16} color="var(--secondary)" />
              <span style={{ fontSize: '0.75rem' }}>Student</span>
            </button>

            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoLogin('teacher@exam.com', 'Teacher123!')}
              style={{ flexDirection: 'column', gap: '0.2rem', padding: '0.5rem 0.25rem' }}
            >
              <User size={16} color="var(--primary)" />
              <span style={{ fontSize: '0.75rem' }}>Teacher</span>
            </button>

            <button 
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoLogin('admin@exam.com', 'Admin123!')}
              style={{ flexDirection: 'column', gap: '0.2rem', padding: '0.5rem 0.25rem' }}
            >
              <Shield size={16} color="var(--warning)" />
              <span style={{ fontSize: '0.75rem' }}>Admin</span>
            </button>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <span 
            onClick={onNavigateRegister}
            style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            Register Here
          </span>
        </div>
      </div>
    </div>
  );
}
