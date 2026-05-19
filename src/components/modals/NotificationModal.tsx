import { Bell } from 'lucide-react';

interface NotificationModalProps {
  onAllow: () => void;
  onDeny: () => void;
}

export function NotificationModal({ onAllow, onDeny }: NotificationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center pointer-events-auto">
      <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 max-h-[380px]">
        <div className="p-1.5 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={24} className="text-[#F4D03F]" />
            <h2 className="text-white text-lg font-bold">Permitir notificações?</h2>
          </div>
          <p className="text-[#A0A0B0] text-sm mb-2">Para receber alertas importantes como:</p>
          <div className="bg-white/5 rounded-xl p-2 mb-3 space-y-0.5">
            <p className="text-white text-sm">• 🚗 "Motorista a caminho"</p>
            <p className="text-white text-sm">• 📍 "Estou chegando!"</p>
            <p className="text-white text-sm">• ✅ "Corrida confirmada"</p>
            <p className="text-white text-sm">• 💰 "Promoções e descontos"</p>
          </div>
          <div className="space-y-1.5">
            <button onClick={onAllow} className="w-full py-1.5 rounded-xl bg-[#F4D03F] text-black font-bold text-base">PERMITIR</button>
            <button onClick={onDeny} className="w-full py-1.5 rounded-xl border border-white/20 text-white font-bold text-base">NÃO PERMITIR</button>
          </div>
        </div>
      </div>
    </div>
  );
}