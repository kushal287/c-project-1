import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, CheckCircle, Clock, Archive, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { auth } from '../lib/firebase';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
    { path: '/dashboard', label: 'Overview', icon: Home },
    { path: '/dashboard/new-event', label: 'Start New Event', icon: PlusCircle },
    { path: '/dashboard/requests', label: 'Requests', icon: Clock },
    { path: '/dashboard/ongoing', label: 'Ongoing Events', icon: CheckCircle },
    { path: '/dashboard/past', label: 'Past Events', icon: Archive },
    { path: '/dashboard/help', label: 'Help & Contact', icon: HelpCircle },
];

export function CustomerLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    return (
        <div className="dashboard-wrapper" style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-cream)' }}>
            {/* Desktop Sidebar */}
            <aside className="dashboard-sidebar" style={{
                width: 250,
                background: '#fff',
                borderRight: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                left: 0, top: 0, bottom: 0,
                zIndex: 100
            }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--color-border)' }}>
                    <h2 style={{ fontSize: 24, color: 'var(--color-primary)', margin: 0, cursor: 'pointer' }}>
                        JashanEdge
                    </h2>
                </div>

                <nav style={{ flex: 1, padding: '24px 0', overflowY: 'auto' }}>
                    {NAV_ITEMS.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path} style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '12px 24px',
                                color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-mid)',
                                background: isActive ? 'var(--color-primary-light)' : 'transparent',
                                fontWeight: isActive ? 600 : 500,
                                borderRight: isActive ? '4px solid var(--color-primary)' : '4px solid transparent',
                            }}>
                                <item.icon size={20} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ padding: '24px', borderTop: '1px solid var(--color-border)' }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            color: 'var(--color-text-mid)', fontWeight: 500,
                            background: 'none', border: 'none', cursor: 'pointer', width: '100%',
                            padding: 0, font: 'inherit'
                        }}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main" style={{
                flex: 1,
                marginLeft: 250,
                padding: '32px 48px',
                paddingBottom: 100 // space for mobile nav
            }}>
                <Outlet />
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="mobile-bottom-nav" style={{
                display: 'none',
                position: 'fixed',
                bottom: 0, left: 0, right: 0,
                background: '#fff',
                borderTop: '1px solid var(--color-border)',
                zIndex: 100,
                padding: '8px 16px',
                justifyContent: 'space-around',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
            }}>
                {NAV_ITEMS.slice(0, 5).map(item => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link key={item.path} to={item.path} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            color: isActive ? 'var(--color-primary)' : 'var(--color-text-light)',
                        }}>
                            <item.icon size={24} />
                            <span style={{ fontSize: 10, fontWeight: 500 }}>{item.label.split(' ')[0]}</span>
                        </Link>
                    );
                })}
            </nav>

            <style>{`
        @media (max-width: 768px) {
          .dashboard-sidebar { display: none !important; }
          .dashboard-main { margin-left: 0 !important; padding: 24px 16px !important; padding-bottom: 80px !important; }
          .mobile-bottom-nav { display: flex !important; }
        }
      `}</style>
        </div>
    );
}
