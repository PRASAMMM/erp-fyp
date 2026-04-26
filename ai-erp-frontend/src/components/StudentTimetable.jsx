import { useState, useEffect } from 'react';

const DAYS    = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
const COLORS  = ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e', '#8b5cf6', '#06b6d4', '#84cc16'];

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

export default function StudentTimetable() {
  const [timetable, setTimetable] = useState(() => {
    try { return JSON.parse(localStorage.getItem('edu_timetable') || '{}'); }
    catch { return {}; }
  });
  const [modal, setModal]       = useState(null);
  const [form, setForm]         = useState({ subject: '', faculty: '', room: '', color: COLORS[0] });
  const [viewMode, setViewMode] = useState('week');
  const [activeDay, setActiveDay] = useState('Monday');

  useEffect(() => {
    localStorage.setItem('edu_timetable', JSON.stringify(timetable));
  }, [timetable]);

  const key = (day, period) => `${day}-${period}`;

  const openSlot = (day, period) => {
    const existing = timetable[key(day, period)];
    setForm(existing ? { ...existing } : { subject: '', faculty: '', room: '', color: COLORS[0] });
    setModal({ day, period });
  };

  const saveSlot = () => {
    if (!form.subject.trim()) return;
    setTimetable(prev => ({ ...prev, [key(modal.day, modal.period)]: { ...form } }));
    setModal(null);
  };

  const deleteSlot = (day, period, e) => {
    e.stopPropagation();
    setTimetable(prev => {
      const next = { ...prev };
      delete next[key(day, period)];
      return next;
    });
  };

  const todayName    = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayClasses = PERIODS
    .map(p => ({ period: p, slot: timetable[key(todayName, p)] }))
    .filter(x => x.slot);
  const displayDays  = viewMode === 'day' ? [activeDay] : DAYS;

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <ClockIcon />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>My Timetable</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{Object.keys(timetable).length} classes · click any slot to add</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['week', 'day'].map(v => (
            <button key={v} onClick={() => setViewMode(v)} style={{
              padding: '5px 14px', fontSize: 12, borderRadius: 8,
              border: '1px solid var(--border)',
              background: viewMode === v ? 'var(--accent)' : 'var(--bg-primary)',
              color: viewMode === v ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.15s', fontWeight: viewMode === v ? 600 : 400,
            }}>{v === 'week' ? 'Week' : 'Day'}</button>
          ))}
        </div>
      </div>

      {/* Today's quick strip */}
      {todayClasses.length > 0 && (
        <div style={{ padding: '8px 20px', background: 'rgba(99,102,241,0.06)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>TODAY:</span>
          {todayClasses.map(({ period, slot }) => (
            <span key={period} style={{ fontSize: 11, padding: '2px 9px', borderRadius: 20, background: slot.color + '22', color: slot.color, border: `1px solid ${slot.color}44` }}>
              {period} · {slot.subject}
            </span>
          ))}
        </div>
      )}

      {/* Day tabs for day view */}
      {viewMode === 'day' && (
        <div style={{ padding: '10px 20px 0', display: 'flex', gap: 6, overflowX: 'auto', borderBottom: '1px solid var(--border)' }}>
          {DAYS.map(d => (
            <button key={d} onClick={() => setActiveDay(d)} style={{
              padding: '6px 14px', fontSize: 12, whiteSpace: 'nowrap', cursor: 'pointer',
              borderRadius: '8px 8px 0 0', border: '1px solid var(--border)',
              borderBottom: activeDay === d ? 'none' : '1px solid var(--border)',
              background: activeDay === d ? 'var(--bg-card)' : 'var(--bg-primary)',
              color: activeDay === d ? 'var(--accent)' : 'var(--text-muted)',
              fontWeight: activeDay === d ? 700 : 400, marginBottom: activeDay === d ? -1 : 0,
            }}>{d.slice(0, 3)}</button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: viewMode === 'week' ? 680 : 300, padding: '14px 18px' }}>

          {/* Column headers */}
          <div style={{ display: 'grid', gridTemplateColumns: `72px repeat(${displayDays.length}, 1fr)`, gap: 5, marginBottom: 5 }}>
            <div />
            {displayDays.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, padding: '3px 0', color: d === todayName ? 'var(--accent)' : 'var(--text-muted)' }}>
                {viewMode === 'week' ? d.slice(0, 3).toUpperCase() : d}
                {d === todayName && <span style={{ display: 'block', width: 4, height: 4, borderRadius: '50%', background: 'var(--accent)', margin: '2px auto 0' }} />}
              </div>
            ))}
          </div>

          {/* Period rows */}
          {PERIODS.map(period => (
            <div key={period} style={{ display: 'grid', gridTemplateColumns: `72px repeat(${displayDays.length}, 1fr)`, gap: 5, marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10, fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>
                {period}
              </div>
              {displayDays.map(day => {
                const slot = timetable[key(day, period)];
                return (
                  <div
                    key={day}
                    onClick={() => openSlot(day, period)}
                    style={{
                      height: 56, borderRadius: 8, cursor: 'pointer', position: 'relative', overflow: 'hidden',
                      border: slot ? `1.5px solid ${slot.color}55` : '1px dashed var(--border)',
                      background: slot ? `${slot.color}18` : 'var(--bg-primary)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; if (!slot) e.currentTarget.style.borderColor = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; if (!slot) e.currentTarget.style.borderColor = 'var(--border)'; }}
                  >
                    {slot ? (
                      <>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: slot.color }} />
                        <div style={{ padding: '5px 6px 5px 9px' }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: slot.color, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{slot.subject}</div>
                          {slot.faculty && <div style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{slot.faculty}</div>}
                          {slot.room && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Room {slot.room}</div>}
                        </div>
                        <button
                          onClick={e => deleteSlot(day, period, e)}
                          style={{
                            position: 'absolute', top: 3, right: 3, width: 18, height: 18,
                            borderRadius: 4, border: 'none', cursor: 'pointer',
                            background: 'rgba(0,0,0,0.25)', color: 'white',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0, transition: 'opacity 0.15s',
                          }}
                          onMouseEnter={e => { e.stopPropagation(); e.currentTarget.style.opacity = 1; }}
                          onMouseLeave={e => { e.currentTarget.style.opacity = 0; }}
                        >
                          <TrashIcon />
                        </button>
                      </>
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', opacity: 0.35 }}>
                        <PlusIcon />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div
          onClick={() => setModal(null)}
          style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
        >
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 24, width: 320, border: '1px solid var(--border)', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>
              {timetable[key(modal.day, modal.period)] ? 'Edit' : 'Add'} Class
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>{modal.day} · {modal.period}</div>

            {[
              { label: 'Subject *', field: 'subject', placeholder: 'e.g. Data Structures' },
              { label: 'Faculty',   field: 'faculty', placeholder: 'e.g. Dr. Anita Sharma'  },
              { label: 'Room / Lab',field: 'room',    placeholder: 'e.g. CS-101'             },
            ].map(({ label, field, placeholder }) => (
              <div key={field} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>{label}</label>
                <input
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  onKeyDown={e => { if (e.key === 'Enter') saveSlot(); }}
                  style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
            ))}

            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: 6 }}>Colour</label>
              <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                    width: 24, height: 24, borderRadius: '50%', background: c, border: 'none', cursor: 'pointer',
                    boxShadow: form.color === c ? `0 0 0 3px ${c}66` : 'none',
                    transform: form.color === c ? 'scale(1.25)' : 'scale(1)',
                    transition: 'all 0.15s',
                  }} />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: '9px 0', borderRadius: 9, border: '1px solid var(--border)', background: 'var(--bg-primary)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              <button onClick={saveSlot} disabled={!form.subject.trim()} style={{ flex: 2, padding: '9px 0', borderRadius: 9, border: 'none', background: form.subject.trim() ? 'var(--accent)' : 'var(--bg-card-hover)', color: form.subject.trim() ? 'white' : 'var(--text-muted)', cursor: form.subject.trim() ? 'pointer' : 'default', fontSize: 13, fontWeight: 600 }}>
                Save Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
