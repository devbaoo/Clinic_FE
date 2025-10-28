import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Pages
import HomePage from '../pages/Home/HomePage';
import LoginPage from '../pages/Auth/LoginPage';
import UnauthorizedPage from '../pages/Error/UnauthorizedPage';
import NotFoundPage from '../pages/Error/NotFoundPage';

// Layout components
import DashboardLayout from '../components/layouts/DashboardLayout';

// Pages
import DashboardPage from '../pages/Dashboard/DashboardPage';
import PatientsPage from '../pages/Patients/PatientsPage';
import PatientDetailPage from '../pages/Patients/PatientDetailPage';
import AppointmentsPage from '../pages/Appointments/AppointmentsPage';
import PrescriptionsPage from '../pages/Prescriptions/PrescriptionsPage';
import UserManagementPage from '../pages/Admin/UserManagementPage';

const AppRouter: React.FC = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected routes - requires authentication */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* Patient routes - accessible by all authenticated users */}
                    <Route path="/patients" element={<PatientsPage />} />
                    <Route path="/patients/:id" element={<PatientDetailPage />} />

                    {/* Appointment routes - accessible by all authenticated users */}
                    <Route path="/appointments" element={<AppointmentsPage />} />

                    {/* Prescription routes - accessible by all authenticated users */}
                    <Route path="/prescriptions" element={<PrescriptionsPage />} />
                </Route>
            </Route>

            {/* Admin-only routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/users" element={<UserManagementPage />} />
                </Route>
            </Route>

            {/* Doctor-only routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'doctor']} />}>
                <Route element={<DashboardLayout />}>
                    {/* Add doctor-specific routes here */}
                </Route>
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRouter;
