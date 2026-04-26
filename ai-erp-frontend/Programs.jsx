const programs = [
  {
    code: 'B.Sc.',
    name: 'Computer Science & Information Technology',
    short: 'CSIT',
    duration: '4 Years',
    seats: 72,
    description: 'A comprehensive program covering algorithms, systems, AI, databases, and software engineering. The most sought-after program in Nepalese computing education.',
    accent: '#1a4fa0',
    size: 'large',
  },
  {
    code: 'B.E.',
    name: 'Computer Engineering',
    short: 'CE',
    duration: '4 Years',
    seats: 48,
    description: 'Bridges hardware and software — covering embedded systems, networking, VLSI, and systems design.',
    accent: '#0d7a6a',
    size: 'medium',
  },
  {
    code: 'BIT',
    name: 'Bachelor of Information Technology',
    short: 'BIT',
    duration: '3 Years',
    seats: 48,
    description: 'Practical-focused program balancing business, management and information systems.',
    accent: '#5a3fa0',
    size: 'medium',
  },
  {
    code: 'BCA',
    name: 'Bachelor of Computer Applications',
    short: 'BCA',
    duration: '3 Years',
    seats: 64,
    description: 'Foundation-level computing education with strong focus on programming, web technologies, and application development.',
    accent: '#a03f1a',
    size: 'small',
  },
  {
    code: 'M.Sc.',
    name: 'Master of Science in CS',
    short: 'M.Sc. CSIT',
    duration: '2 Years',
    seats: 24,
    description: 'Advanced research and coursework in machine learning, distributed systems, and advanced algorithms.',
    accent: '#1a4fa0',
    size: 'small',
  },
];

function ProgramCard({ program }) {
  const isLarge = program.size === 'large';

  return (
    <div
      style={{
        backgroundColor: '#0f1a2e',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '4px',
        padding: isLarge ? '32px' : '24px',
        gridColumn: isLarge ? 'span 2' : 'span 1',
        display: 'flex',
        flexDirection: isLarge ? 'row' : 'column',
        gap: isLarge ? '48px' : '16px',
        alignItems: isLarge ? 'center' : 'flex-start',
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${program.accent}40`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Subtle left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '3px',
        backgroundColor: program.accent,
        opacity: 0.7,
      }} />

      <div style={{ flex: isLarge ? 1 : 'unset' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '10px' }}>
          <span style={{
            fontSize: '11px',
            color: program.accent,
            fontFamily: 'system-ui, sans-serif',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            fontWeight: '600',
          }}>{program.code}</span>
          <span style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.2)',
            fontFamily: 'system-ui, sans-serif',
          }}>·</span>
          <span style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'system-ui, sans-serif',
          }}>{program.duration}</span>
        </div>
        <h3 style={{
          fontFamily: '"Crimson Pro", Georgia, serif',
          fontSize: isLarge ? '28px' : '21px',
          fontWeight: '600',
          color: 'white',
          margin: '0 0 12px',
          lineHeight: '1.2',
        }}>{program.name}</h3>
        <p style={{
          fontSize: '13.5px',
          color: 'rgba(255,255,255,0.45)',
          fontFamily: 'system-ui, sans-serif',
          lineHeight: '1.7',
          margin: 0,
          maxWidth: isLarge ? '400px' : 'none',
        }}>{program.description}</p>
      </div>

      {isLarge && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          minWidth: '180px',
        }}>
          <div style={{
            padding: '16px 20px',
            backgroundColor: 'rgba(26,79,160,0.12)',
            borderRadius: '3px',
            border: '1px solid rgba(26,79,160,0.2)',
          }}>
            <div style={{
              fontSize: '28px',
              fontFamily: '"Crimson Pro", Georgia, serif',
              fontWeight: '700',
              color: 'white',
            }}>{program.seats}</div>
            <div style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.35)',
              fontFamily: 'system-ui, sans-serif',
            }}>Seats available</div>
          </div>
          <a
            href="#admissions"
            style={{
              padding: '10px 20px',
              backgroundColor: program.accent,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '3px',
              fontSize: '12.5px',
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'center',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            Apply Now
          </a>
        </div>
      )}

      {!isLarge && (
        <div style={{
          marginTop: 'auto',
          paddingTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}>
          <span style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.25)',
            fontFamily: 'system-ui, sans-serif',
          }}>{program.seats} seats</span>
          <a
            href="#admissions"
            style={{
              fontSize: '12px',
              color: program.accent,
              textDecoration: 'none',
              fontFamily: 'system-ui, sans-serif',
            }}
          >Apply →</a>
        </div>
      )}
    </div>
  );
}

export default function Programs() {
  return (
    <section id="programs" style={{
      backgroundColor: '#0c1424',
      padding: '100px 0',
      borderTop: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 28px' }}>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '48px',
        }} className="programs-header">
          <div>
            <div style={{
              fontSize: '10px', color: 'rgba(255,255,255,0.25)',
              letterSpacing: '2.5px', textTransform: 'uppercase',
              fontFamily: 'system-ui, sans-serif', marginBottom: '12px',
            }}>Academic Programs</div>
            <h2 style={{
              fontFamily: '"Crimson Pro", Georgia, serif',
              fontWeight: '700',
              fontSize: 'clamp(30px, 4vw, 44px)',
              color: 'white',
              margin: 0,
              lineHeight: '1.1',
            }}>Programs we offer</h2>
          </div>
          <p style={{
            fontSize: '13.5px',
            color: 'rgba(255,255,255,0.35)',
            fontFamily: 'system-ui, sans-serif',
            maxWidth: '280px',
            textAlign: 'right',
            lineHeight: '1.6',
            margin: 0,
          }}>TU-affiliated programs meeting international computing education standards.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
        }} className="programs-grid">
          {programs.map(p => (
            <ProgramCard key={p.short} program={p} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .programs-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
          .programs-header p { text-align: left !important; }
          .programs-grid { grid-template-columns: 1fr !important; }
          .programs-grid > div { grid-column: span 1 !important; flex-direction: column !important; }
        }
      `}</style>
    </section>
  );
}
