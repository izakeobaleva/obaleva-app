import React from 'react';
import { MainScreen } from './pages/MainScreen';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <MainScreen />
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}

export default App;