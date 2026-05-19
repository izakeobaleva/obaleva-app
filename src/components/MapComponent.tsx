import React from 'react';

const MapComponent: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  // URL do mapa estático do Google
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=-23.5505,-46.6333&zoom=14&size=400x300&key=${apiKey}`;

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
            <span className="text-3xl">🗺️</span>
          </div>
          <p className="text-white text-sm font-medium">Configurar Google Maps</p>
          <p className="text-[#A0A0B0] text-xs mt-1">Adicione a chave da API no arquivo .env</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <img 
        src={mapUrl} 
        alt="Mapa" 
        className="w-full h-full object-cover"
        onError={() => console.error('Erro ao carregar mapa estático')}
      />
    </div>
  );
};

export default MapComponent;