import React from 'react';
import { ClipboardList, Search, PhoneCall, Gift } from 'lucide-react';

const STEPS = [
    { id: 1, title: 'Tell Us About Your Event', desc: 'Share your requirements, date, and vision.', icon: ClipboardList },
    { id: 2, title: 'Browse Matched Vendors', desc: 'Explore curated lists of premium vendors tailored for you.', icon: Search },
    { id: 3, title: 'Get a Callback & Confirm', desc: 'Finalize details over a call and lock your bookings.', icon: PhoneCall },
    { id: 4, title: 'Celebrate Without Worry', desc: 'We handle the execution while you make memories.', icon: Gift },
];

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="section-padding" style={{ background: 'var(--color-bg-white)' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: 64 }}>Your Event, Simplified</h2>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', position: 'relative' }}>
                    {/* Connector Line Desktop */}
                    <div className="desktop-connector" style={{
                        position: 'absolute',
                        top: 40,
                        left: '10%',
                        right: '10%',
                        height: 2,
                        borderTop: '2px dashed var(--color-primary-light)',
                        zIndex: 1
                    }} />

                    {STEPS.map((step) => (
                        <div key={step.id} style={{
                            flex: '1 1 200px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            <div style={{
                                width: 80, height: 80,
                                borderRadius: '50%',
                                background: 'var(--color-bg-cream)',
                                border: '2px solid var(--color-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 24,
                                position: 'relative',
                                boxShadow: 'var(--shadow-card)'
                            }}>
                                <step.icon size={32} color="var(--color-primary)" />
                                <div style={{
                                    position: 'absolute',
                                    top: -8, right: -8,
                                    width: 28, height: 28,
                                    background: 'var(--color-text-dark)',
                                    color: 'var(--color-primary)',
                                    borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 700,
                                    fontSize: 14
                                }}>
                                    {step.id}
                                </div>
                            </div>

                            <h3 style={{ fontSize: 20, marginBottom: 12 }}>{step.title}</h3>
                            <p style={{ color: 'var(--color-text-mid)' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
        @media (max-width: 768px) {
          .desktop-connector { display: none !important; }
        }
      `}</style>
        </section>
    );
}
