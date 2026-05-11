import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Login } from './pages/Login'
import { PassengerDashboard } from './pages/PassengerDashboard'
import { DriverDashboard } from './pages/DriverDashboard'
import { AdminDashboard } from './pages/AdminDashboard'

function AppRoutes() {
  const { user, profile, loading } = useAuth()
  if (loading) return <div className="p-4 text-center">Carregando...</div>
  if (!user) return <Routes><Route path="*" element={<Login />} /></Routes>
  if (!profile) {
    return <div className="p-4 text-center text-red-500">Perfil não encontrado. Faça logout e tente novamente.</div>
  }
  if (profile.tipo === 'passageiro') return <Routes><Route path="*" element={<PassengerDashboard />} /></Routes>
  if (profile.tipo === 'motorista') return <Routes><Route path="*" element={<DriverDashboard />} /></Routes>
  if (profile.tipo === 'admin') return <Routes><Route path="*" element={<AdminDashboard />} /></Routes>
  return <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-center" />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App