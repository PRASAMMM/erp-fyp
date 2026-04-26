export default function Admissions() {
  const steps = [
    {
      num: '01',
      title: 'Check Eligibility',
      body: 'Complete +2 or equivalent with Science stream (Mathematics compulsory for CSIT/CE). Minimum 45% aggregate.',
    },
    {
      num: '02',
      title: 'Submit Application',
      body: 'Fill out the online form or collect physical form from the college office. Attach academic transcripts and citizenship copy.',
    },
    {
      num: '03',
      title: 'Entrance / Interview',
      body: 'Appear for the college-level entrance examination. Shortlisted candidates are called for counselling.',
    },
    {
      num: '04',
      title: 'Confirm Seat',
      body: 'Pay the initial fee within 7 days of selection. Classes commence in September for regular intake.',
    },
  ];

  return (
    <section
      id="admissions"
      style={{
        backgroundColor: '#080f1e',
        padding: '100px 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 28px' }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '80px',
          alignItems: 'start',
        }} className="admissions-grid">
          
          <div>
            <div style={{
              fontSize: '10px', color: 'rgba(255,255,255,0.25)',
              letterSpacing: '2.5px', textTransform: 'uppercase',
              fontFamily: 'system-ui, sans-serif', marginBottom: '14px',
            }}>Admissions 2025</div>
            <h2 style={{
              fontFamily: '"Crimson Pro", Georgia, serif',
              fontWeight: '700',
              fontSize: 'clamp(28px, 4vw, 44px)',
              color: 'white',
              margin: '0 0 20px',
              lineHeight: '1.1',
            }}>Apply for the<br/>upcoming intake</h2>
            <p style={{
              fontSize: '14.5px',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'system-ui, sans-serif',
              lineHeight: '1.75',
              margin: '0 0 32px',
            }}>
              Applications for the 2025 academic year are now open. Limited seats available across all programs. Early applicants are given preference in merit-based selection.
            </p>

            <div style={{
              padding: '20px 24px',
              backgroundColor: '#0f1a2e',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '4px',
              marginBottom: '28px',
            }}>
              <div style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'system-ui, sans-serif',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>Key Dates</div>
              {[
                { label: 'Form available', date: 'June 1, 2025' },
                { label: 'Last submission', date: 'July 31, 2025' },
                { label: 'Entrance exam', date: 'Aug 10–12, 2025' },
                { label: 'Classes begin', date: 'September 2025' },
              ].map(item => (
                <div key={item.label} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <span style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.45)',
                    fontFamily: 'system-ui, sans-serif',
                  }}>{item.label}</span>
                  <span style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.75)',
                    fontFamily: 'system-ui, sans-serif',
                  }}>{item.date}</span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              style={{
                display: 'inline-block',
                padding: '12px 28px',
                backgroundColor: '#1a4fa0',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '13.5px',
                fontFamily: 'system-ui, sans-serif',
                fontWeight: '500',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => e.target.style.backgroundColor = '#1a5fc0'}
              onMouseLeave={e => e.target.style.backgroundColor = '#1a4fa0'}
            >
              Contact Admissions Office
            </a>
          </div>

          {/* Steps */}
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', fontFamily: 'system-ui', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '28px' }}>
              How to apply
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {steps.map((step, i) => (
                <div key={step.num} style={{
                  display: 'flex',
                  gap: '20px',
                  paddingBottom: i < steps.length - 1 ? '28px' : '0',
                  position: 'relative',
                }}>
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '19px',
                      top: '32px',
                      bottom: 0,
                      width: '1px',
                      backgroundColor: 'rgba(255,255,255,0.07)',
                    }} />
                  )}
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '3px',
                    backgroundColor: '#0f1a2e',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontFamily: '"Crimson Pro", Georgia, serif',
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: '600',
                  }}>{step.num}</div>
                  <div style={{ paddingTop: '8px' }}>
                    <div style={{
                      fontSize: '14.5px',
                      fontFamily: 'system-ui, sans-serif',
                      fontWeight: '500',
                      color: 'white',
                      marginBottom: '6px',
                    }}>{step.title}</div>
                    <div style={{
                      fontSize: '13px',
                      fontFamily: 'system-ui, sans-serif',
                      color: 'rgba(255,255,255,0.4)',
                      lineHeight: '1.65',
                    }}>{step.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admissions-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
