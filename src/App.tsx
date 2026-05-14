import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { PassengerDashboard } from './pages/PassengerDashboard'
import { DriverDashboard } from './pages/DriverDashboard'
import NotFound from './pages/NotFound'

// ✅ Lazy loading - só carrega quando a rota for acessada
const Index = lazy(() => import('./pages/Index').then(m => ({ default: m.Index })))
const LoginPage = lazy(() => import('./pages/Login'))
const RegisterPassenger = lazy(() => import('./pages/RegisterPassenger').then(m => ({ default: m.RegisterPassenger })))
const RegisterDriver = lazy(() => import('./pages/RegisterDriver').then(m => ({ default: m.RegisterDriver })))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'))
const Profile = lazy(() => import('./pages/Profile'))
const Trips = lazy(() => import('./pages/Trips'))
const TripDetails = lazy(() => import('./pages/TripDetails'))
const Earnings = lazy(() => import('./pages/Earnings'))
const Divulgacao = lazy(() => import('./pages/Divulgacao'))
const AppDivulgacao = lazy(() => import('./pages/AppDivulgacao'))

// Loader minimalista
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0F0B1A]">
      <div className="animate-spin h-6 w-6 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
    </div>
  )
}

function AppRoutes() {
  const { profile, loading } = useAuth()

  if (loading) return <PageLoader />

  // Rotas comuns a todos os estados
  const commonRoutes = (
    <>
      <Route path="/forgot-password" element={<Suspense fallback={<PageLoader />}><ForgotPassword /></Suspense>} />
      <Route path="/update-password" element={<Suspense fallback={<PageLoader />}><UpdatePassword /></Suspense>} />
      <Route path="/divulgar" element={<Suspense fallback={<PageLoader />}><AppDivulgacao /></Suspense>} />
      <Route path="/landing" element={<Suspense fallback={<PageLoader />}><Divulgacao /></Suspense>} />
      <Route path="*" element={<NotFound />} />
    </>
  )

  // Logado como passageiro
  if (profile?.tipo === 'passageiro') {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<PassengerDashboard />} />
        <Route path="/trips" element={<Suspense fallback={<PageLoader />}><Trips /></Suspense>} />
        <Route path="/trips/:id" element={<Suspense fallback={<PageLoader />}><TripDetails /></Suspense>} />
        <Route path="/profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<PageLoader />}><RegisterPassenger /></Suspense>} />
        <Route path="/register-driver" element={<Suspense fallback={<PageLoader />}><RegisterDriver /></Suspense>} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
        {commonRoutes}
      </Routes>
    )
  }

  // Logado como motorista
  if (profile?.tipo === 'motorista') {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DriverDashboard />} />
        <Route path="/earnings" element={<Suspense fallback={<PageLoader />}><Earnings /></Suspense>} />
        <Route path="/trips/:id" element={<Suspense fallback={<PageLoader />}><TripDetails /></Suspense>} />
        <Route path="/profile" element={<Suspense fallback={<PageLoader />}><Profile /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<PageLoader />}><RegisterPassenger /></Suspense>} />
        <Route path="/register-driver" element={<Suspense fallback={<PageLoader />}><RegisterDriver /></Suspense>} />
        <Route path="/login" element={<Navigate to="/dashboard" replace />} />
        <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
        {commonRoutes}
      </Routes>
    )
  }

  // Logado como admin
  if (profile?.tipo === 'admin') {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense>} />
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
        <Route path="/login" element={<Navigate to="/admin" replace />} />
        <Route path="/register" element={<Suspense fallback={<PageLoader />}><RegisterPassenger /></Suspense>} />
        <Route path="/register-driver" element={<Suspense fallback={<PageLoader />}><RegisterDriver /></Suspense>} />
        {commonRoutes}
      </Routes>
    )
  }

  // NÃO LOGADO
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Suspense fallback={<PageLoader />}><LoginPage /></Suspense>} />
      <Route path="/register" element={<Suspense fallback={<PageLoader />}><RegisterPassenger /></Suspense>} />
      <Route path="/register-driver" element={<Suspense fallback={<PageLoader />}><RegisterDriver /></Suspense>} />
      <Route path="/admin" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
      {commonRoutes}
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