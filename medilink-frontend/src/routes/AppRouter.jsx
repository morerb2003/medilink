
import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';

// Patient Pages
import PatientDashboard from '../pages/patient/Dashboard';
import MyRecords from '../pages/patient/MyRecords';
import ConsentRequests from '../pages/patient/ConsentRequests';
import GenerateQR from '../pages/patient/GenerateQR';

// Doctor Pages
import DoctorDashboard from '../pages/doctor/Dashboard';
import PatientRecords from '../pages/doctor/PatientRecords';
import Emergency from '../pages/doctor/Emergency';
import AccessHistory from '../pages/doctor/AccessHistory';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import AuditLogs from '../pages/admin/AuditLogs';
import EmergencyLogs from '../pages/admin/EmergencyLogs';

// Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient Routes */}
      <Route path="/patient" element={<ProtectedRoute><RoleRoute role="patient"><PatientDashboard /></RoleRoute></ProtectedRoute>} />
      <Route path="/patient/records" element={<ProtectedRoute><RoleRoute role="patient"><MyRecords /></RoleRoute></ProtectedRoute>} />
      <Route path="/patient/consents" element={<ProtectedRoute><RoleRoute role="patient"><ConsentRequests /></RoleRoute></ProtectedRoute>} />
      <Route path="/patient/qr" element={<ProtectedRoute><RoleRoute role="patient"><GenerateQR /></RoleRoute></ProtectedRoute>} />

      {/* Doctor Routes */}
      <Route path="/doctor" element={<ProtectedRoute><RoleRoute role="doctor"><DoctorDashboard /></RoleRoute></ProtectedRoute>} />
      <Route path="/doctor/records" element={<ProtectedRoute><RoleRoute role="doctor"><PatientRecords /></RoleRoute></ProtectedRoute>} />
      <Route path="/doctor/emergency" element={<ProtectedRoute><RoleRoute role="doctor"><Emergency /></RoleRoute></ProtectedRoute>} />
      <Route path="/doctor/history" element={<ProtectedRoute><RoleRoute role="doctor"><AccessHistory /></RoleRoute></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><RoleRoute role="admin"><AdminDashboard /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute><RoleRoute role="admin"><ManageUsers /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/audit" element={<ProtectedRoute><RoleRoute role="admin"><AuditLogs /></RoleRoute></ProtectedRoute>} />
      <Route path="/admin/emergency-logs" element={<ProtectedRoute><RoleRoute role="admin"><EmergencyLogs /></RoleRoute></ProtectedRoute>} />

      {/* 404 & 403 Fallback */}
      <Route path="/403" element={<div className="flex items-center justify-center h-screen text-2xl font-bold text-red-500">403 - Forbidden Access</div>} />
      <Route path="*" element={<div className="flex items-center justify-center h-screen text-2xl font-bold">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;
