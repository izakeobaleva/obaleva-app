import React from 'react';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
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
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', fontSize: 20 }}>←</button>
        <h1 style={{ fontSize: 18, margin: 0 }}>Meu Perfil</h1>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, padding: 16, overflow: 'auto' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 20 }}>
          <div style={{ fontSize: 60, textAlign: 'center' }}>👤</div>
          <p><strong>Nome:</strong> Usuário</p>
          <p><strong>Email:</strong> usuario@email.com</p>

          <button
            onClick={() => alert('Em breve!')}
            style={{
              width: '100%',
              background: '#ccc',
              color: '#666',
              padding: 14,
              border: 'none',
              borderRadius: 12,
              marginTop: 16,
              cursor: 'pointer',
            }}
          >
            🚧 Em desenvolvimento
          </button>

          <button
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
            style={{
              width: '100%',
              background: '#dc2626',
              color: 'white',
              padding: 12,
              border: 'none',
              borderRadius: 8,
              marginTop: 16,
              cursor: 'pointer',
            }}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;