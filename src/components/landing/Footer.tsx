import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ background: 'var(--color-admin-bg)', color: '#fff', paddingTop: 80, paddingBottom: 24 }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 64 }}>
                    {/* Brand Col */}
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', fontSize: 24, marginBottom: 24 }}>
                            JashanEdge
                        </h3>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                            Where Every Celebration Finds Its Edge. India's premium tech-driven event management platform.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ color: '#fff', marginBottom: 24 }}>Quick Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                { label: 'About Us', href: '#how-it-works' },
                                { label: 'Services', href: '#services' },
                                { label: 'Venues', href: '#locations' },
                                { label: 'Careers', href: '/contact' }
                            ].map(link => (
                                <li key={link.label}>
                                    {link.href.startsWith('#') ? (
                                        <a href={link.href} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textDecoration: 'none' }}>{link.label}</a>
                                    ) : (
                                        <Link to={link.href} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textDecoration: 'none' }}>{link.label}</Link>
                                    )}
                                </li>
                            ))}
                            <li>
                                <Link to="/contact" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textDecoration: 'none' }}>Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ color: '#fff', marginBottom: 24 }}>Contact Info</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 16, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                            <li>
                                <a href="tel:+917019128497" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                                    <Phone size={16} /> +91 7019128497
                                </a>
                            </li>
                            <li>
                                <a href="mailto:jashanedge@gmail.com" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                                    <Mail size={16} /> jashanedge@gmail.com
                                </a>
                            </li>
                            <li>
                                <a href="https://maps.google.com/?q=PJC,+North+Bengaluru-560073,+Karnataka" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'flex-start', gap: 8, transition: 'color 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                                    <MapPin size={16} style={{ flexShrink: 0, marginTop: 4 }} />
                                    <span>PJC, North Bengaluru-560073,<br />Karnataka</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Socials */}
                    <div>
                        <h4 style={{ color: '#fff', marginBottom: 24 }}>Follow Us</h4>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <a href="https://wa.me/917019128497" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', transition: 'transform 0.3s ease', display: 'flex', alignItems: 'center' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/jashan_edge_events?igsh=dzR3ZHhrejRqcXk=" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                <Instagram size={24} />
                            </a>
                            <a href="https://www.facebook.com/share/1AgRU9YcBC/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                <Facebook size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Decorative Divider */}
                <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 24 }} />

                {/* Bottom Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, margin: 0 }}>
                        &copy; {new Date().getFullYear()} JashanEdge. All rights reserved.
                    </p>
                    <Link to="/admin-login" style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, textDecoration: 'none' }}>
                        Admin Portal
                    </Link>
                </div>
            </div>
        </footer>
    );
}
