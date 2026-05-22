import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccessScreen } from './screens/AccessScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { SearchScreen } from './components/screens/SearchScreen';
import { ActivityScreen } from './components/screens/ActivityScreen';
import ProfileScreen from './components/ProfileScreen';
import { BottomNav } from './components/navigation/BottomNav';

function AppContent() {
  const { user, profile, loading, signOut, refreshSession } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showAccess, setShowAccess] = useState(false);

  useEffect(() => {
    if (!user) {
      setShowAccess(true);
    } else {
      setShowAccess(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Tela de acesso com mapa + carrossel (para não logados)
  if (showAccess && !user) {
    return (
      <>
        <AccessScreen onAccessSuccess={() => setShowAccess(false)} />
        <Toaster position="top-center" richColors />
      </>
    );
  }

  const handleLogout = async () => {
    await signOut();
    setShowAccess(true);
  };

  return (
    <>
      {activeTab === 'home' && (
        <HomeScreen user={user} onLogout={handleLogout} showFullUI={!!user} />
      )}
      {activeTab === 'perfil' && user && (
        <ProfileScreen user={user} profile={profile} onLogout={handleLogout} onRefresh={refreshSession} />
      )}
      {activeTab === 'buscar' && !!user && <SearchScreen />}
      {activeTab === 'atividade' && !!user && <ActivityScreen />}
      {!!user && <BottomNav active={activeTab} onNavigate={setActiveTab} />}
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