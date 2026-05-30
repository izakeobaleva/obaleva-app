import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { Toaster, toast } from 'sonner';

export default function MainScreen() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) navigate('/login');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setUserLocation({ lat: -23.5505, lng: -46.6333 })
      );
    } else setUserLocation({ lat: -23.5505, lng: -46.6333 });
  }, [navigate]);

  const handleRequestRide = () => {
    if (!destination) { toast.error('Digite um destino'); return; }
    setIsRequesting(true);
    setTimeout(() => { toast.success('Procurando motorista... 🚗'); setIsRequesting(false); }, 2000);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Toaster position="top-center" richColors />
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {isLoaded && userLocation ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={userLocation}
            zoom={15}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              zoomControlOptions: { position: (window.google as any)?.maps?.ControlPosition?.RIGHT_BOTTOM || 3 },
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center">
              <div style={{ width: 32, height: 32, border: '4px solid #eab308', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
              <p style={{ color: '#9ca3af' }}>Carregando mapa...</p>
              <p style={{ color: '#6b7280', fontSize: 12, marginTop: 8 }}>📍 Aguardando localização</p>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)' }} />
      
      <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ height: 60, flexShrink: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(234,179,8,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, background: '#eab308', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>🚗</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 'bold', color: '#eab308' }}>ObaLeva</span>
          </div>
          <button
            onClick={() => { localStorage.removeItem('isLoggedIn'); navigate('/login'); }}
            style={{ color: '#d1d5db', fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sair
          </button>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ flexShrink: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, borderTop: '1px solid rgba(234,179,8,0.5)' }}>
          
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ color: '#4ade80', fontSize: 14 }}>📍</span>
              <span style={{ color: '#d1d5db', fontSize: 12, fontWeight: 500 }}>ONDE VOCÊ ESTÁ?</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1a1a', borderRadius: 12, padding: '8px 12px', border: '1px solid #374151' }}>
              <span style={{ color: '#fff', fontSize: 14, flex: 1 }}>
                {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Carregando...'}
              </span>
              <button style={{ color: '#eab308', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>[Alterar]</button>
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ color: '#f87171', fontSize: 14 }}>🎯</span>
              <span style={{ color: '#d1d5db', fontSize: 12, fontWeight: 500 }}>PARA ONDE VOCÊ VAI?</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1a1a1a', borderRadius: 12, padding: '8px 12px', border: '1px solid #374151' }}>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Para onde vai?"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14 }}
              />
              <button style={{ color: '#eab308', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>[Selecionar]</button>
            </div>
          </div>

          <button
            onClick={handleRequestRide}
            disabled={isRequesting}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 12, fontWeight: 'bold', fontSize: 16, border: 'none', cursor: isRequesting ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              background: isRequesting ? '#374151' : '#eab308',
              color: isRequesting ? '#9ca3af' : '#000',
            }}
          >
            {isRequesting ? 'Procurando motorista...' : '🚗 Chamar ObaLeva'}
          </button>
        </div>

        <div style={{ flexShrink: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderTop: '1px solid #1f2937', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#eab308', fontSize: 12 }}>🔥</span>
              <span style={{ color: '#d1d5db', fontSize: 12 }}><strong style={{ color: '#eab308' }}>10% OFF</strong> 1ª corrida</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#eab308', fontSize: 12 }}>🛡️</span>
              <span style={{ color: '#9ca3af', fontSize: 12 }}>Segurança 24h</span>
            </div>
          </div>
          <button style={{ color: '#eab308', fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>Saiba mais →</button>
        </div>
      </div>
    </div>
  );
}