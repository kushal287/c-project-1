import React from 'react';

const LOCATIONS = [
    { name: 'Bangalore', img: '/images/banglore 1.jpg' },
    { name: 'Mumbai', img: '/images/mumbai 1.jpg' },
    { name: 'Indore', img: '/images/indore 1.jpg' },
    { name: 'Coimbatore', img: '/images/coimbatore.jpg' },
];

export default function Locations() {
    return (
        <section id="locations" style={{ backgroundColor: '#FFF9F2', padding: '100px 24px', textAlign: 'center' }}>
            <div className="container">
                <p style={{
                    fontFamily: 'var(--font-body)',
                    color: '#C88A58',
                    letterSpacing: '0.15em',
                    fontSize: 14,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginBottom: 16
                }}>
                    Choose a wedding venue in your city
                </p>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 42,
                    color: '#8A8581',
                    marginBottom: 64,
                    fontWeight: 500
                }}>
                    ANY LOCATION IN MIND?
                </h2>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 64,
                    flexWrap: 'wrap',
                    maxWidth: 1000,
                    margin: '0 auto'
                }}>
                    {LOCATIONS.map((loc, idx) => {
                        return (
                            <div key={idx} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 24,
                                width: 140,
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    width: 130,
                                    height: 130,
                                    borderRadius: '50%',
                                    border: '1px solid #C88A58',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: 'transparent',
                                    overflow: 'hidden'
                                }}>
                                    <img src={loc.img} alt={loc.name} style={{ width: '60%', height: 'auto', objectFit: 'contain' }} />
                                </div>
                                <h3 style={{
                                    fontFamily: 'var(--font-body)',
                                    fontSize: 20,
                                    fontWeight: 600,
                                    color: '#D77241'
                                }}>
                                    {loc.name}
                                </h3>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
