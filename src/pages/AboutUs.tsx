import React from 'react';
import { Users, Target, Rocket, Heart, ChevronRight } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Link } from 'react-router-dom';

const TEAM = [
    {
        name: 'Harshit',
        role: 'CEO & Visionary',
        desc: 'The strategic architect behind JashanEdge. Harshit is dedicated to redefining how India celebrates, combining traditional values with modern efficiency.',
        icon: Target,
        color: '#E6BE8A'
    },
    {
        name: 'Purvesh',
        role: 'CTO & Tech Lead',
        desc: 'A tech virtuoso who builds the seamless digital infrastructure of JashanEdge. Purvesh ensures that every click brings you closer to your dream event.',
        icon: Rocket,
        color: '#C8963E'
    },
    {
        name: 'Apoorv',
        role: 'COO & Operations',
        desc: 'The operational engine of the company. Apoorv handles the complex rhythm of vendor management and flawless execution of every Jashan.',
        icon: Users,
        color: '#8B4513'
    }
];

export default function AboutUs() {
    return (
        <div style={{ background: '#fff', color: 'var(--color-text-dark)' }}>
            <Navbar />
            
            {/* Hero Section */}
            <section className="section-padding" style={{ 
                background: 'linear-gradient(135deg, #1A1208 0%, #3D2B1F 100%)',
                color: '#fff',
                paddingTop: 160,
                textAlign: 'center'
            }}>
                <div className="container animate-fade-in-up">
                    <span style={{ 
                        color: 'var(--color-primary)', 
                        fontSize: 14, 
                        fontWeight: 600, 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.2em',
                        marginBottom: 16,
                        display: 'block'
                    }}>
                        The Heart of Every Jashan
                    </span>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: 24, color: '#fff' }}>
                        We Engineer <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Memories</span>
                    </h1>
                    <p style={{ maxWidth: 700, margin: '0 auto', fontSize: 18, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8 }}>
                        JashanEdge was born from a simple idea: that planning a celebration should be as joyful as the event itself. We bridge the gap between imagination and execution.
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="section-padding">
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>
                        <div className="animate-fade-in-left">
                            <h2 style={{ marginBottom: 32 }}>Driven by Passion, <br/>Led by Innovation</h2>
                            <p style={{ color: 'var(--color-text-mid)', lineHeight: 1.8, marginBottom: 24 }}>
                                From small gatherings in vibrant city halls to majestic palace weddings, JashanEdge has evolved into a premier tech-driven ecosystem. We didn't just build a platform; we built a community of creators, dreamers, and celebration specialists.
                            </p>
                            <p style={{ color: 'var(--color-text-mid)', lineHeight: 1.8 }}>
                                Our journey is defined by the thousands of smiles we've captured and the intricate logistical puzzles we've solved. Every event is a new chapter in our mission to make India celebrate better.
                            </p>
                        </div>
                        <div className="animate-fade-in-right" style={{ position: 'relative' }}>
                            <div style={{ 
                                width: '100%', 
                                height: 400, 
                                background: 'var(--color-bg-cream)', 
                                borderRadius: 24, 
                                overflow: 'hidden',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                            }}>
                                <img src="/images/How to Use Lighting for Beautiful Sangeet Decor_D.jpg" alt="About JashanEdge" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{
                                position: 'absolute',
                                bottom: -20,
                                right: -20,
                                background: 'var(--color-primary)',
                                padding: '24px 32px',
                                borderRadius: 16,
                                color: '#fff',
                                boxShadow: '0 10px 20px rgba(200,150,62,0.3)'
                            }}>
                                <h4 style={{ margin: 0, fontSize: 32 }}>100+</h4>
                                <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Successful Events</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section */}
            <section className="section-padding" style={{ background: 'var(--color-bg-cream)' }}>
                <div className="container text-center">
                    <h2 style={{ marginBottom: 64 }}>The Leadership Column</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: 32
                    }}>
                        {TEAM.map((member, idx) => (
                            <div key={idx} className="card" style={{ 
                                padding: 48, 
                                textAlign: 'center', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                transition: 'transform 0.3s ease',
                                cursor: 'default'
                            }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                               onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                <div style={{ 
                                    width: 80, height: 80, 
                                    background: member.color, 
                                    borderRadius: '50%', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    marginBottom: 24,
                                    color: '#fff',
                                    boxShadow: `0 10px 20px ${member.color}44`
                                }}>
                                    <member.icon size={32} />
                                </div>
                                <h3 style={{ marginBottom: 8 }}>{member.name}</h3>
                                <span style={{ 
                                    color: 'var(--color-primary)', 
                                    fontSize: 14, 
                                    fontWeight: 700, 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '0.1em',
                                    marginBottom: 24,
                                    display: 'block'
                                }}>
                                    {member.role}
                                </span>
                                <p style={{ color: 'var(--color-text-mid)', fontSize: 15, lineHeight: 1.6 }}>
                                    {member.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brand Values Section */}
            <section className="section-padding">
                <div className="container">
                    <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto 64px auto' }}>
                        <h2 style={{ marginBottom: 24 }}>What We Stand For</h2>
                        <p style={{ color: 'var(--color-text-mid)' }}>At JashanEdge, our values are more than words — they are the blueprint of every decision we make.</p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
                        {[
                            { title: 'Excellence', desc: 'Settle for nothing less than perfection in execution.' },
                            { title: 'Transparency', desc: 'Clear communication between clients and vendors.' },
                            { title: 'Innovation', desc: 'Using technology to solve real event challenges.' },
                            { title: 'Happiness', desc: 'Ensuring every "Jashan" ends with a smile.' }
                        ].map((val, idx) => (
                            <div key={idx}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    <Heart size={20} color="var(--color-primary)" />
                                    <h4 style={{ margin: 0 }}>{val.title}</h4>
                                </div>
                                <p style={{ color: 'var(--color-text-mid)', fontSize: 14 }}>{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA section */}
            <section style={{ padding: '80px 0', background: '#1A1208', color: '#fff', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ color: '#fff', marginBottom: 24 }}>Ready to Start Your Chapter?</h2>
                    <Link to="/dashboard/new-event" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        Plan Your Event <ChevronRight size={18} />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
}
