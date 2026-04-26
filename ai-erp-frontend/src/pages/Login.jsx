import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(form);
      const userData = res.user || res;
      const token = res.token || 'erp-token-local';

      // Normalize role to UPPERCASE so routing is consistent
      if (userData.role) userData.role = userData.role.toUpperCase();

      login(userData, token);

      const role = userData.role?.toUpperCase();
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'FACULTY') navigate('/faculty/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (username, password) => setForm({ username, password });

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'var(--bg-primary)', fontFamily: 'var(--font-body)',
    }}>
      {/* Left branding panel */}
      <div style={{
        flex: '0 0 460px', background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '48px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -60, width: 360, height: 360, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 64, position: 'relative' }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #6366f1, #22d3ee)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'white' }}>E</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22 }}>EICT</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2, textTransform: 'uppercase' }}>Campus Management</div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, background: 'linear-gradient(135deg, var(--text-primary) 60%, var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            The Future of Campus Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8, maxWidth: 340 }}>
            Unified platform for admins, faculty & students — marks, attendance, materials, analytics and AI assistance in one place.
          </p>
          <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
            {[['99.9%', 'Uptime'], ['Role-Based', 'Access'], ['AI', 'Powered']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>{v}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', position: 'relative' }}>© 2026 EICT · All rights reserved</div>
      </div>

      {/* Right login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, marginBottom: 8 }}>Welcome back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Sign in to access your campus portal</p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: 'var(--danger-soft)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: 13.5, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input className="form-input" type="text" placeholder="Enter your username" autoComplete="username"
                value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Enter your password" autoComplete="current-password"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button type="submit" className="btn btn-primary w-full btn-lg" style={{ justifyContent: 'center', marginTop: 4 }} disabled={loading}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Signing in...
                </span>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: 36, padding: 20, background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>Quick Demo Login</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { role: 'Admin', user: 'admin', pass: 'admin123', color: '#6366f1' },
                { role: 'Faculty', user: 'faculty1', pass: 'faculty123', color: '#22d3ee' },
                { role: 'Student', user: 'student1', pass: 'student123', color: '#10b981' },
              ].map(({ role, user, pass, color }) => (
                <button key={role} type="button"
                  onClick={() => fillDemo(user, pass)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-primary)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
                    {role}
                  </span>
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{user} / {pass}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
