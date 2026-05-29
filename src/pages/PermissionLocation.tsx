import React from 'react';
import { useNavigate } from 'react-router-dom';

const PermissionLocation = () => {
  const navigate = useNavigate();

  const handleAllow = () => {
    navigator.geolocation.getCurrentPosition(
      () => navigate('/permission-notification'),
      () => navigate('/permission-notification')
    );
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
        textAlign: 'center',
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
          📍
        </div>
        <h2 style={{ color: '#facc15', fontSize: '22px', marginBottom: '12px' }}>ObaLeva</h2>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
          Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
        </p>
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
          SEMPRE PERMITIR
        </button>
        <button
          onClick={() => navigate('/permission-notification')}
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

export default PermissionLocation;