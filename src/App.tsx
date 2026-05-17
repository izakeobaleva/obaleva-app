import React, { useEffect } from 'react';
import { MainScreen } from './pages/MainScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { checkAndRestoreSession } from './lib/supabaseClient';
import { Toaster } from 'sonner';
import { Car } from 'lucide-react';

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
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Car className="w-8 h-8 text-[#F4D03F]" />
          </div>
          <p className="text-white text-lg font-bold">Bem-vindo de volta!</p>
          <p className="text-[#A0A0B0] text-sm mt-1">Entrando...</p>
        </div>
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