// src/components/AtRiskDashboard.jsx
// Add to Admin dashboard or Faculty dashboard pages.
// Usage: <AtRiskDashboard />

import { useEffect, useState } from 'react';
import { getAtRiskStudents } from '../services/api';

const LEVEL_CONFIG = {
  HIGH:   { bg: 'rgba(220, 38, 38, 0.1)', text: '#ef4444', border: 'rgba(220, 38, 38, 0.2)', dot: '#ef4444' },
  MEDIUM: { bg: 'rgba(217, 119, 6, 0.1)', text: '#f59e0b', border: 'rgba(217, 119, 6, 0.2)', dot: '#f59e0b' },
  LOW:    { bg: 'rgba(22, 163, 74, 0.1)', text: '#10b981', border: 'rgba(22, 163, 74, 0.2)', dot: '#10b981' },
};

const GRADE_COLORS = { A: '#10b981', B: '#3b82f6', C: '#f59e0b', D: '#f97316', F: '#ef4444' };

export default function AtRiskDashboard({ enrolledStudents = [], facultyId = null }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState('ALL'); // ALL | HIGH | MEDIUM

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAtRiskStudents(facultyId)
      .then(res => { if (active) setData(res); })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
      
    return () => { active = false; };
  }, [facultyId]);

  if (loading) return (
    <div className="card">
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Running ML predictions for all students…</p>
    </div>
  );

  if (error) return (
    <div className="card" style={{ borderColor: 'var(--danger)', background: 'rgba(220, 38, 38, 0.05)' }}>
      <p style={{ color: 'var(--danger)', fontSize: 13 }}>
        Could not load at-risk data. Make sure Flask ML service is running.
      </p>
    </div>
  );

  const mlStudents = data?.at_risk_students ?? [];
  
  const mappedStudents = mlStudents.map(ml => {
    const info = enrolledStudents.find(s => s.id === ml.student_id || s._id === ml.student_id) || {};
    return {
      ...ml,
      name: ml.name || info.name || ml.student_id,
      roll: ml.registrationNumber || info.registrationNumber || info.username || 'Unknown',
    };
  });

  const filtered = filter === 'ALL'
    ? mappedStudents
    : mappedStudents.filter(s => s.risk_level === filter);

  return (
    <div className="card">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
            At-Risk Student Detection
          </h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '3px 0 0' }}>
            ML-powered early warning system
          </p>
        </div>
        <div style={{
          background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.2)',
          borderRadius: 20, padding: '4px 14px',
          fontSize: 13, fontWeight: 700, color: 'var(--danger)'
        }}>
          {data?.at_risk_count ?? 0} / {data?.total_students ?? 0} At Risk
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Students', value: data?.total_students ?? 0, color: '#3b82f6' },
          { label: 'At Risk',        value: data?.at_risk_count   ?? 0, color: '#ef4444' },
          { label: 'Risk Rate',      value: `${data?.at_risk_percent ?? 0}%`, color: '#f59e0b' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ flex: 1, minWidth: 90, padding: '10px 14px', textAlign: 'center', marginBottom: 0 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {['ALL', 'HIGH', 'MEDIUM'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '4px 14px', borderRadius: 20, border: '1px solid var(--border)',
            background: filter === f ? 'var(--primary)' : 'transparent',
            color: filter === f ? '#FFF' : 'var(--text-muted)',
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>
            {f === 'ALL' ? `All (${mlStudents.length})` : f}
          </button>
        ))}
      </div>

      {/* Student list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 13, borderTop: '1px solid var(--border)' }}>
          No {filter !== 'ALL' ? filter.toLowerCase() + ' risk' : ''} students found.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Student Name</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Roll No</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Attendance</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Predicted Score</th>
                <th style={{ padding: '10px 14px', fontWeight: 600 }}>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const lc = LEVEL_CONFIG[s.risk_level] || LEVEL_CONFIG.HIGH;
                const gc = GRADE_COLORS[s.grade] || 'var(--text-muted)';
                return (
                  <tr key={s.student_id || i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 500, color: 'var(--text)' }}>
                      {s.name}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      {s.roll}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: s.avg_attendance < 75 ? 'var(--danger)' : 'var(--text)' }}>
                        {s.avg_attendance != null ? `${s.avg_attendance}%` : 'N/A'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {s.predicted_score != null ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <strong style={{ color: gc }}>{s.grade}</strong>
                          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                            (~{s.predicted_score}/100)
                          </span>
                        </div>
                      ) : 'N/A'}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '3px 10px', borderRadius: 4,
                        background: lc.bg, fontSize: 11,
                        fontWeight: 700, color: lc.text, border: `1px solid ${lc.border}`
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: lc.dot }} />
                        {s.risk_level}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 14, textAlign: 'right' }}>
        Model: Random Forest Classifier · 97% accuracy · Live predictions
      </p>
    </div>
  );
}
