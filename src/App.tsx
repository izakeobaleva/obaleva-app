import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import { RegisterPassenger } from './pages/RegisterPassenger';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Divulgacao from './pages/Divulgacao';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Earnings from './pages/Earnings';
import TestLogin from './pages/TestLogin';
import BulkCreateUsers from './pages/BulkCreateUsers';
import Profile from './pages/Profile';
import CadastroMotorista from './pages/CadastroMotorista';
import Login from './pages/Login';
import Home from './pages/Home';
import CompleteProfile from './pages/CompleteProfile';
import { PassengerDashboard } from './pages/PassengerDashboard';
import PermissionLocation from './pages/PermissionLocation';
import PermissionNotification from './pages/PermissionNotification';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/permission-location" element={<PermissionLocation />} />
      <Route path="/permission-notification" element={<PermissionNotification />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPassenger />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/divulgar" element={<Divulgacao />} />
      <Route path="/test-login" element={<TestLogin />} />
      <Route path="/bulk-create" element={<BulkCreateUsers />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute><PassengerDashboard /></ProtectedRoute>} />
      <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
      <Route path="/trips/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
      <Route path="/earnings" element={<ProtectedRoute><Earnings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/cadastro-motorista" element={<ProtectedRoute><CadastroMotorista /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;