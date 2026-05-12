import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import RegisterPassenger from './pages/RegisterPassenger';
import RegisterDriver from './pages/RegisterDriver';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Landing from './pages/Landing';
import { Toaster } from 'sonner';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4D03F]"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.tipo)) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F4D03F]"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={profile ? <Navigate to="/home" replace /> : <Landing />} />
      <Route path="/login" element={profile ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/register-passenger" element={profile ? <Navigate to="/home" replace /> : <RegisterPassenger />} />
      <Route path="/register-driver" element={profile ? <Navigate to="/home" replace /> : <RegisterDriver />} />
      <Route path="/home" element={<ProtectedRoute allowedRoles={['passageiro', 'motorista', 'admin']}><div id="dashboard-root" /></ProtectedRoute>} />
      <Route path="/passenger" element={<ProtectedRoute allowedRoles={['passageiro']}><PassengerDashboard /></ProtectedRoute>} />
      <Route path="/driver" element={<ProtectedRoute allowedRoles={['motorista']}><DriverDashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </Router>
  );
}