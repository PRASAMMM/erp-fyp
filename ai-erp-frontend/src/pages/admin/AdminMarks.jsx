import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';

export default function AdminMarks() {
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');

  useEffect(() => {
    Promise.allSettled([api.getAllMarks(), api.getStudents()]).then(([m, s]) => {
      const allStudents = s.status === 'fulfilled' ? (s.value || []) : [];
      const studentIds = new Set(allStudents.map(student => student.id));
      
      let allMarks = m.status === 'fulfilled' ? (m.value || []) : [];
      // Filter out orphaned records belonging to deleted students
      allMarks = allMarks.filter(mark => studentIds.has(mark.studentId));

      setMarks(allMarks);
      setStudents(allStudents);
      setLoading(false);
    });
  }, []);

  const subjects = [...new Set(marks.map(m => m.subject).filter(Boolean))];

  const filtered = marks.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.studentName?.toLowerCase().includes(q) || m.subject?.toLowerCase().includes(q);
    const matchSubject = !subjectFilter || m.subject === subjectFilter;
    return matchSearch && matchSubject;
  });

  const getGrade = (marks) => {
    if (marks >= 90) return { grade: 'A+', color: 'var(--success)' };
    if (marks >= 80) return { grade: 'A', color: 'var(--success)' };
    if (marks >= 70) return { grade: 'B', color: 'var(--accent-2)' };
    if (marks >= 60) return { grade: 'C', color: 'var(--accent)' };
    if (marks >= 50) return { grade: 'D', color: 'var(--warning)' };
    return { grade: 'F', color: 'var(--danger)' };
  };

  const avg = marks.length ? Math.round(marks.reduce((s, m) => s + (m.marksObtained || 0), 0) / marks.length) : 0;
  const highest = marks.length ? Math.max(...marks.map(m => m.marksObtained || 0)) : 0;
  const lowest = marks.length ? Math.min(...marks.map(m => m.marksObtained || 0)) : 0;
  const passRate = marks.length ? Math.round(marks.filter(m => (m.marksObtained || 0) >= 50).length / marks.length * 100) : 0;

  return (
    <Layout title="Marks Overview">
      {/* Summary Cards */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Average Score', value: avg, color: 'var(--accent)' },
          { label: 'Highest Score', value: highest, color: 'var(--success)' },
          { label: 'Lowest Score', value: lowest, color: 'var(--danger)' },
          { label: 'Pass Rate', value: `${passRate}%`, color: 'var(--warning)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color }}>{value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="section-header mb-4">
        <div>
          <div className="section-title">All Marks Records</div>
          <div className="section-subtitle">{marks.length} records across all subjects</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="search-wrapper">
          <Icons.Search />
          <input className="search-input" placeholder="Search by student or subject..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-input form-select" style={{ width: 200 }} value={subjectFilter}
          onChange={e => setSubjectFilter(e.target.value)}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Subject</th>
                <th>Exam Type</th>
                <th>Score</th>
                <th>Out of</th>
                <th>Grade</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-icon"><Icons.Award /></div>
                    <div className="empty-title">No marks records</div>
                    <div className="empty-desc">Faculty can assign marks from their dashboard</div>
                  </div>
                </td></tr>
              ) : filtered.map((m, i) => {
                const { grade, color } = getGrade(m.marksObtained || 0);
                const pct = Math.round(((m.marksObtained || 0) / (m.totalMarks || 100)) * 100);
                return (
                  <tr key={m.id || m._id || i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                          {m.studentName?.slice(0, 2).toUpperCase() || 'ST'}
                        </div>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{m.studentName || 'Student'}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{m.subject || '—'}</td>
                    <td><span className="badge badge-accent">{m.examType || 'Internal'}</span></td>
                    <td style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color }}>{m.marksObtained ?? '—'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{m.totalMarks || 100}</td>
                    <td><span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color, fontSize: 16 }}>{grade}</span></td>
                    <td style={{ width: 120 }}>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{pct}%</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
