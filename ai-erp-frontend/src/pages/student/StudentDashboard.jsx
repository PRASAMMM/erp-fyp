import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import Layout from '../../components/Layout';
import StudentTimetable   from '../../components/StudentTimetable';
import AIRecommendations  from '../../components/AIRecommendations';
import MLPredictionCard from '../../components/MLPredictionCard';

// ─── Icons ───────────────────────────────────────────────────────────────────

const GraduationIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const ChartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);
const BellIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--bg-card)', borderRadius: 14,
      border: '1px solid var(--border)', padding: '20px 22px',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, flexShrink: 0,
        background: color + '22',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: color, marginTop: 2, fontWeight: 600 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentDashboard() {
  const { user } = useAuth();
  const [marks, setMarks]             = useState([]);
  const [attendance, setAttendance]   = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading]         = useState(true);

  const firstName = user?.name?.split(' ')[0] || 'Student';

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [m, a, asgn, ann] = await Promise.allSettled([
          api.getStudentMarks(user?.id || user?._id),
          api.getStudentAttendance(user?.id || user?._id),
          api.getStudentAssignments(user?.id || user?._id),
          api.getAnnouncements(),
        ]);
        if (m.status === 'fulfilled')    setMarks(m.value || []);
        if (a.status === 'fulfilled')    setAttendance(a.value || []);
        if (asgn.status === 'fulfilled') setAssignments(asgn.value || []);
        if (ann.status === 'fulfilled')  setAnnouncements(ann.value || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  // Computed stats
  const avgMarks = marks.length > 0
    ? (marks.reduce((sum, m) => {
        const pct = m.totalMarks > 0 ? (m.marksObtained / m.totalMarks) * 100 : 0;
        return sum + pct;
      }, 0) / marks.length).toFixed(1)
    : '—';

  const avgAttendance = attendance.length > 0
    ? (attendance.reduce((s, a) => s + (a.percentage || 0), 0) / attendance.length).toFixed(0)
    : '—';

  const pendingCount = assignments.filter(a =>
    !a.status || a.status.toLowerCase() === 'pending'
  ).length;

  const lowAttendance = attendance.filter(a => a.percentage != null && a.percentage < 75);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <Layout>
      <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Welcome banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(99,102,241,0.08) 100%)',
          borderRadius: 16, border: '1px solid var(--border)',
          padding: '24px 28px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800 }}>
              {greeting}, {firstName} 👋
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            {lowAttendance.length > 0 && (
              <div style={{ marginTop: 10, padding: '6px 14px', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: 8, fontSize: 12, color: '#f43f5e', display: 'inline-block' }}>
                ⚠️ {lowAttendance.length} subject{lowAttendance.length > 1 ? 's' : ''} below 75% attendance
              </div>
            )}
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
          <StatCard icon={<GraduationIcon />} label="Avg Score"     value={avgMarks !== '—' ? avgMarks + '%' : '—'} color="#6366f1" />
          <StatCard icon={<CalendarIcon />}   label="Avg Attendance" value={avgAttendance !== '—' ? avgAttendance + '%' : '—'} color="#22d3ee"
            sub={avgAttendance !== '—' && Number(avgAttendance) < 75 ? '⚠ Below minimum' : null} />
          <StatCard icon={<ChartIcon />}      label="Pending Tasks"  value={pendingCount}  color="#f59e0b" />
          <StatCard icon={<BellIcon />}       label="Announcements"  value={announcements.length} color="#10b981" />
        </div>

        {/* ── Main grid: left column + right column ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, alignItems: 'start' }}>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Marks table */}
            {marks.length > 0 && (
              <div style={{ background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <GraduationIcon /> My Marks
                </div>
                <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {marks.map((m, i) => {
                    const pct = m.totalMarks > 0 ? (m.marksObtained / m.totalMarks) * 100 : 0;
                    const g   = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#f43f5e';
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1, fontSize: 13 }}>{m.subject}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 60, textAlign: 'right' }}>
                          {m.marksObtained}/{m.totalMarks}
                        </div>
                        <div style={{ width: 100, height: 6, background: 'var(--bg-primary)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: pct + '%', height: '100%', background: g, borderRadius: 3, transition: 'width 0.6s ease' }} />
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: g, minWidth: 28, textAlign: 'right' }}>
                          {pct.toFixed(0)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Attendance table */}
            {attendance.length > 0 && (
              <div style={{ background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CalendarIcon /> My Attendance
                </div>
                <div style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {attendance.map((a, i) => {
                    const pct = a.percentage || 0;
                    const g   = pct >= 75 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#f43f5e';
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1, fontSize: 13 }}>{a.subject}</div>
                        {pct < 75 && <span style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(244,63,94,0.15)', color: '#f43f5e', borderRadius: 6 }}>LOW</span>}
                        <div style={{ width: 100, height: 6, background: 'var(--bg-primary)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ width: Math.min(pct, 100) + '%', height: '100%', background: g, borderRadius: 3 }} />
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: g, minWidth: 34, textAlign: 'right' }}>
                          {pct.toFixed(0)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Timetable — full width inside left column */}
            <StudentTimetable />

          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            <MLPredictionCard studentId={user?.id || user?._id} />

            {/* AI Recommendations */}
            <AIRecommendations />

            {/* Announcements */}
            {announcements.length > 0 && (
              <div style={{ background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BellIcon /> Announcements
                </div>
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {announcements.slice(0, 5).map((a, i) => (
                    <div key={i} style={{ padding: '10px 12px', background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.5 }}>{a.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Assignments */}
            {assignments.filter(a => !a.status || a.status.toLowerCase() === 'pending').length > 0 && (
              <div style={{ background: 'var(--bg-card)', borderRadius: 14, border: '1px solid var(--border)', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookIcon /> Pending Assignments
                </div>
                <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {assignments
                    .filter(a => !a.status || a.status.toLowerCase() === 'pending')
                    .map((a, i) => (
                      <div key={i} style={{ padding: '10px 12px', background: 'rgba(245,158,11,0.08)', borderRadius: 8, border: '1px solid rgba(245,158,11,0.25)' }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                          {a.subject && <span>{a.subject} · </span>}
                          Due: {a.dueDate || 'N/A'}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
}
