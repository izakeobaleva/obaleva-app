import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import { PassengerDashboard } from './pages/PassengerDashboard';
import { DriverDashboard } from './pages/DriverDashboard';
import { RegisterPassenger } from './pages/RegisterPassenger';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Profile from './pages/Profile';
import Earnings from './pages/Earnings';
import CadastroMotorista from './pages/CadastroMotorista';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PermissionLocation from './pages/PermissionLocation';
import PermissionNotification from './pages/PermissionNotification';

function App() {
  const jaViuOnboarding = localStorage.getItem('obaleva_onboarding') === 'true';

  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="w-full min-h-screen bg-[#0F0B1A]">
          <Routes>
            {/* Rotas principais */}
            <Route path="/" element={<PassengerDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPassenger />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            
            {/* Rotas de motorista */}
            <Route path="/driver" element={<DriverDashboard />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/cadastro-motorista" element={<CadastroMotorista />} />
            
            {/* Rotas de corridas */}
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:id" element={<TripDetails />} />
            
            {/* Rotas de perfil */}
            <Route path="/profile" element={<Profile />} />
            
            {/* Rotas de onboarding */}
            <Route path="/permission-location" element={jaViuOnboarding ? <Navigate to="/" replace /> : <PermissionLocation />} />
            <Route path="/permission-notification" element={jaViuOnboarding ? <Navigate to="/" replace /> : <PermissionNotification />} />
            
            {/* Rotas de admin */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-center" richColors />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;