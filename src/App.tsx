import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainScreen from './pages/MainScreen';
import ProfileScreen from './pages/ProfileScreen';
import Login from './pages/Login';
import PermissionLocation from './pages/PermissionLocation';
import PermissionNotification from './pages/PermissionNotification';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/permission-location" element={<PermissionLocation />} />
        <Route path="/permission-notification" element={<PermissionNotification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;