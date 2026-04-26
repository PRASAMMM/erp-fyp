import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function StudentProfileModal({ student, marks, attendance, subjectName, onClose }) {
  const avgMarks = marks.length
    ? Math.round(marks.reduce((s, m) => s + (m.marksObtained || 0), 0) / marks.length) : 0;
  const avgAtt = attendance.length
    ? Math.round(attendance.reduce((s, a) => s + (a.percentage || 0), 0) / attendance.length) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">Student Profile</div>
            {subjectName && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                Enrolled in <strong>{subjectName}</strong>
              </div>
            )}
          </div>
          <button className="btn btn-ghost" style={{ padding: 8 }} onClick={onClose}><Icons.X /></button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', gap: 20, padding: 20, background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(34,211,238,0.05))', borderRadius: 'var(--radius)', marginBottom: 20 }}>
            <div className="avatar avatar-xl" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              {student.name?.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>{student.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>{student.email}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                <span className="badge badge-accent">{student.department || 'No Dept'}</span>
                <span className="badge badge-success">Active</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>{avgMarks}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Marks</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: avgAtt >= 75 ? 'var(--success)' : 'var(--danger)' }}>{avgAtt}%</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Attendance</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              ['Registration No.', student.registrationNumber || '—'],
              ['Username',         student.username],
              ['Phone',            student.phone || '—'],
              ['Email',            student.email || '—'],
            ].map(([label, value]) => (
              <div key={label} style={{ padding: 12, background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
              </div>
            ))}
          </div>

          {marks.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text-secondary)' }}>Recent Marks</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {marks.slice(0, 4).map(m => {
                  const pct = Math.round(((m.marksObtained || 0) / (m.totalMarks || 100)) * 100);
                  return (
                    <div key={m.id || m._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                      <span style={{ fontSize: 13 }}>{m.subject} · {m.examType}</span>
                      <span style={{ fontWeight: 600, fontSize: 13, color: pct >= 50 ? 'var(--success)' : 'var(--danger)' }}>
                        {m.marksObtained}/{m.totalMarks || 100} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FacultyStudents() {
  const { user } = useAuth();
  const [subjects, setSubjects]         = useState([]);
  const [allMarks, setAllMarks]         = useState([]);
  const [allAttendance, setAllAttendance] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selectedSubject, setSelected]  = useState(null);
  const [viewStudent, setViewStudent]   = useState(null);
  const [search, setSearch]             = useState('');

  const fetchData = async () => {
    setLoading(true);
    const userId = user?.id || user?._id;
    const [subRes, marksRes, attRes] = await Promise.allSettled([
      api.getMySubjects(userId, 'FACULTY'),
      api.getAllMarks(),
      api.getAllAttendance(),
    ]);
    const subs = subRes.status === 'fulfilled' ? (subRes.value || []) : [];
    setSubjects(subs);
    if (subs.length > 0 && !selectedSubject) setSelected(subs[0]);
    if (marksRes.status === 'fulfilled') setAllMarks(marksRes.value || []);
    if (attRes.status   === 'fulfilled') setAllAttendance(attRes.value || []);
    setLoading(false);
  };

  useEffect(() => { if (user) fetchData(); }, [user]);

  const students = selectedSubject?.students || [];

  const filteredStudents = students.filter(s => {
    const q = search.toLowerCase();
    return !q || s.name?.toLowerCase().includes(q) || s.registrationNumber?.toLowerCase().includes(q);
  });

  const getStudentMarks = (studentId) =>
    allMarks.filter(m => m.studentId === studentId &&
      (m.subjectId === selectedSubject?.id || m.subject === selectedSubject?.name));

  const getStudentAttendance = (studentId) =>
    allAttendance.filter(a => a.studentId === studentId &&
      (a.subjectId === selectedSubject?.id || a.subject === selectedSubject?.name));

  return (
    <Layout title="My Students">
      {viewStudent && (
        <StudentProfileModal
          student={viewStudent}
          marks={getStudentMarks(viewStudent.id || viewStudent._id)}
          attendance={getStudentAttendance(viewStudent.id || viewStudent._id)}
          subjectName={selectedSubject?.name}
          onClose={() => setViewStudent(null)}
        />
      )}

      <div className="section-header mb-6">
        <div>
          <div className="section-title">My Students</div>
          <div className="section-subtitle">
            {selectedSubject
              ? `${filteredStudents.length} students in ${selectedSubject.name}`
              : `${subjects.length} subjects assigned`}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
      ) : subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Icons.BookOpen /></div>
          <div className="empty-title">No subjects assigned</div>
          <div className="empty-desc">Ask admin to assign you to a subject first.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24, alignItems: 'start' }}>

          {/* Subject sidebar */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
              Your Subjects
            </div>
            {subjects.map(s => (
              <div
                key={s.id}
                onClick={() => { setSelected(s); setSearch(''); }}
                style={{
                  padding: '14px 16px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  background: selectedSubject?.id === s.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                  borderLeft: selectedSubject?.id === s.id ? '3px solid #6366f1' : '3px solid transparent',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                  {s.studentCount || 0} students
                  {s.code && ` · ${s.code}`}
                </div>
              </div>
            ))}
          </div>

          {/* Student list */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <div className="search-wrapper">
                <Icons.Search />
                <input className="search-input" placeholder="Search students..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>

            {filteredStudents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Icons.Users /></div>
                <div className="empty-title">No students enrolled</div>
                <div className="empty-desc">Ask admin to enroll students in {selectedSubject?.name}.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
                {filteredStudents.map(s => {
                  const sMarks = getStudentMarks(s.id || s._id);
                  const sAtt   = getStudentAttendance(s.id || s._id);
                  const avgPct = sAtt.length
                    ? Math.round(sAtt.reduce((acc, a) => acc + (a.percentage || 0), 0) / sAtt.length) : null;

                  return (
                    <div key={s.id || s._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                        <div className="avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                          {s.name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                            {s.registrationNumber || s.username}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--accent)' }}>
                            {sMarks.length}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mark Records</div>
                        </div>
                        <div style={{ flex: 1, textAlign: 'center', padding: '8px 0', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: avgPct == null ? 'var(--text-muted)' : avgPct >= 75 ? 'var(--success)' : 'var(--danger)' }}>
                            {avgPct == null ? '—' : `${avgPct}%`}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Attendance</div>
                        </div>
                      </div>

                      <button className="btn btn-secondary btn-sm" onClick={() => setViewStudent(s)}>
                        <Icons.Eye /> View Profile
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
}
