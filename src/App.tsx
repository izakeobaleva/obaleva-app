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
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
import Profile from './pages/Profile'
import Trips from './pages/Trips'
import TripDetails from './pages/TripDetails'
import Earnings from './pages/Earnings'
import Divulgacao from './pages/Divulgacao'
import AppDivulgacao from './pages/AppDivulgacao'
import NotFound from './pages/NotFound'

function AppRoutes() {
  const { user, profile, loading } = useAuth()

  console.log('🧭 AppRoutes:', { user: !!user, profile: profile?.tipo, loading })

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F0B1A]">
      <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
    </div>
  )

  // Se estiver logado, redireciona / e /login para o dashboard certo
  if (profile?.tipo === 'passageiro') {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<PassengerDashboard />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<RegisterPassenger />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/divulgar" element={<AppDivulgacao />} />
        <Route path="/landing" element={<Divulgacao />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  if (profile?.tipo === 'motorista') {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DriverDashboard />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<RegisterPassenger />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/divulgar" element={<AppDivulgacao />} />
        <Route path="/landing" element={<Divulgacao />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  if (profile?.tipo === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Navigate to="/admin" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<RegisterPassenger />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/divulgar" element={<AppDivulgacao />} />
        <Route path="/landing" element={<Divulgacao />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    )
  }

  // Não logado — mostra páginas públicas
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/index" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPassenger />} />
      <Route path="/register-driver" element={<RegisterDriver />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/divulgar" element={<AppDivulgacao />} />
      <Route path="/landing" element={<Divulgacao />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App