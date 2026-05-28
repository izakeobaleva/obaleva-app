import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Home from './pages/Home';
import PermissionLocation from './pages/PermissionLocation';
import PermissionNotification from './pages/PermissionNotification';
import { RegisterPassenger } from './pages/RegisterPassenger';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const jaViuOnboarding = localStorage.getItem('obaleva_onboarding') === 'true';

  return (
    <BrowserRouter>
      <div style={{ width: '100%', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={jaViuOnboarding ? <Home /> : <Navigate to="/permission-location" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/permission-location" element={<PermissionLocation />} />
          <Route path="/permission-notification" element={<PermissionNotification />} />
          <Route path="/register" element={<RegisterPassenger />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </div>
    </BrowserRouter>
  );
}

export default App;