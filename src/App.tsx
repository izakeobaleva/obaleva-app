import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { MainScreen } from './pages/MainScreen';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MainScreen />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;