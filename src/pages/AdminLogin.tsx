import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (email !== 'admin1@jashanedge.com' || password !== 'admin1jashan') {
            toast.error('Invalid admin credentials');
            return;
        }

        setLoading(true);
        try {
            let userCredential;
            try {
                // Try signing in
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } catch (signInError: any) {
                // If user doesn't exist, try creating it (Auto-provision)
                if (signInError.code === 'auth/user-not-found' || signInError.code === 'auth/invalid-credential') {
                    userCredential = await createUserWithEmailAndPassword(auth, email, password);
                } else {
                    throw signInError;
                }
            }

            // Ensure admin role doc exists in Firestore for security rules
            const userRef = doc(db, 'users', userCredential.user.uid);
            await setDoc(userRef, {
                email: email,
                role: 'admin',
                updatedAt: new Date().toISOString()
            }, { merge: true });

            toast.success('Admin portal access granted!');
            navigate('/admin/queries');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Login failed. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-admin-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div className="card" style={{ padding: '48px 40px', width: '100%', maxWidth: 440, textAlign: 'center' }}>
                <h1 style={{ color: 'var(--color-primary)', marginBottom: 8 }}>JashanEdge</h1>
                <h2 style={{ fontSize: 20, marginBottom: 8 }}>Admin Portal</h2>
                <p style={{ color: 'var(--color-text-mid)', marginBottom: 32 }}>Restricted Access</p>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 24, textAlign: 'left' }}>
                    <div>
                        <label>Admin Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <label>Portal Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: 16, marginTop: 16 }}>
                        {loading ? 'Authenticating...' : 'Explore Admin Portal'}
                    </button>
                    <button type="button" onClick={() => navigate('/')} className="btn btn-ghost" style={{ padding: 16, width: '100%' }}>&larr; Back to Website</button>
                </form>
            </div>
        </div>
    );
}
