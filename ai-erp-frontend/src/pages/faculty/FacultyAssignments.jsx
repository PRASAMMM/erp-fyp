import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';

const SUBJECTS = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English', 'Biology', 'History', 'Economics'];

export default function FacultyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    api.getAllAssignments().then(d => setAssignments(d || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const filtered = assignments.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.title?.toLowerCase().includes(q) || a.studentName?.toLowerCase().includes(q);
    const matchStatus = !statusFilter || (a.status || '').toUpperCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleGrade = async (id) => {
    try {
      await api.updateAssignment(id, { status: 'GRADED' });
      const updated = await api.getAllAssignments();
      setAssignments(updated || []);
    } catch (err) { alert(err.message); }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    if (s === 'SUBMITTED') return <span className="badge badge-success">Submitted</span>;
    if (s === 'GRADED') return <span className="badge badge-cyan">Graded</span>;
    if (s === 'LATE') return <span className="badge badge-warning">Late</span>;
    return <span className="badge badge-accent">Pending</span>;
  };

  const counts = {
    all: assignments.length,
    submitted: assignments.filter(a => (a.status || '').toUpperCase() === 'SUBMITTED').length,
    pending: assignments.filter(a => !a.status || a.status.toUpperCase() === 'PENDING').length,
    graded: assignments.filter(a => (a.status || '').toUpperCase() === 'GRADED').length,
  };

  return (
    <Layout title="Assignments">
      <div className="grid-4 mb-6">
        {[
          { label: 'Total', value: counts.all, color: 'var(--accent)' },
          { label: 'Submitted', value: counts.submitted, color: 'var(--success)' },
          { label: 'Pending', value: counts.pending, color: 'var(--warning)' },
          { label: 'Graded', value: counts.graded, color: 'var(--accent-2)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="section-header mb-4">
        <div>
          <div className="section-title">Assignment Submissions</div>
          <div className="section-subtitle">Review and grade student submissions</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="search-wrapper">
          <Icons.Search />
          <input className="search-input" placeholder="Search assignments..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input form-select" style={{ width: 180 }} value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="PENDING">Pending</option>
          <option value="GRADED">Graded</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Assignment</th>
              <th>Student</th>
              <th>Subject</th>
              <th>Due Date</th>
              <th>Submitted At</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7}>
                <div className="empty-state">
                  <div className="empty-icon"><Icons.FileText /></div>
                  <div className="empty-title">No assignments found</div>
                  <div className="empty-desc">Students upload assignments from their portal</div>
                </div>
              </td></tr>
            ) : filtered.map((a, i) => (
              <tr key={a.id || a._id || i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'var(--accent)' }}><Icons.FileText /></span>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>{a.title || 'Untitled'}</div>
                      {a.description && <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.description?.slice(0, 40)}...</div>}
                    </div>
                  </div>
                </td>
                <td style={{ fontWeight: 500 }}>{a.studentName || '—'}</td>
                <td>{a.subject || '—'}</td>
                <td style={{ fontSize: 12 }}>{a.dueDate ? new Date(a.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                <td style={{ fontSize: 12 }}>{a.submittedAt ? new Date(a.submittedAt).toLocaleDateString('en-IN') : '—'}</td>
                <td>{getStatusBadge(a.status)}</td>
                <td>
                  {(a.status || '').toUpperCase() === 'SUBMITTED' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleGrade(a.id || a._id)}>
                      <Icons.Check /> Grade
                    </button>
                  )}
                  {(a.status || '').toUpperCase() === 'GRADED' && (
                    <span style={{ fontSize: 12, color: 'var(--success)' }}>✓ Graded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
