import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/AppLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';

import { AdminDashboard } from './pages/AdminDashboard';
import { StaffDashboard } from './pages/StaffDashboard';
import { ClientDashboard } from './pages/ClientDashboard';
import { StaffKanban } from './pages/StaffKanban';
import { ClientsPage } from './pages/ClientsPage';
import { StaffPage } from './pages/StaffPage';
import { RecordsPage } from './pages/RecordsPage';
import { DocumentsPage } from './pages/DocumentsPage';

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="itr" element={<RecordsPage type="itr" title="ITR Filings" />} />
        <Route path="gst" element={<RecordsPage type="gst" title="GST Filings" />} />
        <Route path="tds" element={<RecordsPage type="tds" title="TDS Filings" />} />
        <Route path="audit" element={<RecordsPage type="audit" title="Audit Reports" />} />
        <Route path="billing" element={<RecordsPage type="billing" title="Billing & Invoices" />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff" element={<ProtectedRoute allowedRoles={['staff']}><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="kanban" element={<StaffKanban />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="itr" element={<RecordsPage type="itr" title="ITR Filings" />} />
        <Route path="gst" element={<RecordsPage type="gst" title="GST Filings" />} />
        <Route path="tds" element={<RecordsPage type="tds" title="TDS Filings" />} />
        <Route path="audit" element={<RecordsPage type="audit" title="Audit Reports" />} />
        <Route path="billing" element={<RecordsPage type="billing" title="Billing & Invoices" />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
      </Route>

      {/* Client Routes */}
      <Route path="/client" element={<ProtectedRoute allowedRoles={['client']}><AppLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<ClientDashboard />} />
        <Route path="*" element={<Navigate to="/client/dashboard" replace />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
