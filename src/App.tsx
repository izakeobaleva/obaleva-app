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