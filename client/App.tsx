import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './lib/redux/store';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Example layout components (you'll need to create these)
import DashboardLayout from './components/layouts/DashboardLayout';

// Example pages (you'll need to create these)
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import Appointments from './pages/Appointments';
import Prescriptions from './pages/Prescriptions';
import UserManagement from './pages/UserManagement';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes - requires authentication */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Patient routes - accessible by all authenticated users */}
              <Route path="/patients" element={<Patients />} />
              <Route path="/patients/:id" element={<PatientDetail />} />

              {/* Appointment routes - accessible by all authenticated users */}
              <Route path="/appointments" element={<Appointments />} />

              {/* Prescription routes - accessible by all authenticated users */}
              <Route path="/prescriptions" element={<Prescriptions />} />
            </Route>
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/users" element={<UserManagement />} />
            </Route>
          </Route>

          {/* Doctor-only routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'doctor']} />}>
            <Route element={<DashboardLayout />}>
              {/* Add doctor-specific routes here */}
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;