import React from 'react';
import { Map, ArrowRight } from 'lucide-react';

interface LocationInputsProps {
  pickupAddress: string;
  setPickupAddress: (value: string) => void;
  dropoffAddress: string;
  setDropoffAddress: (value: string) => void;
}

export const LocationInputs = React.memo(({
  pickupAddress,
  setPickupAddress,
  dropoffAddress,
  setDropoffAddress,
}: LocationInputsProps) => (
  <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528] rounded-2xl p-4 border border-[#F4D03F]/15 shadow-xl">
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
      <Map size={16} className="text-[#F4D03F]" />
      <h3 className="text-white font-semibold text-sm">Definir rota</h3>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
      </div>
    </div>

    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-[#F4D03F]/30 transition-all">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <div className="absolute top-4 left-1.5 w-0.5 h-6 bg-gradient-to-b from-green-500 to-red-500" />
        </div>
        <input
          type="text"
          placeholder="Onde você está?"
          className="flex-1 bg-transparent text-white outline-none text-sm font-medium placeholder:text-[#A0A0B0]/50"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
        />
        {pickupAddress && (
          <button onClick={() => setPickupAddress('')} className="text-[#A0A0B0] hover:text-red-400 transition">✕</button>
        )}
      </div>
    </div>
    
    <div className="mt-2" />
    
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-[#F4D03F]/30 transition-all">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <input
          type="text"
          placeholder="Para onde vai?"
          className="flex-1 bg-transparent text-white outline-none text-sm font-medium placeholder:text-[#A0A0B0]/50"
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
        />
        {dropoffAddress && (
          <button onClick={() => setDropoffAddress('')} className="text-[#A0A0B0] hover:text-red-400 transition">✕</button>
        )}
      </div>
    </div>

    <button 
      className="mt-3 w-full flex items-center justify-center gap-2 text-[10px] text-[#A0A0B0] hover:text-[#F4D03F] transition-all py-1"
      onClick={() => {
        const temp = pickupAddress;
        setPickupAddress(dropoffAddress);
        setDropoffAddress(temp);
      }}
    >
      <ArrowRight size={12} />
      Trocar origem e destino
      <ArrowRight size={12} />
    </button>
  </div>
));