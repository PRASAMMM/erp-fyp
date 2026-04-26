import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';

const FILE_TYPES = ['PDF', 'VIDEO', 'LINK', 'DOC', 'PPT', 'IMAGE', 'OTHER'];
const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Biology', 'History', 'Economics', 'Other'];
const DEPTS = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'All Departments'];
const CLASSES = ['ALL', 'FY', 'SY', 'TY', 'LY'];

const typeIcons = {
  PDF: '📄', VIDEO: '🎬', LINK: '🔗', DOC: '📝', PPT: '📊', IMAGE: '🖼️', OTHER: '📁'
};
const typeColors = {
  PDF: '#ef4444', VIDEO: '#8b5cf6', LINK: '#22d3ee', DOC: '#6366f1', PPT: '#f59e0b', IMAGE: '#10b981', OTHER: '#6b7280'
};

function UploadModal({ onClose, onSuccess, user }) {
  const [form, setForm] = useState({
    title: '', description: '', subject: '', department: user?.department || '',
    targetClass: 'ALL', fileType: 'LINK', fileUrl: '', fileName: '',
    tags: '', uploadedBy: user?.name || '', facultyId: user?.id || user?._id || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.fileUrl) { setError('Title and URL/Link are required'); return; }
    setLoading(true); setError('');
    try {
      await api.uploadMaterial({
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Upload Study Material</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Share resources with your students</div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Title *</label>
                <input className="form-input" required placeholder="e.g. Data Structures — Lecture 5 Notes" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Material Type</label>
                <select className="form-input form-select" value={form.fileType}
                  onChange={e => setForm(f => ({ ...f, fileType: e.target.value }))}>
                  {FILE_TYPES.map(t => <option key={t} value={t}>{typeIcons[t]} {t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <select className="form-input form-select" value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                  <option value="">Select subject</option>
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">URL / Link *</label>
                <input className="form-input" required placeholder="https://drive.google.com/... or any accessible URL" value={form.fileUrl}
                  onChange={e => setForm(f => ({ ...f, fileUrl: e.target.value }))} />
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Paste a Google Drive, YouTube, Dropbox, or any public link
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-input form-select" value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                  <option value="">Select department</option>
                  {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Target Class</label>
                <select className="form-input form-select" value={form.targetClass}
                  onChange={e => setForm(f => ({ ...f, targetClass: e.target.value }))}>
                  {CLASSES.map(c => <option key={c} value={c}>{c === 'ALL' ? 'All Classes' : c}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="Brief description of this material..." value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Tags (comma-separated)</label>
                <input className="form-input" placeholder="e.g. lecture, important, exam, chapter-3" value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                <Icons.Upload /> {loading ? 'Uploading...' : 'Upload Material'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function FacultyMaterials() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchMaterials = async () => {
    try {
      const data = await api.getMaterialsByFaculty(user?.id || user?._id);
      setMaterials(data || []);
    } catch { setMaterials([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMaterials(); }, []);

  const filtered = materials.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.title?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q);
    const matchType = !typeFilter || m.fileType === typeFilter;
    return matchSearch && matchType;
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this material?')) return;
    try { await api.deleteMaterial(id); fetchMaterials(); } catch (err) { alert(err.message); }
  };

  const counts = FILE_TYPES.reduce((acc, t) => ({ ...acc, [t]: materials.filter(m => m.fileType === t).length }), {});

  return (
    <Layout title="Study Materials">
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSuccess={fetchMaterials} user={user} />}

      <div className="section-header mb-6">
        <div>
          <div className="section-title">Study Materials</div>
          <div className="section-subtitle">{materials.length} resources uploaded · visible to students</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
          <Icons.Upload /> Upload Material
        </button>
      </div>

      {/* Type breakdown */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {FILE_TYPES.filter(t => counts[t] > 0).map(t => (
          <div key={t} style={{ padding: '6px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>{typeIcons[t]}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{t}</span>
            <span style={{ fontWeight: 700, color: typeColors[t] }}>{counts[t]}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="search-wrapper">
          <Icons.Search />
          <input className="search-input" placeholder="Search materials..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Materials Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {[1, 2, 3].map(i => <div key={i} className="card"><div className="skeleton" style={{ height: 120 }} /></div>)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Icons.BookOpen /></div>
          <div className="empty-title">{search ? 'No materials found' : 'No materials uploaded yet'}</div>
          <div className="empty-desc">Click "Upload Material" to share resources with your students</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map(m => (
            <div key={m.id || m._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Type indicator bar */}
              <div style={{ height: 4, borderRadius: '12px 12px 0 0', background: typeColors[m.fileType] || 'var(--accent)', margin: '-24px -24px 20px', position: 'relative' }} />

              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: `${typeColors[m.fileType] || 'var(--accent)'}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                }}>
                  {typeIcons[m.fileType] || '📁'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3, lineHeight: 1.3 }}>{m.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.subject || 'General'} · {m.targetClass === 'ALL' ? 'All Classes' : m.targetClass}</div>
                </div>
              </div>

              {m.description && (
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {m.description}
                </div>
              )}

              {/* Tags */}
              {m.tags && m.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {m.tags.slice(0, 3).map(tag => (
                    <span key={tag} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-muted)' }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                <a href={m.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm" style={{ flex: 1, justifyContent: 'center', textDecoration: 'none' }}>
                  <Icons.Eye /> Open
                </a>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id || m._id)}>
                  <Icons.Trash />
                </button>
              </div>

              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                {m.createdAt ? new Date(m.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Just now'}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
