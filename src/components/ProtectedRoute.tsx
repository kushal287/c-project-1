import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ roleRequired }: { roleRequired: 'customer' | 'admin' }) => {
    const { user, role, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to={roleRequired === 'admin' ? '/admin-login' : '/login'} replace />;
    if (role !== roleRequired) return <Navigate to="/" replace />;

    return <Outlet />;
};
