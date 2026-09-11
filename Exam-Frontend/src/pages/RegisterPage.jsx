import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, UserPlus } from 'lucide-react';

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
      padding: '2rem'
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
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
            Create Account
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Join ExamSystem Platform
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
            <label className="form-label">Full Name</label>
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

          <div className="form-group">
            <label className="form-label">Account Role</label>
            <select 
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="0">Student</option>
              <option value="1">Teacher</option>
              <option value="2">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <span 
            onClick={onNavigateLogin}
            style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
}
