// src/components/AtRiskDashboard.jsx
// Add to Admin dashboard or Faculty dashboard pages.
// Usage: <AtRiskDashboard />

import { useEffect, useState } from 'react';
import { getAtRiskStudents } from '../services/mlApi';

const LEVEL_CONFIG = {
  HIGH:   { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', icon: '🔴' },
  MEDIUM: { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A', icon: '🟡' },
  LOW:    { bg: '#F0FDF4', text: '#16A34A', border: '#BBF7D0', icon: '🟢' },
};

const GRADE_COLORS = { A: '#16A34A', B: '#2563EB', C: '#D97706', D: '#EA580C', F: '#DC2626' };

export default function AtRiskDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [filter,  setFilter]  = useState('ALL'); // ALL | HIGH | MEDIUM

  useEffect(() => {
    getAtRiskStudents()
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={cardStyle}>
      <p style={{ color: '#6B7280', fontSize: 14 }}>⏳ Running ML predictions for all students…</p>
    </div>
  );

  if (error) return (
    <div style={{ ...cardStyle, borderColor: '#FECACA', background: '#FEF2F2' }}>
      <p style={{ color: '#DC2626', fontSize: 13 }}>
        ⚠️ Could not load at-risk data. Make sure Flask ML service is running.
      </p>
    </div>
  );

  const students = data?.at_risk_students ?? [];
  const filtered = filter === 'ALL'
    ? students
    : students.filter(s => s.risk_level === filter);

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>
            🎯 At-Risk Student Detection
          </h3>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '3px 0 0' }}>
            ML-powered early warning system
          </p>
        </div>
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA',
          borderRadius: 20, padding: '4px 14px',
          fontSize: 13, fontWeight: 700, color: '#DC2626'
        }}>
          {data?.at_risk_count ?? 0} / {data?.total_students ?? 0} At Risk
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Students', value: data?.total_students ?? 0, color: '#3B82F6' },
          { label: 'At Risk',        value: data?.at_risk_count   ?? 0, color: '#EF4444' },
          { label: 'Risk Rate',      value: `${data?.at_risk_percent ?? 0}%`, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1, minWidth: 90,
            background: '#F9FAFB', border: '1px solid #E5E7EB',
            borderRadius: 8, padding: '10px 14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {['ALL', 'HIGH', 'MEDIUM'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '4px 14px', borderRadius: 20, border: '1px solid #E5E7EB',
            background: filter === f ? '#111827' : 'transparent',
            color: filter === f ? '#FFF' : '#6B7280',
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
          }}>
            {f === 'ALL' ? `All (${students.length})` : f}
          </button>
        ))}
      </div>

      {/* Student list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#6B7280', fontSize: 13 }}>
          ✅ No {filter !== 'ALL' ? filter.toLowerCase() + ' risk' : ''} students found.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((s, i) => {
            const lc = LEVEL_CONFIG[s.risk_level] || LEVEL_CONFIG.HIGH;
            const gc = GRADE_COLORS[s.grade] || '#9CA3AF';
            return (
              <div key={s.student_id || i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 8,
                background: lc.bg, border: `1px solid ${lc.border}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 16 }}>{lc.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                      {s.student_id}
                    </div>
                    <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>
                      Attendance: {s.avg_attendance != null ? `${s.avg_attendance}%` : 'N/A'} ·
                      Confidence: {s.confidence != null ? `${s.confidence}%` : 'N/A'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {s.predicted_score != null && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: gc }}>
                        {s.grade}
                      </div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>
                        ~{s.predicted_score}/100
                      </div>
                    </div>
                  )}
                  <div style={{
                    padding: '3px 10px', borderRadius: 12,
                    background: lc.text + '18', fontSize: 11,
                    fontWeight: 700, color: lc.text,
                  }}>
                    {s.risk_level}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 14, textAlign: 'right' }}>
        Model: Random Forest Classifier · 97% accuracy · Live predictions
      </p>
    </div>
  );
}

const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};
