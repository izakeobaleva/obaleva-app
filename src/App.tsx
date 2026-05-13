<<<<<<< HEAD
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Index } from './pages/Index'
import { Login } from './pages/Login'
import { RegisterPassenger } from './pages/RegisterPassenger'
import { RegisterDriver } from './pages/RegisterDriver'
import { PassengerDashboard } from './pages/PassengerDashboard'
import { DriverDashboard } from './pages/DriverDashboard'
import { AdminDashboard } from './pages/AdminDashboard'

function AppRoutes() {
  const { user, profile, loading } = useAuth()

  if (loading) return <div className="p-4 text-center text-white bg-[#0F0B1A] min-h-screen">Carregando...</div>

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPassenger />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  if (profile?.tipo === 'passageiro') {
    return (
      <Routes>
        <Route path="/" element={<PassengerDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  if (profile?.tipo === 'motorista') {
    return (
      <Routes>
        <Route path="/" element={<DriverDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  if (profile?.tipo === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return <Navigate to="/login" replace />
}
=======
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Entrar from './pages/Login';
import RegisterPassenger from './pages/RegisterPassenger';
import RegisterDriver from './pages/RegisterDriver';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Earnings from './pages/Earnings';
import AdminDashboard from './pages/AdminDashboard';
import LandingPage from './pages/LandingPage';
import NotFound from './pages/NotFound';
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
<<<<<<< HEAD
        <AppRoutes />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
=======
        <Routes>
          <Route path="/" element={<Entrar />} />
          <Route path="/login" element={<Entrar />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPassenger />} />
          <Route path="/register-driver" element={<RegisterDriver />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/passenger" element={<PassengerDashboard />} />
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780
