import React from 'react';
import { useNavigate } from 'react-router-dom';

const PermissionNotification = () => {
  const navigate = useNavigate();

  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
    navigate('/login');
  };

  return (
    <div style={{
      backgroundColor: '#111827',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '24px',
        padding: '32px 24px',
        maxWidth: '320px',
        width: '100%'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#facc15',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '32px'
        }}>
          🔔
        </div>
        <h2 style={{ color: '#facc15', fontSize: '22px', marginBottom: '12px', textAlign: 'center' }}>
          Permitir notificações?
        </h2>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }}>
          Para receber alertas importantes como:
        </p>
        <ul style={{ color: '#d1d5db', fontSize: '13px', marginBottom: '24px', paddingLeft: '20px' }}>
          <li style={{ marginBottom: '4px' }}>• "Motorista a caminho"</li>
          <li style={{ marginBottom: '4px' }}>• "Estou chegando!"</li>
          <li style={{ marginBottom: '4px' }}>• "Corrida confirmada"</li>
          <li style={{ marginBottom: '4px' }}>• "Promoções e descontos"</li>
          <li>• "Avalie sua corrida"</li>
        </ul>
        <button
          onClick={handleAllow}
          style={{
            width: '100%',
            backgroundColor: '#facc15',
            color: '#111827',
            padding: '14px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '12px',
            cursor: 'pointer'
          }}
        >
          PERMITIR
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            color: '#6b7280',
            padding: '14px',
            border: 'none',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Agora não
        </button>
      </div>
    </div>
  );
};

export default PermissionNotification;