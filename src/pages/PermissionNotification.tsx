import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

export default function PermissionNotification() {
  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleAllow = () => {
    if ('Notification' in window) Notification.requestPermission();
    navigate('/login');
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{ lat: -23.5505, lng: -46.6333 }}
            zoom={14}
            options={{
              disableDefaultUI: true,
              zoomControl: false,
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
            </div>
          </div>
        )}
      </div>
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)' }} />
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#1a1a1a', borderRadius: 24, padding: 24, width: '100%', maxWidth: 320, border: '1px solid #374151', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          
          <div className="text-center">
            <div style={{ width: 64, height: 64, background: 'rgba(234,179,8,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span style={{ fontSize: 28 }}>🔔</span>
            </div>
            
            <h2 style={{ fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 12 }}>Permitir notificações?</h2>
            
            <p style={{ color: '#9ca3af', fontSize: 14, marginBottom: 12 }}>
              Para receber alertas importantes como:
            </p>
            
            <ul style={{ textAlign: 'left', color: '#d1d5db', fontSize: 14, marginBottom: 24, paddingLeft: 8, lineHeight: 1.8 }}>
              <li>• "Motorista a caminho"</li>
              <li>• "Estou chegando!"</li>
              <li>• "Corrida confirmada"</li>
              <li>• "Promoções e descontos"</li>
              <li>• "Avalie sua corrida"</li>
            </ul>
            
            <button
              onClick={handleAllow}
              style={{ width: '100%', padding: '14px 0', background: '#eab308', color: '#000', fontWeight: 'bold', borderRadius: 12, fontSize: 16, border: 'none', cursor: 'pointer', marginBottom: 12 }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#d97706'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#eab308'}
            >
              PERMITIR
            </button>
            
            <button
              onClick={() => navigate('/login')}
              style={{ width: '100%', padding: '12px 0', background: 'transparent', color: '#6b7280', fontWeight: 500, fontSize: 14, border: 'none', cursor: 'pointer' }}
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}