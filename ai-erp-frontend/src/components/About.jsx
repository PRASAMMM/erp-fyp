export default function About() {
  return (
    <section
      id="about"
      style={{
        backgroundColor: '#06101f',
        padding: '110px 0 90px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid texture background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `radial-gradient(circle at 80% 20%, rgba(26,79,160,0.07) 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 28px', position: 'relative' }}>

        {/* Section label */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '72px',
        }}>
          <div style={{ width: '32px', height: '1px', backgroundColor: '#1a4fa0' }} />
          <span style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.3)',
            letterSpacing: '2.5px', textTransform: 'uppercase',
            fontFamily: '"DM Sans", system-ui, sans-serif',
          }}>About EICT</span>
        </div>

        {/* Two-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '72px',
          alignItems: 'center',
        }} className="about-grid">

          {/* Left: photo composition */}
          <div style={{ position: 'relative' }}>
            {/* Main tall photo */}
            <div style={{
              width: '100%',
              aspectRatio: '3/4',
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            }}>
              <img
                src="/assets/campus_bg.png"
                alt="College campus building"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(0.75) saturate(0.8)',
                }}
              />
              {/* Bottom gradient */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: '50%',
                background: 'linear-gradient(transparent, rgba(6,16,31,0.8))',
              }} />
              {/* "Kathmandu, Nepal" label */}
              <div style={{
                position: 'absolute',
                bottom: '20px', left: '20px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
              }}>Kathmandu, Nepal</div>
            </div>

            {/* Overlapping secondary photo — bottom-right */}
            <div style={{
              position: 'absolute',
              bottom: '-28px', right: '-24px',
              width: '52%',
              aspectRatio: '4/3',
              borderRadius: '6px',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
              border: '3px solid #06101f',
            }}>
              <img
                src="/assets/students_studying.png"
                alt="Students in class"
                style={{
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(0.8)',
                }}
              />
            </div>

            {/* Year founded badge */}
            <div style={{
              position: 'absolute',
              top: '24px', right: '-16px',
              backgroundColor: '#1a4fa0',
              borderRadius: '6px',
              padding: '18px 22px',
              boxShadow: '0 16px 40px rgba(26,79,160,0.45)',
            }}>
              <div style={{
                fontSize: '30px',
                fontFamily: '"Playfair Display", Georgia, serif',
                fontWeight: '700',
                color: 'white',
                lineHeight: 1,
              }}>2005</div>
              <div style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.6)',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginTop: '3px',
              }}>Founded</div>
            </div>
          </div>

          {/* Right: text */}
          <div style={{ paddingTop: '16px', paddingBottom: '56px' }}>
            <h2 style={{
              fontFamily: '"Playfair Display", "Crimson Pro", Georgia, serif',
              fontWeight: '400',
              fontSize: 'clamp(30px, 3.8vw, 48px)',
              color: 'white',
              lineHeight: '1.15',
              margin: '0 0 8px',
              letterSpacing: '-0.3px',
            }}>
              Shaping engineers,
            </h2>
            <h2 style={{
              fontFamily: '"Playfair Display", "Crimson Pro", Georgia, serif',
              fontWeight: '700',
              fontSize: 'clamp(30px, 3.8vw, 48px)',
              color: 'white',
              lineHeight: '1.15',
              margin: '0 0 32px',
              letterSpacing: '-0.5px',
            }}>
              one generation at a time.
            </h2>

            <p style={{
              fontSize: '15.5px',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              lineHeight: '1.8',
              margin: '0 0 18px',
            }}>
              Everest International College of Technology has been one of Nepal's most respected computing and engineering institutions since 2005. Affiliated with Tribhuvan University, EICT offers rigorous programs meeting international standards.
            </p>

            <p style={{
              fontSize: '15.5px',
              color: 'rgba(255,255,255,0.5)',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              lineHeight: '1.8',
              margin: '0 0 40px',
            }}>
              Our faculty combines academic depth with real industry experience — producing graduates who thrive across Nepal's growing tech sector and beyond.
            </p>

            {/* Attribute list with photos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'Affiliated with Tribhuvan University',
                'UGC recognized programs',
                'Industry-aligned curriculum updated annually',
                'Dedicated research & innovation lab',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '20px', height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(26,79,160,0.2)',
                    border: '1px solid rgba(26,79,160,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4.5 7.5L8 3" stroke="#4a8fe8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.6)',
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                  }}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA link */}
            <a href="#programs" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '36px',
              fontSize: '13px',
              color: '#4a8fe8',
              textDecoration: 'none',
              fontFamily: '"DM Sans", system-ui, sans-serif',
              fontWeight: '500',
              letterSpacing: '0.3px',
              transition: 'gap 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.gap = '12px'}
            onMouseLeave={e => e.currentTarget.style.gap = '8px'}
            >
              View our programs
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="#4a8fe8" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500&display=swap');
        @media (max-width: 860px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 80px !important;
          }
          .about-grid > div:first-child {
            max-width: 500px;
          }
        }
      `}</style>
    </section>
  );
}
