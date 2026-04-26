import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [students, setStudents] = useState([]);

  useEffect(() => {
    Promise.allSettled([api.getAllAssignments(), api.getStudents()]).then(([a, s]) => {
      const allStudents = s.status === 'fulfilled' ? (s.value || []) : [];
      const studentIds = new Set(allStudents.map(student => student.id));
      
      let allAsg = a.status === 'fulfilled' ? (a.value || []) : [];
      allAsg = allAsg.filter(asg => studentIds.has(asg.studentId));
      
      setAssignments(allAsg);
      setStudents(allStudents);
      setLoading(false);
    });
  }, []);

  const filtered = assignments.filter(a => {
    const q = search.toLowerCase();
    return !q || a.title?.toLowerCase().includes(q) || a.studentName?.toLowerCase().includes(q) || a.subject?.toLowerCase().includes(q);
  });

  const statusCounts = {
    submitted: assignments.filter(a => a.status === 'SUBMITTED' || a.status === 'submitted').length,
    pending: assignments.filter(a => a.status === 'PENDING' || a.status === 'pending').length,
    graded: assignments.filter(a => a.status === 'GRADED' || a.status === 'graded').length,
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'SUBMITTED') return <span className="badge badge-success">Submitted</span>;
    if (s === 'GRADED') return <span className="badge badge-cyan">Graded</span>;
    if (s === 'LATE') return <span className="badge badge-warning">Late</span>;
    return <span className="badge badge-accent">Pending</span>;
  };

  return (
    <Layout title="Assignments">
      <div className="grid-3 mb-6">
        {[
          { label: 'Submitted', value: statusCounts.submitted, color: 'var(--success)' },
          { label: 'Pending', value: statusCounts.pending, color: 'var(--warning)' },
          { label: 'Graded', value: statusCounts.graded, color: 'var(--accent-2)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="section-header mb-4">
        <div className="section-title">All Assignments</div>
        <div className="search-wrapper">
          <Icons.Search />
          <input className="search-input" placeholder="Search assignments..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
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
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div className="empty-icon"><Icons.FileText /></div>
                  <div className="empty-title">No assignments</div>
                  <div className="empty-desc">Students can upload assignments from their portal</div>
                </div>
              </td></tr>
            ) : filtered.map((a, i) => (
              <tr key={a.id || a._id || i}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: 'var(--accent)' }}><Icons.FileText /></span>
                    </div>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{a.title || 'Untitled'}</span>
                  </div>
                </td>
                <td>{a.studentName || '—'}</td>
                <td>{a.subject || '—'}</td>
                <td style={{ fontSize: 12 }}>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'}</td>
                <td style={{ fontSize: 12 }}>{a.submittedAt ? new Date(a.submittedAt).toLocaleDateString() : '—'}</td>
                <td>{getStatusBadge(a.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
