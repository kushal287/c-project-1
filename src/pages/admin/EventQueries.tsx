import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateInvoice } from '../../services/invoiceService';

export default function EventQueries() {
    const [queries, setQueries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuery, setSelectedQuery] = useState<any>(null);
    const [priceStr, setPriceStr] = useState('');
    const [adminNote, setAdminNote] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'queries'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setQueries(list);
            setLoading(false);
        }, (error) => {
            console.error("Queries fetch error:", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleAccept = async () => {
        if (!selectedQuery) return;
        const toastId = toast.loading("Updating request...");
        try {
            await updateDoc(doc(db, 'queries', selectedQuery.id), {
                status: 'matched',
                price: Number(priceStr),
                adminNote: adminNote,
                updatedAt: new Date().toISOString()
            });
            toast.success("Query updated and customer notified!", { id: toastId });
            setSelectedQuery(null);
        } catch (error) {
            toast.error("Failed to update.", { id: toastId });
        }
    };

    const handleReject = async () => {
        if (!selectedQuery) return;
        if (!window.confirm("Are you sure you want to reject this request?")) return;

        const toastId = toast.loading("Rejecting request...");
        try {
            await updateDoc(doc(db, 'queries', selectedQuery.id), {
                status: 'rejected',
                updatedAt: new Date().toISOString()
            });
            toast.success("Query rejected.", { id: toastId });
            setSelectedQuery(null);
        } catch (error) {
            toast.error("Action failed.", { id: toastId });
        }
    };

    const handleUpdatePayment = async (type: 'advance' | 'final') => {
        if (!selectedQuery) return;
        const confirmMsg = type === 'advance' ? "Are you sure advance payment received?" : "Are you sure final payment received?";
        if (!window.confirm(confirmMsg)) return;

        const toastId = toast.loading("Confirming payment...");
        try {
            if (!selectedQuery.userId) {
                console.error("Missing userId for query:", selectedQuery);
                throw new Error("Missing customer user ID. Cannot record payment.");
            }
            if (!selectedQuery.price) {
                console.error("Missing price for query:", selectedQuery);
                throw new Error("Missing event price. Please set a price first.");
            }

            console.log("Confirming payment for:", {
                type,
                eventId: selectedQuery.id,
                userId: selectedQuery.userId,
                price: selectedQuery.price
            });

            const updateData: any = {
                updatedAt: new Date().toISOString()
            };
            if (type === 'advance') updateData.advancePaid = true;
            else updateData.finalPaid = true;

            await updateDoc(doc(db, 'queries', selectedQuery.id), updateData);
            
            // 1. Create Payment Record for History (Graceful Handle)
            try {
                await addDoc(collection(db, 'payments'), {
                    userId: selectedQuery.userId,
                    eventId: selectedQuery.id,
                    eventName: selectedQuery.eventName,
                    customerName: selectedQuery.fullName,
                    contactNumber: selectedQuery.phone,
                    eventDate: new Date(selectedQuery.date).toLocaleDateString(),
                    eventTime: selectedQuery.time,
                    totalAmount: Number(selectedQuery.price),
                    amountPaid: Number(selectedQuery.price) / 2,
                    type: type === 'advance' ? 'Advance' : 'Final',
                    status: 'Paid',
                    createdAt: new Date().toISOString()
                });
            } catch (payErr) {
                console.warn("Could not record payment history document:", payErr);
                toast("Payment confirmed, but history record failed (check permissions).", { icon: '⚠️' });
            }

            // 2. Generate PDF Invoice
            await generateInvoice({
                customerName: selectedQuery.fullName,
                contactNumber: selectedQuery.phone,
                eventName: selectedQuery.eventName,
                eventDate: new Date(selectedQuery.date).toLocaleDateString(),
                eventTime: selectedQuery.time,
                totalAmount: Number(selectedQuery.price),
                amountPaid: Number(selectedQuery.price) / 2,
                isAdvance: type === 'advance',
                isFinal: type === 'final',
                paymentDate: new Date().toLocaleDateString('en-IN')
            });

            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} payment confirmed!`, { id: toastId });
            setSelectedQuery({ ...selectedQuery, ...updateData });
        } catch (error: any) {
            console.error("Payment confirmation error:", error);
            toast.error(`Failed: ${error.message || 'Unknown error'}`, { id: toastId });
        }
    };

    const handleMarkDone = async () => {
        if (!selectedQuery) return;
        if (!window.confirm("Are you sure the event is completed?")) return;

        const toastId = toast.loading("Updating status...");
        try {
            await updateDoc(doc(db, 'queries', selectedQuery.id), {
                status: 'completed',
                updatedAt: new Date().toISOString()
            });
            toast.success("Event marked as completed!", { id: toastId });
            setSelectedQuery({ ...selectedQuery, status: 'completed' });
        } catch (error) {
            toast.error("Failed to update status.", { id: toastId });
        }
    };

    const getStatusIndicator = (status: string) => {
        switch (status) {
            case 'matched':
                return <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F1C40F', display: 'inline-block', marginRight: 8 }} title="Ongoing" />;
            case 'completed':
                return <span style={{ color: '#27AE60', marginRight: 8, fontWeight: 'bold' }} title="Completed">✓</span>;
            case 'pending':
                return <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E74C3C', display: 'inline-block', marginRight: 8 }} title="New/Pending" />;
            default:
                return null;
        }
    };

    return (
        <div>
            <h1 style={{ marginBottom: 32 }}>Event Queries</h1>
            
            {loading ? (
                <div style={{ padding: 48, textAlign: 'center' }}>
                    <Loader2 className="spin" size={32} style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
                </div>
            ) : queries.length === 0 ? (
                <div style={{ padding: 64, background: '#fff', textAlign: 'center', borderRadius: 8, border: '1px dashed var(--color-border)' }}>
                    <h3 style={{ color: 'var(--color-text-mid)' }}>No queries yet</h3>
                    <p className="caption">New customer inquiries will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                    {queries.map(q => (
                        <div key={q.id} className="card" style={{ padding: 24, cursor: 'pointer', position: 'relative', opacity: q.status === 'rejected' ? 0.6 : 1 }} onClick={() => {
                            setSelectedQuery(q);
                            setPriceStr(q.price?.toString() || '');
                            setAdminNote(q.adminNote || '');
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {getStatusIndicator(q.status)}
                                    <h3 style={{ margin: 0 }}>{q.fullName || 'Anonymous'}</h3>
                                </div>
                                <span className="caption" style={{ 
                                    color: q.status === 'pending' ? '#E74C3C' : q.status === 'matched' ? '#F1C40F' : q.status === 'completed' ? '#27AE60' : 'var(--color-text-light)',
                                    fontWeight: 600
                                }}>
                                    {q.status.toUpperCase()}
                                </span>
                            </div>
                            <div className="caption" style={{ marginBottom: 12 }}>{q.city} &bull; {q.eventName}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className="badge badge-gold">{q.eventType}</span>
                                <span className="caption">{new Date(q.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedQuery && (
                <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 480, background: '#fff', boxShadow: '-4px 0 24px rgba(0,0,0,0.1)', zIndex: 1000, padding: 32, overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                        <h2 style={{ fontSize: 24, margin: 0 }}>Query Details</h2>
                        <button onClick={() => setSelectedQuery(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24 }}>&times;</button>
                    </div>

                    <div style={{ background: 'var(--color-bg-cream)', padding: 16, borderRadius: 8, marginBottom: 24, fontSize: 15 }}>
                        <p><strong>Customer:</strong> {selectedQuery.fullName}</p>
                        <p><strong>Phone:</strong> {selectedQuery.phone}</p>
                        <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid var(--color-border)' }} />
                        <p><strong>Event Name:</strong> {selectedQuery.eventName}</p>
                        <p><strong>Event Type:</strong> {selectedQuery.eventType}</p>
                        <p><strong>Date:</strong> {new Date(selectedQuery.date).toLocaleDateString()} at {selectedQuery.time}</p>
                        <p><strong>Location:</strong> {selectedQuery.street}, {selectedQuery.area}, {selectedQuery.city} - {selectedQuery.pincode}</p>
                        <p><strong>Preferred Contact:</strong> {selectedQuery.preferredContact}</p>
                        {selectedQuery.otherDesc && <p><strong>Description:</strong> {selectedQuery.otherDesc}</p>}
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label>Admin Note (Visible to Customer)</label>
                        <textarea rows={3} value={adminNote} onChange={e => setAdminNote(e.target.value)} placeholder="Will arrange a meeting..."></textarea>
                    </div>

                    <div style={{ marginBottom: 32 }}>
                        <label>Total Event Price (₹)</label>
                        <input type="number" value={priceStr} onChange={e => setPriceStr(e.target.value)} placeholder="e.g. 500000" disabled={selectedQuery.status === 'matched' || selectedQuery.status === 'completed'} />
                        <p className="caption" style={{ marginTop: 8 }}>Advance payment (50%) will be set to ₹{Number(priceStr) / 2 || 0}</p>
                    </div>

                    <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                        {selectedQuery.status === 'pending' ? (
                            <>
                                <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleReject}>Reject</button>
                                <button className="btn btn-primary" style={{ flex: 2 }} onClick={handleAccept}>Accept & Set Deal</button>
                            </>
                        ) : (
                            <button className="btn btn-secondary" style={{ width: '100%' }} disabled>Request Accepted</button>
                        )}
                    </div>

                    {(selectedQuery.status === 'matched' || selectedQuery.status === 'completed') && (
                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24, marginTop: 24 }}>
                            <h3 style={{ fontSize: 18, marginBottom: 20 }}>Payment & Status Management</h3>
                            
                            {/* Step 1: Advance Payment */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: 16, background: 'var(--color-bg-cream)', borderRadius: 8 }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: 13, color: 'var(--color-text-mid)' }}>1. Advance Payment (50%)</span>
                                    <strong>₹{(Number(selectedQuery.price) / 2).toLocaleString()}</strong>
                                </div>
                                <button 
                                    className={`btn ${selectedQuery.advancePaid ? 'btn-secondary' : 'btn-primary'}`}
                                    disabled={selectedQuery.advancePaid}
                                    onClick={() => handleUpdatePayment('advance')}
                                    style={{ padding: '8px 16px', fontSize: 14 }}
                                >
                                    {selectedQuery.advancePaid ? 'Received ✓' : 'Received'}
                                </button>
                            </div>

                            {/* Step 2: Event Done */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: 16, background: 'var(--color-bg-cream)', borderRadius: 8 }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: 13, color: 'var(--color-text-mid)' }}>2. Event Status</span>
                                    <strong>{selectedQuery.status === 'completed' ? 'Completed' : 'Ongoing'}</strong>
                                </div>
                                <button 
                                    className={`btn ${selectedQuery.status === 'completed' ? 'btn-secondary' : 'btn-primary'}`}
                                    disabled={selectedQuery.status === 'completed' || !selectedQuery.advancePaid}
                                    onClick={handleMarkDone}
                                    style={{ padding: '8px 16px', fontSize: 14 }}
                                >
                                    {selectedQuery.status === 'completed' ? 'Done ✓' : 'Done'}
                                </button>
                            </div>

                            {/* Step 3: Pending Payment */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: 16, background: 'var(--color-bg-cream)', borderRadius: 8 }}>
                                <div>
                                    <span style={{ display: 'block', fontSize: 13, color: 'var(--color-text-mid)' }}>3. Pending Payment (50%)</span>
                                    <strong>₹{(Number(selectedQuery.price) / 2).toLocaleString()}</strong>
                                </div>
                                <button 
                                    className={`btn ${selectedQuery.finalPaid ? 'btn-secondary' : 'btn-primary'}`}
                                    disabled={selectedQuery.finalPaid || selectedQuery.status !== 'completed'}
                                    onClick={() => handleUpdatePayment('final')}
                                    style={{ padding: '8px 16px', fontSize: 14 }}
                                >
                                    {selectedQuery.finalPaid ? 'Received ✓' : 'Received'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
