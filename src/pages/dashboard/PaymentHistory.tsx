import { useState, useEffect } from 'react';
import { CreditCard, Download, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { generateInvoice } from '../../services/invoiceService';

export default function PaymentHistory() {
    const { user } = useAuth();
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'payments'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPayments(list);
            setLoading(false);
        }, (error) => {
            console.error("Payment fetch error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDownload = (p: any) => {
        generateInvoice({
            customerName: p.customerName,
            contactNumber: p.contactNumber,
            eventName: p.eventName,
            eventDate: p.eventDate,
            eventTime: p.eventTime,
            totalAmount: p.totalAmount,
            amountPaid: p.amountPaid,
            isAdvance: p.type === 'Advance',
            isFinal: p.type === 'Final',
            paymentDate: new Date(p.createdAt).toLocaleDateString()
        });
    };

    return (
        <div>
            <h1 style={{ marginBottom: 32 }}>Payment History</h1>

            {loading ? (
                <div style={{ padding: 48, textAlign: 'center' }}>
                    <Loader2 className="spin" size={24} style={{ margin: '0 auto' }} />
                </div>
            ) : payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 64, background: '#fff', borderRadius: 8 }}>
                    <CreditCard size={48} color="var(--color-text-light)" style={{ marginBottom: 16 }} />
                    <h3>No payments made yet</h3>
                    <p style={{ color: 'var(--color-text-mid)' }}>Your payment records will appear here once you make a transaction.</p>
                </div>
            ) : (
                <div className="card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-mid)' }}>
                                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Date</th>
                                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Event Name</th>
                                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Type</th>
                                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Amount</th>
                                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Status</th>
                                <th style={{ padding: '16px 24px', fontWeight: 500 }}>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '16px 24px' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{p.eventName}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span className="badge badge-gold" style={{ background: 'var(--color-bg-cream)' }}>{p.type}</span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>₹{Number(p.amountPaid).toLocaleString()}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{ color: 'var(--color-success)', fontWeight: 500 }}>{p.status || 'Paid'}</span>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ padding: '8px 12px', fontSize: 13 }}
                                            title="Download PDF Receipt"
                                            onClick={() => handleDownload(p)}
                                        >
                                            <Download size={16} /> Receipt
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
