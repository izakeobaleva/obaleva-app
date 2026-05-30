"use client";

import { useState } from 'react';
import { MapPin, Navigation, ChevronDown, DollarSign } from 'lucide-react';

interface RidePanelProps {
  onRequestRide: (origin: string, destination: string) => void;
  priceEstimate?: number | null;
}

export function RidePanel({ onRequestRide, priceEstimate }: RidePanelProps) {
  const [origin, setOrigin] = useState('R. Santo Antônio, 1091 - Bela Vista, SP');
  const [destination, setDestination] = useState('');

  const handleSubmit = () => {
    if (!destination.trim()) return;
    onRequestRide(origin, destination);
  };

  return (
    <div className="bg-[#0F0B1A] border-t border-white/10 px-4 pt-3 pb-2 space-y-2.5 flex-shrink-0">
      {/* Origem */}
      <div className="flex items-center gap-2 bg-[#1A1528] rounded-xl px-3 py-2.5 border border-white/10">
        <MapPin size={16} className="text-green-400 shrink-0" />
        <input
          type="text"
          value={origin}
          onChange={e => setOrigin(e.target.value)}
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
          placeholder="Onde você está?"
        />
      </div>

      {/* Destino */}
      <div className="flex items-center gap-2 bg-[#1A1528] rounded-xl px-3 py-2.5 border border-white/10">
        <Navigation size={16} className="text-red-400 shrink-0" />
        <input
          type="text"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
          placeholder="Para onde vai?"
        />
      </div>

      {/* Preço estimado + Botão */}
      <div className="flex items-center gap-3 pt-1">
        {priceEstimate && (
          <div className="flex items-center gap-1 bg-green-900/30 border border-green-500/30 rounded-lg px-3 py-1.5">
            <DollarSign size={14} className="text-green-400" />
            <span className="text-green-400 text-xs font-bold">R$ {priceEstimate.toFixed(2)}</span>
          </div>
        )}
        <button
          onClick={handleSubmit}
          className="flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg active:scale-[0.98] transition-all text-sm"
        >
          🚗 Chamar ObaLeva
        </button>
      </div>
    </div>
  );
}