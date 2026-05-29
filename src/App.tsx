import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import PermissionMaps from './pages/PermissionMaps';
import PermissionApp from './pages/PermissionApp';
import Login from './pages/Login';
import MainScreen from './pages/MainScreen';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/permission-maps" element={<PermissionMaps />} />
        <Route path="/permission-app" element={<PermissionApp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;