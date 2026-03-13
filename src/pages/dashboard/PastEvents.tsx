import { useState, useEffect } from 'react';
import { Archive, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

export default function PastEvents() {
    const { user } = useAuth();
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'queries'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter((ev: any) => ev.status === 'completed' && ev.finalPaid === true);
            setEvents(list);
            setLoading(false);
        }, (error) => {
            console.error("Past events fetch error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <div>
            <h1 style={{ marginBottom: 32 }}>Past Events</h1>

            {loading ? (
                <div style={{ padding: 48, textAlign: 'center' }}>
                    <Loader2 className="spin" size={24} style={{ margin: '0 auto' }} />
                </div>
            ) : events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 64, background: '#fff', borderRadius: 8 }}>
                    <Archive size={48} color="var(--color-text-light)" style={{ marginBottom: 16 }} />
                    <h3>No past events</h3>
                    <p style={{ color: 'var(--color-text-mid)' }}>Your completed events will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 24 }}>
                    {events.map(ev => (
                        <div key={ev.id} className="card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{ev.eventName}</h3>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <span className="caption">{new Date(ev.date).toLocaleDateString()}</span> &bull;
                                        <span className="caption">{ev.city}</span> &bull;
                                        <span className="caption">{ev.vendorName}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span className="badge badge-completed" style={{ marginBottom: 8 }}>
                                        Completed
                                    </span>
                                    <div style={{ fontWeight: 600 }}>Total: ₹{Number(ev.price).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
