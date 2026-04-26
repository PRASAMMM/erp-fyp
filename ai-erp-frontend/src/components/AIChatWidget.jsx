import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('erp_token') || localStorage.getItem('token') || ''}`,
});

const MODES = [
  { id: 'chat',      label: 'College AI',  icon: '🏫', placeholder: 'Ask anything about college…' },
  { id: 'reminders', label: 'Deadlines',   icon: '🔔', placeholder: 'Ask about your deadlines…' },
  { id: 'study',     label: 'Study Tutor', icon: '📚', placeholder: 'Ask me to explain anything…' },
];

const PROMPTS = {
  chat: {
    STUDENT: ['What are my marks?', 'My attendance status', 'Latest announcements', 'Who are my faculty?'],
    FACULTY: ['All student marks', 'Low attendance students', 'Recent announcements', 'Pending submissions'],
    ADMIN:   ['Enrollment stats', 'All student list', 'Campus performance', 'Faculty overview'],
  },
  reminders: {
    STUDENT: ["What's due this week?", 'Show overdue work', 'Prioritize my tasks', 'Am I behind?'],
    FACULTY: ['Assignments to grade', 'Pending submissions', 'Weekly overview', 'Overdue assignments'],
    ADMIN:   ['Campus deadlines', 'Submission stats', 'At-risk students', 'Week summary'],
  },
  study: {
    STUDENT: ['Explain Big O notation', 'Quiz me on thermodynamics', 'Help me write an essay', 'Solve this step by step'],
    FACULTY: ['Create practice questions', 'Explain a concept simply', 'Lesson plan ideas', 'Example problems'],
    ADMIN:   ['Academic glossary', 'Education best practices', 'Report writing tips', 'Policy overview'],
  },
};

const WELCOME = {
  chat:      (n, r) => r === 'ADMIN'
    ? `Hi ${n}! 👋 I have access to all campus data.\n\nAsk me:\n• Student records by name or registration number\n• Marks and attendance summaries\n• Faculty info, announcements\n• Any college information`
    : r === 'FACULTY'
    ? `Hi ${n}! 👋 I can access all student data for you.\n\nAsk me:\n• Any student's marks or attendance (use reg. number)\n• Class performance summaries\n• Pending submissions, announcements`
    : `Hi ${n}! 👋 I'm your College AI.\n\nAsk me anything:\n• Your marks, attendance, assignments\n• Faculty, courses, announcements\n• Study help — coding, math, science…`,

  reminders: (n) => `Hey ${n}! 📅 Let me help you stay on top of deadlines.\n\nAsk me what's due soon, what's overdue, or how to prioritize your work!`,
  study:     (n) => `Hi ${n}! 🎓 I'm your Study Tutor.\n\nI can:\n• Explain any concept with examples\n• Solve problems step-by-step\n• Create practice quizzes\n• Summarize notes you paste in\n• Help with any subject!`,
};

function renderText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code style="background:rgba(99,102,241,0.15);padding:1px 5px;border-radius:4px;font-size:12px;font-family:monospace">$1</code>')
    .replace(/\n/g, '<br/>');
}

export default function AIChatWidget() {
  const { user } = useAuth();
  const role      = user?.role?.toUpperCase() || 'STUDENT';
  const firstName = user?.name?.split(' ')[0] || 'there';
  const username  = user?.username || 'anonymous';

  const [open,       setOpen]       = useState(false);
  const [mode,       setMode]       = useState('chat');
  const [messages,   setMessages]   = useState([]);
  const [input,      setInput]      = useState('');
  const [loading,    setLoading]    = useState(false);
  const [reminders,  setReminders]  = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);

  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Load reminders
  useEffect(() => {
    fetch(`${BASE_URL}/ai/reminders?username=${encodeURIComponent(username)}`, { headers: getHeaders() })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setReminders(data || []);
        setBadgeCount((data || []).filter(r => r.urgency === 'HIGH').length);
      })
      .catch(() => {});
  }, [username]);

  // Welcome message on mode change
  useEffect(() => {
    setMessages([{
      role: 'assistant',
      text: WELCOME[mode]?.(firstName, role) || WELCOME.chat(firstName, role),
      ts:   Date.now(),
    }]);
  }, [mode, firstName, role]);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: msg, ts: Date.now() }]);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/ai/chat`, {
        method:  'POST',
        headers: getHeaders(),
        body:    JSON.stringify({ message: msg, username, role, mode }),
      });

      const data = await res.json();
      // Backend returns { response: "..." }
      const reply = data?.response || data?.reply || 'No response received.';

      setMessages(prev => [...prev, { role: 'assistant', text: reply, ts: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: '⚠️ Connection issue. Please check your network and try again.',
        ts:   Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const prompts = PROMPTS[mode]?.[role] || PROMPTS[mode]?.STUDENT || [];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="EICT AI Assistant"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
          width: 56, height: 56, borderRadius: '50%',
          background: open ? 'var(--bg-card-hover)' : 'linear-gradient(135deg,#6366f1,#8b5cf6)',
          border: open ? '1px solid var(--border)' : 'none',
          cursor: 'pointer', color: 'white', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(99,102,241,0.4)',
          transition: 'all 0.2s ease',
        }}
      >
        {open ? '✕' : '✦'}
        {!open && badgeCount > 0 && (
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#ef4444', color: 'white', borderRadius: '50%',
            width: 20, height: 20, fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg-primary)',
          }}>{badgeCount > 9 ? '9+' : badgeCount}</span>
        )}
        {!open && (
          <span style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            border: '2px solid rgba(99,102,241,0.3)',
            animation: 'aiPulse 2.5s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 999,
          width: 420, height: 600, maxHeight: '85vh',
          borderRadius: 20, background: 'var(--bg-card)',
          border: '1px solid var(--border-active)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
          overflow: 'hidden', animation: 'aiSlideUp 0.22s ease',
          fontFamily: 'var(--font-body)',
        }}>

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(139,92,246,0.08))',
            borderBottom: '1px solid var(--border)',
            padding: '16px 18px 12px', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, color: 'white', flexShrink: 0,
              }}>✦</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>
                  EICT AI
                </div>
                <div style={{ fontSize: 11, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                  Live data · Powered by Groq (Free)
                </div>
              </div>
              <span style={{
                fontSize: 10, padding: '3px 8px', borderRadius: 6,
                background: 'var(--accent-soft)', color: 'var(--accent)', fontWeight: 600,
              }}>{role}</span>
              <button onClick={() => setOpen(false)} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: 18, lineHeight: 1, padding: 4,
              }}>✕</button>
            </div>

            {/* Mode tabs */}
            <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.2)', padding: 4, borderRadius: 12 }}>
              {MODES.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)} style={{
                  flex: 1, padding: '7px 6px', borderRadius: 8, border: 'none',
                  background: mode === m.id ? 'var(--accent)' : 'transparent',
                  color:      mode === m.id ? 'white' : 'var(--text-muted)',
                  cursor: 'pointer', fontSize: 11,
                  fontWeight: mode === m.id ? 700 : 400,
                  fontFamily: 'var(--font-body)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  transition: 'all 0.15s', position: 'relative',
                }}>
                  <span style={{ fontSize: 15 }}>{m.icon}</span>
                  <span>{m.label}</span>
                  {m.id === 'reminders' && badgeCount > 0 && (
                    <span style={{
                      position: 'absolute', top: -3, right: -3,
                      background: '#ef4444', color: 'white', borderRadius: '50%',
                      width: 15, height: 15, fontSize: 9, fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{badgeCount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Reminders panel */}
          {mode === 'reminders' && reminders.length > 0 && (
            <div style={{
              padding: '10px 14px', borderBottom: '1px solid var(--border)',
              maxHeight: 180, overflowY: 'auto', background: 'rgba(0,0,0,0.15)', flexShrink: 0,
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
                Your Deadlines
              </div>
              {reminders.map((r, i) => {
                const colors = {
                  HIGH:   { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   text: '#ef4444' },
                  MEDIUM: { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  text: '#f59e0b' },
                  LOW:    { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)',   text: '#10b981' },
                }[r.urgency] || {};
                return (
                  <div key={i} style={{
                    display: 'flex', gap: 10, marginBottom: 8,
                    padding: '9px 11px', borderRadius: 10,
                    background: colors.bg, border: `1px solid ${colors.border}`,
                  }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
                      {r.urgency === 'HIGH' ? '🔴' : r.urgency === 'MEDIUM' ? '🟡' : '🟢'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.subject} · Due: {r.dueDate}</div>
                      <div style={{ fontSize: 11, color: colors.text, marginTop: 2, fontWeight: 500 }}>{r.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '14px 14px 8px',
            display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                gap: 8, alignItems: 'flex-end',
              }}>
                {m.role === 'assistant' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, color: 'white', marginBottom: 2,
                  }}>✦</div>
                )}
                <div
                  style={{
                    maxWidth: '80%', padding: '10px 14px',
                    borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: m.role === 'user' ? 'var(--accent)' : 'var(--bg-primary)',
                    border: m.role === 'assistant' ? '1px solid var(--border)' : 'none',
                    color: m.role === 'user' ? 'white' : 'var(--text-secondary)',
                    fontSize: 13.5, lineHeight: 1.6,
                  }}
                  dangerouslySetInnerHTML={{ __html: renderText(m.text) }}
                />
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, color: 'white',
                }}>✦</div>
                <div style={{
                  padding: '12px 16px', borderRadius: '16px 16px 16px 4px',
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  display: 'flex', gap: 5, alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <span key={i} style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: 'var(--accent)', display: 'inline-block',
                      animation: `aiDot 1.3s ease-in-out ${i * 0.18}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div style={{
            padding: '8px 12px', borderTop: '1px solid var(--border)',
            display: 'flex', gap: 6, flexWrap: 'wrap',
            background: 'rgba(0,0,0,0.1)', flexShrink: 0,
          }}>
            {prompts.map((p, i) => (
              <button key={i} onClick={() => sendMessage(p)} style={{
                padding: '4px 11px', borderRadius: 20,
                border: '1px solid rgba(99,102,241,0.25)',
                background: 'var(--accent-soft)', color: 'var(--accent)',
                fontSize: 11.5, fontFamily: 'var(--font-body)',
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.12s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-soft)'; e.currentTarget.style.color = 'var(--accent)'; }}
              >{p}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: '10px 12px 14px', borderTop: '1px solid var(--border)',
            display: 'flex', gap: 8, alignItems: 'flex-end', flexShrink: 0,
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={MODES.find(m => m.id === mode)?.placeholder || 'Ask anything…'}
              rows={1}
              disabled={loading}
              style={{
                flex: 1, border: '1px solid var(--border)', borderRadius: 12,
                padding: '10px 14px', fontSize: 13.5, resize: 'none',
                fontFamily: 'var(--font-body)', background: 'var(--bg-primary)',
                color: 'var(--text-primary)', outline: 'none',
                lineHeight: 1.5, maxHeight: 90, overflowY: 'auto', transition: 'border-color 0.15s',
              }}
              onFocus={e  => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e   => e.target.style.borderColor = 'var(--border)'}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 40, height: 40, borderRadius: 12, border: 'none', flexShrink: 0,
                background: input.trim() && !loading ? 'var(--accent)' : 'var(--bg-card-hover)',
                color:      input.trim() && !loading ? 'white' : 'var(--text-muted)',
                cursor:     input.trim() && !loading ? 'pointer' : 'default',
                fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}
            >↑</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes aiPulse   { 0% { transform:scale(1); opacity:.7 } 100% { transform:scale(1.7); opacity:0 } }
        @keyframes aiSlideUp { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        @keyframes aiDot     { 0%,60%,100% { transform:translateY(0); opacity:.4 } 30% { transform:translateY(-6px); opacity:1 } }
      `}</style>
    </>
  );
}
