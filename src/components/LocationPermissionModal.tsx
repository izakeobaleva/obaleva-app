import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationPermissionModalProps {
  onAllow: (type: 'exact' | 'approximate') => void;
  onDeny: () => void;
  isVisible: boolean;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({ onAllow, onDeny, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl animate-slide-up border-t border-[#F4D03F]/30">
        <div className="p-3 flex justify-center">
          <div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" />
        </div>

        <div className="px-6 pb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <MapPin size={32} className="text-[#F4D03F]" />
          </div>
          
          <h2 className="text-white text-xl font-bold text-center mb-2">
            Permitir que o app acesse<br />a localização deste dispositivo?
          </h2>
          
          <p className="text-[#A0A0B0] text-sm text-center mb-6">
            Para assegurar que o aplicativo possa enviar<br />corridas e planejar rotas.
          </p>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => onAllow('exact')}
              className="w-full py-4 px-4 rounded-xl bg-[#F4D03F] text-black font-bold text-left flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="text-base">📍 Permitir (Exata)</span>
                <span className="text-xs text-black/70 font-normal">DURANTE O USO DO APP</span>
              </div>
            </button>
            
            <button
              onClick={() => onAllow('approximate')}
              className="w-full py-4 px-4 rounded-xl border border-white/20 text-white font-bold text-left flex justify-between items-center hover:bg-white/5 transition"
            >
              <div className="flex flex-col">
                <span className="text-base">📍 Permitir (Aproximada)</span>
                <span className="text-xs text-[#A0A0B0] font-normal">APENAS ESTA VEZ</span>
              </div>
            </button>
            
            <button onClick={onDeny} className="w-full py-4 px-4 rounded-xl text-[#A0A0B0] text-left hover:bg-white/5 transition">
              NÃO PERMITIR
            </button>
          </div>

          <p className="text-[#A0A0B0] text-[10px] text-center">
            Você pode alterar essa permissão a qualquer momento nas configurações do dispositivo
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationPermissionModal;