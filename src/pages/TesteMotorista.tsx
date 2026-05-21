import React from 'react';

const TesteMotorista = () => {
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
      zIndex: 9999,
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#4CAF50' }}>✅ TELA FUNCIONANDO</h1>
        <p>Se você está vendo isso, o componente carregou corretamente.</p>
        <button 
          onClick={() => alert('Funciona!')}
          style={{
            padding: '12px 24px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          Clique aqui
        </button>
      </div>
    </div>
  );
};

export default TesteMotorista;