import { Truck } from 'lucide-react';

export function DriverPanel() {
  return (
    <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-[#F4D03F]/15 mt-2">
      <Truck className="text-[#F4D03F] w-8 h-8 mx-auto mb-1" />
      <h2 className="text-white font-bold text-sm">Painel do Motorista</h2>
      <p className="text-[#A0A0B0] text-[10px]">Aguardando aprovação</p>
      <button className="mt-2 px-2 py-0.5 rounded-full bg-green-600 text-white text-[10px]">🟢 Online</button>
    </div>
  );
}