#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Run this from: ~/Desktop/PROJECT/code/ai-erp-frontend/
# Command: bash setup.sh
# ─────────────────────────────────────────────────────────────

echo "📁 Creating folders..."
mkdir -p src/components

echo "✍️  Writing component files into src/components/ ..."

# ── Navbar ────────────────────────────────────────────────────
cat > src/components/Navbar.jsx << 'EOF'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = [
    { label: 'Home',       href: '#home' },
    { label: 'About',      href: '#about' },
    { label: 'Programs',   href: '#programs' },
    { label: 'Admissions', href: '#admissions' },
    { label: 'Contact',    href: '#contact' },
  ];

  const navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    transition: 'all 0.3s',
    backgroundColor: scrolled ? 'rgba(10,18,35,0.97)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
  };

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: scrolled ? 60 : 72, transition: 'height 0.3s' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, backgroundColor: '#1a4fa0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white', fontFamily: 'Georgia,serif' }}>E</div>
          <div>
            <div style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 16, color: 'white', lineHeight: 1.1 }}>EICT</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'system-ui,sans-serif' }}>Kathmandu</div>
          </div>
        </Link>

        <div className="eict-dnav" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {links.map(l => (
            <a key={l.label} href={l.href} style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: 13.5, padding: '6px 12px', borderRadius: 4, fontFamily: 'system-ui,sans-serif', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >{l.label}</a>
          ))}
          <Link to="/login" style={{ marginLeft: 12, padding: '8px 20px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, color: 'white', fontSize: 13, fontFamily: 'system-ui,sans-serif', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.target.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.target.style.borderColor = 'rgba(255,255,255,0.5)'; }}
            onMouseLeave={e => { e.target.style.backgroundColor = 'transparent'; e.target.style.borderColor = 'rgba(255,255,255,0.3)'; }}
          >ERP Login</Link>
        </div>

        <button className="eict-mbtn" onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {menuOpen
              ? <path d="M4 4L18 18M18 4L4 18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              : <><line x1="3" y1="6" x2="19" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="11" x2="19" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="3" y1="16" x2="14" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></>}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div style={{ backgroundColor: 'rgba(10,18,35,0.98)', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '16px 28px 20px' }}>
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
              style={{ display: 'block', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: 14, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: 'system-ui,sans-serif' }}
            >{l.label}</a>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)}
            style={{ display: 'inline-block', marginTop: 16, padding: '9px 22px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 4, color: 'white', textDecoration: 'none', fontSize: 13, fontFamily: 'system-ui,sans-serif' }}
          >ERP Login</Link>
        </div>
      )}
      <style>{`@media(max-width:768px){.eict-dnav{display:none!important}.eict-mbtn{display:block!important}}`}</style>
    </nav>
  );
}
EOF

# ── Hero ──────────────────────────────────────────────────────
cat > src/components/Hero.jsx << 'EOF'
import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export default function Hero() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 100);
  }, []);

  return (
    <section id="home" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', backgroundColor: '#080f1e', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 80% 60% at 70% 40%,rgba(26,79,160,.13) 0%,transparent 70%),radial-gradient(ellipse 50% 80% at 10% 80%,rgba(10,120,100,.07) 0%,transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: 50, top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.04)' }} />
      <div style={{ position: 'absolute', left: 24, bottom: 48, writingMode: 'vertical-rl', fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '2px', fontFamily: 'system-ui,sans-serif', textTransform: 'uppercase' }}>Est. 2005</div>
      <div style={{ position: 'absolute', right: 28, bottom: 48, fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '1.5px', fontFamily: 'system-ui,sans-serif', textTransform: 'uppercase' }}>Kathmandu, Nepal</div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '120px 28px 80px 80px', width: '100%' }}>
        <div ref={ref} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.8s ease,transform 0.8s ease', maxWidth: 760 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <div style={{ width: 28, height: 1, backgroundColor: '#1a4fa0' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'system-ui,sans-serif' }}>Tribhuvan University Affiliated</span>
          </div>

          <h1 style={{ margin: '0 0 8px', fontFamily: 'Georgia,serif', fontWeight: 300, fontSize: 'clamp(40px,6.5vw,80px)', color: 'rgba(255,255,255,0.88)', lineHeight: 1.05, letterSpacing: '-0.5px' }}>Everest International</h1>
          <h1 style={{ margin: '0 0 28px', fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 'clamp(40px,6.5vw,80px)', color: 'white', lineHeight: 1.05, letterSpacing: '-1px' }}>College of Technology</h1>

          <p style={{ margin: '0 0 48px', fontSize: 'clamp(15px,1.8vw,18px)', color: 'rgba(255,255,255,0.42)', fontFamily: 'system-ui,sans-serif', lineHeight: 1.7, maxWidth: 520 }}>
            Empowering future innovators through technology and excellence — a premier engineering and computing institution in the heart of Kathmandu.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <a href="#admissions" style={{ padding: '13px 32px', backgroundColor: '#1a4fa0', color: 'white', textDecoration: 'none', borderRadius: 4, fontSize: 14, fontFamily: 'system-ui,sans-serif', fontWeight: 500, transition: 'background-color 0.2s' }}
              onMouseEnter={e => e.target.style.backgroundColor = '#2060c0'}
              onMouseLeave={e => e.target.style.backgroundColor = '#1a4fa0'}>Apply for 2025 Intake</a>
            <Link to="/login" style={{ padding: '13px 32px', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderRadius: 4, fontSize: 14, fontFamily: 'system-ui,sans-serif', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.borderColor = 'rgba(255,255,255,0.45)'; e.target.style.color = 'white'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)'; e.target.style.color = 'rgba(255,255,255,0.8)'; }}>Student / Staff Login</Link>
          </div>

          <div style={{ display: 'flex', gap: 40, marginTop: 64, paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.07)', flexWrap: 'wrap' }}>
            {[{ num: '3,200+', label: 'Students enrolled' }, { num: '18', label: 'Years of excellence' }, { num: '94%', label: 'Graduate employment' }].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: 'clamp(22px,3vw,30px)', fontFamily: 'Georgia,serif', fontWeight: 600, color: 'white', lineHeight: 1, marginBottom: 4 }}>{s.num}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.5px', fontFamily: 'system-ui,sans-serif' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom,transparent,#0c1424)', pointerEvents: 'none' }} />
    </section>
  );
}
EOF

# ── About ─────────────────────────────────────────────────────
cat > src/components/About.jsx << 'EOF'
export default function About() {
  return (
    <section id="about" style={{ backgroundColor: '#0c1424', padding: '100px 0 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.22)', letterSpacing: '2.5px', textTransform: 'uppercase', fontFamily: 'system-ui,sans-serif' }}>About EICT</span>
          <div style={{ flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }} className="eict-ag">
          <div style={{ position: 'relative', paddingBottom: 32 }}>
            <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#111e35', borderRadius: 3, overflow: 'hidden' }}>
              <svg width="100%" height="100%" viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg">
                <rect width="480" height="360" fill="#0d1829"/>
                <rect x="80" y="80" width="320" height="180" fill="#142240" rx="1"/>
                {[100,150,200,250,300,350].map((x,i)=><rect key={`a${i}`} x={x} y="100" width="28" height="20" fill={i%3===0?'#1a4fa0':'#0f1e36'} rx="1"/>)}
                {[100,150,200,250,300,350].map((x,i)=><rect key={`b${i}`} x={x} y="140" width="28" height="20" fill={i%2===0?'#0f1e36':'#122040'} rx="1"/>)}
                {[100,150,200,250,300,350].map((x,i)=><rect key={`c${i}`} x={x} y="180" width="28" height="20" fill={i%3===1?'#1a4fa0':'#0f1e36'} rx="1"/>)}
                <rect x="200" y="210" width="80" height="50" fill="#0a1220" rx="1"/>
                <rect x="215" y="200" width="50" height="10" fill="#1a4fa0"/>
                <rect x="205" y="210" width="8" height="50" fill="#0d1b30"/>
                <rect x="267" y="210" width="8" height="50" fill="#0d1b30"/>
                <line x1="240" y1="20" x2="240" y2="80" stroke="rgba(255,255,255,0.12)" strokeWidth="2"/>
                <rect x="240" y="20" width="30" height="18" fill="#1a4fa0" opacity="0.6"/>
                <rect x="30" y="200" width="18" height="50" fill="#0a1220"/><ellipse cx="39" cy="185" rx="28" ry="22" fill="#0d2015"/>
                <rect x="430" y="210" width="18" height="40" fill="#0a1220"/><ellipse cx="439" cy="197" rx="24" ry="18" fill="#0d2015"/>
                <text x="240" y="165" textAnchor="middle" fill="rgba(255,255,255,0.1)" fontSize="14" fontFamily="serif" letterSpacing="4">EICT</text>
              </svg>
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: -20, backgroundColor: '#1a4fa0', borderRadius: 3, padding: '20px 24px', width: 180 }}>
              <div style={{ fontSize: 32, fontFamily: 'Georgia,serif', fontWeight: 700, color: 'white', lineHeight: 1 }}>2005</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: 'system-ui,sans-serif', marginTop: 4 }}>Year founded</div>
            </div>
          </div>
          <div style={{ paddingTop: 24 }}>
            <h2 style={{ fontFamily: 'Georgia,serif', fontWeight: 400, fontSize: 'clamp(28px,4vw,44px)', color: 'white', lineHeight: 1.15, margin: '0 0 24px', letterSpacing: '-0.3px' }}>
              Shaping engineers,<br/><span style={{ fontWeight: 700 }}>one generation at a time.</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.48)', fontFamily: 'system-ui,sans-serif', lineHeight: 1.8, margin: '0 0 20px' }}>Everest International College of Technology has been one of Nepal's most respected computing and engineering institutions since 2005, affiliated with Tribhuvan University.</p>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.48)', fontFamily: 'system-ui,sans-serif', lineHeight: 1.8, margin: '0 0 36px' }}>Our faculty combines academic depth with industry experience, giving students a grounded education that prepares them for careers both in Nepal and abroad.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Affiliated with Tribhuvan University','UGC recognized programs','Industry-aligned curriculum','Dedicated research & innovation lab'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: '#1a4fa0', flexShrink: 0 }} />
                  <span style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.52)', fontFamily: 'system-ui,sans-serif' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.eict-ag{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </section>
  );
}
EOF

# ── Programs ──────────────────────────────────────────────────
cat > src/components/Programs.jsx << 'EOF'
const programs = [
  { code:'B.Sc.', name:'Computer Science & Information Technology', short:'CSIT', duration:'4 Years', seats:72, description:'A comprehensive program covering algorithms, systems, AI, databases, and software engineering. The most sought-after computing program in Nepal.', accent:'#1a4fa0', size:'large' },
  { code:'B.E.', name:'Computer Engineering', short:'CE', duration:'4 Years', seats:48, description:'Bridges hardware and software — embedded systems, networking, VLSI, and systems design.', accent:'#0d7a6a', size:'medium' },
  { code:'BIT', name:'Bachelor of Information Technology', short:'BIT', duration:'3 Years', seats:48, description:'Practical-focused program balancing business, management, and information systems.', accent:'#5a3fa0', size:'medium' },
  { code:'BCA', name:'Bachelor of Computer Applications', short:'BCA', duration:'3 Years', seats:64, description:'Foundation computing with strong focus on programming, web technologies, and application development.', accent:'#a03f1a', size:'small' },
  { code:'M.Sc.', name:'Master of Science in CS', short:'M.Sc. CSIT', duration:'2 Years', seats:24, description:'Advanced research in machine learning, distributed systems, and advanced algorithms.', accent:'#1a4fa0', size:'small' },
];

function ProgramCard({ p }) {
  const big = p.size === 'large';
  return (
    <div style={{ backgroundColor:'#0f1a2e', border:'1px solid rgba(255,255,255,0.06)', borderRadius:4, padding: big?32:24, gridColumn: big?'span 2':'span 1', display:'flex', flexDirection: big?'row':'column', gap: big?48:16, alignItems: big?'center':'flex-start', transition:'border-color 0.2s,transform 0.2s', position:'relative', overflow:'hidden' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=p.accent+'40';e.currentTarget.style.transform='translateY(-2px)';}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.06)';e.currentTarget.style.transform='translateY(0)';}}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, backgroundColor:p.accent, opacity:0.7 }} />
      <div style={{ flex: big?1:'unset' }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:10 }}>
          <span style={{ fontSize:11, color:p.accent, fontFamily:'system-ui,sans-serif', letterSpacing:'1.5px', textTransform:'uppercase', fontWeight:600 }}>{p.code}</span>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.28)', fontFamily:'system-ui,sans-serif' }}>{p.duration}</span>
        </div>
        <h3 style={{ fontFamily:'Georgia,serif', fontSize: big?26:20, fontWeight:600, color:'white', margin:'0 0 12px', lineHeight:1.2 }}>{p.name}</h3>
        <p style={{ fontSize:13.5, color:'rgba(255,255,255,0.43)', fontFamily:'system-ui,sans-serif', lineHeight:1.7, margin:0, maxWidth: big?400:'none' }}>{p.description}</p>
      </div>
      {big && (
        <div style={{ display:'flex', flexDirection:'column', gap:16, minWidth:180 }}>
          <div style={{ padding:'16px 20px', backgroundColor:'rgba(26,79,160,0.12)', borderRadius:3, border:'1px solid rgba(26,79,160,0.2)' }}>
            <div style={{ fontSize:28, fontFamily:'Georgia,serif', fontWeight:700, color:'white' }}>{p.seats}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.32)', fontFamily:'system-ui,sans-serif' }}>Seats available</div>
          </div>
          <a href="#admissions" style={{ padding:'10px 20px', backgroundColor:p.accent, color:'white', textDecoration:'none', borderRadius:3, fontSize:12.5, fontFamily:'system-ui,sans-serif', textAlign:'center' }}>Apply Now</a>
        </div>
      )}
      {!big && (
        <div style={{ marginTop:'auto', paddingTop:12, display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%' }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,0.22)', fontFamily:'system-ui,sans-serif' }}>{p.seats} seats</span>
          <a href="#admissions" style={{ fontSize:12, color:p.accent, textDecoration:'none', fontFamily:'system-ui,sans-serif' }}>Apply →</a>
        </div>
      )}
    </div>
  );
}

export default function Programs() {
  return (
    <section id="programs" style={{ backgroundColor:'#0c1424', padding:'100px 0', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:48, flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:12 }}>Academic Programs</div>
            <h2 style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'clamp(28px,4vw,42px)', color:'white', margin:0, lineHeight:1.1 }}>Programs we offer</h2>
          </div>
          <p style={{ fontSize:13.5, color:'rgba(255,255,255,0.32)', fontFamily:'system-ui,sans-serif', maxWidth:280, textAlign:'right', lineHeight:1.6, margin:0 }}>TU-affiliated programs meeting international computing education standards.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }} className="eict-pg">
          {programs.map(p => <ProgramCard key={p.short} p={p} />)}
        </div>
      </div>
      <style>{`@media(max-width:768px){.eict-pg{grid-template-columns:1fr!important}.eict-pg>div{grid-column:span 1!important;flex-direction:column!important}}`}</style>
    </section>
  );
}
EOF

# ── WhyChooseUs ───────────────────────────────────────────────
cat > src/components/WhyChooseUs.jsx << 'EOF'
const reasons = [
  { title:'TU Recognized',    body:'Fully affiliated with Tribhuvan University. Degrees recognized across government and private sectors in Nepal.' },
  { title:'Industry Faculty', body:'Our lecturers bring active industry experience — not just textbook knowledge.' },
  { title:'Modern Curriculum',body:'Updated syllabi covering AI/ML, cloud computing, DevOps, and cybersecurity alongside core CS foundations.' },
  { title:'Campus Facilities', body:'Well-equipped computer labs, library, seminar halls, and project rooms in central Kathmandu.' },
  { title:'Flexible Timings', body:'Morning and day shifts for undergraduates. Evening batches available for working professionals.' },
  { title:'Placement Support', body:"Dedicated career cell with tie-ups to Nepal's leading IT companies and internship pipelines." },
];
export default function WhyChooseUs() {
  return (
    <section style={{ backgroundColor:'#080f1e', padding:'100px 0', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ marginBottom:56, maxWidth:560 }}>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:14 }}>Why EICT</div>
          <h2 style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'clamp(28px,4vw,42px)', color:'white', margin:'0 0 16px', lineHeight:1.1 }}>What sets us apart</h2>
          <p style={{ fontSize:14.5, color:'rgba(255,255,255,0.38)', fontFamily:'system-ui,sans-serif', lineHeight:1.7, margin:0 }}>We're not the largest institution in Nepal. We focus on being one of the most attentive ones.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, backgroundColor:'rgba(255,255,255,0.05)', borderRadius:4, overflow:'hidden' }} className="eict-wg">
          {reasons.map(r => (
            <div key={r.title} style={{ backgroundColor:'#080f1e', padding:'32px 28px', transition:'background-color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.backgroundColor='#0d1627'}
              onMouseLeave={e=>e.currentTarget.style.backgroundColor='#080f1e'}>
              <h3 style={{ fontFamily:'system-ui,sans-serif', fontSize:14.5, fontWeight:600, color:'white', margin:'0 0 8px' }}>{r.title}</h3>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.38)', fontFamily:'system-ui,sans-serif', lineHeight:1.7, margin:0 }}>{r.body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:900px){.eict-wg{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:600px){.eict-wg{grid-template-columns:1fr!important}}`}</style>
    </section>
  );
}
EOF

# ── LoginPanel (uses real AuthContext) ────────────────────────
cat > src/components/LoginPanel.jsx << 'EOF'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLES = ['Admin', 'Faculty', 'Student'];
const DEMO  = {
  Admin:   { username: 'admin',    password: 'admin123'   },
  Faculty: { username: 'faculty1', password: 'faculty123' },
  Student: { username: 'student1', password: 'student123' },
};

export default function LoginPanel() {
  const [role, setRole]         = useState('Student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const navigate  = useNavigate();
  const { login } = useAuth();

  const fillDemo = () => { setUsername(DEMO[role].username); setPassword(DEMO[role].password); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const api = (await import('../services/api')).default;
      const { data } = await api.post('/auth/login', { username, password });
      login(data.user, data.token);
      const r = (data.user.role || '').toUpperCase();
      navigate(r === 'ADMIN' ? '/admin' : r === 'FACULTY' ? '/faculty' : '/student');
    } catch (err) {
      // Demo fallback
      const d = DEMO[role];
      if (username === d.username && password === d.password) {
        const u = { username, role: role.toUpperCase(), name: role };
        login(u, 'demo-' + role.toLowerCase());
        navigate('/' + role.toLowerCase());
      } else {
        setError(err?.response?.data?.message || 'Invalid credentials. Use demo fill below.');
      }
    } finally { setLoading(false); }
  };

  const inp = {
    width:'100%', padding:'10px 12px', backgroundColor:'#0a1220',
    border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, color:'white',
    fontSize:14, fontFamily:'system-ui,sans-serif', outline:'none',
    boxSizing:'border-box', transition:'border-color 0.15s',
  };

  return (
    <div style={{ backgroundColor:'#0f1a2e', border:'1px solid rgba(255,255,255,0.08)', borderRadius:6, overflow:'hidden', maxWidth:400, width:'100%', boxShadow:'0 20px 60px rgba(0,0,0,0.4)' }}>
      <div style={{ padding:'20px 24px 0', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.28)', letterSpacing:'1.5px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:16 }}>EICT Campus Portal</div>
        <div style={{ display:'flex' }}>
          {ROLES.map(r => (
            <button key={r} onClick={()=>{setRole(r);setError('');setUsername('');setPassword('');}}
              style={{ flex:1, padding:'9px 0', backgroundColor:'transparent', border:'none', borderBottom:r===role?'2px solid #1a4fa0':'2px solid transparent', color:r===role?'white':'rgba(255,255,255,0.32)', fontSize:12.5, fontFamily:'system-ui,sans-serif', cursor:'pointer', fontWeight:r===role?500:400, transition:'all 0.15s' }}
            >{r}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:24 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.32)', fontFamily:'system-ui,sans-serif', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:6 }}>Username</label>
            <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder={`Enter ${role.toLowerCase()} username`} autoComplete="username" style={inp}
              onFocus={e=>e.target.style.borderColor='rgba(26,79,160,0.6)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:11, color:'rgba(255,255,255,0.32)', fontFamily:'system-ui,sans-serif', letterSpacing:'0.8px', textTransform:'uppercase', marginBottom:6 }}>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" style={inp}
              onFocus={e=>e.target.style.borderColor='rgba(26,79,160,0.6)'} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'}/>
          </div>
          {error && <div style={{ marginBottom:14, padding:'8px 12px', backgroundColor:'rgba(180,50,50,0.15)', border:'1px solid rgba(180,50,50,0.3)', borderRadius:3, fontSize:12, color:'#f87171', fontFamily:'system-ui,sans-serif' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ width:'100%', padding:11, backgroundColor:loading?'#143d80':'#1a4fa0', color:'white', border:'none', borderRadius:4, fontSize:13.5, fontFamily:'system-ui,sans-serif', fontWeight:500, cursor:loading?'not-allowed':'pointer', transition:'background-color 0.15s' }}>
            {loading ? 'Signing in…' : `Sign in as ${role}`}
          </button>
        </form>
        <div style={{ marginTop:16, padding:12, backgroundColor:'rgba(255,255,255,0.03)', borderRadius:3, border:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.26)', fontFamily:'system-ui,sans-serif' }}>Demo: {DEMO[role].username} / {DEMO[role].password}</div>
          <button onClick={fillDemo} style={{ padding:'5px 10px', backgroundColor:'transparent', border:'1px solid rgba(255,255,255,0.12)', borderRadius:3, color:'rgba(255,255,255,0.45)', fontSize:11, fontFamily:'system-ui,sans-serif', cursor:'pointer' }}>Fill</button>
        </div>
      </div>
    </div>
  );
}
EOF

# ── ERPLoginSection ───────────────────────────────────────────
cat > src/components/ERPLoginSection.jsx << 'EOF'
import LoginPanel from './LoginPanel';
export default function ERPLoginSection() {
  return (
    <section id="erp-login" style={{ backgroundColor:'#0c1424', padding:'100px 0', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 400px', gap:80, alignItems:'center' }} className="eict-eg">
          <div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:16 }}>Campus Portal</div>
            <h2 style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'clamp(28px,4vw,44px)', color:'white', margin:'0 0 20px', lineHeight:1.1 }}>Your academic life,<br/>in one place.</h2>
            <p style={{ fontSize:15, color:'rgba(255,255,255,0.43)', fontFamily:'system-ui,sans-serif', lineHeight:1.75, margin:'0 0 40px', maxWidth:420 }}>The EICT Campus Portal gives students access to timetables, marks, attendance, and study materials. Faculty can manage course delivery. Admins oversee the entire institution.</p>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {[{role:'Student',color:'#1a4fa0',features:'Marks · Attendance · Timetable · Materials · AI Chat'},{role:'Faculty',color:'#0d7a6a',features:'Grade entry · Attendance marking · Announcements'},{role:'Admin',color:'#5a3fa0',features:'Full oversight · Reports · User management'}].map(item=>(
                <div key={item.role} style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', backgroundColor:item.color, marginTop:6, flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:13, color:'rgba(255,255,255,0.68)', fontFamily:'system-ui,sans-serif', fontWeight:500, marginBottom:2 }}>{item.role} Portal</div>
                    <div style={{ fontSize:12, color:'rgba(255,255,255,0.28)', fontFamily:'system-ui,sans-serif' }}>{item.features}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <LoginPanel/>
        </div>
      </div>
      <style>{`@media(max-width:900px){.eict-eg{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </section>
  );
}
EOF

# ── Admissions ────────────────────────────────────────────────
cat > src/components/Admissions.jsx << 'EOF'
export default function Admissions() {
  const steps=[{num:'01',title:'Check Eligibility',body:'Complete +2 or equivalent with Science stream. Minimum 45% aggregate. Mathematics compulsory for CSIT/CE.'},{num:'02',title:'Submit Application',body:'Fill out the online form or collect a physical form from the college office. Attach academic transcripts and citizenship copy.'},{num:'03',title:'Entrance / Interview',body:'Appear for the college-level entrance examination. Shortlisted candidates are called for counselling.'},{num:'04',title:'Confirm Seat',body:'Pay the initial fee within 7 days of selection. Classes commence in September for regular intake.'}];
  return (
    <section id="admissions" style={{ backgroundColor:'#080f1e', padding:'100px 0', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }} className="eict-admg">
          <div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2.5px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:14 }}>Admissions 2025</div>
            <h2 style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:'clamp(28px,4vw,44px)', color:'white', margin:'0 0 20px', lineHeight:1.1 }}>Apply for the<br/>upcoming intake</h2>
            <p style={{ fontSize:14.5, color:'rgba(255,255,255,0.4)', fontFamily:'system-ui,sans-serif', lineHeight:1.75, margin:'0 0 32px' }}>Applications for the 2025 academic year are now open. Limited seats available across all programs.</p>
            <div style={{ padding:'20px 24px', backgroundColor:'#0f1a2e', border:'1px solid rgba(255,255,255,0.07)', borderRadius:4, marginBottom:28 }}>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.28)', fontFamily:'system-ui,sans-serif', letterSpacing:'1px', textTransform:'uppercase', marginBottom:12 }}>Key Dates</div>
              {[{label:'Form available',date:'June 1, 2025'},{label:'Last submission',date:'July 31, 2025'},{label:'Entrance exam',date:'Aug 10–12, 2025'},{label:'Classes begin',date:'September 2025'}].map(item=>(
                <div key={item.label} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.42)', fontFamily:'system-ui,sans-serif' }}>{item.label}</span>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.72)', fontFamily:'system-ui,sans-serif' }}>{item.date}</span>
                </div>
              ))}
            </div>
            <a href="#contact" style={{ display:'inline-block', padding:'12px 28px', backgroundColor:'#1a4fa0', color:'white', textDecoration:'none', borderRadius:4, fontSize:13.5, fontFamily:'system-ui,sans-serif', fontWeight:500 }}>Contact Admissions Office</a>
          </div>
          <div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.22)', fontFamily:'system-ui,sans-serif', letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:28 }}>How to apply</div>
            {steps.map((s,i)=>(
              <div key={s.num} style={{ display:'flex', gap:20, paddingBottom:i<steps.length-1?28:0, position:'relative' }}>
                {i<steps.length-1&&<div style={{ position:'absolute', left:19, top:32, bottom:0, width:1, backgroundColor:'rgba(255,255,255,0.06)' }}/>}
                <div style={{ width:38, height:38, borderRadius:3, backgroundColor:'#0f1a2e', border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:'Georgia,serif', fontSize:13, color:'rgba(255,255,255,0.38)', fontWeight:600 }}>{s.num}</div>
                <div style={{ paddingTop:8 }}>
                  <div style={{ fontSize:14.5, fontFamily:'system-ui,sans-serif', fontWeight:500, color:'white', marginBottom:6 }}>{s.title}</div>
                  <div style={{ fontSize:13, fontFamily:'system-ui,sans-serif', color:'rgba(255,255,255,0.38)', lineHeight:1.65 }}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.eict-admg{grid-template-columns:1fr!important;gap:40px!important}}`}</style>
    </section>
  );
}
EOF

# ── Footer ────────────────────────────────────────────────────
cat > src/components/Footer.jsx << 'EOF'
export default function Footer() {
  return (
    <>
      <section id="contact" style={{ backgroundColor:'#0c1424', padding:'80px 0 60px', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:40, paddingBottom:48, borderBottom:'1px solid rgba(255,255,255,0.06)' }} className="eict-cg">
            <div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:20 }}>Location</div>
              <p style={{ fontSize:13.5, color:'rgba(255,255,255,0.48)', fontFamily:'system-ui,sans-serif', lineHeight:1.8, margin:0 }}>Everest International College of Technology<br/>Gairidhara, Kathmandu<br/>Bagmati Province, Nepal</p>
            </div>
            <div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:20 }}>Contact</div>
              {[{label:'Admissions',value:'+977-1-4004567'},{label:'General',value:'+977-1-4004568'},{label:'Email',value:'info@eict.edu.np'}].map(c=>(
                <div key={c.label} style={{ marginBottom:8 }}>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.22)', fontFamily:'system-ui,sans-serif', marginRight:8 }}>{c.label}</span>
                  <span style={{ fontSize:13, color:'rgba(255,255,255,0.52)', fontFamily:'system-ui,sans-serif' }}>{c.value}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.22)', letterSpacing:'2px', textTransform:'uppercase', fontFamily:'system-ui,sans-serif', marginBottom:20 }}>Hours</div>
              {[{day:'Sun – Fri',time:'7:00 AM – 6:00 PM'},{day:'Saturday',time:'9:00 AM – 3:00 PM'},{day:'Holidays',time:'Closed'}].map(h=>(
                <div key={h.day} style={{ display:'flex', justifyContent:'space-between', gap:16, marginBottom:6 }}>
                  <span style={{ fontSize:12.5, color:'rgba(255,255,255,0.32)', fontFamily:'system-ui,sans-serif' }}>{h.day}</span>
                  <span style={{ fontSize:12.5, color:'rgba(255,255,255,0.52)', fontFamily:'system-ui,sans-serif' }}>{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <footer style={{ backgroundColor:'#080f1e', borderTop:'1px solid rgba(255,255,255,0.05)', padding:'28px 0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 28px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:28, height:28, backgroundColor:'#1a4fa0', borderRadius:4, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontWeight:700, fontSize:11, color:'white' }}>E</div>
            <span style={{ fontSize:12, color:'rgba(255,255,255,0.28)', fontFamily:'system-ui,sans-serif' }}>© 2025 Everest International College of Technology</span>
          </div>
          <div style={{ display:'flex', gap:24 }}>
            {['Privacy Policy','Terms of Use','Sitemap'].map(l=>(
              <a key={l} href="#" style={{ fontSize:11.5, color:'rgba(255,255,255,0.22)', textDecoration:'none', fontFamily:'system-ui,sans-serif', transition:'color 0.15s' }}
                onMouseEnter={e=>e.target.style.color='rgba(255,255,255,0.6)'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.22)'}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
      <style>{`@media(max-width:768px){.eict-cg{grid-template-columns:1fr!important}}`}</style>
    </>
  );
}
EOF

# ── HomePage (src/components/HomePage.jsx) ────────────────────
cat > src/components/HomePage.jsx << 'EOF'
import Navbar          from './Navbar';
import Hero            from './Hero';
import About           from './About';
import Programs        from './Programs';
import WhyChooseUs     from './WhyChooseUs';
import ERPLoginSection from './ERPLoginSection';
import Admissions      from './Admissions';
import Footer          from './Footer';

export default function HomePage() {
  return (
    <div style={{ backgroundColor:'#080f1e', minHeight:'100vh' }}>
      <Navbar/>
      <Hero/>
      <About/>
      <Programs/>
      <WhyChooseUs/>
      <ERPLoginSection/>
      <Admissions/>
      <Footer/>
    </div>
  );
}
EOF

# ── LoginPage (src/components/LoginPage.jsx) ──────────────────
cat > src/components/LoginPage.jsx << 'EOF'
import { Link } from 'react-router-dom';
import LoginPanel from './LoginPanel';

export default function LoginPage() {
  return (
    <div style={{ minHeight:'100vh', backgroundColor:'#080f1e', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, position:'relative' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse 60% 60% at 50% 50%,rgba(26,79,160,0.10) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', top:24, left:28 }}>
        <Link to="/" style={{ color:'rgba(255,255,255,0.38)', textDecoration:'none', fontSize:13, fontFamily:'system-ui,sans-serif' }}>← EICT Homepage</Link>
      </div>
      <div style={{ marginBottom:32, textAlign:'center', position:'relative' }}>
        <div style={{ width:44, height:44, backgroundColor:'#1a4fa0', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia,serif', fontWeight:700, fontSize:18, color:'white', margin:'0 auto 10px' }}>E</div>
        <div style={{ fontFamily:'Georgia,serif', fontWeight:700, fontSize:20, color:'white', marginBottom:2 }}>EICT</div>
        <div style={{ fontSize:11, color:'rgba(255,255,255,0.28)', fontFamily:'system-ui,sans-serif', letterSpacing:'1.5px', textTransform:'uppercase' }}>Campus Portal</div>
      </div>
      <LoginPanel/>
      <p style={{ marginTop:20, fontSize:11.5, color:'rgba(255,255,255,0.18)', fontFamily:'system-ui,sans-serif', textAlign:'center', position:'relative' }}>For login issues contact it@eict.edu.np</p>
    </div>
  );
}
EOF

echo ""
echo "✅ All component files written to src/components/"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "FINAL STEP: Update src/App.jsx"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Add these 2 lines near the top of your App.jsx imports:"
echo ""
echo "  import HomePage  from './components/HomePage';"
echo "  import LoginPage from './components/LoginPage';"
echo ""
echo "Then change the routes for / and /login to:"
echo ""
echo "  <Route path='/'      element={<HomePage />} />"
echo "  <Route path='/login' element={<LoginPage />} />"
echo ""
echo "Then run: npm run dev"
echo "Open:     http://localhost:5173/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
