import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
  </svg>
);
const RefreshIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const BookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const BellIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const CalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const ICON_MAP = { alert: AlertIcon, check: CheckIcon, book: BookIcon, bell: BellIcon, cal: CalIcon };
const TYPE_STYLES = {
  urgent:  { bg: 'rgba(244,63,94,0.1)',  border: 'rgba(244,63,94,0.25)',  accent: '#f43f5e', label: 'Action needed' },
  warning: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)', accent: '#f59e0b', label: 'Heads up' },
  success: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)', accent: '#10b981', label: 'Looking good' },
  info:    { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)', accent: '#6366f1', label: 'Tip' },
};

export default function AIRecommendations() {
  const { user } = useAuth();
  const [cards, setCards]         = useState([]);
  const [loading, setLoading]     = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('edu_dismissed_recs') || '[]'); }
    catch { return []; }
  });

  const username = user?.username || user?.rollNumber || user?.email || user?.name || 'student';

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      // Get today's timetable classes from localStorage
      const timetable = JSON.parse(localStorage.getItem('edu_timetable') || '{}');
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const todayClasses = Object.entries(timetable)
        .filter(([k]) => k.startsWith(today))
        .map(([k, v]) => `${k.split('-')[1]} ${v.subject}`)
        .join(', ');

      const prompt = `You are an academic advisor AI. Based on the student's data, generate EXACTLY 4-6 smart recommendations.
Respond ONLY with valid JSON array, no other text.
Format: [{"type":"urgent|warning|success|info","icon":"alert|check|book|bell|cal","title":"short title","body":"1-2 sentences max","action":"optional button label or null"}]

Rules:
- "urgent" = attendance below 75%, failed subject, missed assignment deadline
- "warning" = attendance 75-80%, weak subject, assignment due soon  
- "success" = good performance praise, streak acknowledgment
- "info" = study tip, announcement reminder, class today

Today's classes: ${todayClasses || 'none scheduled'}
Student: ${username}

Generate recommendations now:`;

      const res = await fetch('http://localhost:8080/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, username, role: 'STUDENT' }),
      });

      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const text = data.response || '';

      // Extract JSON from response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setCards(parsed.slice(0, 6));
        setLastUpdated(new Date());
      } else {
        // Fallback cards if AI doesn't return JSON
        setCards(getFallbackCards());
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Recommendations error:', err);
      setCards(getFallbackCards());
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchRecommendations();
    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchRecommendations, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchRecommendations]);

  const dismiss = (idx) => {
    const next = [...dismissed, idx + '-' + Date.now()];
    setDismissed(next);
    localStorage.setItem('edu_dismissed_recs', JSON.stringify(next));
    setCards(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: 'linear-gradient(135deg, #f59e0b, #f43f5e)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          }}>
            <SparkleIcon />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>AI Recommendations</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : 'Personalised insights'}
            </div>
          </div>
        </div>
        <button onClick={fetchRecommendations} disabled={loading} title="Refresh" style={{
          width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)',
          background: 'var(--bg-primary)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <span style={{ animation: loading ? 'spin 1s linear infinite' : 'none', display: 'flex' }}>
            <RefreshIcon />
          </span>
        </button>
      </div>

      {/* Cards */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && cards.length === 0 ? (
          // Skeleton loading
          [0,1,2,3].map(i => (
            <div key={i} style={{
              height: 72, borderRadius: 10, border: '1px solid var(--border)',
              background: 'var(--bg-primary)', animation: 'shimmer 1.5s ease-in-out infinite',
              opacity: 1 - i * 0.15,
            }} />
          ))
        ) : cards.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            No recommendations right now. Check back later!
          </div>
        ) : (
          cards.map((card, i) => {
            const style = TYPE_STYLES[card.type] || TYPE_STYLES.info;
            const IconComp = ICON_MAP[card.icon] || ICON_MAP.book;
            return (
              <div key={i} style={{
                borderRadius: 10, border: `1px solid ${style.border}`,
                background: style.bg, padding: '11px 13px',
                display: 'flex', gap: 11, alignItems: 'flex-start',
                transition: 'transform 0.15s, opacity 0.3s',
                animation: `fadeSlideIn 0.35s ease ${i * 0.05}s both`,
              }}>
                {/* Icon */}
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: style.accent + '22',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: style.accent,
                }}>
                  <IconComp />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{card.title}</span>
                    <span style={{ fontSize: 10, color: style.accent, fontWeight: 600, flexShrink: 0 }}>{style.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{card.body}</div>
                  {card.action && (
                    <button style={{
                      marginTop: 7, padding: '3px 12px', fontSize: 11, fontWeight: 600,
                      background: style.accent, color: 'white', border: 'none',
                      borderRadius: 6, cursor: 'pointer',
                    }}>{card.action}</button>
                  )}
                </div>

                {/* Dismiss */}
                <button onClick={() => dismiss(i)} title="Dismiss" style={{
                  flexShrink: 0, width: 20, height: 20, borderRadius: 5,
                  border: 'none', background: 'transparent', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: 15, lineHeight: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0.5,
                }} onMouseEnter={e => e.currentTarget.style.opacity = 1}
                   onMouseLeave={e => e.currentTarget.style.opacity = 0.5}>
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {cards.length > 0 && !loading && (
        <div style={{ padding: '0 16px 14px', display: 'flex', justifyContent: 'center' }}>
          <button onClick={fetchRecommendations} style={{
            fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <RefreshIcon /> Refresh recommendations
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

function getFallbackCards() {
  return [
    { type: 'info', icon: 'cal', title: "Check today's schedule", body: "Open your timetable to see what classes you have today. Stay ahead!", action: null },
    { type: 'info', icon: 'book', title: 'Keep studying consistently', body: "Regular revision is more effective than last-minute cramming. Aim for 2-3 hours daily.", action: null },
    { type: 'warning', icon: 'bell', title: 'Check new announcements', body: "There may be important updates from faculty or admin. Check the announcements section.", action: null },
  ];
}
