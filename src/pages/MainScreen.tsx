import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Navigation, Car, User, LogOut, Search,
  ZoomIn, ZoomOut, Crosshair, Flame, Shield, Star, Info,
  CheckCircle, Edit3
} from 'lucide-react';

// ==============================================
// CORES DO TEMA OBALEVÁ
// ==============================================
const COLORS = {
  amarelo: '#facc15',
  amareloEscuro: '#eab308',
  roxo: '#8b5cf6',
  roxoEscuro: '#7c3aed',
  vinho: '#800020',
  vinhoClaro: '#b91c1c',
  vermelho: '#ef4444',
  vermelhoEscuro: '#dc2626',
  verde: '#22c55e',
  verdeEscuro: '#16a34a',
  fundo: '#0f0f0f',
  card: '#1a1a2e',
  texto: '#ffffff',
  textoCinza: '#9ca3af',
};

const MainScreen = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState('Rua Santo Antônio, 1095 - Centro, SP');
  const [isRequesting, setIsRequesting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sugestões de endereços (simulação do Google Autocomplete)
  const suggestions = [
    { name: 'Av. Paulista, 1000 - Bela Vista, SP' },
    { name: 'Rua Augusta, 500 - Consolação, SP' },
    { name: 'Praça da Sé, s/n - Sé, SP' },
    { name: 'Parque Ibirapuera, portão 3 - SP' },
    { name: 'Shopping Center Norte, SP' },
  ];

  const handleRequestRide = () => {
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

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleEditOrigin = () => {
    const newOrigin = prompt('Editar endereço de origem:', origin);
    if (newOrigin) setOrigin(newOrigin);
  };

  const handleConfirmOrigin = () => {
    alert('Origem confirmada!');
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setDestination(suggestion);
    setShowSuggestions(false);
    alert(`Destino selecionado: ${suggestion}`);
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100%', 
      backgroundColor: COLORS.fundo,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      
      {/* ========================================== */}
      {/* TOP BAR COM LOGO E BOTÕES */}
      {/* ========================================== */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.fundo,
        borderBottom: `1px solid ${COLORS.roxo}`,
        padding: '8px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo e título */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Espaço para o logo */}
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: COLORS.amarelo,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Car size={28} color={COLORS.fundo} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: COLORS.amarelo }}>
              ObaLeva
            </span>
          </div>
          
          {/* Botões de ação */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.roxo + '20'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <User size={18} color={COLORS.roxo} />
              <span style={{ color: COLORS.roxo, fontSize: '13px' }}>Perfil</span>
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.vermelho + '20'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={18} color={COLORS.vermelho} />
              <span style={{ color: COLORS.vermelho, fontSize: '13px' }}>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MAPA AO VIVO (OCUPA MÁXIMO ESPAÇO) */}
      {/* ========================================== */}
      <div style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#1a1a2e',
        margin: '0px',
        overflow: 'hidden',
      }}>
        {/* Simulação do mapa (substituir pelo componente real do Google Maps) */}
        <div style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#2a2a3e',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Texto do mapa */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🗺️</div>
            <p style={{ color: COLORS.textoCinza, fontSize: '14px' }}>Mapa ao vivo</p>
            <p style={{ color: '#555', fontSize: '10px' }}>📍 -23.5505, -46.6333</p>
          </div>
          
          {/* Botões de zoom e localização (canto inferior direito) */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            zIndex: 10,
          }}>
            <button style={{
              width: '40px',
              height: '40px',
              backgroundColor: COLORS.amarelo,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              <ZoomIn size={20} color={COLORS.fundo} />
            </button>
            <button style={{
              width: '40px',
              height: '40px',
              backgroundColor: COLORS.amarelo,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              <ZoomOut size={20} color={COLORS.fundo} />
            </button>
            <button style={{
              width: '40px',
              height: '40px',
              backgroundColor: COLORS.verde,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}>
              <Crosshair size={20} color={COLORS.fundo} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* ORIGEM E DESTINO (ESPAÇOS REDUZIDOS) */}
      {/* ========================================== */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.card,
        padding: '8px 16px',
        borderTop: `1px solid ${COLORS.roxo}40`,
        borderBottom: `1px solid ${COLORS.roxo}40`,
      }}>
        
        {/* ONDE VOCÊ ESTÁ? */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <MapPin size={12} color={COLORS.verde} />
            <span style={{ fontSize: '10px', color: COLORS.textoCinza, fontWeight: '500' }}>
              ONDE VOCÊ ESTÁ?
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: COLORS.roxo + '15',
            borderRadius: '12px',
            padding: '8px 12px',
            border: `1px solid ${COLORS.roxo}40`,
          }}>
            <span style={{ fontSize: '13px', color: COLORS.texto, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {origin}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleEditOrigin} style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
                [Editar]
              </button>
              <button onClick={handleConfirmOrigin} style={{ color: COLORS.verde, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
                [✅]
              </button>
            </div>
          </div>
        </div>

        {/* PARA ONDE VOCÊ VAI? */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Navigation size={12} color={COLORS.vermelho} />
            <span style={{ fontSize: '10px', color: COLORS.textoCinza, fontWeight: '500' }}>
              PARA ONDE VOCÊ VAI?
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: COLORS.roxo + '15',
            borderRadius: '12px',
            padding: '8px 12px',
            border: `1px solid ${COLORS.roxo}40`,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setShowSuggestions(e.target.value.length > 0);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Digite o endereço ou cidade..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: COLORS.texto,
                fontSize: '13px',
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => inputRef.current?.focus()}
                style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                [Editar]
              </button>
              <button 
                onClick={() => {
                  if (destination) alert(`Destino confirmado: ${destination}`);
                  else alert('Digite um destino primeiro');
                }}
                style={{ color: COLORS.verde, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                [✅]
              </button>
            </div>
          </div>
          
          {/* AUTOCOMPLETE SUGESTÕES */}
          {showSuggestions && destination.length > 0 && (
            <div style={{
              marginTop: '4px',
              backgroundColor: COLORS.card,
              borderRadius: '12px',
              border: `1px solid ${COLORS.roxo}40`,
              overflow: 'hidden',
              maxHeight: '150px',
              overflowY: 'auto',
            }}>
              {suggestions.filter(s => 
                s.name.toLowerCase().includes(destination.toLowerCase())
              ).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion.name)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    textAlign: 'left',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: index < suggestions.length - 1 ? `1px solid ${COLORS.roxo}20` : 'none',
                    cursor: 'pointer',
                    color: COLORS.textoCinza,
                    fontSize: '12px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.roxo + '20'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Search size={12} style={{ display: 'inline', marginRight: '8px', color: COLORS.amarelo }} />
                  {suggestion.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BOTÃO CHAMAR OBALEVÁ - VERDE */}
        <button
          onClick={handleRequestRide}
          disabled={isRequesting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isRequesting ? COLORS.textoCinza : COLORS.verde,
            color: isRequesting ? COLORS.fundo : COLORS.fundo,
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: isRequesting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            marginTop: '8px',
          }}
        >
          {isRequesting ? 'Procurando motorista...' : '🚗 Chamar ObaLeva'}
        </button>
      </div>

      {/* ========================================== */}
      {/* CONTAINER DE PROPAGANDA (MENOR) */}
      {/* ========================================== */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.roxo + '15',
        padding: '6px 16px',
        borderBottom: `1px solid ${COLORS.roxo}20`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}>
          <Flame size={14} color={COLORS.amarelo} />
          <span style={{ fontSize: '11px', color: COLORS.textoCinza }}>
            <strong style={{ color: COLORS.amarelo }}>20% OFF</strong> na 1ª corrida • 
            Código: <strong style={{ color: COLORS.amarelo }}>OBALEVAFIRST</strong>
          </span>
        </div>
      </div>

      {/* ========================================== */}
      {/* BOTÕES DE INFORMAÇÕES (4 BOTÕES MENORES) */}
      {/* ========================================== */}
      <div style={{
        flexShrink: 0,
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <button style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '6px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: COLORS.roxo + '20',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: '16px' }}>📞</span>
          </div>
          <span style={{ fontSize: '9px', color: COLORS.roxo }}>Suporte 24h</span>
        </button>

        <button style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '6px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: COLORS.roxo + '20',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Shield size={16} color={COLORS.roxo} />
          </div>
          <span style={{ fontSize: '9px', color: COLORS.roxo }}>Segurança</span>
        </button>

        <button style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '6px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: COLORS.roxo + '20',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Star size={16} color={COLORS.roxo} />
          </div>
          <span style={{ fontSize: '9px', color: COLORS.roxo }}>Avaliar</span>
        </button>

        <button style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          padding: '6px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: COLORS.roxo + '20',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Info size={16} color={COLORS.roxo} />
          </div>
          <span style={{ fontSize: '9px', color: COLORS.roxo }}>Sobre</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* RODAPÉ (FONTE PEQUENA - COR VINHO) */}
      {/* ========================================== */}
      <div style={{
        flexShrink: 0,
        padding: '6px 16px',
        textAlign: 'center',
        borderTop: `1px solid ${COLORS.vinho}40`,
      }}>
        <span style={{ fontSize: '8px', color: COLORS.vinho }}>
          ObaLeva v1.0.0 | © 2026 Todos os direitos reservados
        </span>
      </div>

    </div>
  );
};

export default MainScreen;