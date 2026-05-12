import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import Landing from './pages/Landing'
import Login from './pages/Login'
import RegisterPassenger from './pages/RegisterPassenger'
import RegisterDriver from './pages/RegisterDriver'
import Home from './pages/Home'
import PassengerDashboard from './pages/PassengerDashboard'
import DriverDashboard from './pages/DriverDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Trips from './pages/Trips'
import Earnings from './pages/Earnings'
import Profile from './pages/Profile'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Toaster position="top-center" richColors />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/passenger" element={<RegisterPassenger />} />
          <Route path="/register/driver" element={<RegisterDriver />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </>
    )
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/passenger" element={<PassengerDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/register/passenger" element={<Navigate to="/" />} />
        <Route path="/register/driver" element={<Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  )
}

export default App