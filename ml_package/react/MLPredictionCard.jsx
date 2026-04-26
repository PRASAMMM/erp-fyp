// src/components/MLPredictionCard.jsx
// Drop this into StudentDashboard.jsx alongside existing cards.
// Usage: <MLPredictionCard studentId={user.id} />

import { useEffect, useState } from 'react';
import { getStudentPrediction } from '../services/mlApi';

// ── Risk badge colours ────────────────────────────────────────────────────────
const RISK_CONFIG = {
  HIGH:    { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626', dot: '#EF4444', label: 'High Risk' },
  MEDIUM:  { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706', dot: '#F59E0B', label: 'Medium Risk' },
  LOW:     { bg: '#F0FDF4', border: '#BBF7D0', text: '#16A34A', dot: '#22C55E', label: 'Low Risk' },
  UNKNOWN: { bg: '#F9FAFB', border: '#E5E7EB', text: '#6B7280', dot: '#9CA3AF', label: 'Unknown' },
};

const GRADE_CONFIG = {
  A: { color: '#16A34A', desc: 'Excellent' },
  B: { color: '#2563EB', desc: 'Good' },
  C: { color: '#D97706', desc: 'Average' },
  D: { color: '#EA580C', desc: 'Below Average' },
  F: { color: '#DC2626', desc: 'Failing' },
  'N/A': { color: '#9CA3AF', desc: 'N/A' },
};

// ── Circular progress ring ────────────────────────────────────────────────────
function CircleGauge({ value, max = 100, color, label, size = 90 }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(Math.max(value / max, 0), 1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="#E5E7EB" strokeWidth={8} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={8}
          strokeDasharray={`${pct * circ} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }} />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
          fontSize={size < 80 ? 13 : 16} fontWeight="600" fill="#111827">
          {Math.round(value)}
        </text>
      </svg>
      <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ── Feature bar (shows model inputs) ─────────────────────────────────────────
function FeatureBar({ label, value, max = 100 }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct >= 65 ? '#22C55E' : pct >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    fontSize: 12, color: '#374151', marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 600 }}>{Math.round(value)}{max === 100 ? '%' : ''}</span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: '#F3F4F6', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color,
                      borderRadius: 3, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MLPredictionCard({ studentId }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    getStudentPrediction(studentId)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [studentId]);

  // ── Loading state ──────────────────────────────────────────────────
  if (loading) return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={spinnerStyle} />
        <span style={{ color: '#6B7280', fontSize: 14 }}>Generating AI predictions…</span>
      </div>
    </div>
  );

  // ── Error / fallback ───────────────────────────────────────────────
  if (error || !data) return (
    <div style={{ ...cardStyle, borderColor: '#FCA5A5', background: '#FEF2F2' }}>
      <p style={{ color: '#DC2626', fontSize: 13 }}>
        ⚠️ ML service unavailable. Start Flask: <code>python app.py</code>
      </p>
    </div>
  );

  const { risk, performance, anomaly, input_features: feat } = data;
  const rc   = RISK_CONFIG[risk?.risk_level || 'UNKNOWN'];
  const gc   = GRADE_CONFIG[performance?.grade || 'N/A'];

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>
            🤖 AI Academic Prediction
          </h3>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
            Powered by trained Random Forest models
          </p>
        </div>
        {/* Risk badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 20,
          background: rc.bg, border: `1px solid ${rc.border}`,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: rc.dot }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: rc.text }}>{rc.label}</span>
        </div>
      </div>

      {/* Gauges row */}
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '8px 0 20px', flexWrap: 'wrap', gap: 12 }}>
        <CircleGauge
          value={performance?.predicted_score ?? 0}
          max={100}
          color={gc.color}
          label="Predicted Score" />
        <CircleGauge
          value={risk?.confidence ?? 0}
          max={100}
          color={rc.dot}
          label="Model Confidence" />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%',
            background: gc.color + '18',
            border: `4px solid ${gc.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 700, color: gc.color,
          }}>
            {performance?.grade ?? 'N/A'}
          </div>
          <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 500 }}>
            {gc.desc}
          </span>
        </div>
      </div>

      {/* Interpretation */}
      <div style={{
        background: rc.bg, border: `1px solid ${rc.border}`,
        borderRadius: 8, padding: '10px 14px', marginBottom: 14,
      }}>
        <p style={{ fontSize: 13, color: rc.text, margin: 0, lineHeight: 1.5 }}>
          <strong>{risk?.label}</strong> — {performance?.interpretation}
        </p>
      </div>

      {/* Anomaly flag */}
      {anomaly?.is_anomaly && (
        <div style={{
          background: '#FFFBEB', border: '1px solid #FDE68A',
          borderRadius: 8, padding: '8px 14px', marginBottom: 14,
          fontSize: 12, color: '#92400E',
        }}>
          ⚠️ <strong>Attendance anomaly detected</strong> — unusual pattern flagged by AI. Talk to your faculty.
        </div>
      )}

      {/* Expandable feature details */}
      {feat && (
        <>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 12, color: '#6B7280', padding: 0, marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
            {expanded ? '▾' : '▸'} View model inputs
          </button>
          {expanded && (
            <div style={{ marginTop: 4 }}>
              <FeatureBar label="Attendance"       value={feat.avg_attendance}    max={100} />
              <FeatureBar label="Midterm Score"    value={feat.midterm_score}     max={100} />
              <FeatureBar label="Assignment Score" value={feat.assignment_score}  max={100} />
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <p style={{ fontSize: 11, color: '#9CA3AF', margin: '10px 0 0', textAlign: 'right' }}>
        Random Forest · 97% accuracy · Trained on 500 student records
      </p>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const cardStyle = {
  background: '#FFFFFF',
  border: '1px solid #E5E7EB',
  borderRadius: 12,
  padding: 20,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
};

const spinnerStyle = {
  width: 20, height: 20, borderRadius: '50%',
  border: '2px solid #E5E7EB',
  borderTopColor: '#3B82F6',
  animation: 'spin 0.8s linear infinite',
};
