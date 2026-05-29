import React, { useState } from 'react';
import { MapPin, Navigation, Edit2, Check, Crosshair } from 'lucide-react';

const RideInputs: React.FC = () => {
  const [origin, setOrigin] = useState('Rua Santo Antônio, 1095 - Centro, SP');
  const [destination, setDestination] = useState('');
  const [editingOrigin, setEditingOrigin] = useState(false);
  const [editingDest, setEditingDest] = useState(false);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setOrigin('📍 Localização atual'),
        () => {}
      );
    }
  };

  return (
    <div className="bg-[#1A1528] px-4 py-3 space-y-2 border-t border-white/10">
      {/* ORIGEM */}
      <div className="relative">
        <label className="text-[10px] text-[#A0A0B0] mb-1 flex items-center gap-1">
          <MapPin size={10} className="text-green-400" />
          ONDE VOCÊ ESTÁ?
        </label>
        <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-2.5 transition-all">
          <MapPin size={16} className="text-green-400 shrink-0" />
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            readOnly={!editingOrigin}
            className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
            placeholder="Onde você está?"
          />
          <button
            onClick={handleGetLocation}
            className="text-green-400 hover:text-white transition p-1"
            title="Usar localização atual"
          >
            <Crosshair size={14} />
          </button>
          {editingOrigin ? (
            <button
              onClick={() => setEditingOrigin(false)}
              className="bg-[#22C55E] text-white p-1 rounded-xl hover:bg-[#16A34A] transition flex items-center gap-1 text-[10px] font-medium px-2.5 shrink-0"
            >
              <Check size={12} /> OK
            </button>
          ) : (
            <button
              onClick={() => setEditingOrigin(true)}
              className="bg-white/10 text-white p-1 rounded-xl hover:bg-white/20 transition flex items-center gap-1 text-[10px] font-medium px-2.5 shrink-0"
            >
              <Edit2 size={12} /> Editar
            </button>
          )}
        </div>
      </div>

      {/* DESTINO */}
      <div className="relative">
        <label className="text-[10px] text-[#A0A0B0] mb-1 flex items-center gap-1">
          <Navigation size={10} className="text-red-400" />
          PARA ONDE VOCÊ VAI?
        </label>
        <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-2.5 transition-all">
          <Navigation size={16} className="text-red-400 shrink-0" />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            readOnly={!editingDest}
            className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
            placeholder="Para onde vai?"
          />
          {editingDest ? (
            <button
              onClick={() => setEditingDest(false)}
              className="bg-[#22C55E] text-white p-1 rounded-xl hover:bg-[#16A34A] transition flex items-center gap-1 text-[10px] font-medium px-2.5 shrink-0"
            >
              <Check size={12} /> OK
            </button>
          ) : (
            <button
              onClick={() => setEditingDest(true)}
              className="bg-white/10 text-white p-1 rounded-xl hover:bg-white/20 transition flex items-center gap-1 text-[10px] font-medium px-2.5 shrink-0"
            >
              <Edit2 size={12} /> Editar
            </button>
          )}
        </div>
      </div>

      {/* BOTÃO CHAMAR */}
      <button className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base shadow-lg mt-2">
        🚕 Chamar ObaLeva
      </button>
    </div>
  );
};

export default RideInputs;