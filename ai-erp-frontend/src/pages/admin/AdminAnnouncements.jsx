import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';

const CATEGORIES = ['General', 'Academic', 'Exam', 'Holiday', 'Event', 'Urgent'];
const categoryColors = { General: 'badge-accent', Academic: 'badge-cyan', Exam: 'badge-warning', Holiday: 'badge-success', Event: 'badge-accent', Urgent: 'badge-danger' };

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'General', targetRole: 'ALL' });
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  const fetchAnnouncements = async () => {
    try { setAnnouncements(await api.getAnnouncements() || []); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    setError('');
    try {
      await api.createAnnouncement(form);
      setForm({ title: '', content: '', category: 'General', targetRole: 'ALL' });
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) { setError(err.message || 'Failed to post'); }
    finally { setPosting(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try { await api.deleteAnnouncement(id); fetchAnnouncements(); }
    catch (err) { alert(err.message); }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Just now';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <Layout title="Announcements">
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Announcements</div>
          <div className="section-subtitle">Campus-wide communications and notices</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          <Icons.Plus /> New Announcement
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card mb-6" style={{ borderColor: 'var(--accent)', borderWidth: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
            Create Announcement
          </div>
          {error && <div className="alert alert-error mb-4">{error}</div>}
          <form onSubmit={handlePost}>
            <div className="grid-2 mb-4">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" required placeholder="Announcement title" value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select className="form-input form-select" value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Target Audience</label>
                  <select className="form-input form-select" value={form.targetRole}
                    onChange={e => setForm(f => ({ ...f, targetRole: e.target.value }))}>
                    <option value="ALL">Everyone</option>
                    <option value="STUDENT">Students Only</option>
                    <option value="FACULTY">Faculty Only</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Content *</label>
              <textarea className="form-input" required rows={4} placeholder="Write announcement content here..."
                value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={posting}>
                <Icons.Megaphone /> {posting ? 'Posting...' : 'Post Announcement'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card"><div className="skeleton" style={{ height: 80 }} /></div>
        )) : announcements.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Icons.Megaphone /></div>
            <div className="empty-title">No announcements yet</div>
            <div className="empty-desc">Post your first campus announcement above</div>
          </div>
        ) : announcements.map(a => (
          <div key={a.id || a._id} className="card" style={{ display: 'flex', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, flexShrink: 0,
              background: a.category === 'Urgent' ? 'var(--danger-soft)' : 'var(--accent-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: a.category === 'Urgent' ? 'var(--danger)' : 'var(--accent)',
            }}>
              <Icons.Megaphone />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span className={`badge ${categoryColors[a.category] || 'badge-accent'}`}>{a.category || 'General'}</span>
                    <span className="badge badge-accent">{a.targetRole === 'ALL' ? 'Everyone' : a.targetRole === 'STUDENT' ? 'Students' : 'Faculty'}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDate(a.createdAt)}</span>
                  </div>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id || a._id)}>
                  <Icons.Trash />
                </button>
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{a.content}</div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
