import React from 'react';

const AdSpace: React.FC = () => {
  return (
    <div className="h-[50px] min-h-[50px] bg-gradient-to-r from-[#1A1528] to-[#2D2342] border-t border-[#F4D03F]/20 flex items-center justify-center px-4">
      <div className="flex items-center gap-3 w-full max-w-xl mx-auto justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-lg">🎉</span>
          <div className="text-left">
            <p className="text-white text-xs font-bold leading-tight">Ganhe R$ 10 na primeira corrida!</p>
            <p className="text-[#A0A0B0] text-[10px]">Use o cupom: <span className="text-[#F4D03F] font-bold">OBALEVALE10</span></p>
          </div>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText('OBALEVALE10');
            alert('Cupom copiado!');
          }}
          className="bg-[#F4D03F] text-[#1E1E2F] px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-[#FFD966] transition shrink-0"
        >
          Copiar
        </button>
      </div>
    </div>
  );
};

export default AdSpace;