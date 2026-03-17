import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import AdminLogin from './pages/AdminLogin';

// Customer Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import NewEventForm from './pages/dashboard/NewEventForm';
import Requests from './pages/dashboard/Requests';
import OngoingEvents from './pages/dashboard/OngoingEvents';
import PastEvents from './pages/dashboard/PastEvents';
import PaymentHistory from './pages/dashboard/PaymentHistory';
import HelpContact from './pages/dashboard/HelpContact';
import PaymentPage from './pages/dashboard/PaymentPage';

// Admin Pages
import EventQueries from './pages/admin/EventQueries';
import ManageVendors from './pages/admin/ManageVendors';
function App() {
    return (
        <AuthProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
                <Toaster position="top-center" toastOptions={{
                    style: { background: '#1A1208', color: '#C8963E', border: '1px solid #C8963E' }
                }} />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/login" element={<AuthPage mode="login" />} />
                    <Route path="/signup" element={<AuthPage mode="signup" />} />
                    <Route path="/admin-login" element={<AdminLogin />} />

                    {/* Customer Protected Routes */}
                    <Route element={<ProtectedRoute roleRequired="customer" />}>
                        <Route path="/dashboard" element={<CustomerLayout />}>
                            <Route index element={<DashboardHome />} />
                            <Route path="new-event" element={<NewEventForm />} />
                            <Route path="requests" element={<Requests />} />
                            <Route path="ongoing" element={<OngoingEvents />} />
                            <Route path="payments" element={<PaymentHistory />} />
                            <Route path="help" element={<HelpContact />} />
                            <Route path="payment/:type/:eventId" element={<PaymentPage />} />
                        </Route>
                    </Route>

                    {/* Admin Protected Routes */}
                    <Route element={<ProtectedRoute roleRequired="admin" />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route path="queries" element={<EventQueries />} />
                            <Route path="vendors" element={<ManageVendors />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
