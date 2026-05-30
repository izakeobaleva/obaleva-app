import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PermissionLocation from './pages/PermissionLocation';
import PermissionNotification from './pages/PermissionNotification';
import Login from './pages/Login';
import MainScreen from './pages/MainScreen';
import ProfileScreen from './pages/ProfileScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* FLUXO DE PERMISSÕES E LOGIN */}
        <Route path="/permission-location" element={<PermissionLocation />} />
        <Route path="/permission-notification" element={<PermissionNotification />} />
        <Route path="/login" element={<Login />} />
        
        {/* TELAS PRINCIPAIS */}
        <Route path="/" element={<MainScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;