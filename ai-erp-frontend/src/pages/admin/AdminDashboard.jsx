import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';
import AtRiskDashboard from '../../components/AtRiskDashboard';

const StatCard = ({ icon, label, value, color, change }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: `${color}18` }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {change && <div className="stat-change">{change}</div>}
    </div>
  </div>
);

const MiniBar = ({ label, value, max, color }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{value}%</span>
    </div>
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
    </div>
  </div>
);

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, f, m, att, ann] = await Promise.allSettled([
          api.getStudents(), api.getFaculty(), api.getAllMarks(), api.getAllAttendance(), api.getAnnouncements()
        ]);
        if (s.status === 'fulfilled') setStudents(s.value || []);
        if (f.status === 'fulfilled') setFaculty(f.value || []);
        if (m.status === 'fulfilled') setMarks(m.value || []);
        if (att.status === 'fulfilled') setAttendance(att.value || []);
        if (ann.status === 'fulfilled') setAnnouncements(ann.value || []);
      } finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const avgAttendance = attendance.length
    ? Math.round(attendance.reduce((sum, a) => sum + (a.percentage || 0), 0) / attendance.length)
    : 0;

  const avgMarks = marks.length
    ? Math.round(marks.reduce((sum, m) => sum + (m.marksObtained || 0), 0) / marks.length)
    : 0;

  const recentStudents = students.slice(-5).reverse();

  return (
    <Layout title="Admin Dashboard">
      {/* Stats */}
      <div className="grid-4 mb-6">
        <StatCard icon={<Icons.GraduationCap />} label="Total Students" value={loading ? '...' : students.length} color="#6366f1" change="↑ 12% this semester" />
        <StatCard icon={<Icons.Users />} label="Faculty Members" value={loading ? '...' : faculty.length} color="#22d3ee" change="Active instructors" />
        <StatCard icon={<Icons.Calendar />} label="Avg Attendance" value={loading ? '...' : `${avgAttendance}%`} color="#10b981" change="Across all classes" />
        <StatCard icon={<Icons.Award />} label="Avg Score" value={loading ? '...' : `${avgMarks}`} color="#f59e0b" change="Out of 100" />
      </div>

      {/* Main Grid */}
      <div className="grid-2 mb-6" style={{ gridTemplateColumns: '1fr 340px' }}>
        {/* Recent Students */}
        <div className="card">
          <div className="section-header mb-4">
            <div>
              <div className="section-title" style={{ fontSize: 16 }}>Recent Enrollments</div>
              <div className="section-subtitle">Latest registered students</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => window.location.href = '/admin/students'}>
              View All
            </button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Reg. No</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>Loading...</td></tr>
                ) : recentStudents.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>No students yet</td></tr>
                ) : recentStudents.map(s => (
                  <tr key={s.id || s._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                          {s.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{s.name}</span>
                      </div>
                    </td>
                    <td><span style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.registrationNumber || s.username}</span></td>
                    <td>{s.department || s.className || '—'}</td>
                    <td><span className="badge badge-success"><span className="dot dot-green" style={{ width: 6, height: 6 }} />Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Performance */}
        <div className="card">
          <div className="section-title" style={{ fontSize: 16, marginBottom: 20 }}>Department Performance</div>
          <MiniBar label="Computer Science" value={87} max={100} color="var(--accent)" />
          <MiniBar label="Mathematics" value={74} max={100} color="var(--accent-2)" />
          <MiniBar label="Physics" value={68} max={100} color="var(--warning)" />
          <MiniBar label="Chemistry" value={81} max={100} color="var(--success)" />
          <MiniBar label="Biology" value={79} max={100} color="#8b5cf6" />

          <div className="divider" />

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: 16, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--success)' }}>{marks.filter(m => (m.marksObtained || 0) >= 75).length}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>DISTINCTION</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: 16, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--warning)' }}>{marks.filter(m => (m.marksObtained || 0) >= 50 && (m.marksObtained || 0) < 75).length}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>PASSING</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: 16, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: 'var(--danger)' }}>{marks.filter(m => (m.marksObtained || 0) < 50).length}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>AT RISK</div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements + Quick Actions */}
      <div className="grid-2">
        <div className="card">
          <div className="section-header mb-4">
            <div>
              <div className="section-title" style={{ fontSize: 16 }}>Recent Announcements</div>
              <div className="section-subtitle">Campus-wide communications</div>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => window.location.href = '/admin/announcements'}>
              Manage
            </button>
          </div>
          {announcements.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Icons.Megaphone /></div>
              <div className="empty-title">No announcements</div>
              <div className="empty-desc">Post your first announcement</div>
            </div>
          ) : announcements.slice(0, 4).map(a => (
            <div key={a.id || a._id} style={{
              padding: '14px 0', borderBottom: '1px solid var(--border)',
              display: 'flex', gap: 12,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'var(--accent)', fontSize: 14 }}><Icons.Megaphone /></span>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5, marginBottom: 3 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.content?.slice(0, 80)}...</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="section-title" style={{ fontSize: 16, marginBottom: 20 }}>Quick Actions</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { label: 'Add Student', icon: <Icons.GraduationCap />, path: '/admin/students', color: 'var(--accent)' },
              { label: 'Add Faculty', icon: <Icons.Users />, path: '/admin/faculty', color: 'var(--accent-2)' },
              { label: 'Post Announcement', icon: <Icons.Megaphone />, path: '/admin/announcements', color: 'var(--warning)' },
              { label: 'View Reports', icon: <Icons.BarChart />, path: '/admin/marks', color: 'var(--success)' },
            ].map(({ label, icon, path, color }) => (
              <button
                key={label}
                className="btn btn-secondary"
                style={{ flexDirection: 'column', gap: 10, padding: '20px 16px', height: 'auto', borderRadius: 'var(--radius)' }}
                onClick={() => window.location.href = path}
              >
                <span style={{ color, fontSize: 24 }}>{icon}</span>
                <span style={{ fontSize: 13 }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* At-Risk Dashboard */}
      <AtRiskDashboard />
    </Layout>
  );
}
