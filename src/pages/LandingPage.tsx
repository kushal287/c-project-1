import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import EventCategories from '../components/landing/EventCategories';
import HowItWorks from '../components/landing/HowItWorks';
import Services from '../components/landing/Services';
import CTABanner from '../components/landing/CTABanner';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/landing/Footer';
import Stats from '../components/landing/Stats';
import Locations from '../components/landing/Locations';

export default function LandingPage() {
    return (
        <div style={{ backgroundColor: 'var(--color-bg-cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Hero />

            {/* Ornamental Section Divider */}
            <div className="divider-ornamental">
                <div className="divider-line" />
                <div className="divider-diamond" />
                <div className="divider-line" />
            </div>

            <EventCategories />

            <div className="divider-ornamental">
                <div className="divider-line" />
                <div className="divider-diamond" />
                <div className="divider-line" />
            </div>

            <Stats />
            <Locations />

            <div className="divider-ornamental">
                <div className="divider-line" />
                <div className="divider-diamond" />
                <div className="divider-line" />
            </div>

            <HowItWorks />

            <div className="divider-ornamental">
                <div className="divider-line" />
                <div className="divider-diamond" />
                <div className="divider-line" />
            </div>

            <Services />
            <CTABanner />

            <div className="divider-ornamental" style={{ margin: '80px 0' }}>
                <div className="divider-line" />
                <div className="divider-diamond" />
                <div className="divider-line" />
            </div>

            <Testimonials />

            <div className="divider-ornamental" style={{ margin: '80px 0' }}>
                <div className="divider-line" />
                <div className="divider-diamond" />
                <div className="divider-line" />
            </div>

            <FAQ />
            <Footer />
        </div>
    );
}
