import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';

const DEPT_OPTIONS = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics'];
const SEMESTER_OPTIONS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const EXAM_TYPES = ['Internal 1', 'Internal 2', 'Mid-Semester', 'End-Semester', 'Practical', 'Quiz'];

// ── Create / Edit Subject Modal ───────────────────────────────────────────────
function SubjectFormModal({ subject, faculty, onClose, onSuccess }) {
  const isEdit = !!subject;
  const [form, setForm] = useState({
    name:       subject?.name       || '',
    code:       subject?.code       || '',
    department: subject?.department || '',
    semester:   subject?.semester   || '',
    facultyId:  subject?.facultyId  || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Subject name is required'); return; }
    setLoading(true); setError('');
    try {
      if (isEdit) {
        await api.updateSubject(subject.id, form);
      } else {
        await api.createSubject({ ...form, studentIds: [] });
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{isEdit ? 'Edit Subject' : 'Create Subject'}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {isEdit ? `Editing ${subject.name}` : 'Add a new subject and assign a faculty member'}
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Subject Name *</label>
                <input className="form-input" required placeholder="e.g. Data Structures & Algorithms"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Subject Code</label>
                <input className="form-input" placeholder="e.g. CS301"
                  value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select className="form-input form-select" value={form.department}
                  onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                  <option value="">Select department</option>
                  {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Semester</label>
                <select className="form-input form-select" value={form.semester}
                  onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}>
                  <option value="">Select semester</option>
                  {SEMESTER_OPTIONS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Assigned Faculty</label>
                <select className="form-input form-select" value={form.facultyId}
                  onChange={e => setForm(f => ({ ...f, facultyId: e.target.value }))}>
                  <option value="">— No faculty assigned yet —</option>
                  {faculty.map(f => (
                    <option key={f.id || f._id} value={f.id || f._id}>
                      {f.name} — {f.designation || 'Faculty'} ({f.department || 'No dept'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Subject'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Manage Enrolled Students Modal ────────────────────────────────────────────
function EnrollModal({ subject, allStudents, onClose, onSuccess }) {
  const [enrolled, setEnrolled] = useState(new Set(subject.studentIds || []));
  const [search, setSearch]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const toggle = (id) => {
    setEnrolled(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    setLoading(true); setError('');
    try {
      await api.setSubjectStudents(subject.id, [...enrolled]);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update enrollment');
    } finally {
      setLoading(false);
    }
  };

  const filtered = allStudents.filter(s => {
    const q = search.toLowerCase();
    return !q || s.name?.toLowerCase().includes(q)
              || s.registrationNumber?.toLowerCase().includes(q)
              || s.username?.toLowerCase().includes(q);
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Manage Students — {subject.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {enrolled.size} of {allStudents.length} students enrolled
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <button className="btn btn-secondary btn-sm"
              onClick={() => setEnrolled(new Set(allStudents.map(s => s.id || s._id)))}>
              Select All
            </button>
            <button className="btn btn-secondary btn-sm"
              onClick={() => setEnrolled(new Set())}>
              Clear All
            </button>
          </div>

          {/* Search */}
          <div className="search-wrapper" style={{ marginBottom: 14 }}>
            <Icons.Search />
            <input className="search-input" placeholder="Search students..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          {/* Student list */}
          <div style={{ maxHeight: 360, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>
                No students found
              </div>
            ) : filtered.map(s => {
              const id = s.id || s._id;
              const isIn = enrolled.has(id);
              return (
                <div
                  key={id}
                  onClick={() => toggle(id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: isIn ? 'rgba(99,102,241,0.1)' : 'var(--bg-primary)',
                    border: `1px solid ${isIn ? 'rgba(99,102,241,0.35)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Checkbox */}
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                    border: `2px solid ${isIn ? '#6366f1' : 'var(--border)'}`,
                    background: isIn ? '#6366f1' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isIn && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5L4.5 7.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', flexShrink: 0 }}>
                    {s.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {s.registrationNumber || s.username} · {s.department || 'No dept'}
                    </div>
                  </div>
                  {isIn && <span className="badge badge-accent">Enrolled</span>}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" disabled={loading} onClick={handleSave}>
              {loading ? 'Saving...' : `Save Enrollment (${enrolled.size} students)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Subject Detail Drawer ─────────────────────────────────────────────────────
function SubjectDetail({ subject, onClose, onEnroll }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: 560 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{subject.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {subject.code && `${subject.code} · `}{subject.department} · Semester {subject.semester || '—'}
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          {/* Faculty */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
              Faculty
            </div>
            {subject.facultyName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                <div className="avatar" style={{ background: 'linear-gradient(135deg, #22d3ee, #6366f1)' }}>
                  {subject.facultyName?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>{subject.facultyName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Teaching this subject</div>
                </div>
              </div>
            ) : (
              <div className="alert alert-warning">No faculty assigned to this subject yet.</div>
            )}
          </div>

          {/* Students */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Enrolled Students ({subject.studentCount || 0})
              </div>
              <button className="btn btn-secondary btn-sm" onClick={onEnroll}>
                <Icons.Users /> Manage Enrollment
              </button>
            </div>
            {!subject.students?.length ? (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                No students enrolled. Click "Manage Enrollment" to add students.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto' }}>
                {subject.students.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                    <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                      {s.name?.slice(0, 2).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{s.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.registrationNumber || s.username}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminSubjects() {
  const [subjects, setSubjects]   = useState([]);
  const [faculty, setFaculty]     = useState([]);
  const [allStudents, setStudents] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const [showCreate, setShowCreate]   = useState(false);
  const [editing, setEditing]         = useState(null);  // subject being edited
  const [detailSubject, setDetail]    = useState(null);  // subject detail view
  const [enrollSubject, setEnroll]    = useState(null);  // subject being enrolled

  const fetchAll = async () => {
    setLoading(true);
    const [s, f, st] = await Promise.allSettled([
      api.getAllSubjects(),
      api.getFaculty(),
      api.getStudents(),
    ]);
    if (s.status === 'fulfilled') setSubjects(s.value || []);
    if (f.status === 'fulfilled') setFaculty(f.value || []);
    if (st.status === 'fulfilled') setStudents(st.value || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this subject? All associated enrollment data will be lost.')) return;
    try { await api.deleteSubject(id); fetchAll(); }
    catch (err) { alert(err.message); }
  };

  const departments = [...new Set(subjects.map(s => s.department).filter(Boolean))];

  const filtered = subjects.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name?.toLowerCase().includes(q)
                           || s.code?.toLowerCase().includes(q)
                           || s.facultyName?.toLowerCase().includes(q);
    const matchDept = !deptFilter || s.department === deptFilter;
    return matchSearch && matchDept;
  });

  return (
    <Layout title="Subject Management">
      {showCreate && (
        <SubjectFormModal faculty={faculty} onClose={() => setShowCreate(false)} onSuccess={fetchAll} />
      )}
      {editing && (
        <SubjectFormModal subject={editing} faculty={faculty}
          onClose={() => setEditing(null)} onSuccess={fetchAll} />
      )}
      {detailSubject && !enrollSubject && (
        <SubjectDetail
          subject={detailSubject}
          onClose={() => setDetail(null)}
          onEnroll={() => { setEnroll(detailSubject); setDetail(null); }}
        />
      )}
      {enrollSubject && (
        <EnrollModal
          subject={enrollSubject}
          allStudents={allStudents}
          onClose={() => setEnroll(null)}
          onSuccess={() => { fetchAll(); setEnroll(null); }}
        />
      )}

      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Subjects</div>
          <div className="section-subtitle">{subjects.length} subjects · {allStudents.length} students</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          <Icons.Plus /> Create Subject
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="search-wrapper" style={{ flex: 1, minWidth: 200 }}>
          <Icons.Search />
          <input className="search-input" placeholder="Search subject, code, faculty..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input form-select" style={{ width: 200 }}
          value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Subject Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card"><div className="skeleton" style={{ height: 120 }} /></div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1' }}>
            <div className="empty-state">
              <div className="empty-icon"><Icons.BookOpen /></div>
              <div className="empty-title">No subjects yet</div>
              <div className="empty-desc">Create your first subject and assign faculty and students to it.</div>
            </div>
          </div>
        ) : filtered.map(s => (
          <div key={s.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Top */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                  {s.code && `${s.code} · `}{s.department || 'No dept'}{s.semester && ` · Sem ${s.semester}`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <span className="badge badge-accent">{s.studentCount || 0} students</span>
              </div>
            </div>

            {/* Faculty */}
            <div style={{ fontSize: 13, color: s.facultyName ? 'var(--text-secondary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icons.User />
              {s.facultyName || <span style={{ fontStyle: 'italic' }}>No faculty assigned</span>}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}
                onClick={() => setDetail(s)}>
                <Icons.Eye /> View
              </button>
              <button className="btn btn-secondary btn-sm"
                onClick={() => setEnroll(s)} title="Manage students">
                <Icons.Users />
              </button>
              <button className="btn btn-secondary btn-sm"
                onClick={() => setEditing(s)} title="Edit subject">
                <Icons.Edit />
              </button>
              <button className="btn btn-danger btn-sm"
                onClick={() => handleDelete(s.id)} title="Delete subject">
                <Icons.Trash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
