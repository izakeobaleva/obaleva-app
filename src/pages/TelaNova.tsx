import React, { useState } from 'react';

const TelaNova = () => {
  const [destination, setDestination] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequest = () => {
    if (!destination) {
      alert('Digite um destino');
      return;
    }
    setIsRequesting(true);
    setTimeout(() => {
      alert('Procurando motorista... 🚗');
      setIsRequesting(false);
    }, 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#111827',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* TOPO */}
      <div style={{
        padding: '20px 16px 10px 16px',
        backgroundColor: '#111827',
        borderBottom: '1px solid #1f2937'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#facc15',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            🚗
          </div>
          <h1 style={{ color: '#facc15', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>ObaLeva</h1>
        </div>
      </div>

      {/* ÁREA DO MAPA */}
      <div style={{
        flex: 1,
        backgroundColor: '#1f2937',
        margin: '16px',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #374151'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🗺️</div>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Mapa indisponível</p>
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '5px' }}>📍 -23.5543, -46.6475</p>
        </div>
      </div>

      {/* FORMULÁRIO */}
      <div style={{
        padding: '16px',
        backgroundColor: '#111827',
        borderTop: '1px solid #1f2937'
      }}>
        
        {/* Origem */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: '#4ade80' }}>📍</span>
            <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>ONDE VOCÊ ESTÁ?</span>
          </div>
          <div style={{
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            padding: '12px 14px',
            border: '1px solid #374151',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#f3f4f6', fontSize: '14px' }}>R. Santo Antônio, 1091 - Bela Vista</span>
            <button style={{ color: '#facc15', fontSize: '12px', background: 'none', border: 'none' }}>[Editar]</button>
          </div>
        </div>

        {/* Destino */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '12px', color: '#f87171' }}>🎯</span>
            <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '500' }}>PARA ONDE VOCÊ VAI?</span>
          </div>
          <div style={{
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            padding: '12px 14px',
            border: '1px solid #374151',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Digite seu destino"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f3f4f6',
                fontSize: '14px',
                flex: 1
              }}
            />
            <button style={{ color: '#facc15', fontSize: '12px', background: 'none', border: 'none' }}>[Editar]</button>
          </div>
        </div>

        {/* Botão */}
        <button
          onClick={handleRequest}
          disabled={isRequesting}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: isRequesting ? '#374151' : '#facc15',
            color: isRequesting ? '#9ca3af' : '#111827',
            border: 'none',
            borderRadius: '14px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isRequesting ? 'not-allowed' : 'pointer',
            marginTop: '4px'
          }}
        >
          {isRequesting ? '⏳ Procurando motorista...' : '🚗 Chamar ObaLeva'}
        </button>
      </div>

      {/* Rodapé */}
      <div style={{
        padding: '12px 16px',
        backgroundColor: '#1f2937',
        borderTop: '1px solid #374151',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ fontSize: '11px', color: '#facc15' }}>🔥 10% OFF</span>
          <span style={{ fontSize: '11px', color: '#9ca3af' }}>🛡️ Segurança 24h</span>
        </div>
        <span style={{ fontSize: '11px', color: '#facc15' }}>Saiba mais →</span>
      </div>

    </div>
  );
};

export default TelaNova;