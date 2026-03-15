import React from 'react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactUs() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Thank you! Your message has been sent.");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div style={{ backgroundColor: 'var(--color-bg-cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            
            <main style={{ flex: 1, paddingTop: 120, paddingBottom: 80 }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-primary)', marginBottom: 16 }}>
                            Contact Us
                        </h1>
                        <p style={{ maxWidth: 600, margin: '0 auto', color: 'var(--color-text-mid)', fontSize: 18 }}>
                            Have questions about our services or need help planning your next event? 
                            We're here to help you create something extraordinary.
                        </p>
                    </div>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                        gap: 32,
                        maxWidth: 1000,
                        margin: '0 auto'
                    }}>
                        {/* Contact Info Cards */}
                        <div className="card" style={{ padding: 32, display: 'flex', gap: 20 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(200, 150, 62, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>Email Us</h3>
                                <p style={{ margin: 0, color: 'var(--color-text-mid)' }}>For general inquiries and support</p>
                                <a href="mailto:jashanedge@gmail.com" style={{ display: 'block', marginTop: 8, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                                    jashanedge@gmail.com
                                </a>
                            </div>
                        </div>

                        <div className="card" style={{ padding: 32, display: 'flex', gap: 20 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(200, 150, 62, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>Call or WhatsApp</h3>
                                <p style={{ margin: 0, color: 'var(--color-text-mid)' }}>Available Mon-Sat, 9am - 8pm</p>
                                <a href="tel:+917019128497" style={{ display: 'block', marginTop: 8, fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>
                                    +91 70191 28497
                                </a>
                            </div>
                        </div>

                        <div className="card" style={{ padding: 32, display: 'flex', gap: 20 }}>
                            <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(200, 150, 62, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: 20 }}>Our Office</h3>
                                <p style={{ margin: 0, color: 'var(--color-text-mid)' }}>Visit us for a consultation</p>
                                <p style={{ margin: '8px 0 0 0', fontWeight: 600, lineHeight: 1.5 }}>
                                    PJC, North Bengaluru-560073,<br />
                                    Karnataka, India
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
