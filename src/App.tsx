import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PermissionLocation from './pages/PermissionLocation';
import PermissionNotification from './pages/PermissionNotification';
import Login from './pages/Login';
import MainScreen from './pages/MainScreen';
import ProfileScreen from './pages/ProfileScreen';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas do fluxo de permissões e login */}
          <Route path="/" element={<Navigate to="/permission-location" replace />} />
          <Route path="/permission-location" element={<PermissionLocation />} />
          <Route path="/permission-notification" element={<PermissionNotification />} />
          <Route path="/login" element={<Login />} />
          
          {/* Telas principais após login */}
          <Route path="/home" element={<MainScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;