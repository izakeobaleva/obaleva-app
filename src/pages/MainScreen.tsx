import React, { useState } from 'react';

const MainScreen = () => {
  const [destination, setDestination] = useState('');

  return (
    <div style={{
      backgroundColor: '#111827',
      minHeight: '100vh',
      padding: '20px 16px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#facc15', fontSize: '28px', marginBottom: '4px' }}>ObaLeva</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Passageiro</p>
      </div>

      {/* Mapa */}
      <div style={{
        backgroundColor: '#1f2937',
        borderRadius: '16px',
        padding: '40px 20px',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🗺️</div>
        <p style={{ color: '#9ca3af', fontWeight: '500' }}>Carregando mapa...</p>
        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>📍 Aguardando localização</p>
      </div>

      {/* Onde você está */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#4ade80', fontWeight: '500', fontSize: '12px' }}>📍 ONDE VOCÊ ESTÁ?</span>
        </div>
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span style={{ color: '#fff', fontSize: '14px' }}>-23.5239, -46.6436</span>
          <button style={{ color: '#facc15', fontSize: '12px' }}>[Alterar]</button>
        </div>
      </div>

      {/* Para onde você vai */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ color: '#f87171', fontWeight: '500', fontSize: '12px' }}>🎯 PARA ONDE VOCÊ VAI?</span>
        </div>
        <div style={{
          backgroundColor: '#1f2937',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <input
            type="text"
            placeholder="Para onde vai?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              flex: 1,
              outline: 'none'
            }}
          />
          <button style={{ color: '#facc15', fontSize: '12px' }}>[Selecionar]</button>
        </div>
      </div>

      {/* Botão */}
      <button style={{
        width: '100%',
        backgroundColor: '#facc15',
        color: '#111827',
        padding: '14px',
        border: 'none',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '16px'
      }}>
        🚗 Chamar ObaLeva
      </button>

      {/* Rodapé */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderTop: '1px solid #1f2937'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: '#facc15', fontSize: '11px' }}>🔥 10% OFF 1ª corrida</span>
          <span style={{ color: '#6b7280', fontSize: '11px' }}>🛡️ Segurança 24h</span>
        </div>
        <span style={{ color: '#facc15', fontSize: '11px' }}>Saiba mais →</span>
      </div>
    </div>
  );
};

export default MainScreen;