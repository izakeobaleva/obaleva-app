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

// Componente de proteção de rota
const PrivateRoute = ({ children, allowedTypes }: { children: React.ReactNode; allowedTypes?: string[] }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedTypes && profile && !allowedTypes.includes(profile.tipo)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  // Rotas públicas (usuário NÃO logado)
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPassenger />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Rotas privadas (usuário logado)
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute allowedTypes={['passageiro', 'motorista', 'admin']}>
            <Navigate to="/passenger" replace />
          </PrivateRoute>
        }
      />
      <Route
        path="/passenger"
        element={
          <PrivateRoute allowedTypes={['passageiro']}>
            <PassengerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/driver"
        element={
          <PrivateRoute allowedTypes={['motorista']}>
            <DriverDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedTypes={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
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