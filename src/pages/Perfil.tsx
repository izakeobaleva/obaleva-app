import React from 'react';
import { useNavigate } from 'react-router-dom';

const Perfil = () => {
  const navigate = useNavigate();
  const isMotorista = false; // Buscar do seu estado/backend

  const handleLogout = () => {
    navigate('/');
  };

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
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}>←</button>
        <h1 style={{ fontSize: '18px', margin: 0 }}>Meu Perfil</h1>
        <div style={{ width: 40 }}></div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>👤</div>
          <p><strong>João Silva</strong></p>
          <p>joao@email.com</p>

          {/* Botão para se tornar motorista - só aparece se NÃO for motorista */}
          {!isMotorista && (
            <button
              onClick={() => navigate('/seja-motorista')}
              style={{
                width: '100%',
                background: '#ff9800',
                color: 'white',
                fontWeight: 'bold',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                marginTop: '16px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              🚛 Quero ser Motorista
            </button>
          )}

          {isMotorista && (
            <div style={{ marginTop: '16px', padding: '12px', background: '#e8f5e9', borderRadius: '8px' }}>
              <p>✅ Você é motorista parceiro</p>
              <p>⭐ Avaliação: 4.8</p>
              <p>🚖 Corridas: 150</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              background: '#e53935',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px',
              border: 'none',
              borderRadius: '8px',
              marginTop: '16px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;