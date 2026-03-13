import { useState, useEffect } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

export default function Requests() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                .filter((req: any) => ['pending', 'rejected'].includes(req.status))
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
            setRequests(list);
            setLoading(false);
        }, (error) => {
            console.error("Requests fetch error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    return (
        <div>
            <h1 style={{ marginBottom: 32 }}>My Requests</h1>

            {loading ? (
                <div style={{ padding: 48, textAlign: 'center' }}>
                    <Loader2 className="spin" size={24} style={{ margin: '0 auto' }} />
                </div>
            ) : requests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 64, background: '#fff', borderRadius: 8 }}>
                    <Clock size={48} color="var(--color-text-light)" style={{ marginBottom: 16 }} />
                    <h3>No pending requests</h3>
                    <p style={{ color: 'var(--color-text-mid)' }}>You haven't submitted any event requests yet.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: 24 }}>
                    {requests.map(req => (
                        <div key={req.id} className="card" style={{ padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>{req.eventName}</h3>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                        <span className="caption">{new Date(req.createdAt).toLocaleDateString()}</span> &bull;
                                        <span className="caption">{req.city}</span>
                                    </div>
                                </div>
                                <span className={`badge ${req.status === 'pending' ? 'badge-pending' : 'badge-danger'}`}>
                                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                </span>
                            </div>

                            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span className="caption" style={{ display: 'block' }}>Event Type</span>
                                    <strong>{req.eventType}</strong>
                                </div>
                                {req.price && (
                                    <div style={{ textAlign: 'right' }}>
                                        <span className="caption" style={{ display: 'block' }}>Quote</span>
                                        <strong>₹{Number(req.price).toLocaleString()}</strong>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
