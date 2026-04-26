// StudentMarks.jsx
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';

export function StudentMarks() {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = user?.id || user?._id;
    if (id) api.getMarksByStudent(id).then(d => setMarks(d || [])).catch(console.error).finally(() => setLoading(false));
    else setLoading(false);
  }, [user]);

  const getGrade = (marks, total) => {
    const pct = (marks / total) * 100;
    if (pct >= 90) return { grade: 'A+', color: 'var(--success)' };
    if (pct >= 80) return { grade: 'A', color: 'var(--success)' };
    if (pct >= 70) return { grade: 'B', color: 'var(--accent-2)' };
    if (pct >= 60) return { grade: 'C', color: 'var(--accent)' };
    if (pct >= 50) return { grade: 'D', color: 'var(--warning)' };
    return { grade: 'F', color: 'var(--danger)' };
  };

  const avg = marks.length ? Math.round(marks.reduce((s, m) => s + (m.marksObtained || 0), 0) / marks.length) : 0;
  const highest = marks.length ? Math.max(...marks.map(m => m.marksObtained || 0)) : 0;
  const passed = marks.filter(m => (m.marksObtained || 0) >= 50).length;

  return (
    <Layout title="My Marks">
      <div className="grid-3 mb-6">
        {[
          { label: 'Average Score', value: avg, color: 'var(--accent)' },
          { label: 'Highest Score', value: highest, color: 'var(--success)' },
          { label: 'Subjects Passed', value: `${passed}/${marks.length}`, color: 'var(--accent-2)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr><th>Subject</th><th>Exam Type</th><th>Marks</th><th>Out of</th><th>Grade</th><th>Percentage</th><th>Remarks</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : marks.length === 0 ? (
              <tr><td colSpan={7}><div className="empty-state">
                <div className="empty-icon"><Icons.Award /></div>
                <div className="empty-title">No marks recorded yet</div>
                <div className="empty-desc">Your marks will appear here once your faculty assigns them</div>
              </div></td></tr>
            ) : marks.map((m, i) => {
              const total = m.totalMarks || 100;
              const { grade, color } = getGrade(m.marksObtained || 0, total);
              const pct = Math.round(((m.marksObtained || 0) / total) * 100);
              return (
                <tr key={m.id || m._id || i}>
                  <td style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{m.subject}</td>
                  <td><span className="badge badge-accent">{m.examType || 'Internal'}</span></td>
                  <td style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color }}>{m.marksObtained}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{total}</td>
                  <td><span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color }}>{grade}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ flex: 1, maxWidth: 80 }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color }}>{pct}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.remarks || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export function StudentAttendance() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = user?.id || user?._id;
    if (id) api.getAttendanceByStudent(id).then(d => setAttendance(d || [])).catch(console.error).finally(() => setLoading(false));
    else setLoading(false);
  }, [user]);

  const avg = attendance.length ? Math.round(attendance.reduce((s, a) => s + (a.percentage || 0), 0) / attendance.length) : 0;
  const critical = attendance.filter(a => (a.percentage || 0) < 75);

  return (
    <Layout title="My Attendance">
      {critical.length > 0 && (
        <div style={{ padding: '12px 16px', background: 'var(--danger-soft)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', marginBottom: 20, fontSize: 13.5 }}>
          <span style={{ color: 'var(--danger)', fontWeight: 600 }}>
            ⚠️ You have low attendance in {critical.length} subject(s). Minimum required: 75%
          </span>
        </div>
      )}

      <div className="grid-3 mb-6">
        {[
          { label: 'Overall Average', value: `${avg}%`, color: avg >= 75 ? 'var(--success)' : 'var(--danger)' },
          { label: 'Subjects OK', value: attendance.filter(a => (a.percentage || 0) >= 75).length, color: 'var(--success)' },
          { label: 'Subjects at Risk', value: critical.length, color: 'var(--danger)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading...</div>
          : attendance.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Icons.Calendar /></div>
              <div className="empty-title">No attendance records</div>
            </div>
          ) : attendance.map((a, i) => {
            const pct = a.percentage || 0;
            const color = pct >= 75 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)';
            return (
              <div key={i} className="card" style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icons.Calendar />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{a.subject}</span>
                        {a.date && <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--text-muted)' }}>{new Date(a.date).toLocaleDateString('en-IN')}</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{a.classesAttended}/{a.totalClasses} classes</span>
                        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color }}>{pct}%</span>
                        <span className={`badge ${pct >= 75 ? 'badge-success' : pct >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                          {pct >= 75 ? 'Good' : pct >= 60 ? 'Warning' : 'Critical'}
                        </span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </Layout>
  );
}

export function StudentAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', description: '', dueDate: '' });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Biology'];

  const fetchAssignments = () => {
    const id = user?.id || user?._id;
    if (id) api.getAssignmentsByStudent(id).then(d => setAssignments(d || [])).catch(console.error).finally(() => setLoading(false));
    else setLoading(false);
  };

  useEffect(() => { fetchAssignments(); }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true); setError('');
    try {
      await api.createAssignment({
        ...form,
        studentId: user?.id || user?._id,
        studentName: user?.name,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
      });
      setForm({ title: '', subject: '', description: '', dueDate: '' });
      setShowUpload(false);
      fetchAssignments();
    } catch (err) { setError(err.message || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'SUBMITTED').toUpperCase();
    if (s === 'SUBMITTED') return <span className="badge badge-success">✓ Submitted</span>;
    if (s === 'GRADED') return <span className="badge badge-cyan">★ Graded</span>;
    return <span className="badge badge-warning">Pending</span>;
  };

  return (
    <Layout title="Assignments">
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Upload Assignment</div>
              <button className="btn btn-ghost" style={{ padding: 8 }} onClick={() => setShowUpload(false)}><Icons.X /></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={handleUpload}>
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" required placeholder="Assignment title" value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select className="form-input form-select" required value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
                    <option value="">Select subject</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" rows={3} placeholder="Brief description..." value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    style={{ resize: 'vertical', fontFamily: 'var(--font-body)' }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input className="form-input" type="date" value={form.dueDate}
                    onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    <Icons.Upload /> {uploading ? 'Uploading...' : 'Submit Assignment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="section-header mb-6">
        <div>
          <div className="section-title">My Assignments</div>
          <div className="section-subtitle">{assignments.length} assignments submitted</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowUpload(true)}>
          <Icons.Upload /> Upload Assignment
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading...</div>
          : assignments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Icons.FileText /></div>
              <div className="empty-title">No assignments submitted</div>
              <div className="empty-desc">Upload your first assignment to get started</div>
            </div>
          ) : assignments.map((a, i) => (
            <div key={a.id || a._id || i} className="card" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'var(--accent)' }}><Icons.FileText /></span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{a.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {a.subject} · Submitted {a.submittedAt ? new Date(a.submittedAt).toLocaleDateString('en-IN') : 'today'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {a.dueDate && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>
                    Due: {new Date(a.dueDate).toLocaleDateString('en-IN')}
                  </div>
                )}
                {getStatusBadge(a.status)}
              </div>
            </div>
          ))}
      </div>
    </Layout>
  );
}

export function StudentPerformance() {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = user?.id || user?._id;
    if (!id) { setLoading(false); return; }
    Promise.allSettled([api.getMarksByStudent(id), api.getAttendanceByStudent(id)]).then(([m, a]) => {
      if (m.status === 'fulfilled') setMarks(m.value || []);
      if (a.status === 'fulfilled') setAttendance(a.value || []);
      setLoading(false);
    });
  }, [user]);

  const avgMarks = marks.length ? marks.reduce((s, m) => s + (m.marksObtained || 0), 0) / marks.length : 0;
  const avgAtt = attendance.length ? attendance.reduce((s, a) => s + (a.percentage || 0), 0) / attendance.length : 0;
  const cgpa = avgMarks >= 90 ? 10 : avgMarks >= 80 ? 9 : avgMarks >= 70 ? 8 : avgMarks >= 60 ? 7 : avgMarks >= 50 ? 6 : 5;
  const overall = Math.round((avgMarks + avgAtt) / 2);
  const rank = overall >= 85 ? 'Excellent' : overall >= 70 ? 'Good' : overall >= 55 ? 'Average' : 'Needs Improvement';
  const rankColor = overall >= 85 ? 'var(--success)' : overall >= 70 ? 'var(--accent-2)' : overall >= 55 ? 'var(--warning)' : 'var(--danger)';

  const subjectPerf = marks.map(m => ({
    subject: m.subject,
    marks: m.marksObtained || 0,
    total: m.totalMarks || 100,
    pct: Math.round(((m.marksObtained || 0) / (m.totalMarks || 100)) * 100),
  })).sort((a, b) => b.pct - a.pct);

  return (
    <Layout title="Performance Analytics">
      {/* Overview Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(34,211,238,0.06))',
        border: '1px solid rgba(99,102,241,0.15)', borderRadius: 'var(--radius-lg)',
        padding: '28px', marginBottom: 24, display: 'flex', gap: 32, alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 800, color: rankColor, lineHeight: 1 }}>{overall}%</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Overall Performance</div>
        </div>
        <div style={{ width: 1, height: 80, background: 'var(--border)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: rankColor, marginBottom: 4 }}>{rank}</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>
            CGPA: <strong style={{ color: 'var(--text-primary)' }}>{cgpa.toFixed(1)}</strong> ·
            Avg Marks: <strong style={{ color: 'var(--text-primary)' }}>{Math.round(avgMarks)}</strong> ·
            Avg Attendance: <strong style={{ color: avgAtt >= 75 ? 'var(--success)' : 'var(--danger)' }}>{Math.round(avgAtt)}%</strong>
          </div>
        </div>
      </div>

      <div className="grid-2 mb-6">
        {/* Subject Performance */}
        <div className="card">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Subject-wise Performance</div>
          {loading ? <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
            : subjectPerf.length === 0 ? <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>No marks data</div>
            : subjectPerf.map((s, i) => {
              const color = s.pct >= 75 ? 'var(--success)' : s.pct >= 50 ? 'var(--warning)' : 'var(--danger)';
              return (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{s.subject}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.marks}/{s.total}</span>
                      <span style={{ fontWeight: 700, color, fontSize: 14 }}>{s.pct}%</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${s.pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
        </div>

        {/* Attendance Analysis */}
        <div className="card">
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Attendance Analysis</div>
          {loading ? <div style={{ color: 'var(--text-muted)' }}>Loading...</div>
            : attendance.length === 0 ? <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>No attendance data</div>
            : attendance.map((a, i) => {
              const pct = a.percentage || 0;
              const color = pct >= 75 ? 'var(--success)' : pct >= 60 ? 'var(--warning)' : 'var(--danger)';
              return (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{a.subject}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.classesAttended}/{a.totalClasses}</span>
                      <span style={{ fontWeight: 700, color, fontSize: 14 }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  {pct < 75 && (
                    <div style={{ fontSize: 11, color: 'var(--danger)', marginTop: 3 }}>
                      Need {Math.ceil((0.75 * a.totalClasses - (a.classesAttended || 0)) / 0.25)} more classes to reach 75%
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="card">
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, marginBottom: 20 }}>Grade Distribution</div>
        <div className="grid-4">
          {[
            { grade: 'A+ / A', count: marks.filter(m => ((m.marksObtained || 0) / (m.totalMarks || 100)) >= 0.8).length, color: 'var(--success)' },
            { grade: 'B / C', count: marks.filter(m => { const p = ((m.marksObtained || 0) / (m.totalMarks || 100)); return p >= 0.5 && p < 0.8; }).length, color: 'var(--accent-2)' },
            { grade: 'D', count: marks.filter(m => { const p = ((m.marksObtained || 0) / (m.totalMarks || 100)); return p >= 0.4 && p < 0.5; }).length, color: 'var(--warning)' },
            { grade: 'F (Fail)', count: marks.filter(m => ((m.marksObtained || 0) / (m.totalMarks || 100)) < 0.4).length, color: 'var(--danger)' },
          ].map(({ grade, count, color }) => (
            <div key={grade} style={{ textAlign: 'center', padding: 20, background: 'var(--bg-primary)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color }}>{count}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{grade}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export function StudentProfile() {
  const { user, login } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true); setError(''); setSuccess('');
    try {
      const updated = await api.updateUser(user.id || user._id, form);
      login(updated, localStorage.getItem('token'));
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (err) { setError(err.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <Layout title="My Profile">
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {success && <div className="alert alert-success mb-4"><Icons.Check /> {success}</div>}
        {error && <div className="alert alert-error mb-4">{error}</div>}

        <div className="card mb-5">
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24 }}>
            <div className="avatar avatar-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {user?.name?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>{user?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>{user?.department} · {user?.className}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <span className="badge badge-accent">Student</span>
                <span className="badge badge-success">Active</span>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ marginLeft: 'auto' }} onClick={() => setEditing(e => !e)}>
              <Icons.Edit /> {editing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editing ? (
            <div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                ['Registration No.', user?.registrationNumber || '—'],
                ['Username', user?.username],
                ['Email', user?.email || '—'],
                ['Phone', user?.phone || '—'],
                ['Department', user?.department || '—'],
                ['Class / Year', user?.className || '—'],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: 14, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
