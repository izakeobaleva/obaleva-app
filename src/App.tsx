import React, { useEffect } from 'react';
import { MainScreen } from './pages/MainScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { checkAndRestoreSession } from './lib/supabaseClient';
import { Toaster } from 'sonner';

function AppContent() {
  const { refreshSession, loading } = useAuth();

  useEffect(() => {
    // Reconectar ao voltar para a página
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshSession();
      }
    };

    // Reconectar quando a página ganhar foco
    const handleFocus = () => {
      refreshSession();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Restaurar sessão ao carregar
    checkAndRestoreSession().then(() => {
      refreshSession();
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshSession]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-pulse text-white">Restaurando sessão...</div>
      </div>
    );
  }

  return <MainScreen />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}

export default App;