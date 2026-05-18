import React from 'react';
import { MainScreen } from './pages/MainScreen';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <MainScreen />
    </AuthProvider>
  );
}

export default App;