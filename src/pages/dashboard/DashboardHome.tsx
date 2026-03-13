import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, CreditCard, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function DashboardHome() {
    const { user } = useAuth();
    const [queries, setQueries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, 'queries'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setQueries(list);
            setLoading(false);
        }, (error) => {
            console.error("Dashboard activities fetch error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const stats = {
        active: queries.filter(q => 
            q.status === 'matched' || 
            (q.status === 'completed' && !q.finalPaid)
        ).length,
        pending: queries.filter(q => q.status === 'pending').length,
        totalSpent: 0 // In a real app, this would sum up payment docs
    };
    return (
        <div>
            <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <h1 style={{ fontSize: 32, marginBottom: 8 }}>Welcome back, {user?.displayName?.split(' ')[0] || 'User'} 👋</h1>
                    <p style={{ color: 'var(--color-text-mid)' }}>Here's an overview of your events and requests.</p>
                </div>
                <Link to="/dashboard/new-event" className="btn btn-primary">Start New Event</Link>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
                <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 8, background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle color="var(--color-primary-dark)" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: 24, margin: 0 }}>{stats.active}</h3>
                        <span className="caption">Active Events</span>
                    </div>
                </div>

                <div className="card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 8, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Clock color="#92400E" />
                    </div>
                    <div>
                        <h3 style={{ fontSize: 24, margin: 0 }}>{stats.pending}</h3>
                        <span className="caption">Pending Requests</span>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div>
                <h3 style={{ marginBottom: 24 }}>Recent Activity</h3>
                <div className="card">
                    {loading ? (
                        <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-mid)' }}>
                            no recent activities
                        </div>
                    ) : queries.length > 0 ? (
                        queries.slice(0, 5).map((q, idx) => (
                            <div key={q.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '16px 24px',
                                borderBottom: idx !== queries.slice(0, 5).length - 1 ? '1px solid var(--color-border)' : 'none'
                            }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 16 }}>{q.eventName}</h4>
                                    <span className="caption" style={{ display: 'inline-block', marginTop: 4 }}>
                                        {q.eventType} &bull; {new Date(q.createdAt).toLocaleDateString()}
                                        <span style={{ 
                                            marginLeft: 8, 
                                            color: q.status === 'pending' ? 'var(--color-primary)' : 
                                                   q.status === 'completed' ? 'var(--color-success)' : '#F1C40F',
                                            fontWeight: 600
                                        }}>
                                            [{q.status === 'completed' ? 'EVENT DONE' : q.status.toUpperCase()}]
                                        </span>
                                    </span>
                                </div>
                                <ChevronRight color="var(--color-text-light)" />
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-mid)' }}>
                            No recent activity found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
