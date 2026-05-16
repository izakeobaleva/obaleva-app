import React from 'react';
import { Gift, Clock, X, Ticket, Car } from 'lucide-react';

interface BonusModalProps {
  onClose: () => void;
  onUseNow: () => void;
  bonusCode: string;
  bonusValue: number;
}

const BonusModal: React.FC<BonusModalProps> = ({ onClose, onUseNow, bonusCode, bonusValue }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl max-w-md w-full border-2 border-[#F4D03F]/30 shadow-2xl overflow-hidden">
        <div className="relative p-6 text-center">
          <button onClick={onClose} className="absolute right-4 top-4 text-[#A0A0B0] hover:text-white">
            <X size={20} />
          </button>
          
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/30 flex items-center justify-center mb-4 animate-bounce">
            <Gift className="w-10 h-10 text-[#F4D03F]" />
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-2">🎉 Bônus de Boas-vindas!</h2>
          <p className="text-[#F4D03F] text-3xl font-black mb-2">R$ {bonusValue},00</p>
          <p className="text-[#A0A0B0] text-sm mb-4">
            de desconto na sua primeira corrida
          </p>
          
          <div className="bg-black/40 rounded-xl p-3 mb-4">
            <p className="text-[#A0A0B0] text-xs mb-1">Seu código promocional</p>
            <div className="flex items-center justify-center gap-2">
              <Ticket size={18} className="text-[#F4D03F]" />
              <span className="text-white text-xl font-mono font-bold tracking-wider">
                {bonusCode}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-1 text-[10px] text-[#A0A0B0] mb-5">
            <Clock size={12} />
            Expira em 30 dias
          </div>
          
          <div className="space-y-2">
            <button
              onClick={onUseNow}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base flex items-center justify-center gap-2"
            >
              <Car size={18} /> USAR AGORA
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 rounded-xl text-[#A0A0B0] font-medium text-sm hover:text-white transition"
            >
              Depois
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusModal;