import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import RegisterPassenger from './pages/RegisterPassenger';
import RegisterDriver from './pages/RegisterDriver';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Earnings from './pages/Earnings';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import NotFound from './pages/NotFound';

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Usuário não autenticado: rotas públicas
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/register" element={<RegisterPassenger />} />
        <Route path="/register/passenger" element={<RegisterPassenger />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/register/driver" element={<RegisterDriver />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // Usuário autenticado: rotas protegidas com redirecionamento por tipo
  if (profile?.tipo === 'passageiro') {
    return (
      <Routes>
        <Route path="/" element={<PassengerDashboard />} />
        <Route path="/home" element={<PassengerDashboard />} />
        <Route path="/passenger" element={<PassengerDashboard />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/profile" element={<Profile />} />
        {/* Rotas de login/cadastro redirecionam para o dashboard */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register/*" element={<Navigate to="/" replace />} />
        <Route path="/register-driver" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (profile?.tipo === 'motorista') {
    return (
      <Routes>
        <Route path="/" element={<DriverDashboard />} />
        <Route path="/home" element={<DriverDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register/*" element={<Navigate to="/" replace />} />
        <Route path="/register-driver" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (profile?.tipo === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/home" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/passenger" element={<PassengerDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/register/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Fallback (caso o tipo não seja reconhecido)
  return <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;