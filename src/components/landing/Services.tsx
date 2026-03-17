import React from 'react';
import { Settings, Users, MapPin, Coffee, Camera, Music, Gift, Video, CheckCircle } from 'lucide-react';

const SERVICES = [
    { title: 'Event Planning & Coordination', desc: 'End-to-end management of your entire event.', icon: Settings },
    { title: 'Vendor Curation & Management', desc: 'Premium vendors matched to your budget and style.', icon: Users },
    { title: 'Venue Sourcing', desc: 'Find the perfect location for your special day.', icon: MapPin },
    { title: 'Catering Partners', desc: 'Exquisite culinary experiences tailored to your taste.', icon: Coffee },
    { title: 'Photography & Videography', desc: 'Capture every moment with ultimate perfection.', icon: Camera },
    { title: 'Entertainment & Performances', desc: 'Live bands, DJs, and talented performers.', icon: Music },
    { title: 'Invitation & Gifting', desc: 'Custom invites and memorable favors for guests.', icon: Gift },
    { title: 'Live Streaming', desc: 'Connect with loved ones anywhere across the globe.', icon: Video },
    { title: 'Post-Event Services', desc: 'Cleanup, returns, and album delivery.', icon: CheckCircle },
];

export default function Services() {
    return (
        <section id="services" className="section-padding">
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Premium Wedding & Event Management</h2>
                <p style={{ textAlign: 'center', color: 'var(--color-text-mid)', marginBottom: 64, maxWidth: 700, margin: '0 auto 64px auto' }}>
                    Expert planning for your <strong>wedding</strong>, <strong>birthday</strong>, <strong>anniversary</strong>, or any corporate <strong>celebration</strong>. Over 100+ verified vendors managed.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 24
                }}>
                    {SERVICES.map((srv, idx) => (
                        <div key={idx} className="card service-card" style={{
                            padding: 32,
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 16,
                            position: 'relative'
                        }}>
                            <div className="service-accent" style={{
                                position: 'absolute',
                                top: 0, bottom: 0, left: 0,
                                width: 4,
                                background: 'var(--color-primary)',
                                opacity: 0,
                                transition: 'var(--transition-default)'
                            }} />

                            <div style={{ padding: 12, background: 'var(--color-primary-light)', borderRadius: 8 }}>
                                <srv.icon size={24} color="var(--color-primary-dark)" />
                            </div>

                            <div>
                                <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--color-text-dark)' }}>{srv.title}</h3>
                                <p style={{ color: 'var(--color-text-mid)', fontSize: 14 }}>{srv.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
        .service-card:hover .service-accent { opacity: 1; }
      `}</style>
        </section>
    );
}
