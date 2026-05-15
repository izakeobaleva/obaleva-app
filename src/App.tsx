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
import Trips from './pages/Trips'
import TripDetails from './pages/TripDetails'
import Earnings from './pages/Earnings'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import UpdatePassword from './pages/UpdatePassword'
import NotFound from './pages/NotFound'
import Divulgacao from './pages/Divulgacao'
import AppDivulgacao from './pages/AppDivulgacao'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

function ProtectedRoute({ children, allowedTypes }: { children: React.ReactNode; allowedTypes?: string[] }) {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
    </div>
  )

  if (!user) return <Navigate to="/" replace />

  if (allowedTypes && profile && !allowedTypes.includes(profile.tipo)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export function AppRoutes() {
  const { user, profile, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
    </div>
  )

  const tipo = profile?.tipo

  return (
    <Routes>
      {/* Rotas públicas - SEMPRE acessíveis, mesmo logado */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPassenger />} />
      <Route path="/register-driver" element={<RegisterDriver />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/test-login" element={<TestLogin />} />
      <Route path="/landing" element={<Divulgacao />} />
      <Route path="/divulgar" element={<Divulgacao />} />
      <Route path="/app-divulgacao" element={<AppDivulgacao />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/" element={<Index />} />

      {/* Admin */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedTypes={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* Rotas protegidas */}
      <Route path="/" element={
        <ProtectedRoute allowedTypes={['passageiro', 'motorista']}>
          {tipo === 'passageiro' ? <PassengerDashboard /> : <DriverDashboard />}
        </ProtectedRoute>
      } />
      
      <Route path="/trips" element={
        <ProtectedRoute allowedTypes={['passageiro']}>
          <Trips />
        </ProtectedRoute>
      } />
      
      <Route path="/trips/:id" element={
        <ProtectedRoute allowedTypes={['passageiro', 'motorista']}>
          <TripDetails />
        </ProtectedRoute>
      } />
      
      <Route path="/earnings" element={
        <ProtectedRoute allowedTypes={['motorista']}>
          <Earnings />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute allowedTypes={['passageiro', 'motorista']}>
          <Profile />
        </ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-center" richColors closeButton />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App