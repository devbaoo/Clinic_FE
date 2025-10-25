import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/lib/redux/hooks';
import { selectIsAuthenticated, selectCurrentUser } from '@/lib/redux/slices/authSlice';
import { User } from '@shared/api';

interface ProtectedRouteProps {
    allowedRoles?: Array<User['role']>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const currentUser = useAppSelector(selectCurrentUser);
    const location = useLocation();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If role restrictions are specified and user doesn't have the required role
    if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // If authenticated and authorized, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
