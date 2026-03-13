import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const IMAGES = [
    '/images/How to Use Lighting for Beautiful Sangeet Decor_D.jpg',
    '/images/anniversary-4.jpg',
    '/images/corporate-events-in-Hyderabad.webp',
    '/images/housewarming-event-planners-in-chennai.jpg',
    '/images/istockphoto-1553480547-612x612.jpg',
];

export default function Hero() {
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIdx(prev => (prev + 1) % IMAGES.length);
        }, 3000); // reduced from 4000ms
        return () => clearInterval(timer);
    }, []);

    return (
        <section style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
            {IMAGES.map((img, idx) => (
                <div key={idx} style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: `url("${img}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: idx === currentIdx ? 1 : 0,
                    transition: 'opacity 1s ease-in-out',
                    zIndex: 1
                }} />
            ))}

            {/* Dark gradient overlay */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 100%)',
                zIndex: 2
            }} />

            {/* Content */}
            <div className="container animate-fade-in-up" style={{
                position: 'relative',
                zIndex: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#fff',
                paddingTop: 72 // offset for navbar
            }}>
                <span style={{
                    color: 'var(--color-primary)',
                    fontSize: 13,
                    letterSpacing: '0.15em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginBottom: 16
                }}>
                    India's Premier Event Management Platform
                </span>

                <h1 style={{
                    color: '#fff',
                    maxWidth: 900,
                    marginBottom: 24,
                    textShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}>
                    Making Every Jashan Unforgettable
                </h1>

                <p style={{
                    fontSize: 18,
                    color: 'rgba(255,255,255,0.9)',
                    maxWidth: 600,
                    marginBottom: 48,
                    fontFamily: 'var(--font-body)'
                }}>
                    From intimate gatherings to grand weddings — we connect you with the finest vendors across India.
                </p>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link to="/dashboard/new-event" className="btn btn-primary">Plan Your Event</Link>
                    <a href="#services" className="btn" style={{
                        background: 'transparent',
                        color: '#fff',
                        border: '2px solid #fff',
                    }}>Explore Services</a>
                </div>
            </div>

            <div style={{
                position: 'absolute',
                bottom: 32,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 3,
                animation: 'bounce 2s infinite'
            }}>
                <ChevronDown color="#fff" size={32} />
            </div>

            <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
        </section>
    );
}
