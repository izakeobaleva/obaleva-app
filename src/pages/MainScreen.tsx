import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RealMap from '../components/RealMap';
import { 
  MapPin, Navigation, Car, User, LogOut, Search,
  ZoomIn, ZoomOut, Crosshair, Flame, Shield, Star, Info,
} from 'lucide-react';

const COLORS = {
  amarelo: '#facc15',
  roxo: '#8b5cf6',
  vinho: '#800020',
  vermelho: '#ef4444',
  verde: '#22c55e',
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
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Verificar se está logado
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  // Pegar localização do usuário
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(loc);
        if (map) {
          map.setCenter(loc);
        }
      },
      (error) => {
        console.log('Erro ao obter localização:', error);
      }
    );
  }, [map]);

  const suggestions = [
    'Av. Paulista, 1000 - Bela Vista, SP',
    'Rua Augusta, 500 - Consolação, SP',
    'Praça da Sé, s/n - Sé, SP',
    'Parque Ibirapuera, portão 3 - SP',
    'Shopping Center Norte, SP',
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

  const handleCenterLocation = () => {
    if (userLocation && map) {
      map.setCenter(userLocation);
      map.setZoom(15);
    }
  };

  const handleZoomIn = () => {
    if (map) {
      map.setZoom((map.getZoom() || 14) + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.setZoom((map.getZoom() || 14) - 1);
    }
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
      
      {/* TOP BAR */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.fundo,
        borderBottom: `1px solid ${COLORS.roxo}`,
        padding: '8px 16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => navigate('/profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '8px',
              }}
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
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: '8px',
              }}
            >
              <LogOut size={18} color={COLORS.vermelho} />
              <span style={{ color: COLORS.vermelho, fontSize: '13px' }}>Sair</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAPA - OCUPA MÁXIMO ESPAÇO */}
      <div style={{ flex: 1, position: 'relative' }}>
        <RealMap 
          center={userLocation || undefined}
          zoom={14}
          onLoad={(mapInstance) => setMap(mapInstance)}
          showUserLocation={!!userLocation}
        />
        
        {/* Botões do mapa (sem cores exageradas) */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 10,
        }}>
          <button
            onClick={handleZoomIn}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#2a2a3e',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              color: '#fff',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a4e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
          >
            <ZoomIn size={20} />
          </button>
          <button
            onClick={handleZoomOut}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#2a2a3e',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              color: '#fff',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a4e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
          >
            <ZoomOut size={20} />
          </button>
          <button
            onClick={handleCenterLocation}
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#2a2a3e',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              color: '#fff',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a4e'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a3e'}
          >
            <Crosshair size={20} />
          </button>
        </div>
      </div>

      {/* ORIGEM E DESTINO */}
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
            <span style={{ fontSize: '13px', color: COLORS.texto, flex: 1 }}>
              {origin}
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
                [Editar]
              </button>
              <button style={{ color: COLORS.verde, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
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
              <button style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
                [Editar]
              </button>
              <button style={{ color: COLORS.verde, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
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
            }}>
              {suggestions.filter(s => 
                s.toLowerCase().includes(destination.toLowerCase())
              ).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDestination(suggestion);
                    setShowSuggestions(false);
                  }}
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
                  }}
                >
                  <Search size={12} style={{ display: 'inline', marginRight: '8px', color: COLORS.amarelo }} />
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* BOTÃO CHAMAR */}
        <button
          onClick={handleRequestRide}
          disabled={isRequesting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isRequesting ? COLORS.textoCinza : COLORS.verde,
            color: COLORS.fundo,
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: isRequesting ? 'not-allowed' : 'pointer',
            marginTop: '8px',
          }}
        >
          {isRequesting ? 'Procurando motorista...' : '🚗 Chamar ObaLeva'}
        </button>
      </div>

      {/* PROPAGANDA */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.roxo + '15',
        padding: '6px 16px',
        borderBottom: `1px solid ${COLORS.roxo}20`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Flame size={14} color={COLORS.amarelo} />
          <span style={{ fontSize: '11px', color: COLORS.textoCinza }}>
            <strong style={{ color: COLORS.amarelo }}>20% OFF</strong> na 1ª corrida • 
            Código: <strong style={{ color: COLORS.amarelo }}>OBALEVAFIRST</strong>
          </span>
        </div>
      </div>

      {/* BOTÕES INFO */}
      <div style={{
        flexShrink: 0,
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: COLORS.roxo + '20', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '16px' }}>📞</span>
          </div>
          <span style={{ fontSize: '9px', color: COLORS.roxo }}>Suporte 24h</span>
        </button>
        <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: COLORS.roxo + '20', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={16} color={COLORS.roxo} />
          </div>
          <span style={{ fontSize: '9px', color: COLORS.roxo }}>Segurança</span>
        </button>
        <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: COLORS.roxo + '20', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={16} color={COLORS.roxo} />
          </div>
          <span style={{ fontSize: '9px', color: COLORS.roxo }}>Avaliar</span>
        </button>
        <button style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: COLORS.roxo + '20', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Info size={16} color={COLORS.roxo} />
          </div>
          <span style={{ fontSize: '9px', color: COLORS.roxo }}>Sobre</span>
        </button>
      </div>

      {/* RODAPÉ */}
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