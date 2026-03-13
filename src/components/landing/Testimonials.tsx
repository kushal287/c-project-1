import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
    { name: 'Priya Sharma', city: 'Mumbai', event: 'Wedding', rating: 5, text: 'JashanEdge made our dream wedding a reality. The vendors were incredibly professional and everything went perfectly.' },
    { name: 'Rahul Verma', city: 'Delhi', event: 'Corporate Event', rating: 5, text: 'Flawless execution of our annual gala. Highly recommend their corporate planning team.' },
    { name: 'Sneha Patel', city: 'Ahmedabad', event: 'Baby Shower', rating: 5, text: 'Such a beautiful setup! They took all the stress away so I could just enjoy my special day.' },
    { name: 'Vikram Singh', city: 'Jaipur', event: 'Engagement', rating: 5, text: 'From venue selection to the decor, the JashanEdge team was supportive every step of the way.' },
    { name: 'Ananya Desai', city: 'Pune', event: 'Birthday Party', rating: 5, text: 'The themed birthday party was a hit! Kids loved it and parents relaxed.' },
    { name: 'Rohan Gupta', city: 'Bangalore', event: 'House Warming', rating: 5, text: 'Perfect arrangements for our Griha Pravesh. The catering was absolutely exceptional.' },
];

export default function Testimonials() {
    return (
        <section className="section-padding" style={{ background: 'var(--color-bg-white)' }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: 64 }}>Stories From Our Families</h2>

                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    autoplay={{ delay: 3000, disableOnInteraction: true, pauseOnMouseEnter: true }}
                    loop={true}
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 }
                    }}
                >
                    {TESTIMONIALS.map((t, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="card" style={{ padding: 32, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} fill="var(--color-primary)" color="var(--color-primary)" />
                                    ))}
                                </div>

                                <p style={{
                                    fontFamily: 'var(--font-sub)',
                                    fontStyle: 'italic',
                                    fontSize: 18,
                                    color: 'var(--color-text-dark)',
                                    marginBottom: 24,
                                    flexGrow: 1
                                }}>"{t.text}"</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <div style={{
                                        width: 48, height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: 'var(--color-bg-cream)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontFamily: 'var(--font-display)',
                                        color: 'var(--color-primary-dark)',
                                        fontWeight: 700
                                    }}>
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: 16 }}>{t.name}</h4>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                                            <span className="caption">{t.city}</span>
                                            <span className="badge badge-gold" style={{ fontSize: 10, padding: '2px 8px' }}>
                                                {t.event}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
