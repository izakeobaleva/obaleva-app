import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import RegisterPassenger from './pages/RegisterPassenger';
import RegisterDriver from './pages/RegisterDriver';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  // Enquanto carrega, mostra uma mensagem neutra
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  // 🔓 Usuário NÃO logado: só pode ver as telas de login e cadastro
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPassenger />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        {/* Qualquer outra rota redireciona para o login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // 🔐 Usuário logado: redireciona conforme o tipo (se o perfil ainda não carregou, aguarda)
  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Carregando perfil...</div>;
  }

  if (profile.tipo === 'passageiro') {
    return (
      <Routes>
        <Route path="/" element={<PassengerDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (profile.tipo === 'motorista') {
    return (
      <Routes>
        <Route path="/" element={<DriverDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (profile.tipo === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Fallback: se o tipo for desconhecido, faz logout
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