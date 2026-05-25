import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { HomeScreen } from './components/screens/HomeScreen';
import ProfileScreen from './components/ProfileScreen';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  // Se não tem usuário logado, mostra tela de login
  if (!user) {
    return null;
  }

  return (
    <>
      {activeTab === 'home' && <HomeScreen />}
      {activeTab === 'perfil' && user && <ProfileScreen user={user} profile={profile} onLogout={signOut} onRefresh={refreshSession} />}
      <Toaster position="top-center" richColors />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;