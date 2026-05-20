import { Bell } from 'lucide-react';

interface NotificationModalProps {
  onAllow: () => void;
  onDeny: () => void;
}

export function NotificationModal({ onAllow, onDeny }: NotificationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
      <div className="bg-[#1A1528] w-full max-w-md mx-4 rounded-t-2xl border-t border-[#F4D03F]/30">
        <div className="p-2 flex justify-center"><div className="w-10 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
        <div className="px-4 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bell size={20} className="text-[#F4D03F]" />
            <h2 className="text-white text-base font-bold">Permitir notificações?</h2>
          </div>
          <p className="text-[#A0A0B0] text-[11px] text-center mb-2">Para receber alertas importantes como:</p>
          <div className="bg-white/5 rounded-lg p-1.5 mb-2 space-y-0.5">
            <p className="text-white text-[10px] text-center">• 🚗 "Motorista a caminho"</p>
            <p className="text-white text-[10px] text-center">• 📍 "Estou chegando!"</p>
            <p className="text-white text-[10px] text-center">• ✅ "Corrida confirmada"</p>
            <p className="text-white text-[10px] text-center">• 💰 "Promoções e descontos"</p>
          </div>
          <div className="space-y-1.5">
            <button onClick={onAllow} className="w-full py-2 rounded-xl bg-[#F4D03F] text-black font-bold text-sm">PERMITIR</button>
            <button onClick={onDeny} className="w-full py-2 rounded-xl border border-white/20 text-white font-bold text-sm">NÃO PERMITIR</button>
          </div>
        </div>
      </div>
    </div>
  );
}