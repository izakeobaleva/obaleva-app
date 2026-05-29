import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { MapPin, Navigation, Car, Gift, ShieldCheck } from 'lucide-react';

// =====================================================
// TELA PRINCIPAL - OBALEVÁ (VERSÃO ESTÁVEL)
// Usa APENAS estilo inline - NÃO depende de CSS externo
// =====================================================

const MainScreen = () => {
  const [origin, setOrigin] = useState('R. Santo Antônio, 1091 - Bela Vista');
  const [destination, setDestination] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestRide = () => {
    if (!destination) {
      toast.error('Digite um destino');
      return;
    }
    setIsRequesting(true);
    setTimeout(() => {
      toast.success('Procurando motorista... 🚗');
      setIsRequesting(false);
    }, 2000);
  };

  return (
    // Container fixo - força ocupar 100% da tela
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#111827',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Toaster position="top-center" richColors />
      
      {/* ========================================== */}
      {/* 1. TOP BAR (60px FIXO) */}
      {/* ========================================== */}
      <div style={{
        height: '60px',
        flexShrink: 0,
        backgroundColor: '#111827',
        borderBottom: '1px solid #1f2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#facc15',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Car size={18} color="#111827" />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#facc15' }}>ObaLeva</span>
        </div>
        <div style={{
          width: '32px',
          height: '32px',
          backgroundColor: '#1f2937',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ color: '#facc15', fontSize: '14px', fontWeight: 'bold' }}>P</span>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. MAPA (OCUPA TODO ESPAÇO QUE SOBRA - flex-1) */}
      {/* ========================================== */}
      <div style={{
        flex: 1,
        backgroundColor: '#1f2937',
        margin: '16px',
        borderRadius: '16px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#374151',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <span style={{ fontSize: '32px' }}>🗺️</span>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>Mapa indisponível</p>
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>📞 -23.5543, -46.6475</p>
        </div>
        
        {/* Marcador de localização simulado */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: '#111827cc',
          borderRadius: '50%',
          padding: '8px'
        }}>
          <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. ORIGEM + DESTINO */}
      {/* ========================================== */}
      <div style={{
        flexShrink: 0,
        backgroundColor: '#111827',
        padding: '16px',
        borderTop: '1px solid #1f2937'
      }}>
        
        {/* ONDE VOCÊ ESTÁ? */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <MapPin size={14} color="#4ade80" />
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>ONDE VOCÊ ESTÁ?</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            padding: '8px 12px'
          }}>
            <span style={{ fontSize: '13px', color: '#f3f4f6', flex: 1 }}>{origin}</span>
            <button style={{ fontSize: '11px', color: '#facc15' }}>[Editar]</button>
          </div>
        </div>

        {/* PARA ONDE VOCÊ VAI? */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Navigation size={14} color="#f87171" />
            <span style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '500' }}>PARA ONDE VOCÊ VAI?</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#1f2937',
            borderRadius: '12px',
            padding: '8px 12px'
          }}>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Para onde vai?"
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#f3f4f6',
                fontSize: '13px'
              }}
            />
            <button style={{ fontSize: '11px', color: '#facc15' }}>[Editar]</button>
          </div>
        </div>

        {/* BOTÃO CHAMAR */}
        <button
          onClick={handleRequestRide}
          disabled={isRequesting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: !isRequesting ? '#facc15' : '#4b5563',
            color: !isRequesting ? '#111827' : '#9ca3af',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: !isRequesting ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s'
          }}
        >
          {isRequesting ? 'Procurando motorista...' : '🚗 Chamar ObaLeva'}
        </button>
      </div>

      {/* ========================================== */}
      {/* 4. ESPAÇO PUBLICITÁRIO (50px FIXO) */}
      {/* ========================================== */}
      <div style={{
        height: '50px',
        flexShrink: 0,
        backgroundColor: '#1f2937',
        borderTop: '1px solid #374151',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Gift size={12} color="#facc15" />
            <span style={{ fontSize: '11px', color: '#d1d5db' }}>
              <strong style={{ color: '#facc15' }}>10% OFF</strong> 1ª corrida
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={12} color="#facc15" />
            <span style={{ fontSize: '11px', color: '#9ca3af' }}>Segurança 24h</span>
          </div>
        </div>
        <button style={{ fontSize: '11px', color: '#facc15' }}>Saiba mais →</button>
      </div>

    </div>
  );
};

export default MainScreen;