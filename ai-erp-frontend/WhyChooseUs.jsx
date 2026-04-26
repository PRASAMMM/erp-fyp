const reasons = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6C3 4.89543 3.89543 4 5 4H17C18.1046 4 19 4.89543 19 6V8H3V6Z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M3 8H19V17C19 18.1046 18.1046 19 17 19H5C3.89543 19 3 18.1046 3 17V8Z" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M8 4V2M14 4V2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M7 13L9.5 15.5L15 10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'TU Recognized',
    body: 'Fully affiliated with Tribhuvan University. Degrees recognized across government and private sectors in Nepal.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="8" r="4" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M5 19C5 16.2386 7.68629 14 11 14C14.3137 14 17 16.2386 17 19" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M16 4L18 6L20 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Industry Faculty',
    body: 'Our lecturers bring active industry experience — not just textbook knowledge.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="12" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="3" y="12" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
        <rect x="12" y="12" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
    title: 'Modern Curriculum',
    body: 'Updated syllabi covering AI/ML, cloud computing, DevOps, and cybersecurity alongside core CS foundations.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 17L4 9L11 4L18 9V17" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
        <rect x="8" y="13" width="6" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.3"/>
      </svg>
    ),
    title: 'Campus Facilities',
    body: 'Well-equipped computer labs, library, seminar halls, and dedicated project rooms in central Kathmandu.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M11 7V11L14 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Flexible Timings',
    body: 'Morning and day shifts for undergrads. Evening batches available for working professionals.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 8H19M7 3V5M15 3V5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <rect x="3" y="5" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M7 12H10M7 15H13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Placement Support',
    body: "Dedicated career cell with tie-ups to Nepal's leading IT companies and internship pipelines.",
  },
];

export default function WhyChooseUs() {
  return (
    <section style={{
      backgroundColor: '#080f1f',
      padding: '110px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background photo strip */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: '38%', height: '100%',
        opacity: 0.07,
        backgroundImage: `url('https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        maskImage: 'linear-gradient(to left, black 0%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to left, black 0%, transparent 100%)',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 28px', position: 'relative' }}>

        {/* Header row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'end',
          marginBottom: '64px',
        }} className="why-header">
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px',
            }}>
              <div style={{ width: '28px', height: '1px', backgroundColor: '#1a4fa0' }} />
              <span style={{
                fontSize: '10px', color: 'rgba(255,255,255,0.25)',
                letterSpacing: '2.5px', textTransform: 'uppercase',
                fontFamily: '"DM Sans", system-ui, sans-serif',
              }}>Why EICT</span>
            </div>
            <h2 style={{
              fontFamily: '"Playfair Display", "Crimson Pro", Georgia, serif',
              fontWeight: '700',
              fontSize: 'clamp(28px, 3.8vw, 46px)',
              color: 'white',
              margin: 0,
              lineHeight: '1.1',
            }}>What sets us apart</h2>
          </div>

          {/* Inline photo card */}
          <div style={{
            borderRadius: '8px',
            overflow: 'hidden',
            height: '120px',
            position: 'relative',
            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
          }}>
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80&fit=crop"
              alt="Students collaborating"
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover',
                display: 'block',
                filter: 'brightness(0.65) saturate(0.7)',
              }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, rgba(8,15,31,0.7) 0%, transparent 60%)',
              display: 'flex', alignItems: 'center',
              padding: '0 24px',
            }}>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                lineHeight: '1.65',
                margin: 0,
                maxWidth: '260px',
              }}>
                We're not the largest. We focus on being the most attentive.
              </p>
            </div>
          </div>
        </div>

        {/* Grid of reasons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          overflow: 'hidden',
        }} className="why-grid">
          {reasons.map((r) => (
            <div
              key={r.title}
              style={{
                backgroundColor: '#080f1f',
                padding: '32px 28px',
                transition: 'background-color 0.2s',
                cursor: 'default',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0e1730'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#080f1f'}
            >
              <div style={{
                color: '#4a8fe8',
                marginBottom: '16px',
                width: '40px', height: '40px',
                backgroundColor: 'rgba(26,79,160,0.12)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{r.icon}</div>
              <h3 style={{
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontSize: '15px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.9)',
                margin: '0 0 8px',
                letterSpacing: '0.1px',
              }}>{r.title}</h3>
              <p style={{
                fontSize: '13.5px',
                color: 'rgba(255,255,255,0.4)',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                lineHeight: '1.7',
                margin: 0,
              }}>{r.body}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap');
        @media (max-width: 960px) {
          .why-header { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
