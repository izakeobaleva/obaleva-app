import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
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
import { MainScreen } from './pages/MainScreen';
import { DriverDashboard } from './pages/DriverDashboard';
import AuthGate from './components/AuthGate';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPassenger />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/" element={<AuthGate><MainScreen /></AuthGate>} />
          <Route path="/driver" element={<AuthGate><DriverDashboard /></AuthGate>} />
          <Route path="/trips" element={<AuthGate><Trips /></AuthGate>} />
          <Route path="/trips/:id" element={<AuthGate><TripDetails /></AuthGate>} />
          <Route path="/profile" element={<AuthGate><Profile /></AuthGate>} />
          <Route path="/earnings" element={<AuthGate><Earnings /></AuthGate>} />
          <Route path="/cadastro-motorista" element={<AuthGate><CadastroMotorista /></AuthGate>} />
          <Route path="/admin" element={<AuthGate><AdminDashboard /></AuthGate>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;