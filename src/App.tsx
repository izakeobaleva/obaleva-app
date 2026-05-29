import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import { RegisterPassenger } from './pages/RegisterPassenger';
import MainScreen from './pages/MainScreen';
import PermissionLocation from './pages/PermissionLocation';
import PermissionNotification from './pages/PermissionNotification';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Profile from './pages/Profile';
import Trips from './pages/Trips';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AuthGate from './components/AuthGate';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" richColors />
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<MainScreen />} />
          <Route path="/permission-location" element={<PermissionLocation />} />
          <Route path="/permission-notification" element={<PermissionNotification />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPassenger />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          
          {/* Rotas protegidas */}
          <Route path="/profile" element={<AuthGate><Profile /></AuthGate>} />
          <Route path="/trips" element={<AuthGate><Trips /></AuthGate>} />
          <Route path="/admin" element={<AuthGate><AdminDashboard /></AuthGate>} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;