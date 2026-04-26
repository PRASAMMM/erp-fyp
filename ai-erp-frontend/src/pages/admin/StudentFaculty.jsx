// src/pages/student/StudentFaculty.jsx
// New page — shows the student only faculty assigned to their class.
// Uses GET /api/users/my-faculty?className=<student.className>&role=STUDENT

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Icons } from '../../components/Icons';
import { useAuth } from '../../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getHeaders = () => {
  const token = localStorage.getItem('erp_token') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export default function StudentFaculty() {
  const { user } = useAuth();
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');

  const studentClass = user?.className || '';

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({ role: 'STUDENT' });
        if (studentClass) params.append('className', studentClass);

        const res = await fetch(`${BASE_URL}/users/my-faculty?${params}`, {
          headers: getHeaders(),
        });
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        const data = await res.json();
        setFaculty(data || []);
      } catch (err) {
        setError(err.message || 'Could not load faculty');
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, [studentClass]);

  const filtered = faculty.filter(f => {
    const q = search.toLowerCase();
    return !q
      || f.name?.toLowerCase().includes(q)
      || f.department?.toLowerCase().includes(q)
      || f.designation?.toLowerCase().includes(q);
  });

  // Avatar gradient per designation
  const avatarGradient = (designation) => {
    const map = {
      'Professor':           'linear-gradient(135deg, #6366f1, #8b5cf6)',
      'Associate Professor': 'linear-gradient(135deg, #0ea5e9, #6366f1)',
      'Assistant Professor': 'linear-gradient(135deg, #22d3ee, #6366f1)',
      'Lecturer':            'linear-gradient(135deg, #10b981, #6366f1)',
      'HOD':                 'linear-gradient(135deg, #f59e0b, #ef4444)',
    };
    return map[designation] || 'linear-gradient(135deg, #22d3ee, #6366f1)';
  };

  return (
    <Layout title="My Faculty">
      {/* Header */}
      <div className="section-header mb-6">
        <div>
          <div className="section-title">My Faculty</div>
          <div className="section-subtitle">
            {studentClass
              ? `Class teachers assigned to ${studentClass}`
              : 'Your class teachers'}
          </div>
        </div>
      </div>

      {/* Class badge — shows what class the student belongs to */}
      {studentClass ? (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 8, padding: '8px 14px',
          marginBottom: 20, fontSize: 13,
          color: 'var(--text-secondary)',
        }}>
          <Icons.GraduationCap />
          Your class: <strong style={{ color: 'var(--text-primary)', marginLeft: 4 }}>{studentClass}</strong>
        </div>
      ) : (
        <div className="alert alert-warning mb-5" style={{ maxWidth: 520 }}>
          <Icons.AlertCircle />
          Your class hasn't been assigned yet. Contact the admin to get your <strong>className</strong> updated.
          Showing all faculty for now.
        </div>
      )}

      {/* Search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div className="search-wrapper">
          <Icons.Search />
          <input
            className="search-input"
            placeholder="Search by name or department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error mb-4">{error}</div>}

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card">
                <div className="skeleton" style={{ height: 100 }} />
              </div>
            ))
          : filtered.length === 0
          ? (
            <div style={{ gridColumn: '1/-1' }}>
              <div className="empty-state">
                <div className="empty-icon"><Icons.Users /></div>
                <div className="empty-title">No faculty found</div>
                <div className="empty-desc">
                  {studentClass
                    ? `No teachers are currently assigned to class "${studentClass}". Ask your admin to assign faculty to your class.`
                    : 'No faculty members found.'}
                </div>
              </div>
            </div>
          )
          : filtered.map(f => (
            <div key={f.id || f._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Top: avatar + name */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div
                  className="avatar avatar-lg"
                  style={{ background: avatarGradient(f.designation) }}
                >
                  {f.name?.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: 16,
                    color: 'var(--text-primary)',
                  }}>
                    {f.name}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                    {f.designation || 'Faculty'}
                  </div>
                  <span className="badge badge-cyan" style={{ marginTop: 6 }}>
                    {f.department || 'No Dept'}
                  </span>
                </div>
              </div>

              {/* Contact info */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: 8,
                paddingTop: 12,
                borderTop: '1px solid var(--border)',
              }}>
                {f.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}><Icons.Mail /></span>
                    <a
                      href={`mailto:${f.email}`}
                      style={{
                        fontSize: 13,
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {f.email}
                    </a>
                  </div>
                )}
                {f.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}><Icons.Phone /></span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{f.phone}</span>
                  </div>
                )}
                {!f.email && !f.phone && (
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No contact info available</div>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </Layout>
  );
}
