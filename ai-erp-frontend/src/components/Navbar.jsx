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
          <img src="/eict_logo.png" alt="EICT" style={{ width: 36, height: 36, borderRadius: 6 }} />
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
