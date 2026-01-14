import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import BrowseEvents from './pages/BrowseEvents';
import MyTickets from './pages/MyTickets';
import ManageEvents from './pages/ManageEvents';
import ManageVolunteers from './pages/ManageVolunteers';
import ApproveEvents from './pages/ApproveEvents';
import ScanQR from './pages/ScanQR';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="events" element={<BrowseEvents />} />
              <Route path="my-tickets" element={<MyTickets />} />
              <Route path="manage-events" element={<ManageEvents />} />
              <Route path="manage-volunteers" element={<ManageVolunteers />} />
              <Route path="approve-events" element={<ApproveEvents />} />
              <Route path="scan" element={<ScanQR />} />
            </Route>

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
