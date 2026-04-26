import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

const BotIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2"/>
    <circle cx="12" cy="5" r="2"/>
    <path d="M12 7v4"/>
    <line x1="8" y1="16" x2="8" y2="16"/>
    <line x1="16" y1="16" x2="16" y2="16"/>
  </svg>
);
const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function AIChatbot() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'there';

  const [open, setOpen]       = useState(false);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `👋 Hi ${firstName}! I'm your EICT AI assistant.\n\nI have live access to your **marks**, **attendance**, **assignments**, **faculty info**, and **announcements**. Ask me anything!`,
      time: new Date(),
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      inputRef.current?.focus();
    }
  }, [messages, open]);

  const QUICK_PROMPTS = user?.role === 'STUDENT'
    ? ['My marks', 'My attendance', 'Pending assignments', 'How to improve?']
    : user?.role === 'FACULTY'
    ? ['Student performance', 'Who has low attendance?', 'Recent submissions', 'Class statistics']
    : ['Total students', 'Campus attendance', 'Faculty list', 'Performance overview'];

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');

    setMessages(prev => [...prev, { role: 'user', text: msg, time: new Date() }]);
    setLoading(true);

    try {
      // Resolve username — try multiple fields
      const username = user?.username || user?.rollNumber || user?.email || user?.name || 'unknown';
      const role     = user?.role || 'STUDENT';

      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, username, role }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data  = await res.json();
      const reply = data.response || data.reply || 'No response from AI.';

      setMessages(prev => [...prev, { role: 'bot', text: reply, time: new Date() }]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: '⚠️ Connection error or AI API Key missing. Please make sure the backend is running and GROQ_API_KEY is configured.',
        time: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 1000,
          width: 56, height: 56, borderRadius: '50%',
          background: open ? 'var(--bg-card-hover)' : 'linear-gradient(135deg, #6366f1, #22d3ee)',
          border: open ? '1px solid var(--border)' : 'none',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
          transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)', color: 'white',
        }}
        title="AI Assistant"
      >
        {open ? <CloseIcon /> : <BotIcon />}
        {!open && (
          <span style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            border: '2px solid rgba(99,102,241,0.4)',
            animation: 'chatPulse 2s ease-out infinite',
          }} />
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 96, right: 28, zIndex: 1000,
          width: 390, height: 560, maxHeight: '82vh',
          background: 'var(--bg-card)', borderRadius: 20,
          border: '1px solid var(--border-active)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          animation: 'slideUpChat 0.2s ease', overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(34,211,238,0.06))',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0,
            }}>
              <BotIcon />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>EICT AI</div>
              <div style={{ fontSize: 11, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                Live data · Powered by Ollama
              </div>
            </div>
            <div style={{ fontSize: 11, background: 'var(--accent-soft)', padding: '2px 8px', borderRadius: 6, color: 'var(--accent)', flexShrink: 0 }}>
              {user?.role}
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 4 }}>
              <CloseIcon />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                gap: 8, alignItems: 'flex-end',
              }}>
                {msg.role === 'bot' && (
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
                  </div>
                )}
                <div style={{ maxWidth: '80%' }}>
                  <div style={{
                    padding: '9px 13px',
                    background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-primary)',
                    border: msg.role === 'bot' ? '1px solid var(--border)' : 'none',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    fontSize: 13, lineHeight: 1.65,
                    color: msg.role === 'user' ? 'white' : 'var(--text-secondary)',
                  }} dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {formatTime(msg.time)}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#6366f1,#22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
                </div>
                <div style={{ padding: '10px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px', display: 'flex', gap: 4, alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)', display: 'inline-block', animation: `dotBounce 1.2s ease-in-out ${i*0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {QUICK_PROMPTS.map(p => (
              <button key={p} onClick={() => sendMessage(p)} disabled={loading} style={{
                padding: '4px 10px', fontSize: 11,
                background: 'var(--accent-soft)', color: 'var(--accent)',
                border: '1px solid rgba(99,102,241,0.2)', borderRadius: 20, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = 'white'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-soft)'; e.currentTarget.style.color = 'var(--accent)'; }}
              >{p}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask about marks, attendance, faculty..."
              style={{
                flex: 1, background: 'var(--bg-primary)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '9px 13px', fontSize: 13,
                color: 'var(--text-primary)', outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              disabled={loading}
            />
            <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: input.trim() ? 'var(--accent)' : 'var(--bg-card-hover)',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: input.trim() ? 'white' : 'var(--text-muted)', transition: 'all 0.15s',
            }}>
              <SendIcon />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatPulse { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(1.6);opacity:0} }
        @keyframes slideUpChat { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes dotBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }
      `}</style>
    </>
  );
}
