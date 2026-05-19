import { MapPin } from 'lucide-react';

interface LocationModalProps {
  onAllow: (type: 'exact' | 'approximate') => void;
  onDeny: () => void;
}

export function LocationModal({ onAllow, onDeny }: LocationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center pointer-events-auto">
      <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 max-h-[340px]">
        <div className="p-2 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={22} className="text-[#F4D03F]" />
            <h2 className="text-white text-base font-bold">Permitir acesso à localização?</h2>
          </div>
          <p className="text-[#A0A0B0] text-xs mb-4">Para assegurar que o aplicativo possa enviar corridas e planejar rotas.</p>
          <div className="space-y-2">
            <button onClick={() => onAllow('exact')} className="w-full py-2.5 px-4 rounded-xl bg-[#F4D03F] text-black font-bold text-left flex justify-between items-center">
              <span className="text-sm">📍 Permitir (Exata)</span>
              <span className="text-[10px] text-black/70 font-normal">DURANTE O USO DO APP</span>
            </button>
            <button onClick={() => onAllow('approximate')} className="w-full py-2.5 px-4 rounded-xl border border-white/20 text-white font-bold text-left flex justify-between items-center">
              <span className="text-sm">📍 Permitir (Aproximada)</span>
              <span className="text-[10px] text-[#A0A0B0] font-normal">APENAS ESTA VEZ</span>
            </button>
            <button onClick={onDeny} className="w-full py-2.5 px-4 rounded-xl text-[#A0A0B0] text-left text-sm">🚫 NÃO PERMITIR</button>
          </div>
        </div>
      </div>
    </div>
  );
}