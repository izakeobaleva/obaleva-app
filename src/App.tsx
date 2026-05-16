import React from 'react';
import TestMap from './pages/TestMap';

function App() {
  console.log('🔵 App iniciado');
  console.log('🔍 Varíáveis de ambiente:');
  console.log('  VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌');
  console.log('  VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌');
  console.log('  VITE_GOOGLE_MAPS_API_KEY:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅' : '❌');
  
  return <TestMap />;
}

export default App;