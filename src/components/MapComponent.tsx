import React from 'react';

const MapComponent: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-yellow-900/20 border border-yellow-500/30 flex items-center justify-center mb-3">
            <span className="text-3xl">🗺️</span>
          </div>
          <p className="text-yellow-400 text-sm font-medium">Chave da API não encontrada</p>
          <p className="text-gray-500 text-xs mt-1">Adicione VITE_GOOGLE_MAPS_API_KEY no .env</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <iframe
        title="Mapa ObaLeva"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0, minHeight: '200px' }}
        src={`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=-23.5505,-46.6333&zoom=14`}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default MapComponent;