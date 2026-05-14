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
import TestLogin from './pages/TestLogin'

function AppRoutes() {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
    </div>
  )

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPassenger />} />
        <Route path="/register-driver" element={<RegisterDriver />} />
        <Route path="/test-login" element={<TestLogin />} />
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

  return (
    <Routes>
      <Route path="/" element={<Index />} />
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