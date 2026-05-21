import React from 'react';

// Componente de teste mínimo - SEM Calendar, SEM dependências
const TesteMinimo = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      zIndex: 9999,
    }}>
      <h1 style={{ color: '#4CAF50', fontSize: '28px' }}>✅ FUNCIONOU!</h1>
      <p style={{ color: '#666', fontSize: '16px', marginTop: '8px' }}>
        O erro Calendar não existe mais neste componente.
      </p>
    </div>
  );
};

function App() {
  return <TesteMinimo />;
}

export default App;