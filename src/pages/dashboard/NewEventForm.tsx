import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where, addDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2, Image as ImageIcon } from 'lucide-react';

const EVENT_TYPES = [
    'Wedding', 'Engagement', 'Reception', 'Birthday Party',
    'Anniversary Celebration', 'Baby Shower', 'House Warming',
    'Family Gathering', 'Corporate Event', 'House Party', 'Other'
];

const INITIAL_CITIES = ['Bangalore', 'Coimbatore', 'Indore', 'Mumbai'];

// Vendor interface remains the same
interface Vendor {
    id: string;
    name: string;
    city: string;
    events: string[];
    eventDriveLinks: Record<string, string>;
    rating?: number; // Added optional rating
}

export default function NewEventForm() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loadingVendors, setLoadingVendors] = useState(false);

    const [cities, setCities] = useState<string[]>(INITIAL_CITIES);

    useEffect(() => {
        // Sync Cities from Firestore
        const unsubscribe = onSnapshot(collection(db, 'cities'), (snapshot) => {
            if (!snapshot.empty) {
                const cityList = snapshot.docs.map(doc => doc.id).sort();
                setCities(cityList);
            }
        });
        return () => unsubscribe();
    }, []);

    // Step 1 State
    const [formData, setFormData] = useState({
        fullName: user?.displayName || '',
        phone: '',
        eventName: '',
        city: cities[0] || 'Bangalore',
        street: '',
        area: '',
        pincode: '',
        eventType: 'Wedding',
        otherDesc: '',
        date: new Date(),
        time: '',
        preferredContact: 'Phone'
    });

    useEffect(() => {
        if (step === 2) {
            fetchVendors();
        }
    }, [step, formData.city, formData.eventType]);

    const fetchVendors = async () => {
        setLoadingVendors(true);
        try {
            const q = query(
                collection(db, 'vendors'),
                where('city', '==', formData.city),
                where('events', 'array-contains', formData.eventType)
            );
            const snapshot = await getDocs(q);
            const vendorList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Vendor));
            setVendors(vendorList);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load vendors.");
        } finally {
            setLoadingVendors(false);
        }
    };

    // Step 2 State
    const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

    const selectedVendor = vendors.find(v => v.id === selectedVendorId);
    const isOther = formData.eventType === 'Other';

    const handleNext = () => {
        if (step === 1) {
            if (!formData.eventName || !formData.phone || !formData.street || !formData.area || !formData.pincode || !formData.time) {
                toast.error('Please fill all details.');
                return;
            }
            if (formData.phone.length !== 10) {
                toast.error('Phone number must be exactly 10 digits.');
                return;
            }
            if (formData.pincode.length !== 6) {
                toast.error('Pincode must be exactly 6 digits.');
                return;
            }
            if (isOther) setStep(3); // Skip vendor selection
            else setStep(2);
        } else if (step === 2) {
            if (!selectedVendorId) {
                toast.error('Please select a vendor.');
                return;
            }
            setStep(3);
        }
    };

    const handleSubmit = async () => {
        if (!user?.uid) {
            toast.error("You must be logged in to submit a request.");
            return;
        }

        const toastId = toast.loading("Submitting your request...");
        const submissionData = {
            ...formData,
            date: formData.date.toISOString(),
            userId: user.uid,
            selectedVendorId: selectedVendorId,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        try {
            console.log("Submitting query:", submissionData);
            const docRef = await addDoc(collection(db, 'queries'), submissionData);
            console.log("Query submitted with ID:", docRef.id);
            toast.success('Event request submitted successfully!', { id: toastId });
            navigate('/dashboard/requests');
        } catch (error: any) {
            console.error("Submission error:", error);
            toast.error(`Submission failed: ${error.message || 'Unknown error'}`, { id: toastId });
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h1 style={{ marginBottom: 32 }}>Start New Event</h1>

            {/* Progress */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
                {[1, 2, 3].map(s => (
                    <div key={s} style={{
                        flex: 1, height: 8, borderRadius: 4,
                        background: step >= s ? 'var(--color-primary)' : 'var(--color-border)'
                    }} />
                ))}
            </div>

            <div className="card" style={{ padding: 40 }}>
                {step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Event Details</h2>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div>
                                <label>Full Name</label>
                                <input type="text" value={formData.fullName} disabled />
                            </div>
                            <div>
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={10}
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                    placeholder="10 digit number"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label>Event Name</label>
                            <input type="text" value={formData.eventName} onChange={e => setFormData({ ...formData, eventName: e.target.value })} placeholder="e.g. Neha's Wedding" />
                        </div>

                        <div style={{ marginTop: 24 }}>
                            <label>Street Address</label>
                            <input
                                type="text"
                                value={formData.street}
                                onChange={e => setFormData({ ...formData, street: e.target.value })}
                                placeholder="Flat / House No. / Building / Street"
                                style={{ width: '100%', marginBottom: 24 }}
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 24 }}>
                                <div>
                                    <label>Area / Locality</label>
                                    <input
                                        type="text"
                                        value={formData.area}
                                        onChange={e => setFormData({ ...formData, area: e.target.value })}
                                        placeholder="Area"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                                <div>
                                    <label>City</label>
                                    <select value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} style={{ width: '100%' }}>
                                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label>Pincode</label>
                                    <input
                                        type="tel"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={6}
                                        value={formData.pincode}
                                        onChange={e => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                                        placeholder="6 digits"
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label>Event Type</label>
                            <select value={formData.eventType} onChange={e => setFormData({ ...formData, eventType: e.target.value })}>
                                {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        {isOther && (
                            <div>
                                <label>Please describe your event</label>
                                <textarea rows={3} value={formData.otherDesc} onChange={e => setFormData({ ...formData, otherDesc: e.target.value })} placeholder="Describe details..." />
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                            <div>
                                <label>Date of Event</label>
                                <div>
                                    <DatePicker
                                        selected={formData.date}
                                        onChange={d => d && setFormData({ ...formData, date: d })}
                                        minDate={new Date()}
                                        className="date-picker-input"
                                    />
                                </div>
                            </div>
                            <div>
                                <label>Time of Event</label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                    onClick={(e) => {
                                        if ('showPicker' in HTMLInputElement.prototype) {
                                            try {
                                                e.currentTarget.showPicker();
                                            } catch (err) {
                                                // Ignore if not supported or not triggered by user interaction
                                            }
                                        }
                                    }}
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: 24, textAlign: 'right' }}>
                            <button onClick={handleNext} className="btn btn-primary">Next: {isOther ? 'Confirm Details' : 'Choose Vendor'} &rarr;</button>
                        </div>
                    </div>
                )}

                {step === 2 && !isOther && (
                    <div>
                        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Available Vendors</h2>
                        <p style={{ color: 'var(--color-text-mid)', marginBottom: 24 }}>Vendors in {formData.city} for {formData.eventType}</p>

                        <div style={{ display: 'grid', gap: 24 }}>
                            {loadingVendors ? (
                                <div style={{ textAlign: 'center', padding: 48 }}>
                                    <Loader2 className="spin" size={32} style={{ margin: '0 auto', color: 'var(--color-primary)' }} />
                                    <p style={{ marginTop: 12, color: 'var(--color-text-mid)' }}>Finding vendors in {formData.city}...</p>
                                </div>
                            ) : (
                                <>
                                    {vendors.map(vendor => (
                                        <div key={vendor.id}
                                            className="card"
                                            style={{
                                                padding: 24,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 20,
                                                border: selectedVendorId === vendor.id ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <h3 style={{ margin: '0 0 8px 0', fontSize: 22 }}>{vendor.name}</h3>
                                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                                        <span className="badge badge-gold" style={{ background: '#f5f5f5', color: '#666' }}>★ {vendor.rating || '4.5'}</span>
                                                        <span className="badge badge-gold">{vendor.events.length} Service Types</span>
                                                    </div>
                                                </div>
                                                <button
                                                    className={`btn ${selectedVendorId === vendor.id ? 'btn-primary' : 'btn-secondary'}`}
                                                    onClick={() => setSelectedVendorId(selectedVendorId === vendor.id ? null : vendor.id)}
                                                    style={{ whiteSpace: 'nowrap' }}
                                                >
                                                    {selectedVendorId === vendor.id ? 'Selected' : 'Select'}
                                                </button>
                                            </div>

                                            <div>
                                                {vendor.eventDriveLinks?.[formData.eventType] ? (
                                                    <a 
                                                        href={vendor.eventDriveLinks[formData.eventType]} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="btn btn-secondary"
                                                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px' }}
                                                    >
                                                        <ImageIcon size={18} /> View Sample Portfolio Folder
                                                    </a>
                                                ) : (
                                                    <div style={{ padding: '12px 20px', background: 'var(--color-bg-cream)', borderRadius: 8, color: 'var(--color-text-mid)', fontSize: 14 }}>
                                                        No portfolio link provided for {formData.eventType}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {vendors.length === 0 && (
                                        <div style={{ textAlign: 'center', padding: 48, background: 'var(--color-bg-cream)', borderRadius: 8 }}>
                                            <p>No preferred vendors found currently for {formData.eventType} in {formData.city}. You can continue, and our team will assign the perfect vendor shortly.</p>
                                            <button
                                                onClick={() => { setSelectedVendorId('auto'); setStep(3); }}
                                                className="btn btn-secondary"
                                                style={{ marginTop: 16 }}
                                            >
                                                Let JashanEdge Select
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                            <button onClick={() => setStep(1)} className="btn btn-ghost">&larr; Back</button>
                            <button onClick={handleNext} className="btn btn-primary" disabled={!selectedVendorId}>
                                Next: Request Callback
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div>
                        <h2 style={{ fontSize: 24, marginBottom: 24 }}>Confirm & Request</h2>

                        <div style={{ background: 'var(--color-bg-cream)', padding: 24, borderRadius: 8, marginBottom: 32 }}>
                            <h3 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 16, marginBottom: 16 }}>{formData.eventName}</h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div><strong>City:</strong> <br />{formData.city}</div>
                                <div><strong>Date & Time:</strong> <br />{formData.date.toLocaleDateString()} at {formData.time}</div>
                                <div><strong>Event Type:</strong> <br />{formData.eventType}</div>
                                <div><strong>Location:</strong> <br />{formData.street}, {formData.area}, {formData.city} - {formData.pincode}</div>
                                {isOther && <div style={{ gridColumn: 'span 2' }}><strong>Description:</strong> <br />{formData.otherDesc}</div>}
                            </div>

                            {!isOther && selectedVendorId !== 'auto' && selectedVendor && (
                                <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px dashed var(--color-border)' }}>
                                    <strong>Selected Vendor:</strong> <br />
                                    <h4 style={{ margin: '8px 0 0 0', color: 'var(--color-primary-dark)' }}>{selectedVendor.name}</h4>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: 32 }}>
                            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Preferred way to contact</label>
                            <select
                                value={formData.preferredContact}
                                onChange={e => setFormData({ ...formData, preferredContact: e.target.value })}
                                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 16 }}
                            >
                                <option value="Phone">Phone Call</option>
                                <option value="WhatsApp">WhatsApp</option>
                                <option value="Email">Email</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: 16, flexDirection: 'column', alignItems: 'center' }}>
                            <button onClick={handleSubmit} className="btn btn-primary" style={{ width: '100%', padding: 16, fontSize: 16 }}>
                                {isOther ? 'Submit Enquiry to Admin' : 'Request Callback & Book'}
                            </button>
                            <button onClick={() => setStep(step - 1)} className="btn btn-ghost">
                                Back to Edit
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .date-picker-input {
          width: 100%;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 12px 16px;
          font-family: var(--font-body);
          font-size: 15px;
        }
      `}</style>
        </div>
    );
}
