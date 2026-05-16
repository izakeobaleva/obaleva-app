import { Map } from 'lucide-react';

interface LocationInputsProps {
  pickupAddress: string;
  setPickupAddress: (value: string) => void;
  dropoffAddress: string;
  setDropoffAddress: (value: string) => void;
  disabled?: boolean;
}

export function LocationInputs({
  pickupAddress,
  setPickupAddress,
  dropoffAddress,
  setDropoffAddress,
  disabled = false,
}: LocationInputsProps) {
  return (
    <div className="bg-[#1A1528] rounded-xl p-2 border border-[#F4D03F]/15">
      <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-white/10">
        <Map size={12} className="text-[#F4D03F]" />
        <span className="text-white text-[10px] font-medium">Definir rota</span>
      </div>
      
      <div className="bg-white/5 rounded-lg border border-white/10 mb-1">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <input 
            type="text" 
            placeholder="Onde você está?" 
            className="flex-1 bg-transparent text-white outline-none text-xs"
            value={pickupAddress} 
            onChange={(e) => setPickupAddress(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
      
      <div className="bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
          <input 
            type="text" 
            placeholder="Para onde vai?" 
            className="flex-1 bg-transparent text-white outline-none text-xs"
            value={dropoffAddress} 
            onChange={(e) => setDropoffAddress(e.target.value)}
            disabled={disabled}
          />
        </div>
      </div>
      
      <button 
        onClick={() => { const temp = pickupAddress; setPickupAddress(dropoffAddress); setDropoffAddress(temp); }} 
        className="mt-1 w-full text-center text-[9px] text-[#A0A0B0] hover:text-[#F4D03F] transition py-0.5"
        disabled={disabled}
      >
        ↕️ Trocar
      </button>
    </div>
  );
}