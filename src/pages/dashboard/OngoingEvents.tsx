import React, { useState, useEffect } from 'react';
import { CheckCircle, Loader2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { generateInvoice } from '../../services/invoiceService';

export default function OngoingEvents() {
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const handleDownloadReceipt = async (ev: any, type: 'advance' | 'final') => {
        try {
            await generateInvoice({
                customerName: ev.fullName || user?.displayName || 'Customer',
                contactNumber: ev.phone || '',
                eventName: ev.eventName,
                eventDate: new Date(ev.date).toLocaleDateString(),
                eventTime: ev.time,
                totalAmount: Number(ev.price),
                amountPaid: Number(ev.price) / 2,
                isAdvance: type === 'advance',
                isFinal: type === 'final',
                paymentDate: new Date(ev.updatedAt || ev.createdAt).toLocaleDateString('en-IN')
            });
            toast.success("Receipt downloaded!");
        } catch (error) {
            toast.error("Failed to generate receipt.");
        }
    };

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'queries'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter((ev: any) => {
                    // Show if it's matched (ongoing) 
                    // OR if it's completed but final payment is not yet confirmed
                    if (ev.status === 'matched') return true;
                    if (ev.status === 'completed' && !ev.finalPaid) return true;
                    return false;
                });
            setEvents(list);
            setLoading(false);
        }, (error) => {
            console.error("Ongoing events fetch error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const dummyEvents = [];

    return (
        <div>
            <h1 style={{ marginBottom: 32 }}>Ongoing Events</h1>

            {loading ? (
                <div style={{ padding: 48, textAlign: 'center' }}>
                    <Loader2 className="spin" size={24} style={{ margin: '0 auto' }} />
                </div>
            ) : events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 64, background: '#fff', borderRadius: 8 }}>
                    <CheckCircle size={48} color="var(--color-text-light)" style={{ marginBottom: 16 }} />
                    <h3>No ongoing events</h3>
                    <p style={{ color: 'var(--color-text-mid)' }}>Your approved events will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 24 }}>
                    {events.map(ev => (
                        <div key={ev.id} className="card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{ev.eventName}</h3>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <span className="caption">{new Date(ev.date).toLocaleDateString()}</span> &bull;
                                        <span className="caption">{ev.city}</span>
                                    </div>
                                </div>
                                <span className={`badge ${ev.status === 'completed' ? 'badge-completed' : 'badge-active'}`}>
                                    {ev.status === 'completed' ? 'Event Completed' : 'Approved'}
                                </span>
                            </div>

                            <div style={{ background: 'var(--color-bg-cream)', padding: 16, borderRadius: 8, marginBottom: 24 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span className="caption">Total Price</span>
                                    <strong>₹{Number(ev.price).toLocaleString()}</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span className="caption">Advance (50%)</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ 
                                            color: ev.advancePaid ? 'var(--color-success)' : 'var(--color-text-dark)',
                                            fontWeight: ev.advancePaid ? 600 : 400,
                                            marginRight: 12
                                        }}>
                                            {ev.advancePaid ? 'Paid' : `₹${(Number(ev.price) / 2).toLocaleString()}`}
                                        </span>
                                        {ev.advancePaid && (
                                            <button 
                                                onClick={() => handleDownloadReceipt(ev, 'advance')}
                                                style={{ padding: 0, background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, textDecoration: 'underline', cursor: 'pointer' }}
                                            >
                                                Download Receipt
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="caption">Final (50%)</span>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ 
                                            color: ev.finalPaid ? 'var(--color-success)' : 'var(--color-text-dark)',
                                            fontWeight: ev.finalPaid ? 600 : 400,
                                            marginRight: 12
                                        }}>
                                            {ev.finalPaid ? 'Paid' : `₹${(Number(ev.price) / 2).toLocaleString()}`}
                                        </span>
                                        {ev.finalPaid && (
                                            <button 
                                                onClick={() => handleDownloadReceipt(ev, 'final')}
                                                style={{ padding: 0, background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: 13, textDecoration: 'underline', cursor: 'pointer' }}
                                            >
                                                Download Receipt
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                                {ev.vendorDriveLink ? (
                                    <a 
                                        href={ev.vendorDriveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 8, 
                                            color: 'var(--color-primary)', 
                                            textDecoration: 'none',
                                            fontSize: 14,
                                            fontWeight: 500
                                        }}
                                    >
                                        <ExternalLink size={16} /> View Event Drive Folder
                                    </a>
                                ) : <div />}
                                <div style={{ display: 'flex', gap: 16 }}>
                                    {!ev.advancePaid && (
                                        <Link 
                                            to={`/dashboard/payment/advance/${ev.id}`} 
                                            className="btn btn-primary"
                                        >
                                            Pay Advance (₹{(Number(ev.price) / 2).toLocaleString()})
                                        </Link>
                                    )}
                                    {ev.advancePaid && !ev.finalPaid && (
                                        <Link 
                                            to={`/dashboard/payment/final/${ev.id}`} 
                                            className="btn btn-primary"
                                        >
                                            {ev.status === 'completed' ? 'Pay Pending Amount' : 'Pay Final'} (₹{(Number(ev.price) / 2).toLocaleString()})
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
