import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [students, setStudents] = useState([]);

  useEffect(() => {
    Promise.allSettled([api.getAllAttendance(), api.getStudents()]).then(([a, s]) => {
      const allStudents = s.status === 'fulfilled' ? (s.value || []) : [];
      const studentIds = new Set(allStudents.map(student => student.id));
      
      let allAtt = a.status === 'fulfilled' ? (a.value || []) : [];
      allAtt = allAtt.filter(att => studentIds.has(att.studentId));
      
      setAttendance(allAtt);
      setStudents(allStudents);
      setLoading(false);
    });
  }, []);

  const filtered = attendance.filter(a => {
    const q = search.toLowerCase();
    return !q || a.studentName?.toLowerCase().includes(q) || a.subject?.toLowerCase().includes(q);
  });

  const getColor = (pct) => {
    if (pct >= 75) return 'var(--success)';
    if (pct >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const avg = attendance.length ? Math.round(attendance.reduce((s, a) => s + (a.percentage || 0), 0) / attendance.length) : 0;
  const critical = attendance.filter(a => (a.percentage || 0) < 75).length;

  return (
    <Layout title="Attendance Overview">
      <div className="grid-3 mb-6">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--accent)' }}>{avg}%</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase' }}>Campus Average</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--success)' }}>{attendance.filter(a => (a.percentage || 0) >= 75).length}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase' }}>Above 75%</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--danger)' }}>{critical}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase' }}>Below 75% (At Risk)</div>
        </div>
      </div>

      <div className="section-header mb-4">
        <div className="section-title">Attendance Records</div>
        <div className="search-wrapper">
          <Icons.Search />
          <input className="search-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Subject</th>
              <th>Classes Attended</th>
              <th>Total Classes</th>
              <th>Attendance %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6}>
                <div className="empty-state">
                  <div className="empty-icon"><Icons.Calendar /></div>
                  <div className="empty-title">No attendance records</div>
                  <div className="empty-desc">Faculty can mark attendance from their dashboard</div>
                </div>
              </td></tr>
            ) : filtered.map((a, i) => {
              const pct = a.percentage || 0;
              const color = getColor(pct);
              return (
                <tr key={a.id || a._id || i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        {a.studentName?.slice(0, 2).toUpperCase() || 'ST'}
                      </div>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{a.studentName || 'Student'}</span>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-primary)' }}>{a.subject || '—'}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.classesAttended ?? '—'}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{a.totalClasses ?? '—'}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span style={{ fontWeight: 700, color, fontSize: 14, minWidth: 42 }}>{pct}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${pct >= 75 ? 'badge-success' : pct >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                      {pct >= 75 ? 'Good' : pct >= 60 ? 'Warning' : 'Critical'}
                    </span>
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
