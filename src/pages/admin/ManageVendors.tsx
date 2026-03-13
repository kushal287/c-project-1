import { useState, useEffect } from 'react';
import { Search, Plus, Image as ImageIcon, Trash2, X, Loader2, ChevronRight } from 'lucide-react';
import { db } from '../../lib/firebase';
import {
    collection,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy,
    setDoc
} from 'firebase/firestore';
import toast from 'react-hot-toast';

const INITIAL_CITIES = ['Bangalore', 'Coimbatore', 'Indore', 'Mumbai'];
const EVENT_CATEGORIES = [
    'Wedding', 'Engagement', 'Reception', 'Birthday Party',
    'Anniversary Celebration', 'Baby Shower', 'House Warming',
    'Family Gathering', 'Corporate Event', 'House Party'
];

interface Vendor {
    id: string;
    name: string;
    city: string;
    events: string[];
    eventDriveLinks: Record<string, string>;
}

export default function ManageVendors() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingVendor, setViewingVendor] = useState<Vendor | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [cities, setCities] = useState<string[]>(INITIAL_CITIES);
    const [newVendorData, setNewVendorData] = useState({ name: '', city: INITIAL_CITIES[0], events: [] as string[] });

    useEffect(() => {
        const q = query(collection(db, 'vendors'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const vendorList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Vendor));
            setVendors(vendorList);
            setLoading(false);
        });

        // Sync Cities from Firestore
        const citiesSub = onSnapshot(collection(db, 'cities'), (snapshot) => {
            if (!snapshot.empty) {
                const cityList = snapshot.docs.map(doc => doc.id).sort();
                setCities(cityList);
            }
        });

        return () => {
            unsubscribe();
            citiesSub();
        };
    }, []);

    // Custom Modals State
    const [cityModal, setCityModal] = useState({ isOpen: false, name: '' });
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { },
        type: 'danger' as 'danger' | 'info'
    });

    const handleAddCity = async () => {
        if (cityModal.name && cityModal.name.trim()) {
            const cityName = cityModal.name.trim();
            if (cities.includes(cityName)) {
                setConfirmModal({
                    isOpen: true,
                    title: 'Already Exists',
                    message: `The city "${cityName}" is already in the list.`,
                    onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
                    type: 'info'
                });
                return;
            }

            try {
                // Save to Firestore
                await setDoc(doc(db, 'cities', cityName), { active: true });
                toast.success(`City "${cityName}" added!`);
                setCityModal({ isOpen: false, name: '' });
            } catch (error) {
                toast.error("Failed to add city.");
            }
        }
    };

    const handleToggleEvent = (event: string) => {
        setNewVendorData(prev => ({
            ...prev,
            events: prev.events.includes(event) ? prev.events.filter(e => e !== event) : [...prev.events, event]
        }));
    };

    const handleSaveVendor = async () => {
        if (!newVendorData.name || newVendorData.events.length === 0) {
            setConfirmModal({
                isOpen: true,
                title: 'Missing Details',
                message: 'Please fill in the vendor name and select at least one event category.',
                onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
                type: 'info'
            });
            return;
        }

        try {
            await addDoc(collection(db, 'vendors'), {
                name: newVendorData.name,
                city: newVendorData.city,
                events: newVendorData.events,
                eventDriveLinks: newVendorData.events.reduce((acc, event) => ({ ...acc, [event]: '' }), {})
            });
            toast.success("Vendor added successfully!");
            setIsAdding(false);
            setNewVendorData({ name: '', city: INITIAL_CITIES[0], events: [] });
        } catch (error: any) {
            console.error("Add Vendor Error:", error);
            if (error.code === 'permission-denied') {
                toast.error("Permission Denied: You don't have admin rights in the database.");
            } else {
                toast.error(`Failed to add vendor: ${error.message || 'Unknown error'}`);
            }
        }
    };

    const handleDeleteVendor = (id: string, name: string) => {
        setConfirmModal({
            isOpen: true,
            title: 'Delete Vendor',
            message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, 'vendors', id));
                    toast.success("Vendor deleted.");
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    toast.error("Delete failed.");
                }
            },
            type: 'danger'
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h1 style={{ margin: 0 }}>Manage Vendors</h1>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-secondary" onClick={() => setCityModal({ isOpen: true, name: '' })}>
                        <Plus size={18} /> Add City
                    </button>
                    <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                        <Plus size={18} /> Add Vendor
                    </button>
                </div>
            </div>

            <div className="card" style={{ marginBottom: 24, padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Search size={20} color="var(--color-text-light)" />
                <input type="text" placeholder="Search vendors by name or event type..." style={{ border: 'none', padding: 0, outline: 'none', background: 'transparent', flex: 1 }} />
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-mid)' }}>
                            <th style={{ padding: '16px 24px', fontWeight: 500 }}>Vendor Name</th>
                            <th style={{ padding: '16px 24px', fontWeight: 500 }}>City</th>
                            <th style={{ padding: '16px 24px', fontWeight: 500 }}>Events Catered</th>
                            <th style={{ padding: '16px 24px', fontWeight: 500 }}>Portfolio Links</th>
                            <th style={{ padding: '16px 24px', fontWeight: 500, width: 100 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: 48, textAlign: 'center' }}>
                                    <Loader2 className="spin" size={32} style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
                                    <p style={{ marginTop: 12, color: 'var(--color-text-mid)' }}>Loading vendors...</p>
                                </td>
                            </tr>
                        ) : (
                            vendors.map(v => (
                                <tr key={v.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{v.name}</td>
                                    <td style={{ padding: '16px 24px' }}>{v.city}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            {v.events.map(ev => <span key={ev} className="badge badge-gold">{ev}</span>)}
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <button
                                            className="btn btn-ghost"
                                            style={{ padding: '6px 12px', fontSize: 12 }}
                                            onClick={() => setViewingVendor(v)}
                                        >
                                            <ImageIcon size={14} /> Manage Links ({v.events.filter(e => v.eventDriveLinks?.[e]).length})
                                        </button>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <button
                                            className="btn btn-danger"
                                            style={{ padding: 8 }}
                                            onClick={() => handleDeleteVendor(v.id, v.name)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        {vendors.length === 0 && !loading && (
                            <tr>
                                <td colSpan={5} style={{ padding: 48, textAlign: 'center', color: 'var(--color-text-mid)' }}>
                                    No vendors found. Click "Add Vendor" to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isAdding && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: 600, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ margin: 0 }}>Add New Vendor</h2>
                            <button className="btn btn-ghost" onClick={() => setIsAdding(false)} style={{ padding: 8 }}><X size={20} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Vendor Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter business name"
                                    value={newVendorData.name}
                                    onChange={e => setNewVendorData({ ...newVendorData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Base City</label>
                                <select
                                    value={newVendorData.city}
                                    onChange={e => setNewVendorData({ ...newVendorData, city: e.target.value })}
                                    style={{ width: '100%' }}
                                >
                                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Events Catered</label>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: 12,
                                    padding: 16,
                                    background: 'var(--color-bg-cream)',
                                    borderRadius: 8,
                                    border: '1px solid var(--color-border)'
                                }}>
                                    {EVENT_CATEGORIES.map(event => (
                                        <label key={event} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            fontSize: 14,
                                            cursor: 'pointer',
                                            padding: '4px 0'
                                        }}>
                                            <input
                                                type="checkbox"
                                                checked={newVendorData.events.includes(event)}
                                                onChange={() => handleToggleEvent(event)}
                                                style={{ width: 'auto' }}
                                            />
                                            {event}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginTop: 12, display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                                <button className="btn btn-ghost" onClick={() => setIsAdding(false)}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleSaveVendor}>Save Vendor</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Vendor Links Modal */}
            {viewingVendor && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: 600, padding: 32, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--color-border)' }}>
                            <h2 style={{ margin: 0 }}>{viewingVendor.name} - Portfolio Links</h2>
                            <button className="btn btn-ghost" onClick={() => { setViewingVendor(null); }}>Close</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {viewingVendor.events.map((event: string) => (
                                <div key={event}>
                                    <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: 'var(--color-primary-dark)' }}>{event} Drive Folder Link</label>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <input
                                            type="url"
                                            placeholder="Paste Google Drive folder link here..."
                                            value={viewingVendor.eventDriveLinks?.[event] || ''}
                                            onChange={async (e) => {
                                                const newLink = e.target.value;
                                                const updatedLinks = {
                                                    ...viewingVendor.eventDriveLinks,
                                                    [event]: newLink
                                                };
                                                
                                                // Update locally first
                                                setViewingVendor({ ...viewingVendor, eventDriveLinks: updatedLinks });

                                                // Update Firestore
                                                try {
                                                    await updateDoc(doc(db, 'vendors', viewingVendor.id), {
                                                        eventDriveLinks: updatedLinks
                                                    });
                                                } catch (err) {
                                                    toast.error("Cloud sync failed");
                                                }
                                            }}
                                            style={{ flex: 1 }}
                                        />
                                        {viewingVendor.eventDriveLinks?.[event] && (
                                            <a 
                                                href={viewingVendor.eventDriveLinks[event]} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="btn btn-secondary"
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 42, padding: 0 }}
                                                title="Open Link"
                                            >
                                                <ChevronRight size={18} />
                                            </a>
                                        )}
                                    </div>
                                    <p className="caption" style={{ marginTop: 4 }}>This link will be shown to customers looking for {event} services.</p>
                                </div>
                            ))}

                            {viewingVendor.events.length === 0 && (
                                <p style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-mid)' }}>This vendor has no event categories assigned.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Modal: Add City */}
            {cityModal.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: 400, padding: 32 }}>
                        <h2 style={{ marginBottom: 24 }}>Add Operational City</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>City Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Pune, Chennai"
                                    value={cityModal.name}
                                    onChange={e => setCityModal({ ...cityModal, name: e.target.value })}
                                    autoFocus
                                />
                            </div>
                            <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end', marginTop: 8 }}>
                                <button className="btn btn-ghost" onClick={() => setCityModal({ isOpen: false, name: '' })}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleAddCity}>Add City</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Modal: Confirmation / Alert */}
            {confirmModal.isOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: 400, padding: 32, textAlign: 'center' }}>
                        <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: confirmModal.type === 'danger' ? '#fee2e2' : 'var(--color-bg-cream)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            color: confirmModal.type === 'danger' ? 'var(--color-danger)' : 'var(--color-primary)'
                        }}>
                            {confirmModal.type === 'danger' ? <Trash2 size={32} /> : <ImageIcon size={32} />}
                        </div>
                        <h2 style={{ marginBottom: 12 }}>{confirmModal.title}</h2>
                        <p style={{ color: 'var(--color-text-mid)', marginBottom: 24, fontSize: 15, lineHeight: 1.5 }}>
                            {confirmModal.message}
                        </p>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                            {confirmModal.type === 'danger' ? (
                                <>
                                    <button className="btn btn-ghost" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}>Cancel</button>
                                    <button className="btn btn-danger" onClick={confirmModal.onConfirm}>Confirm Delete</button>
                                </>
                            ) : (
                                <button className="btn btn-primary" onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}>Okay</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
