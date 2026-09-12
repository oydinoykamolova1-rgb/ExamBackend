import React, { useEffect, useState } from 'react';
import { fetchAllUsersApi, updateUserApi, deleteUserApi } from '../api/users';
import { Users, Shield, Trash2, Edit2, Check, X, UserCheck, GraduationCap, Sparkles } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('0');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsersApi();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Failed to load user list.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (user) => {
    setEditingUserId(user.id);
    setEditName(user.fullName);
    setEditRole(user.role === 'Admin' ? '2' : user.role === 'Teacher' ? '1' : '0');
  };

  const handleSaveEdit = async (id) => {
    try {
      await updateUserApi(id, editName, editRole);
      setEditingUserId(null);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to update user.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUserApi(id);
      loadUsers();
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  const studentCount = users.filter(u => u.role === 'Student' || u.role === 0).length;
  const teacherCount = users.filter(u => u.role === 'Teacher' || u.role === 1).length;
  const adminCount = users.filter(u => u.role === 'Admin' || u.role === 2).length;

  return (
    <div style={{ maxWidth: '1150px', margin: '2.5rem auto 0 auto', padding: '0 1.5rem' }} className="animate-fade-in-up">
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '2.25rem 2.5rem',
        marginBottom: '2.5rem',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(99, 102, 241, 0.08) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(245, 158, 11, 0.2)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, color: '#fcd34d', marginBottom: '0.75rem' }}>
            <Shield size={14} color="var(--warning)" />
            <span>SYSTEM CONTROL PANEL</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            User Management Studio
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.35rem' }}>
            Admin control center for managing user accounts, permissions, and roles.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="stat-card" style={{ padding: '0.9rem 1.25rem', background: 'rgba(15, 23, 42, 0.8)' }}>
            <div className="stat-icon-box" style={{ width: '42px', height: '42px', background: 'rgba(6, 182, 212, 0.15)' }}>
              <GraduationCap size={20} color="var(--secondary)" />
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{studentCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Students</div>
            </div>
          </div>

          <div className="stat-card" style={{ padding: '0.9rem 1.25rem', background: 'rgba(15, 23, 42, 0.8)' }}>
            <div className="stat-icon-box" style={{ width: '42px', height: '42px', background: 'var(--primary-light)' }}>
              <UserCheck size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{teacherCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Teachers</div>
            </div>
          </div>

          <div className="stat-card" style={{ padding: '0.9rem 1.25rem', background: 'rgba(15, 23, 42, 0.8)' }}>
            <div className="stat-icon-box" style={{ width: '42px', height: '42px', background: 'rgba(245, 158, 11, 0.15)' }}>
              <Shield size={20} color="var(--warning)" />
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>{adminCount}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-subtle)', fontWeight: 600 }}>Admins</div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          <div className="animate-pulse-slow">Loading user accounts...</div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '4rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1.2rem 1.75rem' }}>User ID</th>
                <th style={{ padding: '1.2rem 1.75rem' }}>Full Name</th>
                <th style={{ padding: '1.2rem 1.75rem' }}>Email</th>
                <th style={{ padding: '1.2rem 1.75rem' }}>Role</th>
                <th style={{ padding: '1.2rem 1.75rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isEditing = editingUserId === u.id;
                const roleStr = typeof u.role === 'number' ? (u.role === 2 ? 'Admin' : u.role === 1 ? 'Teacher' : 'Student') : u.role;

                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s ease' }}>
                    <td style={{ padding: '1.1rem 1.75rem', fontWeight: 800, color: 'var(--text-subtle)', fontFamily: 'monospace' }}>
                      #{u.id}
                    </td>

                    <td style={{ padding: '1.1rem 1.75rem' }}>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="form-input" 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)}
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.9rem' }}
                        />
                      ) : (
                        <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.96rem' }}>{u.fullName}</span>
                      )}
                    </td>

                    <td style={{ padding: '1.1rem 1.75rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      {u.email}
                    </td>

                    <td style={{ padding: '1.1rem 1.75rem' }}>
                      {isEditing ? (
                        <select 
                          className="form-input" 
                          value={editRole} 
                          onChange={(e) => setEditRole(e.target.value)}
                          style={{ padding: '0.45rem 0.85rem', fontSize: '0.9rem', cursor: 'pointer' }}
                        >
                          <option value="0" style={{ background: '#111827', color: '#fff' }}>Student</option>
                          <option value="1" style={{ background: '#111827', color: '#fff' }}>Teacher</option>
                          <option value="2" style={{ background: '#111827', color: '#fff' }}>Admin</option>
                        </select>
                      ) : (
                        <span className={`badge badge-${roleStr.toLowerCase()}`} style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}>
                          {roleStr}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1.1rem 1.75rem', textAlign: 'right' }}>
                      {isEditing ? (
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleSaveEdit(u.id)}>
                            <Check size={15} /> Save
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingUserId(null)}>
                            <X size={15} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleStartEdit(u)} title="Edit Role">
                            <Edit2 size={15} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)} title="Delete User">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
