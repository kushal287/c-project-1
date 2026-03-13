import React, { useEffect, useState, useRef } from 'react';

// Custom hook for animated counting
function useCountUp(end: number, duration: number = 2000, start: boolean = true) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);

            // Ease out quad
            const easeOut = percentage * (2 - percentage);

            setCount(Math.floor(end * easeOut));

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration, start]);

    return count;
}

const STATS = [
    { label: 'Weddings', value: 85, suffix: '+' },
    { label: 'Birthday Parties', value: 147, suffix: '+' },
    { label: 'Baby Showers', value: 39, suffix: '+' },
    { label: 'Engagements', value: 112, suffix: '+' }
];

export default function Stats() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} style={{ background: 'var(--color-admin-bg)', padding: '80px 24px', position: 'relative' }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 48 }}>
                {STATS.map((stat, idx) => (
                    <StatCircle
                        key={idx}
                        label={stat.label}
                        value={stat.value}
                        suffix={stat.suffix}
                        isVisible={isVisible}
                    />
                ))}
            </div>
        </section>
    );
}

function StatCircle({ label, value, suffix, isVisible }: { label: string, value: number, suffix: string, isVisible: boolean }) {
    const count = useCountUp(value, 2000, isVisible);

    // Format number with commas
    const formattedCount = new Intl.NumberFormat().format(count);

    return (
        <div style={{
            width: 220,
            height: 220,
            borderRadius: '50%',
            backgroundColor: '#FFF5EB',
            border: '4px solid var(--color-primary-light)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            transition: 'transform 0.3s ease',
            cursor: 'default'
        }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 48,
                fontWeight: 600,
                color: '#C88A58',
                marginBottom: 8,
                lineHeight: 1
            }}>
                {formattedCount}{suffix}
            </div>
            <div style={{
                fontFamily: 'var(--font-sub)',
                fontSize: 18,
                color: '#5C4A2A',
                letterSpacing: '0.05em'
            }}>
                {label}
            </div>
        </div>
    );
}
