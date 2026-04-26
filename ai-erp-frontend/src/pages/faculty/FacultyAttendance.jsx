import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// ── Mark Attendance Modal ─────────────────────────────────────────────────────
function MarkAttendanceModal({ onClose, onSuccess, subjects }) {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [form, setForm] = useState({
    studentId: '', studentName: '', subjectId: '', subject: '',
    classesAttended: '', totalClasses: '', percentage: '',
    date: new Date().toISOString().split('T')[0],
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

  const calcPct = (attended, total) => {
    if (!attended || !total) return '';
    return Math.round((Number(attended) / Number(total)) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.subjectId) { setError('Please select a subject'); return; }
    if (!form.studentId) { setError('Please select a student'); return; }
    setLoading(true); setError('');
    try {
      await api.markAttendance(form);
      onSuccess(); onClose();
    } catch (err) {
      setError(err.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const pct = Number(form.percentage) || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Mark Attendance</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              Select a subject, then pick a student enrolled in it
            </div>
          </div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          {error && <div className="alert alert-error">{error}</div>}

          {pct > 0 && (
            <div style={{
              padding: 16, marginBottom: 16, textAlign: 'center', borderRadius: 'var(--radius)',
              background: pct >= 75 ? 'var(--success-soft)' : pct >= 60 ? 'var(--warning-soft)' : 'var(--danger-soft)',
              border: `1px solid ${pct >= 75 ? 'rgba(16,185,129,0.2)' : pct >= 60 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: pct >= 75 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)' }}>
                {pct}%
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                {pct >= 75 ? '✅ Good Standing' : pct >= 60 ? '⚠️ Warning — Below 75%' : '🚨 Critical — Too Low'}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
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

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Student *</label>
                <select className="form-input form-select" required value={form.studentId}
                  onChange={e => handleStudentChange(e.target.value)}
                  disabled={!selectedSubject}>
                  <option value="">
                    {selectedSubject
                      ? selectedSubject.students?.length ? 'Choose a student...' : 'No students enrolled'
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
                <label className="form-label">Classes Attended *</label>
                <input className="form-input" type="number" required min={0} placeholder="e.g. 38"
                  value={form.classesAttended}
                  onChange={e => {
                    const pct = calcPct(e.target.value, form.totalClasses);
                    setForm(f => ({ ...f, classesAttended: e.target.value, percentage: pct }));
                  }} />
              </div>
              <div className="form-group">
                <label className="form-label">Total Classes *</label>
                <input className="form-input" type="number" required min={1} placeholder="e.g. 45"
                  value={form.totalClasses}
                  onChange={e => {
                    const pct = calcPct(form.classesAttended, e.target.value);
                    setForm(f => ({ ...f, totalClasses: e.target.value, percentage: pct }));
                  }} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Date</label>
                <input className="form-input" type="date" value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : <><Icons.Check /> Save Attendance</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function FacultyAttendance() {
  const { user } = useAuth();
  const [subjects, setSubjects]           = useState([]);
  const [attendance, setAttendance]       = useState([]);
  const [loading, setLoading]             = useState(true);
  const [showMark, setShowMark]           = useState(false);
  const [search, setSearch]               = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const userId = user?.id || user?._id;
    const [subRes, attRes] = await Promise.allSettled([
      api.getMySubjects(userId, 'FACULTY'),
      api.getAllAttendance(),
    ]);
    const mySubjects = subRes.status === 'fulfilled' ? (subRes.value || []) : [];
    setSubjects(mySubjects);

    if (attRes.status === 'fulfilled') {
      const mySubjectIds   = new Set(mySubjects.map(s => s.id));
      const mySubjectNames = new Set(mySubjects.map(s => s.name));
      const all = attRes.value || [];
      setAttendance(all.filter(a =>
        (a.subjectId && mySubjectIds.has(a.subjectId)) ||
        (!a.subjectId && mySubjectNames.has(a.subject))
      ));
    }
    setLoading(false);
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const filtered = attendance.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.studentName?.toLowerCase().includes(q) || a.subject?.toLowerCase().includes(q);
    const matchSubject = !subjectFilter || a.subjectId === subjectFilter || a.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this attendance record?')) return;
    try { await api.deleteAttendance(id); fetchData(); }
    catch (err) { alert(err.message); }
  };

  const getPctColor = (pct) =>
    pct >= 75 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)';

  return (
    <Layout title="Attendance">
      {showMark && (
        <MarkAttendanceModal subjects={subjects} onClose={() => setShowMark(false)} onSuccess={fetchData} />
      )}

      <div className="section-header mb-6">
        <div>
          <div className="section-title">Attendance</div>
          <div className="section-subtitle">{attendance.length} records across {subjects.length} subjects</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowMark(true)}>
          <Icons.Plus /> Mark Attendance
        </button>
      </div>

      {/* Subject tabs */}
      {subjects.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          <button className={`btn btn-sm ${!subjectFilter ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSubjectFilter('')}>All</button>
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
              <th>Attended / Total</th>
              <th>Percentage</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}>
                <div className="empty-state">
                  <div className="empty-icon"><Icons.Calendar /></div>
                  <div className="empty-title">No attendance records</div>
                  <div className="empty-desc">
                    {subjects.length === 0
                      ? 'You have no subjects assigned. Ask admin to assign you to a subject.'
                      : 'Click "Mark Attendance" to get started.'}
                  </div>
                </div>
              </td></tr>
            ) : filtered.map(a => {
              const pct = a.percentage ?? 0;
              const color = getPctColor(pct);
              return (
                <tr key={a.id || a._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        {a.studentName?.slice(0, 2).toUpperCase() || 'ST'}
                      </div>
                      <span style={{ fontWeight: 500 }}>{a.studentName || '—'}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-primary)' }}>{a.subject || '—'}</td>
                  <td style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>
                    {a.classesAttended} / {a.totalClasses}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 6, background: 'var(--bg-primary)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                        <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.5s' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color, fontSize: 14, minWidth: 42 }}>
                        {pct}%
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${pct >= 75 ? 'badge-success' : pct >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                      {pct >= 75 ? 'Good' : pct >= 60 ? 'Warning' : 'Critical'}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.date || '—'}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id || a._id)}>
                      <Icons.Trash />
                    </button>
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
