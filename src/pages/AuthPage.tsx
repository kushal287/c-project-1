import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user exists in Firestore
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                // If new user, create record as customer
                await setDoc(doc(db, 'users', user.uid), {
                    fullName: user.displayName || 'Google User',
                    email: user.email,
                    role: 'customer',
                    createdAt: new Date().toISOString()
                });
            }

            toast.success("Signed in with Google!");
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Google Sign-In failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'signup') {
                if (password !== confirmPassword) {
                    toast.error("Passwords do not match!");
                    setLoading(false);
                    return;
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Set display name
                if (fullName) {
                    await updateProfile(user, { displayName: fullName });
                }

                // Save role in Firestore
                await setDoc(doc(db, 'users', user.uid), {
                    fullName: fullName,
                    email: email,
                    role: 'customer',
                    createdAt: new Date().toISOString()
                });

                toast.success("Account created successfully!");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Signed in successfully!");
            }
            navigate('/dashboard');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'row' }} className="auth-container">
            {/* Left side banner */}
            <div className="auth-banner" style={{
                flex: 1,
                position: 'relative',
                backgroundImage: 'url(/images/auth-bg.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: 48,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                color: '#fff'
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(135deg, rgba(26,18,8,0.9) 0%, rgba(200,150,62,0.4) 100%)',
                    zIndex: 1
                }} />

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', fontSize: 48, marginBottom: 16 }}>
                        JashanEdge
                    </h1>
                    <p style={{ fontSize: 24, fontFamily: 'var(--font-sub)', maxWidth: 400 }}>
                        Where Every Celebration Finds Its Edge.
                    </p>
                </div>
            </div>

            {/* Right side form */}
            <div style={{ flex: 1, padding: '48px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-cream)' }}>
                <div className="card" style={{ width: '100%', maxWidth: 480, padding: 40 }}>
                    <h2 style={{ marginBottom: 8 }}>{mode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
                    <p style={{ color: 'var(--color-text-mid)', marginBottom: 32 }}>
                        {mode === 'login' ? 'Please enter your details to sign in.' : 'Join us to plan your perfect event.'}
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {mode === 'signup' && (
                            <div>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label>Email Address</label>
                            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>

                        <div>
                            <label>Password</label>
                            <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                            {mode === 'login' && (
                                <div style={{ textAlign: 'right', marginTop: 8 }}>
                                    <a href="#" className="caption" style={{ color: 'var(--color-primary)' }}>Forgot password?</a>
                                </div>
                            )}
                        </div>

                        {mode === 'signup' && (
                            <div>
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '16px' }}>
                            {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
                        <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                        <span className="caption">or continue with</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--color-border)' }} />
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="btn btn-secondary"
                        style={{ 
                            width: '100%', 
                            background: '#fff', 
                            color: 'var(--color-text-dark)', 
                            borderColor: 'var(--color-border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 12
                        }}
                    >
                        {loading ? 'Connecting...' : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                                    <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.173.282-1.712V4.956H.957a8.997 8.997 0 0 0 0 8.088l3.007-2.332z" fill="#FBBC05"/>
                                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.483 0 2.443 2.043.957 4.956l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
                                </svg>
                                Google Sign-In
                            </>
                        )}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: 32 }} className="caption">
                        {mode === 'login' ? (
                            <>New here? <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Create an account</Link></>
                        ) : (
                            <>Already have an account? <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Sign In</Link></>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .auth-container { flex-direction: column !important; }
          .auth-banner { padding: 32px !important; min-height: 200px; flex: none !important; }
        }
      `}</style>
        </div>
    );
}
