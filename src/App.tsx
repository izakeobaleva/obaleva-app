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
import NotFound from './pages/NotFound'

function AppRoutes() {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F0B1A]">
      <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
    </div>
  )

  // Rotas públicas (usuário NÃO logado)
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/register" element={<RegisterPassenger />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/divulgar" element={<Divulgacao />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  // Rotas protegidas por tipo de usuário
  return (
    <Routes>
      {/* Passageiro */}
      {profile?.tipo === 'passageiro' && (
        <>
          <Route path="/" element={<PassengerDashboard />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/profile" element={<Profile />} />
        </>
      )}

      {/* Motorista */}
      {profile?.tipo === 'motorista' && (
        <>
          <Route path="/" element={<DriverDashboard />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/profile" element={<Profile />} />
        </>
      )}

      {/* Admin */}
      {profile?.tipo === 'admin' && (
        <>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </>
      )}

      <Route path="/divulgar" element={<Divulgacao />} />

      {/* Se não encaixar em nenhum tipo, redireciona */}
      <Route path="*" element={<Navigate to="/" replace />} />
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