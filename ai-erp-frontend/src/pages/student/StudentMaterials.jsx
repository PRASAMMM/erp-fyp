import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';

const typeIcons = { PDF: '📄', VIDEO: '🎬', LINK: '🔗', DOC: '📝', PPT: '📊', IMAGE: '🖼️', OTHER: '📁' };
const typeColors = { PDF: '#ef4444', VIDEO: '#8b5cf6', LINK: '#22d3ee', DOC: '#6366f1', PPT: '#f59e0b', IMAGE: '#10b981', OTHER: '#6b7280' };

export default function StudentMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        // Get by department or all
        const data = user?.department
          ? await api.getMaterialsByDept(user.department)
          : await api.getAllMaterials();
        setMaterials(data || []);
      } catch { setMaterials([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, [user]);

  const subjects = [...new Set(materials.map(m => m.subject).filter(Boolean))];

  const filtered = materials.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.title?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q);
    const matchType = !typeFilter || m.fileType === typeFilter;
    const matchSubject = !subjectFilter || m.subject === subjectFilter;
    const matchClass = m.targetClass === 'ALL' || !m.targetClass || m.targetClass === user?.className;
    return matchSearch && matchType && matchSubject && matchClass;
  });

  return (
    <Layout title="Study Materials">
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Study Materials</div>
          <div className="section-subtitle">{materials.length} resources from your faculty</div>
        </div>
      </div>

      {/* Subject quick-filter pills */}
      {subjects.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <button onClick={() => setSubjectFilter('')}
            style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, border: '1px solid var(--border)', background: !subjectFilter ? 'var(--accent)' : 'var(--bg-card)', color: !subjectFilter ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
            All Subjects
          </button>
          {subjects.map(s => (
            <button key={s} onClick={() => setSubjectFilter(s === subjectFilter ? '' : s)}
              style={{ padding: '5px 14px', borderRadius: 20, fontSize: 12, border: '1px solid var(--border)', background: subjectFilter === s ? 'var(--accent)' : 'var(--bg-card)', color: subjectFilter === s ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <div className="search-wrapper">
          <Icons.Search />
          <input className="search-input" placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4].map(i => <div key={i} className="card"><div className="skeleton" style={{ height: 140 }} /></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Icons.BookOpen /></div>
          <div className="empty-title">{search ? 'No materials found' : 'No materials available yet'}</div>
          <div className="empty-desc">Your faculty will upload study resources here</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map(m => (
            <div key={m.id || m._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 4, borderRadius: '12px 12px 0 0', background: typeColors[m.fileType] || 'var(--accent)', margin: '-24px -24px 20px', position: 'relative' }} />

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: `${typeColors[m.fileType] || '#6366f1'}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  {typeIcons[m.fileType] || '📁'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, marginBottom: 4 }}>{m.title}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {m.subject && <span className="badge badge-accent" style={{ fontSize: 10 }}>{m.subject}</span>}
                    {m.targetClass && m.targetClass !== 'ALL' && <span className="badge badge-cyan" style={{ fontSize: 10 }}>{m.targetClass}</span>}
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${typeColors[m.fileType]}18`, color: typeColors[m.fileType], fontWeight: 600 }}>{m.fileType}</span>
                  </div>
                </div>
              </div>

              {m.description && (
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {m.description}
                </div>
              )}

              {m.tags && m.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
                  {m.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, padding: '2px 7px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)' }}>#{tag}</span>
                  ))}
                </div>
              )}

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  Uploaded by {m.uploadedBy || 'Faculty'} · {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently'}
                </div>
                <a href={m.fileUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', background: typeColors[m.fileType] || 'var(--accent)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: 13.5, fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {m.fileType === 'VIDEO' ? '▶ Watch Video' : m.fileType === 'LINK' ? '🔗 Open Link' : '⬇ Access Material'}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
