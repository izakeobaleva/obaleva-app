import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'sonner'
import Login from './pages/Login'
import RegisterPassenger from './pages/RegisterPassenger'
import RegisterDriver from './pages/RegisterDriver'
import PassengerDashboard from './pages/PassengerDashboard'
import DriverDashboard from './pages/DriverDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Trips from './pages/Trips'
import Earnings from './pages/Earnings'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register/passenger" element={<RegisterPassenger />} />
        <Route path="/register/driver" element={<RegisterDriver />} />
        <Route path="/passenger" element={<PassengerDashboard />} />
        <Route path="/driver" element={<DriverDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/earnings" element={<Earnings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </AuthProvider>
  )
}

export default App