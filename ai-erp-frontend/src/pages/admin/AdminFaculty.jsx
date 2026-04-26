import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';

const DEPT_OPTIONS = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics'];
const DESIGNATION_OPTIONS = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'HOD'];

// All classes that exist in your college — edit this list to match your actual classes
const CLASS_OPTIONS = [
  'BCA-1', 'BCA-2', 'BCA-3',
  'BIT-1', 'BIT-2', 'BIT-3',
  'CSIT-1', 'CSIT-2', 'CSIT-3', 'CSIT-4',
  'CE-1', 'CE-2', 'CE-3', 'CE-4',
  'MSC-1', 'MSC-2',
];

// ── Add Faculty Modal ─────────────────────────────────────────────────────────
function AddFacultyModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', username: '', password: '', email: '', phone: '',
    department: '', designation: '', className: '', role: 'FACULTY',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.register(form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create faculty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Add Faculty Member</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Create a new faculty account</div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" required placeholder="Dr. Anita Singh" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <select className="form-input form-select" value={form.designation}
                  onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}>
                  <option value="">Select designation</option>
                  {DESIGNATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Username *</label>
                <input className="form-input" required placeholder="Login username" value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Password *</label>
                <input className="form-input" type="password" required placeholder="Set password" value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="faculty@edu.com" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+977 9800000000" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-input form-select" value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                  <option value="">Select department</option>
                  {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* ── NEW: Assigned Class ──────────────────────────────── */}
              <div className="form-group">
                <label className="form-label">
                  Assigned Class
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>
                    (students in this class will see this faculty)
                  </span>
                </label>
                <select className="form-input form-select" value={form.className}
                  onChange={e => setForm(f => ({ ...f, className: e.target.value }))}>
                  <option value="">— No class assigned —</option>
                  {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* ──────────────────────────────────────────────────────── */}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Faculty'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Edit Faculty Modal ────────────────────────────────────────────────────────
function EditFacultyModal({ faculty, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name:        faculty.name        || '',
    email:       faculty.email       || '',
    phone:       faculty.phone       || '',
    department:  faculty.department  || '',
    designation: faculty.designation || '',
    className:   faculty.className   || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.updateUser(faculty.id || faculty._id, form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update faculty');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Edit Faculty</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{faculty.name}</div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <select className="form-input form-select" value={form.designation}
                  onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}>
                  <option value="">Select designation</option>
                  {DESIGNATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-input form-select" value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                  <option value="">Select department</option>
                  {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* ── NEW: Assigned Class ──────────────────────────────── */}
              <div className="form-group">
                <label className="form-label">
                  Assigned Class
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>
                    (students in this class will see this faculty)
                  </span>
                </label>
                <select className="form-input form-select" value={form.className}
                  onChange={e => setForm(f => ({ ...f, className: e.target.value }))}>
                  <option value="">— No class assigned —</option>
                  {CLASS_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* ──────────────────────────────────────────────────────── */}
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminFaculty() {
  const [faculty, setFaculty]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showAdd, setShowAdd]     = useState(false);
  const [editing, setEditing]     = useState(null); // faculty object being edited
  const [search, setSearch]       = useState('');

  const fetchFaculty = async () => {
    try {
      const data = await api.getFaculty();
      setFaculty(data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFaculty(); }, []);

  const filtered = faculty.filter(f => {
    const q = search.toLowerCase();
    return !q || f.name?.toLowerCase().includes(q)
              || f.department?.toLowerCase().includes(q)
              || f.username?.toLowerCase().includes(q)
              || f.className?.toLowerCase().includes(q);
  });

  const handleDelete = async (id) => {
    if (!confirm('Remove this faculty member?')) return;
    try {
      await api.deleteUser(id);
      fetchFaculty();
    } catch (err) { alert(err.message); }
  };

  return (
    <Layout title="Faculty Management">
      {showAdd  && <AddFacultyModal onClose={() => setShowAdd(false)}  onSuccess={fetchFaculty} />}
      {editing  && <EditFacultyModal faculty={editing} onClose={() => setEditing(null)} onSuccess={fetchFaculty} />}

      <div className="section-header mb-6">
        <div>
          <div className="section-title">Faculty</div>
          <div className="section-subtitle">{faculty.length} faculty members</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          <Icons.Plus /> Add Faculty
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="search-wrapper">
          <Icons.Search />
          <input className="search-input" placeholder="Search by name, dept, or class..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Faculty Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {loading ? Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton" style={{ height: 80 }} />
          </div>
        )) : filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1' }}>
            <div className="empty-state">
              <div className="empty-icon"><Icons.Users /></div>
              <div className="empty-title">No faculty members</div>
              <div className="empty-desc">Add your first faculty member to get started</div>
            </div>
          </div>
        ) : filtered.map(f => (
          <div key={f.id || f._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div className="avatar avatar-lg" style={{ background: 'linear-gradient(135deg, #22d3ee, #6366f1)' }}>
                {f.name?.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16 }}>{f.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{f.designation || 'Faculty'}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className="badge badge-cyan">{f.department || 'No Dept'}</span>
                  {/* Show className badge — highlights missing assignments clearly */}
                  {f.className
                    ? <span className="badge badge-success">{f.className}</span>
                    : <span className="badge badge-warning" title="No class assigned — students won't see this faculty">No class</span>
                  }
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                <div style={{ marginBottom: 2 }}>Email</div>
                <div style={{ color: 'var(--text-secondary)' }}>{f.email || '—'}</div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                <div style={{ marginBottom: 2 }}>Username</div>
                <div style={{ color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{f.username}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              {/* Edit button — opens EditFacultyModal */}
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}
                onClick={() => setEditing(f)}>
                <Icons.Edit /> Edit
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.id || f._id)}>
                <Icons.Trash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
