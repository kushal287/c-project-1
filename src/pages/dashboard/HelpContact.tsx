import React from 'react';
import FAQ from '../../components/landing/FAQ';

export default function HelpContact() {
    return (
        <div>
            <h1 style={{ marginBottom: 32 }}>Help & Contact Us</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 32 }}>
                {/* Support Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: 18 }}>Support Info</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div>
                                <span className="caption">Email Us</span>
                                <p style={{ fontWeight: 500, margin: 0 }}>jashanedge@gmail.com</p>
                            </div>
                            <div>
                                <span className="caption">WhatsApp Support</span>
                                <p style={{ fontWeight: 500, margin: 0 }}>+91 70191 28497</p>
                            </div>
                            <div>
                                <span className="caption">Response Time</span>
                                <p style={{ fontWeight: 500, margin: 0 }}>Usually within 2-4 hours</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Block */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ margin: '-100px 0' /* To offset the padding inside FAQ component */ }}>
                        <FAQ />
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns: '1fr 2fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
}
