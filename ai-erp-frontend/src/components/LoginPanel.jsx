import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as apiLogin } from '../services/api';

const ROLES = ['Admin', 'Faculty', 'Student'];
const DEMO  = {
  Admin:   { username: 'admin',    password: 'admin123'   },
  Faculty: { username: 'faculty1', password: 'faculty123' },
  Student: { username: 'student1', password: 'student123' },
};

export default function LoginPanel() {
  const [role, setRole]         = useState('Student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate    = useNavigate();
  const { login }   = useAuth();

  const fillDemo = () => {
    setUsername(DEMO[role].username);
    setPassword(DEMO[role].password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiLogin({ username, password });
      login(data.user, data.token);
      const r = (data.user.role || '').toUpperCase();
      navigate(r === 'ADMIN' ? '/admin' : r === 'FACULTY' ? '/faculty' : '/student');
    } catch (err) {
      // Demo fallback — works offline / without backend
      const d = DEMO[role];
      if (username === d.username && password === d.password) {
        const u = { username, role: role.toUpperCase(), name: role };
        login(u, 'demo-' + role.toLowerCase());
        navigate('/' + role.toLowerCase());
      } else {
        setError(err?.message || 'Invalid credentials. Use demo fill below.');
      }
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width:'100%', padding:'10px 12px', backgroundColor:'#0a1220',
    border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, color:'white',
    fontSize:14, fontFamily:'system-ui,sans-serif', outline:'none',
    boxSizing:'border-box', transition:'border-color 0.15s',
  };

  return (
    <div style={{ backgroundColor:'#0f1a2e', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, overflow:'hidden', maxWidth:400, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
      <div style={{ padding:'20px 24px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.28)', letterSpacing:'1.5px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:16 }}>EICT Campus Portal</div>
        <div style={{ display:'flex' }}>
          {ROLES.map(r => (
            <button key={r} onClick={() => { setRole(r); setError(''); setUsername(''); setPassword(''); }}
              style={{ flex:1, padding:'9px 0', backgroundColor:'transparent', border:'none', borderBottom:r===role?'2px solid #1a4fa0':'2px solid transparent', color:r===role?'white':'rgba(255,255,255,0.32)', fontSize:12.5, fontFamily:'system-ui,sans-serif', cursor:'pointer', fontWeight:r===role?500:400, transition:'all 0.15s' }}
            >{r}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:24 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.32)', fontFamily:'system-ui,sans-serif', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:6 }}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder={`Enter ${role.toLowerCase()} username`} autoComplete="username" style={inp}
              onFocus={e => e.target.style.borderColor='rgba(26,79,160,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.32)', fontFamily:'system-ui,sans-serif', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" style={inp}
              onFocus={e => e.target.style.borderColor='rgba(26,79,160,0.6)'} onBlur={e => e.target.style.borderColor='rgba(255,255,255,0.1)'} />
          </div>
          {error && (
            <div style={{ marginBottom:14, padding:'8px 12px', backgroundColor:'rgba(180,50,50,0.15)', border:'1px solid rgba(180,50,50,0.3)', borderRadius:3, fontSize:12, color:'#f87171', fontFamily:'system-ui,sans-serif' }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} style={{ width:'100%', padding:11, backgroundColor:loading?'#143d80':'#1a4fa0', color:'white', border:'none', borderRadius:4, fontSize:13.5, fontFamily:'system-ui,sans-serif', fontWeight:500, cursor:loading?'not-allowed':'pointer', transition:'background-color 0.15s' }}>
            {loading ? 'Signing in…' : `Sign in as ${role}`}
          </button>
        </form>
        {/* Demo hints removed */}
      </div>
    </div>
  );
}
