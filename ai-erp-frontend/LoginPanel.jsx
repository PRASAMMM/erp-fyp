import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ROLES = ['Admin', 'Faculty', 'Student'];

const DEMO = {
  Admin: { username: 'admin', password: 'admin123' },
  Faculty: { username: 'faculty1', password: 'faculty123' },
  Student: { username: 'student1', password: 'student123' },
};

export default function LoginPanel({ compact = false }) {
  const [role, setRole] = useState('Student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDemoFill = () => {
    setUsername(DEMO[role].username);
    setPassword(DEMO[role].password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const d = DEMO[role];
    if (username === d.username && password === d.password) {
      navigate(`/${role.toLowerCase()}`);
    } else {
      setError('Invalid credentials. Try demo login below.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      backgroundColor: '#0f1a2e',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '6px',
      overflow: 'hidden',
      maxWidth: compact ? '100%' : '400px',
      width: '100%',
      boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          fontSize: '11px',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          fontFamily: 'system-ui, sans-serif',
          marginBottom: '16px',
        }}>EICT Campus Portal</div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0' }}>
          {ROLES.map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); setError(''); setUsername(''); setPassword(''); }}
              style={{
                flex: 1,
                padding: '9px 0',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: r === role ? '2px solid #1a4fa0' : '2px solid transparent',
                color: r === role ? 'white' : 'rgba(255,255,255,0.35)',
                fontSize: '12.5px',
                fontFamily: 'system-ui, sans-serif',
                cursor: 'pointer',
                fontWeight: r === role ? '500' : '400',
                transition: 'all 0.15s',
                letterSpacing: '0.2px',
              }}
            >{r}</button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ padding: '24px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={`Enter ${role.toLowerCase()} username`}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0a1220',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'system-ui, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(26,79,160,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: '#0a1220',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                color: 'white',
                fontSize: '14px',
                fontFamily: 'system-ui, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(26,79,160,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {error && (
            <div style={{
              marginBottom: '14px',
              padding: '8px 12px',
              backgroundColor: 'rgba(180, 50, 50, 0.15)',
              border: '1px solid rgba(180,50,50,0.3)',
              borderRadius: '3px',
              fontSize: '12px',
              color: '#f87171',
              fontFamily: 'system-ui, sans-serif',
            }}>{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '11px',
              backgroundColor: loading ? '#143d80' : '#1a4fa0',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13.5px',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s',
              letterSpacing: '0.2px',
            }}
          >
            {loading ? 'Signing in...' : `Sign in as ${role}`}
          </button>
        </form>

        {/* Demo fill */}
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderRadius: '3px',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontSize: '10.5px',
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'system-ui, sans-serif',
                marginBottom: '2px',
              }}>Demo: {DEMO[role].username} / {DEMO[role].password}</div>
            </div>
            <button
              onClick={handleDemoFill}
              style={{
                padding: '5px 10px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '3px',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '11px',
                fontFamily: 'system-ui, sans-serif',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >Fill</button>
          </div>
        </div>
      </div>
    </div>
  );
}
