import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';

const typeIcons = { PDF: '📄', VIDEO: '🎬', LINK: '🔗', DOC: '📝', PPT: '📊', IMAGE: '🖼️', OTHER: '📁' };
const typeColors = { PDF: '#ef4444', VIDEO: '#8b5cf6', LINK: '#22d3ee', DOC: '#6366f1', PPT: '#f59e0b', IMAGE: '#10b981', OTHER: '#6b7280' };

export default function AdminMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getAllMaterials().then(d => setMaterials(d || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = materials.filter(m => {
    const q = search.toLowerCase();
    return !q || m.title?.toLowerCase().includes(q) || m.uploadedBy?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q);
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this material?')) return;
    try {
      await api.deleteMaterial(id);
      setMaterials(prev => prev.filter(m => (m.id || m._id) !== id));
    } catch (err) { alert(err.message); }
  };

  const byType = Object.keys(typeIcons).reduce((acc, t) => ({ ...acc, [t]: materials.filter(m => m.fileType === t).length }), {});

  return (
    <Layout title="Study Materials">
      <div className="grid-4 mb-6">
        {[
          { label: 'Total Resources', value: materials.length, color: 'var(--accent)' },
          { label: 'PDFs', value: byType.PDF || 0, color: '#ef4444' },
          { label: 'Videos', value: byType.VIDEO || 0, color: '#8b5cf6' },
          { label: 'Links', value: byType.LINK || 0, color: '#22d3ee' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="section-header mb-4">
        <div className="section-title">All Study Materials</div>
        <div className="search-wrapper">
          <Icons.Search />
          <input className="search-input" placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr><th>Title</th><th>Type</th><th>Subject</th><th>Department</th><th>Uploaded By</th><th>Class</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8}>
                <div className="empty-state">
                  <div className="empty-icon"><Icons.BookOpen /></div>
                  <div className="empty-title">No materials uploaded yet</div>
                </div>
              </td></tr>
            ) : filtered.map(m => (
              <tr key={m.id || m._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{typeIcons[m.fileType] || '📁'}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13.5 }}>{m.title}</div>
                      {m.description && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.description.slice(0, 50)}...</div>}
                    </div>
                  </div>
                </td>
                <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: `${typeColors[m.fileType] || '#6366f1'}18`, color: typeColors[m.fileType] || 'var(--accent)', fontWeight: 600 }}>{m.fileType}</span></td>
                <td>{m.subject || '—'}</td>
                <td>{m.department || '—'}</td>
                <td style={{ fontWeight: 500 }}>{m.uploadedBy || '—'}</td>
                <td><span className="badge badge-accent">{m.targetClass || 'ALL'}</span></td>
                <td style={{ fontSize: 12 }}>{m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><Icons.Eye /></a>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id || m._id)}><Icons.Trash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
