import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PermissionLocation from './pages/PermissionLocation';
import PermissionNotification from './pages/PermissionNotification';
import Login from './pages/Login';
import MainScreen from './pages/MainScreen';
import ProfileScreen from './pages/ProfileScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* REDIRECIONA A ROTA PRINCIPAL PARA PERMISSÃO DE LOCALIZAÇÃO */}
        <Route path="/" element={<Navigate to="/permission-location" replace />} />
        
        {/* FLUXO DE PERMISSÕES E LOGIN */}
        <Route path="/permission-location" element={<PermissionLocation />} />
        <Route path="/permission-notification" element={<PermissionNotification />} />
        <Route path="/login" element={<Login />} />
        
        {/* TELAS PRINCIPAIS APÓS LOGIN */}
        <Route path="/home" element={<MainScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;