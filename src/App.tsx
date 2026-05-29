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
import AuthGate from './components/AuthGate';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="w-full min-h-screen bg-[#0F0B1A]">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPassenger />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* Rotas protegidas (precisa estar logado) */}
            <Route path="/" element={<AuthGate><PassengerDashboard /></AuthGate>} />
            <Route path="/driver" element={<AuthGate><DriverDashboard /></AuthGate>} />
            <Route path="/trips" element={<AuthGate><Trips /></AuthGate>} />
            <Route path="/trips/:id" element={<AuthGate><TripDetails /></AuthGate>} />
            <Route path="/profile" element={<AuthGate><Profile /></AuthGate>} />
            <Route path="/earnings" element={<AuthGate><Earnings /></AuthGate>} />
            <Route path="/cadastro-motorista" element={<AuthGate><CadastroMotorista /></AuthGate>} />
            <Route path="/admin" element={<AuthGate><AdminDashboard /></AuthGate>} />
            
            {/* Páginas antigas de onboarding */}
            <Route path="/permission-location" element={<PermissionLocation />} />
            <Route path="/permission-notification" element={<PermissionNotification />} />
            
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