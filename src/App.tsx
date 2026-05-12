import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import RegisterPassenger from './pages/RegisterPassenger';
import RegisterDriver from './pages/RegisterDriver';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverDashboard from './pages/DriverDashboard';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Earnings from './pages/Earnings';
import AdminDashboard from './pages/AdminDashboard';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPassenger />} />
          <Route path="/register-driver" element={<RegisterDriver />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/passenger" element={<PassengerDashboard />} />
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/:id" element={<TripDetails />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;