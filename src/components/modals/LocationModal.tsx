import { MapPin } from 'lucide-react';

interface LocationModalProps {
  onAllow: (type: 'exact' | 'approximate') => void;
  onDeny: () => void;
}

export function LocationModal({ onAllow, onDeny }: LocationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
      <div className="bg-[#1A1528] w-full max-w-md mx-4 rounded-t-2xl border-t border-[#F4D03F]/30">
        <div className="p-2 flex justify-center"><div className="w-10 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
        <div className="px-4 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin size={20} className="text-[#F4D03F]" />
            <h2 className="text-white text-base font-bold">Acesso à localização</h2>
          </div>
          <p className="text-[#A0A0B0] text-[11px] text-center mb-3">Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.</p>
          <div className="space-y-1.5">
            <button onClick={() => onAllow('exact')} className="w-full py-2 px-4 rounded-xl bg-[#F4D03F] text-black font-bold text-left">
              <div className="flex justify-between items-center"><span className="text-sm">📍 SEMPRE PERMITIR</span><span className="text-[9px] text-black/70">Recomendado</span></div>
              <p className="text-[9px] text-black/70">O app pode usar sua localização a qualquer momento</p>
            </button>
            <button onClick={() => onAllow('approximate')} className="w-full py-2 px-4 rounded-xl border border-white/20 text-white font-bold text-left">
              <div><span className="text-sm">📍 SÓ DESTA VEZ</span><p className="text-[9px] text-[#A0A0B0]">O app usa sua localização apenas agora</p></div>
            </button>
            <button onClick={onDeny} className="w-full py-2 px-4 rounded-xl text-[#A0A0B0] text-left text-sm">🚫 NÃO PERMITIR</button>
          </div>
        </div>
      </div>
    </div>
  );
}