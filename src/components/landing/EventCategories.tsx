import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { Heart, PartyPopper, Briefcase, Home } from 'lucide-react';

const BASE_CATEGORIES = [
    { name: 'Wedding', color: '#8B0000', icon: Heart, img: '/images/wedding.jpg' },
    { name: 'Corporate Event', color: '#C8963E', icon: Briefcase, img: '/images/corporate event.jpeg' },
    { name: 'Reception', color: '#4A235A', icon: PartyPopper, img: '/images/reception.jpeg' },
    { name: 'Birthday Party', color: '#D4AC0D', icon: PartyPopper, img: '/images/birthday party.webp' },
];

const CATEGORIES = [...BASE_CATEGORIES, ...BASE_CATEGORIES, ...BASE_CATEGORIES];

export default function EventCategories() {
    const [bgColor, setBgColor] = useState(CATEGORIES[0].color);

    return (
        <section id="events" className="section-padding" style={{
            backgroundColor: bgColor,
            transition: 'background-color 0.5s ease',
            color: '#fff',
            overflow: 'hidden'
        }}>
            <div className="container">
                <h2 style={{ textAlign: 'center', marginBottom: 48, color: '#fff' }}>What Are You Celebrating?</h2>

                <Swiper
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                    }}
                    loop={true}
                    spaceBetween={24}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 2.5 },
                        1024: { slidesPerView: 4 }
                    }}
                    onSlideChange={(swiper) => {
                        const activeIndex = swiper.realIndex;
                        const targetColor = CATEGORIES[activeIndex % CATEGORIES.length].color;
                        setBgColor(targetColor);
                    }}
                >
                    {CATEGORIES.map((cat, idx) => (
                        <SwiperSlide key={idx}>
                            <div
                                onMouseEnter={() => setBgColor(cat.color)}
                                style={{
                                    height: 400,
                                    borderRadius: 'var(--radius-card)',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                                }}>
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    backgroundImage: `url("${cat.img}")`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    transition: 'transform 0.5s ease',
                                }} className="cat-bg" />
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
                                }} />

                                <div style={{ position: 'absolute', top: 16, right: 16 }}>
                                    <cat.icon color="var(--color-primary)" size={28} />
                                </div>

                                <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
                                    <h3 style={{ color: '#fff', margin: 0 }}>{cat.name}</h3>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style>{`
        .swiper-slide:hover .cat-bg {
          transform: scale(1.05);
        }
      `}</style>
        </section>
    );
}
