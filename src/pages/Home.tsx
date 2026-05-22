import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100dvh',
      background: '#f5f5f5', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{
        padding: 16, background: 'white', borderBottom: '1px solid #ddd',
        display: 'flex', justifyContent: 'space-between'
      }}>
        <h1 style={{ fontSize: 20, margin: 0 }}>🏠 Home</h1>
        <button onClick={() => navigate('/perfil')} style={{ background: 'none', border: 'none', fontSize: 24 }}>👤</button>
      </div>

      <div style={{ flex: 1, padding: 16 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 20 }}>
          <p>📍 Página inicial</p>
        </div>
      </div>
    </div>
  );
};

export default Home;