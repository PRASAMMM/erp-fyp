import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Programs', href: '#programs' },
    { label: 'Admissions', href: '#admissions' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'all 0.3s ease',
        backgroundColor: scrolled ? 'rgba(10, 18, 35, 0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        padding: scrolled ? '0' : '0',
      }}
    >
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: scrolled ? '60px' : '72px',
        transition: 'height 0.3s ease',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#1a4fa0',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Crimson Pro", Georgia, serif',
            fontWeight: '700',
            fontSize: '14px',
            color: 'white',
            letterSpacing: '0.5px',
          }}>E</div>
          <div>
            <div style={{
              fontFamily: '"Crimson Pro", Georgia, serif',
              fontWeight: '700',
              fontSize: '16px',
              color: 'white',
              letterSpacing: '0.3px',
              lineHeight: '1.1',
            }}>EICT</div>
            <div style={{
              fontSize: '9px',
              color: 'rgba(255,255,255,0.45)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontFamily: 'system-ui, sans-serif',
            }}>Kathmandu</div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="desktop-nav">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: 'rgba(255,255,255,0.72)',
                textDecoration: 'none',
                fontSize: '13.5px',
                padding: '6px 12px',
                borderRadius: '4px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '0.1px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.72)'}
            >{link.label}</a>
          ))}

          <Link
            to="/login"
            style={{
              marginLeft: '12px',
              padding: '8px 20px',
              backgroundColor: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              color: 'white',
              fontSize: '13px',
              fontFamily: 'system-ui, sans-serif',
              textDecoration: 'none',
              letterSpacing: '0.2px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.target.style.backgroundColor = 'rgba(255,255,255,0.08)';
              e.target.style.borderColor = 'rgba(255,255,255,0.5)';
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            ERP Login
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '4px',
          }}
          className="mobile-menu-btn"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            {menuOpen ? (
              <path d="M4 4L18 18M18 4L4 18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            ) : (
              <>
                <line x1="3" y1="6" x2="19" y2="6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="11" x2="19" y2="11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="3" y1="16" x2="14" y2="16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          backgroundColor: 'rgba(10, 18, 35, 0.98)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '16px 28px 20px',
        }}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                color: 'rgba(255,255,255,0.75)',
                textDecoration: 'none',
                fontSize: '14px',
                padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                fontFamily: 'system-ui, sans-serif',
              }}
            >{link.label}</a>
          ))}
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'inline-block',
              marginTop: '16px',
              padding: '9px 22px',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '4px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '13px',
              fontFamily: 'system-ui, sans-serif',
            }}
          >ERP Login</Link>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
