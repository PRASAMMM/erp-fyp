import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const textRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    const im = imgRef.current;
    if (!el || !im) return;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 120);
    setTimeout(() => {
      im.style.opacity = '1';
      im.style.transform = 'translateY(0) scale(1)';
    }, 300);
  }, []);

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#06101f',
        overflow: 'hidden',
      }}
    >
      {/* Full-bleed background photo — dimmed */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?w=1800&q=80&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        opacity: 0.18,
        filter: 'grayscale(40%)',
      }} />

      {/* Dark overlay gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(100deg, #06101f 55%, rgba(6,16,31,0.6) 100%)',
      }} />

      {/* Right side: large campus photo card */}
      <div
        ref={imgRef}
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-40%) scale(0.97)',
          width: 'clamp(320px, 42vw, 600px)',
          height: 'clamp(400px, 55vh, 680px)',
          opacity: 0,
          transition: 'opacity 1s ease, transform 1s ease',
        }}
      >
        {/* Stacked photo panels */}
        <div style={{
          position: 'absolute',
          top: '40px', right: '60px',
          width: '75%', height: '55%',
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <img
            src="https://unsplash.com/photos/people-sitting-down-near-table-with-assorted-laptop-computers-SYTO3xs06fU"
            alt="Students in computer lab"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.85)' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 50%, rgba(6,16,31,0.6) 100%)',
          }} />
        </div>

        <div style={{
          position: 'absolute',
          bottom: '40px', left: '20px',
          width: '55%', height: '42%',
          borderRadius: '6px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.8)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80&fit=crop"
            alt="Students studying"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.8)' }}
          />
        </div>

        {/* Floating stat badge */}
        <div style={{
          position: 'absolute',
          bottom: '70px', right: '40px',
          backgroundColor: '#1a4fa0',
          borderRadius: '8px',
          padding: '16px 20px',
          boxShadow: '0 16px 40px rgba(26,79,160,0.4)',
        }}>
          <div style={{
            fontSize: '28px',
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: '700',
            color: 'white',
            lineHeight: 1,
          }}>94%</div>
          <div style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
            marginTop: '3px',
          }}>Graduate Employment</div>
        </div>
      </div>

      {/* Left: main text content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '130px 28px 80px 64px',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        <div
          ref={textRef}
          style={{
            opacity: 0,
            transform: 'translateY(28px)',
            transition: 'opacity 0.9s ease, transform 0.9s ease',
            maxWidth: '580px',
          }}
        >
          {/* Affiliation pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(26,79,160,0.15)',
            border: '1px solid rgba(26,79,160,0.35)',
            borderRadius: '100px',
            padding: '5px 14px 5px 8px',
            marginBottom: '36px',
          }}>
            <div style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              backgroundColor: '#4a8fe8',
            }} />
            <span style={{
              fontSize: '11px',
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontFamily: 'system-ui, sans-serif',
              fontWeight: '500',
            }}>Tribhuvan University Affiliated</span>
          </div>

          {/* Headline */}
          <h1 style={{
            margin: '0 0 6px',
            fontFamily: '"Playfair Display", "Crimson Pro", Georgia, serif',
            fontWeight: '400',
            fontSize: 'clamp(42px, 6.5vw, 82px)',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: '1.05',
            letterSpacing: '-0.5px',
          }}>
            Everest International
          </h1>
          <h1 style={{
            margin: '0 0 28px',
            fontFamily: '"Playfair Display", "Crimson Pro", Georgia, serif',
            fontWeight: '700',
            fontSize: 'clamp(42px, 6.5vw, 82px)',
            color: 'white',
            lineHeight: '1.05',
            letterSpacing: '-1px',
          }}>
            College of Technology
          </h1>

          <p style={{
            margin: '0 0 44px',
            fontSize: 'clamp(15px, 1.7vw, 17px)',
            color: 'rgba(255,255,255,0.48)',
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontWeight: '400',
            lineHeight: '1.75',
            maxWidth: '480px',
          }}>
            Empowering Nepal's next generation of engineers and developers — with rigorous academics, industry mentors, and a campus built for the future.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '60px' }}>
            <a
              href="#admissions"
              style={{
                padding: '14px 32px',
                backgroundColor: '#1a4fa0',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontWeight: '500',
                letterSpacing: '0.2px',
                boxShadow: '0 8px 24px rgba(26,79,160,0.4)',
                transition: 'transform 0.15s, box-shadow 0.15s',
                display: 'inline-block',
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(26,79,160,0.55)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(26,79,160,0.4)';
              }}
            >
              Apply for 2025 Intake
            </a>
            <Link
              to="/login"
              style={{
                padding: '14px 32px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.85)',
                textDecoration: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                fontFamily: '"DM Sans", system-ui, sans-serif',
                fontWeight: '400',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.15s',
                display: 'inline-block',
              }}
              onMouseEnter={e => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.09)';
                e.target.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={e => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.05)';
                e.target.style.borderColor = 'rgba(255,255,255,0.15)';
              }}
            >
              Student / Staff Login
            </Link>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'flex',
            gap: '40px',
            paddingTop: '36px',
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            {[
              { num: '3,200+', label: 'Students enrolled' },
              { num: '18 yrs', label: 'Of excellence' },
              { num: '5', label: 'Programs offered' },
            ].map(s => (
              <div key={s.label}>
                <div style={{
                  fontSize: 'clamp(20px, 2.5vw, 26px)',
                  fontFamily: '"Playfair Display", Georgia, serif',
                  fontWeight: '700',
                  color: 'white',
                  lineHeight: '1',
                  marginBottom: '4px',
                }}>{s.num}</div>
                <div style={{
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.3)',
                  letterSpacing: '0.5px',
                  fontFamily: 'system-ui, sans-serif',
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '140px',
        background: 'linear-gradient(to bottom, transparent, #06101f)',
        pointerEvents: 'none',
      }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500&display=swap');
        @media (max-width: 860px) {
          #home > div:nth-child(4) { display: none !important; }
        }
      `}</style>
    </section>
  );
}
