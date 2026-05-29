import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PermissionLocation from './pages/PermissionLocation';
import PermissionNotification from './pages/PermissionNotification';
import Login from './pages/Login';
import MainScreen from './pages/MainScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/permission-location" replace />} />
        <Route path="/permission-location" element={<PermissionLocation />} />
        <Route path="/permission-notification" element={<PermissionNotification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<MainScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;