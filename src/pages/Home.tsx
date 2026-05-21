import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100dvh',
      background: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: 'white',
        borderBottom: '1px solid #eee',
      }}>
        <h1 style={{ fontSize: '20px', margin: 0 }}>🚛 ObaLeva</h1>
        <button onClick={() => navigate('/perfil')} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>👤</button>
      </div>

      <div style={{ flex: 1, padding: '16px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px' }}>
          <h2>📍 Onde você está?</h2>
          <input type="text" placeholder="Endereço de partida" style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
          <input type="text" placeholder="Destino" style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
          <button style={{ width: '100%', background: '#4CAF50', color: 'white', fontWeight: 'bold', padding: '14px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
            🚖 Pedir Corrida
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;