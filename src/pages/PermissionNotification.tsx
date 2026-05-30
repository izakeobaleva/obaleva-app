import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

export default function PermissionNotification() {
  const navigate = useNavigate();

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
    navigate('/login');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      
      {/* MAPA REAL DO GOOGLE - TELA INTEIRA */}
      <div className="absolute inset-0 w-full h-full">
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
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400">Carregando mapa...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* ESCUREÇO O FUNDO */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* CONTAINER CENTRALIZADO */}
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <div className="bg-[#1a1a1a] rounded-3xl p-6 w-full max-w-[320px] border border-gray-700 shadow-2xl">
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔔</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-3">Permitir notificações?</h2>
            
            <p className="text-gray-400 text-sm mb-3">
              Para receber alertas importantes como:
            </p>
            
            <ul className="text-left text-gray-300 text-sm space-y-1 mb-6 pl-2">
              <li>• "Motorista a caminho"</li>
              <li>• "Estou chegando!"</li>
              <li>• "Corrida confirmada"</li>
              <li>• "Promoções e descontos"</li>
              <li>• "Avalie sua corrida"</li>
            </ul>
            
            <button
              onClick={handleAllow}
              className="w-full py-3.5 bg-yellow-500 text-black font-bold rounded-xl text-base mb-3 hover:bg-yellow-400 transition"
            >
              PERMITIR
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 text-gray-500 font-medium text-sm hover:text-gray-400 transition"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}