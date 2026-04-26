import { useState } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';

export default function FacultyProfile() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', department: user?.department || '', designation: user?.designation || '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const updated = await api.updateUser(user.id || user._id, form);
      login(updated, localStorage.getItem('token'));
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) { setError(err.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <Layout title="My Profile">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {success && <div className="alert alert-success mb-4"><Icons.Check /> {success}</div>}
        {error && <div className="alert alert-error mb-4">{error}</div>}

        <div className="card mb-5">
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24 }}>
            <div className="avatar avatar-xl" style={{ background: 'linear-gradient(135deg, #22d3ee, #6366f1)' }}>
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>{user?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>{user?.designation || 'Faculty'} · {user?.department || 'Department'}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <span className="badge badge-cyan">Faculty</span>
                <span className="badge badge-success">Active</span>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => setEditing(e => !e)}>
              <Icons.Edit /> {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editing ? (
            <div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input className="form-input" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                ['Username', user?.username],
                ['Email', user?.email || '—'],
                ['Phone', user?.phone || '—'],
                ['Department', user?.department || '—'],
                ['Designation', user?.designation || '—'],
                ['Role', 'Faculty'],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: 14, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
