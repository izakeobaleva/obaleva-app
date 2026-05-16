import React, { useState } from 'react';
import MapComponent from '../components/MapComponent';

const TestMap = () => {
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [pickupAddr, setPickupAddr] = useState('');
  const [dropoffAddr, setDropoffAddr] = useState('');

  console.log('🔵 TestMap carregado');
  console.log('API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? '✅ Tem chave' : '❌ Sem chave');

  return (
    <div className="min-h-screen bg-[#0F0B1A] p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-white text-xl font-bold mb-4">🧪 Teste do Mapa</h1>
        
        <div className="h-[400px] rounded-xl overflow-hidden mb-3">
          <MapComponent
            pickupLocation={pickup}
            dropoffLocation={dropoff}
            onPickupChange={setPickupAddr}
            onDropoffChange={setDropoffAddr}
            onLocationSelect={(loc: any) => {
              if (!dropoffAddr) {
                setPickup(loc);
                setPickupAddr(loc.address);
              } else {
                setDropoff(loc);
                setDropoffAddr(loc.address);
              }
            }}
          />
        </div>

        <button 
          className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl"
          onClick={() => alert(`Origem: ${pickupAddr}\nDestino: ${dropoffAddr}`)}
        >
          🟡 SOLICITAR OBALEVALe
        </button>

        <div className="mt-4 p-3 bg-[#1A1528] rounded-lg">
          <p className="text-white text-xs">Origem: {pickupAddr || 'Nenhum'}</p>
          <p className="text-white text-xs mt-1">Destino: {dropoffAddr || 'Nenhum'}</p>
        </div>
      </div>
    </div>
  );
};

export default TestMap;