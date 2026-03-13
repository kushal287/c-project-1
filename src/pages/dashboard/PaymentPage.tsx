import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Loader2, ChevronLeft, CreditCard } from 'lucide-react';

export default function PaymentPage() {
    const { type, eventId } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!eventId) return;
            try {
                const docRef = doc(db, 'queries', eventId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setEvent(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 className="spin" size={32} color="var(--color-primary)" />
            </div>
        );
    }

    if (!event) {
        return <div style={{ padding: 40, textAlign: 'center' }}>Event not found.</div>;
    }

    const totalAmount = Number(event.price) || 0;
    const paymentAmount = totalAmount / 2;
    const isAdvance = type === 'advance';

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
            <button 
                onClick={() => navigate(-1)} 
                className="btn btn-ghost" 
                style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, padding: 0 }}
            >
                <ChevronLeft size={20} /> Back to Ongoing Events
            </button>

            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ 
                    width: 64, 
                    height: 64, 
                    borderRadius: '50%', 
                    background: 'var(--color-bg-cream)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <CreditCard size={32} color="var(--color-primary)" />
                </div>

                <h1 style={{ fontSize: 32, marginBottom: 8 }}>₹{paymentAmount.toLocaleString()}</h1>
                <p style={{ color: 'var(--color-text-mid)', marginBottom: 40, fontSize: 18 }}>
                    Amount to be paid for {isAdvance ? 'Advance' : 'Final'} payment
                </p>

                <p style={{ fontSize: 18, marginBottom: 24, fontWeight: 500 }}>
                    Please pay the above amount on the QR code below
                </p>

                <div style={{ 
                    border: '1px solid var(--color-border)', 
                    padding: 24, 
                    borderRadius: 16, 
                    background: '#fff',
                    marginBottom: 32,
                    display: 'inline-block'
                }}>
                    <img 
                        src="/images/qr.jpeg" 
                        alt="Payment QR Code" 
                        style={{ width: '100%', maxWidth: 350, display: 'block', height: 'auto' }}
                    />
                </div>

                <div style={{ background: '#F0FDF4', color: '#166534', padding: '12px 24px', borderRadius: 8, display: 'inline-block', fontSize: 15 }}>
                    You will get confirmation shortly after payment
                </div>

                <div style={{ marginTop: 40, borderTop: '1px solid var(--color-border)', paddingTop: 24, textAlign: 'left' }}>
                    <h3 style={{ fontSize: 16, marginBottom: 8 }}>Payment Details:</h3>
                    <p className="caption" style={{ margin: 0 }}>Event: <strong>{event.eventName}</strong></p>
                    <p className="caption" style={{ margin: '4px 0 0 0' }}>Booking ID: {eventId}</p>
                </div>
            </div>
        </div>
    );
}
