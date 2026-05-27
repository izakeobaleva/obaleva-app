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
import CompleteProfile from './pages/CompleteProfile'; // <-- NOVO IMPORT
import { useAuth } from './contexts/AuthContext';

// Componente de rota protegida
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Routes>
      {/* FLUXO DE PERMISSÕES (se não estiver logado) */}
      {!user && (
        <>
          <Route path="/permission-location" element={<PermissionLocation />} />
          <Route path="/permission-notification" element={<PermissionNotification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPassenger />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
        </>
      )}

      {/* FLUXO PRINCIPAL (quando logado) */}
      {user && (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/complete-profile" element={<CompleteProfile />} /> {/* <-- NOVA ROTA */}
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cadastro-motorista" element={<CadastroMotorista />} />
        </>
      )}

      {/* ROTAS ADMIN (sempre acessíveis) */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* ROTAS PÚBLICAS */}
      <Route path="/divulgar" element={<Divulgacao />} />
      <Route path="/test-login" element={<TestLogin />} />
      <Route path="/bulk-create" element={<BulkCreateUsers />} />

      {/* REDIRECIONAMENTO PADRÃO */}
      <Route 
        path="*" 
        element={
          user 
            ? <Navigate to="/" replace /> 
            : <Navigate to="/permission-location" replace />
        } 
      />
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