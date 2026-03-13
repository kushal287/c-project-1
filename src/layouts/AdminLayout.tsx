import { Link, Outlet, useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { User, LogOut } from 'lucide-react';

export const AdminLayout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-cream)' }}>
            <aside style={{ width: 250, background: 'var(--color-admin-bg)', color: '#fff', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ color: 'var(--color-primary)' }}>JashanEdge Admin</h3>
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '32px' }}>
                    <Link to="/admin/queries" style={{ color: '#fff' }}>Event Queries</Link>
                    <Link to="/admin/vendors" style={{ color: '#fff' }}>Manage Vendors</Link>
                </nav>

                <div style={{ marginTop: 'auto', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1208', fontWeight: 'bold' }}>
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.email?.split('@')[0]}</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Administrator</div>
                        </div>
                    </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                    <button
                        onClick={async () => {
                            sessionStorage.removeItem('jashan_admin_session');
                            await auth.signOut();
                            toast.success('Logged out from Admin');
                            window.location.href = '/admin-login';
                        }}
                        style={{ background: 'transparent', color: '#ff4d4f', border: '1px solid #ff4d4f', padding: '8px 16px', borderRadius: 4, cursor: 'pointer', width: '100%' }}
                    >
                        Logout
                    </button>
                </div>
            </aside>
            <main style={{ flex: 1, padding: '32px' }}>
                <Outlet />
            </main>
        </div>
    );
};
