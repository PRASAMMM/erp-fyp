// src/pages/student/StudentFaculty.jsx
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';

export default function StudentFaculty() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) { setLoading(false); return; }

    api.getMySubjects(userId, 'STUDENT')
      .then(data => setSubjects(data || []))
      .catch(err => setError(err.message || 'Could not load subjects'))
      .finally(() => setLoading(false));
  }, [user]);

  const gradientForIndex = (i) => {
    const gradients = [
      'linear-gradient(135deg, #6366f1, #8b5cf6)',
      'linear-gradient(135deg, #0ea5e9, #6366f1)',
      'linear-gradient(135deg, #10b981, #0ea5e9)',
      'linear-gradient(135deg, #f59e0b, #ef4444)',
      'linear-gradient(135deg, #22d3ee, #6366f1)',
    ];
    return gradients[i % gradients.length];
  };

  return (
    <Layout title="My Faculty">
      <div className="section-header mb-6">
        <div>
          <div className="section-title">My Faculty</div>
          <div className="section-subtitle">
            Teachers for your {subjects.length} enrolled subject{subjects.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card"><div className="skeleton" style={{ height: 100 }} /></div>
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Icons.Users /></div>
          <div className="empty-title">No subjects yet</div>
          <div className="empty-desc">You haven't been enrolled in any subjects. Contact admin to get enrolled.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {subjects.map((subject, i) => (
            <div key={subject.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Subject header */}
              <div style={{
                padding: '14px 16px',
                background: gradientForIndex(i),
                borderRadius: 'var(--radius-sm)',
                marginBottom: 2,
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'white' }}>
                  {subject.name}
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>
                  {subject.code && `${subject.code} · `}
                  {subject.department || ''}
                  {subject.semester && ` · Semester ${subject.semester}`}
                </div>
              </div>

              {/* Faculty info */}
              {subject.facultyName ? (
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div className="avatar" style={{ background: gradientForIndex(i + 1), flexShrink: 0 }}>
                    {subject.facultyName?.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{subject.facultyName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Faculty</div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px 0' }}>
                  No faculty assigned to this subject yet
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
