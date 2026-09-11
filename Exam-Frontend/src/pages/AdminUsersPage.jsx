import React, { useEffect, useState } from 'react';
import { fetchAllUsersApi, updateUserApi, deleteUserApi } from '../api/users';
import { Users, Shield, Trash2, Edit2, Check, X } from 'lucide-react';

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

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>
          User Management Studio
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Admin panel for managing system user accounts and roles.
        </p>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', color: '#f87171', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          Loading user accounts...
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '1rem 1.5rem' }}>User ID</th>
                <th style={{ padding: '1rem 1.5rem' }}>Full Name</th>
                <th style={{ padding: '1rem 1.5rem' }}>Email</th>
                <th style={{ padding: '1rem 1.5rem' }}>Role</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isEditing = editingUserId === u.id;
                const roleStr = typeof u.role === 'number' ? (u.role === 2 ? 'Admin' : u.role === 1 ? 'Teacher' : 'Student') : u.role;

                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: 'var(--text-subtle)' }}>
                      #{u.id}
                    </td>

                    <td style={{ padding: '1rem 1.5rem' }}>
                      {isEditing ? (
                        <input 
                          type="text" 
                          className="form-input" 
                          value={editName} 
                          onChange={(e) => setEditName(e.target.value)}
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.9rem' }}
                        />
                      ) : (
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{u.fullName}</span>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>
                      {u.email}
                    </td>

                    <td style={{ padding: '1rem 1.5rem' }}>
                      {isEditing ? (
                        <select 
                          className="form-input" 
                          value={editRole} 
                          onChange={(e) => setEditRole(e.target.value)}
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.9rem' }}
                        >
                          <option value="0">Student</option>
                          <option value="1">Teacher</option>
                          <option value="2">Admin</option>
                        </select>
                      ) : (
                        <span className={`badge badge-${roleStr.toLowerCase()}`}>
                          {roleStr}
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      {isEditing ? (
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button className="btn btn-success btn-sm" onClick={() => handleSaveEdit(u.id)}>
                            <Check size={14} /> Save
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditingUserId(null)}>
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleStartEdit(u)} title="Edit Role">
                            <Edit2 size={14} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(u.id)} title="Delete User">
                            <Trash2 size={14} />
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
