import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
    { q: 'How does JashanEdge carefully select its vendors?', a: 'All our vendors go through a rigorous 4-step verification process checking their past work, client reviews, hygiene standards, and reliability before they are listed.' },
    { q: 'What is the payment structure?', a: 'We require a 50% advance to secure your bookings. The remaining 50% is only requested after the event is successfully completed.' },
    { q: 'Can I request a vendor not listed on your platform?', a: 'Yes! You can choose "Other" while booking or contact us directly. Our vendor management team will source and verify them for your event.' },
    { q: 'What happens if a vendor cancels last minute?', a: 'JashanEdge provides a 100% execution guarantee. If a vendor backs out, we immediately provide an equal or better replacement at no additional cost.' },
    { q: 'Which cities do you currently operate in?', a: 'We are currently active in all major metros and Tier 1 cities across India, and rapidly expanding to Tier 2 cities.' },
    { q: 'Is there a cancellation or refund policy?', a: 'Cancellations 30 days prior to the event are fully refundable. For closer dates, partial refunds apply based on the specific vendor terms.' },
];

export default function FAQ() {
    const [openIdx, setOpenIdx] = useState<number | null>(0);

    return (
        <section className="section-padding" style={{ background: 'var(--color-bg-cream)' }}>
            <div className="container" style={{ maxWidth: 800 }}>
                <h2 style={{ textAlign: 'center', marginBottom: 64 }}>Frequently Asked Questions</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {FAQS.map((faq, idx) => {
                        const isOpen = openIdx === idx;
                        return (
                            <div key={idx} className="card" style={{
                                padding: '24px 32px',
                                cursor: 'pointer',
                                border: isOpen ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                                boxShadow: isOpen ? '0 4px 16px rgba(200, 150, 62, 0.1)' : 'none'
                            }} onClick={() => setOpenIdx(isOpen ? null : idx)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: 18, margin: 0, color: isOpen ? 'var(--color-primary-dark)' : 'var(--color-text-dark)' }}>
                                        {faq.q}
                                    </h3>
                                    <div>
                                        {isOpen ? <Minus color="var(--color-primary)" /> : <Plus color="var(--color-text-light)" />}
                                    </div>
                                </div>
                                {isOpen && (
                                    <p style={{ marginTop: 16, color: 'var(--color-text-mid)', animation: 'fadeInUp 0.3s ease' }}>
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
