import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { PassengerDashboard } from './pages/PassengerDashboard';
import { DriverDashboard } from './pages/DriverDashboard';
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
import PermissionLocation from './pages/PermissionLocation';
import PermissionNotification from './pages/PermissionNotification';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* NOVAS TELAS */}
          <Route path="/permission-location" element={<PermissionLocation />} />
          <Route path="/permission-notification" element={<PermissionNotification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />

          {/* REDIRECIONAR ROTA RAIZ PARA HOME */}
          <Route path="/" element={<Navigate to="/permission-location" replace />} />

          {/* ROTAS EXISTENTES */}
          <Route path="/register" element={<RegisterPassenger />} />
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/divulgar" element={<Divulgacao />} />
          <Route path="/test-login" element={<TestLogin />} />
          <Route path="/bulk-create" element={<BulkCreateUsers />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cadastro-motorista" element={<CadastroMotorista />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;