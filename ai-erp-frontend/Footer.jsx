export default function Footer() {
  return (
    <>
      {/* Contact Section */}
      <section id="contact" style={{
        backgroundColor: '#0c1424',
        padding: '80px 0 60px',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 28px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '40px',
            paddingBottom: '48px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }} className="contact-grid">
            
            <div>
              <div style={{
                fontSize: '10px', color: 'rgba(255,255,255,0.25)',
                letterSpacing: '2px', textTransform: 'uppercase',
                fontFamily: 'system-ui, sans-serif', marginBottom: '20px',
              }}>Location</div>
              <p style={{
                fontSize: '13.5px',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'system-ui, sans-serif',
                lineHeight: '1.8',
                margin: 0,
              }}>
                Everest International College of Technology<br/>
                Gairidhara, Kathmandu<br/>
                Bagmati Province, Nepal
              </p>
            </div>

            <div>
              <div style={{
                fontSize: '10px', color: 'rgba(255,255,255,0.25)',
                letterSpacing: '2px', textTransform: 'uppercase',
                fontFamily: 'system-ui, sans-serif', marginBottom: '20px',
              }}>Contact</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Admissions', value: '+977-1-4004567' },
                  { label: 'General', value: '+977-1-4004568' },
                  { label: 'Email', value: 'info@eict.edu.np' },
                ].map(c => (
                  <div key={c.label}>
                    <span style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.25)',
                      fontFamily: 'system-ui, sans-serif',
                      marginRight: '8px',
                    }}>{c.label}</span>
                    <span style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.55)',
                      fontFamily: 'system-ui, sans-serif',
                    }}>{c.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{
                fontSize: '10px', color: 'rgba(255,255,255,0.25)',
                letterSpacing: '2px', textTransform: 'uppercase',
                fontFamily: 'system-ui, sans-serif', marginBottom: '20px',
              }}>Hours</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { day: 'Sun – Fri', time: '7:00 AM – 6:00 PM' },
                  { day: 'Saturday', time: '9:00 AM – 3:00 PM' },
                  { day: 'Holidays', time: 'Closed' },
                ].map(h => (
                  <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                    <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.35)', fontFamily: 'system-ui, sans-serif' }}>{h.day}</span>
                    <span style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.55)', fontFamily: 'system-ui, sans-serif' }}>{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#080f1e',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '28px 0',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{
              width: '28px', height: '28px',
              backgroundColor: '#1a4fa0',
              borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: '"Crimson Pro", Georgia, serif',
              fontWeight: '700',
              fontSize: '11px',
              color: 'white',
            }}>E</div>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'system-ui, sans-serif',
            }}>© 2025 Everest International College of Technology</span>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Use', 'Sitemap'].map(link => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: '11.5px',
                  color: 'rgba(255,255,255,0.25)',
                  textDecoration: 'none',
                  fontFamily: 'system-ui, sans-serif',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}
              >{link}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
