import { MapPin } from 'lucide-react';

interface LocationModalProps {
  onAllow: (type: 'exact' | 'approximate') => void;
  onDeny: () => void;
}

export function LocationModal({ onAllow, onDeny }: LocationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center pointer-events-auto">
      <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 max-h-[340px]">
        <div className="p-1.5 flex justify-center">
          <div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" />
        </div>
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={24} className="text-[#F4D03F]" />
            <h2 className="text-white text-lg font-bold">Acesso à localização</h2>
          </div>
          <p className="text-[#A0A0B0] text-sm mb-3">
            Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
          </p>
          <div className="space-y-1.5">
            <button
              onClick={() => onAllow('exact')}
              className="w-full py-1.5 px-4 rounded-xl bg-[#F4D03F] text-black font-bold text-left flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="text-base">📍 SEMPRE PERMITIR</span>
                <span className="text-[11px] text-black/70 font-normal">O app pode usar sua localização a qualquer momento</span>
              </div>
            </button>
            <button
              onClick={() => onAllow('approximate')}
              className="w-full py-1.5 px-4 rounded-xl border border-white/20 text-white font-bold text-left flex justify-between items-center"
            >
              <div className="flex flex-col">
                <span className="text-base">📍 SÓ DESTA VEZ</span>
                <span className="text-[11px] text-[#A0A0B0] font-normal">O app usa sua localização apenas agora</span>
              </div>
            </button>
            <button
              onClick={onDeny}
              className="w-full py-1.5 px-4 rounded-xl text-[#A0A0B0] text-left"
            >
              <div className="flex flex-col">
                <span className="text-base">🚫 NÃO PERMITIR</span>
                <span className="text-[11px] text-[#A0A0B0]/70 font-normal">O app não vai saber onde você está</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}