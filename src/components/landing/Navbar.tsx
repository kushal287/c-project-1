import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';

export default function Navbar() {
    const { user, role } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className="nav-container" style={{
                position: 'fixed',
                top: scrolled ? 0 : 20,
                left: 0,
                right: 0,
                height: 80,
                backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                backdropFilter: scrolled ? 'blur(10px)' : 'none',
                WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
                display: 'flex',
                alignItems: 'center',
                padding: '0 5%',
                justifyContent: 'space-between',
                zIndex: 1000,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                borderBottom: scrolled ? '1px solid rgba(200, 150, 62, 0.15)' : 'none',
                boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.04)' : 'none'
            }}>
                {/* Logo Container */}
                <div className="logo-pill" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: scrolled ? '0' : '8px 20px',
                    backgroundColor: scrolled ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: scrolled ? 'none' : 'blur(8px)',
                    WebkitBackdropFilter: scrolled ? 'none' : 'blur(8px)',
                    borderRadius: scrolled ? '0' : '40px',
                    transition: 'all 0.4s ease',
                    boxShadow: scrolled ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
                    border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.3)'
                }}>
                    <img src="/images/logo.png?v=2" alt="JashanEdge Logo" style={{
                        height: scrolled ? 48 : 56,
                        width: 'auto',
                        filter: scrolled ? 'none' : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))',
                        transition: 'all 0.3s ease'
                    }} />
                    <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: scrolled ? 24 : 28,
                        fontWeight: 800,
                        letterSpacing: '0.01em',
                        color: scrolled ? 'var(--color-primary)' : '#fff',
                        cursor: 'pointer',
                        textShadow: scrolled ? 'none' : '0 2px 4px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s ease'
                    }}>
                        JashanEdge
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="desktop-nav" style={{
                    display: 'none',
                    gap: 32,
                    padding: scrolled ? '0' : '14px 32px',
                    backgroundColor: scrolled ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: scrolled ? 'none' : 'blur(8px)',
                    WebkitBackdropFilter: scrolled ? 'none' : 'blur(8px)',
                    borderRadius: scrolled ? '0' : '40px',
                    transition: 'all 0.4s ease',
                    boxShadow: scrolled ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
                    border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.3)'
                }}>
                    {['How It Works', 'Services', 'Events', 'Contact'].map(link => (
                        <a key={link} className="nav-link" href={`#${link.toLowerCase().replace(/ /g, '-')}`} style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 14,
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            color: 'var(--color-text-dark)',
                            textDecoration: 'none',
                            transition: 'color 0.3s ease',
                            position: 'relative'
                        }}>
                            {link}
                        </a>
                    ))}
                </div>

                {/* User Actions */}
                <div className="actions-pill" style={{
                    display: 'flex',
                    gap: 16,
                    alignItems: 'center',
                    padding: scrolled ? '0' : '6px 6px 6px 20px',
                    backgroundColor: scrolled ? 'transparent' : 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: scrolled ? 'none' : 'blur(8px)',
                    WebkitBackdropFilter: scrolled ? 'none' : 'blur(8px)',
                    borderRadius: scrolled ? '0' : '40px',
                    transition: 'all 0.4s ease',
                    boxShadow: scrolled ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
                    border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.3)'
                }}>
                    <div className="desktop-only">
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            {!user && (
                                <Link to="/login" className="nav-btn-ghost" style={{
                                    color: scrolled ? 'var(--color-primary-dark)' : '#fff',
                                    textShadow: scrolled ? 'none' : '0 1px 2px rgba(0,0,0,0.2)'
                                }}>Sign In</Link>
                            )}
                        </div>
                    </div>
                    <Link to="/dashboard/new-event" className="nav-btn-primary">Plan Event</Link>

                    <button
                        className="mobile-only"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'block' }}
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu size={24} color={scrolled ? "var(--color-text-dark)" : "#fff"} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'var(--color-bg-white)',
                    zIndex: 2000,
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <img src="/images/logo.png?v=2" alt="JashanEdge Logo" style={{ height: 48, width: 'auto', flexShrink: 0 }} />
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: 'var(--color-primary)' }}>
                                JashanEdge
                            </div>
                        </div>
                        <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none' }}>
                            <X size={28} />
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 18, alignItems: 'center' }}>
                        {['How It Works', 'Services', 'Events', 'Contact'].map(link => (
                            <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`} onClick={() => setMobileMenuOpen(false)}>
                                {link}
                            </a>
                        ))}
                        {!user && (
                            <Link to="/login" className="btn btn-secondary" style={{ width: '100%', marginTop: 24 }} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -4px;
          left: 0;
          background-color: var(--color-primary);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-link:hover {
          color: var(--color-primary) !important;
        }
        
        .nav-btn-ghost {
          padding: 10px 20px;
          font-weight: 600;
          font-size: 14px;
          border-radius: 30px;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .nav-btn-ghost:hover {
          background-color: rgba(200, 150, 62, 0.1);
          color: var(--color-primary) !important;
        }

        .nav-btn-primary {
          background-color: var(--color-primary);
          color: white;
          padding: 12px 28px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(200, 150, 62, 0.25);
          letter-spacing: 0.05em;
        }
        .nav-btn-primary:hover {
          background-color: var(--color-primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(200, 150, 62, 0.35);
        }

        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-only { display: block !important; }
          .mobile-only { display: none !important; }
        }

        @media (max-width: 767px) {
          .nav-container { padding: 0 4% !important; }
          .logo-pill { padding: ${scrolled ? '0' : '6px 14px'} !important; gap: 8px !important; }
          .logo-pill img { height: ${scrolled ? '40px' : '44px'} !important; }
          .logo-pill div { font-size: ${scrolled ? '20px' : '22px'} !important; }
          .actions-pill { padding: ${scrolled ? '0' : '4px 4px 4px 12px'} !important; gap: 8px !important; }
          .nav-btn-primary { padding: 8px 16px !important; font-size: 13px !important; }
          .desktop-only { display: none !important; }
        }
      `}</style>
        </>
    );
}
