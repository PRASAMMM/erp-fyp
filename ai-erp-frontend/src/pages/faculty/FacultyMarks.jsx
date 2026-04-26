import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const EXAM_TYPES = ['Internal 1', 'Internal 2', 'Mid-Semester', 'End-Semester', 'Practical', 'Assignment', 'Quiz'];

// ── Assign Marks Modal ────────────────────────────────────────────────────────
function AssignMarksModal({ onClose, onSuccess, subjects }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [form, setForm] = useState({
    studentId: '', studentName: '', subjectId: '', subject: '',
    examType: 'Internal 1', marksObtained: '', totalMarks: 100, remarks: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubjectChange = (subjectId) => {
    const s = subjects.find(s => s.id === subjectId);
    setSelectedSubject(s || null);
    setForm(f => ({ ...f, subjectId, subject: s?.name || '', studentId: '', studentName: '' }));
  };

  const handleStudentChange = (id) => {
    const s = selectedSubject?.students?.find(s => (s.id || s._id) === id);
    setForm(f => ({ ...f, studentId: id, studentName: s?.name || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subjectId)  { setError('Please select a subject'); return; }
    if (!form.studentId)  { setError('Please select a student'); return; }
    setLoading(true); setError('');
    try {
      await api.assignMarks(form);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to assign marks');
    } finally {
      setLoading(false);
    }
  };

  const pct = form.marksObtained && form.totalMarks
    ? Math.round((Number(form.marksObtained) / Number(form.totalMarks)) * 100) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Assign Marks</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Select a subject, then pick a student enrolled in it
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          {form.marksObtained && (
            <div style={{
              padding: 16, marginBottom: 16, textAlign: 'center', borderRadius: 'var(--radius)',
              background: pct >= 50 ? 'var(--success-soft)' : 'var(--danger-soft)',
              border: `1px solid ${pct >= 50 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: pct >= 50 ? 'var(--success)' : 'var(--danger)' }}>
                {pct}%
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                {pct >= 90 ? '🌟 Excellent' : pct >= 75 ? '✅ Good' : pct >= 50 ? '👍 Passing' : '❌ Fail'}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              {/* Step 1: Pick subject */}
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Subject *</label>
                <select className="form-input form-select" required value={form.subjectId}
                  onChange={e => handleSubjectChange(e.target.value)}>
                  <option value="">Select your subject...</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}{s.code ? ` (${s.code})` : ''} — {s.studentCount || 0} students
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Pick student from that subject */}
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Student *</label>
                <select className="form-input form-select" required value={form.studentId}
                  onChange={e => handleStudentChange(e.target.value)}
                  disabled={!selectedSubject}>
                  <option value="">
                    {selectedSubject
                      ? selectedSubject.students?.length
                        ? 'Choose a student...'
                        : 'No students enrolled in this subject'
                      : 'Select a subject first'}
                  </option>
                  {selectedSubject?.students?.map(s => (
                    <option key={s.id || s._id} value={s.id || s._id}>
                      {s.name} — {s.registrationNumber || s.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Exam Type *</label>
                <select className="form-input form-select" required value={form.examType}
                  onChange={e => setForm(f => ({ ...f, examType: e.target.value }))}>
                  {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Total Marks</label>
                <input className="form-input" type="number" min={1} value={form.totalMarks}
                  onChange={e => setForm(f => ({ ...f, totalMarks: e.target.value }))} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Marks Obtained *</label>
                <input className="form-input" type="number" required min={0} max={form.totalMarks}
                  placeholder="e.g. 85" value={form.marksObtained}
                  onChange={e => setForm(f => ({ ...f, marksObtained: e.target.value }))} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Remarks (optional)</label>
                <input className="form-input" placeholder="e.g. Excellent performance" value={form.remarks}
                  onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : <><Icons.Check /> Save Marks</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Edit Marks Modal ──────────────────────────────────────────────────────────
function EditMarksModal({ mark, onClose, onSuccess }) {
  const [form, setForm] = useState({
    marksObtained: mark.marksObtained,
    totalMarks:    mark.totalMarks || 100,
    remarks:       mark.remarks || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateMarks(mark.id || mark._id, form);
      onSuccess(); onClose();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">Edit Marks</div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          <div style={{ marginBottom: 16, padding: 12, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {mark.studentName} · {mark.subject} · {mark.examType}
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Marks Obtained</label>
              <input className="form-input" type="number" required value={form.marksObtained}
                onChange={e => setForm(f => ({ ...f, marksObtained: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Total Marks</label>
              <input className="form-input" type="number" value={form.totalMarks}
                onChange={e => setForm(f => ({ ...f, totalMarks: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Remarks</label>
              <input className="form-input" placeholder="Optional" value={form.remarks}
                onChange={e => setForm(f => ({ ...f, remarks: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Update Marks'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FacultyMarks() {
  const { user } = useAuth();
  const [subjects, setSubjects]         = useState([]);
  const [marks, setMarks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [showAssign, setShowAssign]     = useState(false);
  const [editMark, setEditMark]         = useState(null);
  const [search, setSearch]             = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const userId = user?.id || user?._id;
    const [subRes, marksRes] = await Promise.allSettled([
      api.getMySubjects(userId, 'FACULTY'),
      api.getAllMarks(),
    ]);
    const mySubjects = subRes.status === 'fulfilled' ? (subRes.value || []) : [];
    setSubjects(mySubjects);

    // Only show marks that belong to subjects this faculty teaches
    if (marksRes.status === 'fulfilled') {
      const mySubjectIds = new Set(mySubjects.map(s => s.id));
      const mySubjectNames = new Set(mySubjects.map(s => s.name));
      const all = marksRes.value || [];
      // Filter by subjectId if set, otherwise fall back to subject name match
      const filtered = all.filter(m =>
        (m.subjectId && mySubjectIds.has(m.subjectId)) ||
        (!m.subjectId && mySubjectNames.has(m.subject))
      );
      setMarks(filtered);
    }
    setLoading(false);
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const filtered = marks.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.studentName?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q);
    const matchSubject = !subjectFilter || m.subjectId === subjectFilter || m.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this marks record?')) return;
    try { await api.deleteMarks(id); fetchData(); }
    catch (err) { alert(err.message); }
  };

  const getGradeInfo = (obtained, total) => {
    const pct = (obtained / (total || 100)) * 100;
    if (pct >= 90) return { grade: 'A+', color: 'var(--success)' };
    if (pct >= 80) return { grade: 'A',  color: 'var(--success)' };
    if (pct >= 70) return { grade: 'B',  color: 'var(--accent-2)' };
    if (pct >= 60) return { grade: 'C',  color: 'var(--warning)' };
    if (pct >= 50) return { grade: 'D',  color: 'var(--warning)' };
    return { grade: 'F', color: 'var(--danger)' };
  };

  return (
    <Layout title="Marks Management">
      {showAssign && (
        <AssignMarksModal subjects={subjects} onClose={() => setShowAssign(false)} onSuccess={fetchData} />
      )}
      {editMark && (
        <EditMarksModal mark={editMark} onClose={() => setEditMark(null)} onSuccess={fetchData} />
      )}

      <div className="section-header mb-6">
        <div>
          <div className="section-title">Marks Management</div>
          <div className="section-subtitle">{marks.length} records across {subjects.length} subjects</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAssign(true)}>
          <Icons.Plus /> Assign Marks
        </button>
      </div>

      {/* Subject quick-filter tabs */}
      {subjects.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${!subjectFilter ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubjectFilter('')}>
            All Subjects
          </button>
          {subjects.map(s => (
            <button key={s.id}
              className={`btn btn-sm ${subjectFilter === s.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSubjectFilter(s.id)}>
              {s.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="search-wrapper">
          <Icons.Search />
          <input className="search-input" placeholder="Search student or subject..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Exam Type</th>
              <th>Marks</th>
              <th>Grade</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}>
                <div className="empty-state">
                  <div className="empty-icon"><Icons.Award /></div>
                  <div className="empty-title">No marks yet</div>
                  <div className="empty-desc">
                    {subjects.length === 0
                      ? 'You have no subjects assigned. Ask admin to assign you to a subject.'
                      : 'Click "Assign Marks" to record exam results.'}
                  </div>
                </div>
              </td></tr>
            ) : filtered.map(m => {
              const { grade, color } = getGradeInfo(m.marksObtained || 0, m.totalMarks || 100);
              const pct = Math.round(((m.marksObtained || 0) / (m.totalMarks || 100)) * 100);
              return (
                <tr key={m.id || m._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        {m.studentName?.slice(0, 2).toUpperCase() || 'ST'}
                      </div>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{m.studentName || '—'}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-primary)' }}>{m.subject}</td>
                  <td><span className="badge badge-accent">{m.examType}</span></td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color }}>
                      {m.marksObtained}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>/{m.totalMarks || 100}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>({pct}%)</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color }}>{grade}</span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 140 }}>
                    <div className="truncate">{m.remarks || '—'}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditMark(m)}><Icons.Edit /></button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id || m._id)}><Icons.Trash /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
