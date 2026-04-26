import Sidebar from './Sidebar';
import AIChatbot from './AIChatbot';
import { Icons } from './Icons';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children, title }) {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">{title}</div>
          <div className="topbar-actions">
            <button className="btn btn-ghost" style={{ padding: 8, borderRadius: 'var(--radius-sm)', position: 'relative' }}>
              <Icons.Bell />
              <span style={{ position: 'absolute', top: 5, right: 5, width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', border: '2px solid var(--bg-secondary)' }} />
            </button>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, var(--accent), #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'white', cursor: 'pointer',
            }}>
              {user?.name?.slice(0, 2).toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        <div className="page-content">{children}</div>
      </div>

      {/* AI Chatbot — present on ALL pages */}
      <AIChatbot />
    </div>
  );
}
