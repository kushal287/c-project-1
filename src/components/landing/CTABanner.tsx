import React from 'react';
import { Link } from 'react-router-dom';

export default function CTABanner() {
    return (
        <section className="section-padding" style={{
            background: 'linear-gradient(135deg, var(--color-bg-cream) 0%, var(--color-primary-light) 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Mandala Watermark mockup using CSS circles */}
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 800, height: 800,
                borderRadius: '50%',
                border: '1px solid rgba(200, 150, 62, 0.1)',
                zIndex: 1
            }} />
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 600, height: 600,
                borderRadius: '50%',
                border: '1px dashed rgba(200, 150, 62, 0.15)',
                zIndex: 1
            }} />
            <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400, height: 400,
                borderRadius: '50%',
                border: '2px solid rgba(200, 150, 62, 0.1)',
                zIndex: 1
            }} />

            <div className="container" style={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                padding: '0 24px'
            }}>
                <h2 style={{ fontSize: 48, marginBottom: 24, color: 'var(--color-primary-dark)' }}>
                    Ready to Create Something Memorable?
                </h2>
                <p style={{
                    fontSize: 18,
                    color: 'var(--color-text-mid)',
                    marginBottom: 48,
                    maxWidth: 600,
                    margin: '0 auto 48px auto'
                }}>
                    Join thousands of families who trusted JashanEdge for their most precious moments.
                </p>
                <Link to="/signup" className="btn btn-primary" style={{
                    padding: '18px 48px',
                    fontSize: 16
                }}>
                    Start Planning Now
                </Link>
            </div>
        </section>
    );
}
