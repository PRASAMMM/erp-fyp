import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import AtRiskDashboard from '../../components/AtRiskDashboard';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const userId = user?.id || user?._id;
    Promise.allSettled([
      api.getMySubjects(userId, 'FACULTY'),
      api.getFacultyStudents(userId),
      api.getAllMarks(),
      api.getAllAttendance(),
      api.getAllAssignments(),
      api.getAnnouncements()
    ]).then(([subs, s, m, att, asgn, ann]) => {
      const mySubjects = subs.status === 'fulfilled' ? (subs.value || []) : [];
      const mySubjectIds = new Set(mySubjects.map(sub => sub.id));
      const mySubjectNames = new Set(mySubjects.map(sub => sub.name));

      if (s.status === 'fulfilled') setStudents(s.value || []);
      
      if (m.status === 'fulfilled') {
        const allMarks = m.value || [];
        setMarks(allMarks.filter(mark => 
          (mark.subjectId && mySubjectIds.has(mark.subjectId)) || 
          (!mark.subjectId && mySubjectNames.has(mark.subject))
        ));
      }

      if (att.status === 'fulfilled') {
        const allAtt = att.value || [];
        setAttendance(allAtt.filter(a => 
          (a.subjectId && mySubjectIds.has(a.subjectId)) || 
          (!a.subjectId && mySubjectNames.has(a.subject))
        ));
      }

      if (asgn.status === 'fulfilled') setAssignments(asgn.value || []);
      if (ann.status === 'fulfilled') setAnnouncements(ann.value || []);
      setLoading(false);
    });
  }, [user]);

  const pendingAssignments = assignments.filter(a => (a.status || '').toUpperCase() === 'SUBMITTED').length;
  const avgAttendance = attendance.length
    ? Math.round(attendance.reduce((s, a) => s + (a.percentage || 0), 0) / attendance.length) : 0;
  const avgMarks = marks.length
    ? Math.round(marks.reduce((s, m) => s + (m.marksObtained || 0), 0) / marks.length) : 0;

  return (
    <Layout title="Faculty Dashboard">
      {/* Welcome Banner */}
      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border)',
        borderLeft: '4px solid #6366f1',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: 'var(--text)' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {user?.department || 'Faculty'} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary btn-sm" onClick={() => window.location.href = '/faculty/marks'}>
            <Icons.Award /> Assign Marks
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => window.location.href = '/faculty/attendance'}>
            <Icons.Calendar /> Mark Attendance
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Total Students', value: loading ? '—' : students.length, icon: <Icons.GraduationCap />, color: '#6366f1' },
          { label: 'Avg Attendance', value: loading ? '—' : `${avgAttendance}%`, icon: <Icons.Calendar />, color: '#22d3ee' },
          { label: 'Avg Score', value: loading ? '—' : avgMarks, icon: <Icons.Award />, color: '#10b981' },
          { label: 'Pending Reviews', value: loading ? '—' : pendingAssignments, icon: <Icons.FileText />, color: '#f59e0b' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="stat-card">
            <div className="stat-icon" style={{ background: `${color}18` }}>
              <span style={{ color }}>{icon}</span>
            </div>
            <div className="stat-info">
              <div className="stat-value">{value}</div>
              <div className="stat-label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* At-Risk Dashboard */}
          <AtRiskDashboard enrolledStudents={students} facultyId={user?.id || user?._id} />

          {/* Recent Students */}
          <div className="card">
            <div className="section-header mb-4" style={{ paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: 15 }}>My Enrolled Students</div>
              <button className="btn btn-ghost btn-sm" onClick={() => window.location.href = '/faculty/students'}>View All →</button>
            </div>
            {loading ? (
              <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 24 }}>Loading...</div>
            ) : students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>No students found</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '8px 12px', fontWeight: 600 }}>Name</th>
                      <th style={{ padding: '8px 12px', fontWeight: 600 }}>Roll Number</th>
                      <th style={{ padding: '8px 12px', fontWeight: 600 }}>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 6).map(s => (
                      <tr key={s.id || s._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 500, color: 'var(--text)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 'bold' }}>
                              {s.name?.slice(0, 2).toUpperCase()}
                            </div>
                            {s.name}
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{s.registrationNumber || s.username}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className="badge badge-accent" style={{ fontSize: 11 }}>{s.className || s.department?.slice(0, 4) || '—'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Recent Marks + Announcements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              Recent Marks
            </div>
            {marks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 16, color: 'var(--text-muted)', fontSize: 13 }}>No marks assigned</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                <tbody>
                  {marks.slice(0, 5).map((m, i) => {
                    const total = m.totalMarks || 100;
                    const obtained = m.marksObtained || 0;
                    const isPassing = (obtained / total) >= 0.5;
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '10px 0' }}>
                          <div style={{ fontWeight: 500 }}>{m.studentName || 'Student'}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.subject}</div>
                        </td>
                        <td style={{ padding: '10px 0', textAlign: 'right' }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: isPassing ? 'var(--success)' : 'var(--danger)' }}>
                            {obtained}/{total}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="card">
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              Announcements
            </div>
            {announcements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 16, color: 'var(--text-muted)', fontSize: 13 }}>No announcements</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {announcements.slice(0, 4).map(a => (
                  <div key={a.id || a._id} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{a.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                      {a.content?.slice(0, 70)}{a.content?.length > 70 ? '...' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
