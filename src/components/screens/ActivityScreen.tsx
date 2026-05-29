import { Clock } from 'lucide-react';

export function ActivityScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="text-center">
        <Clock size={48} className="mx-auto mb-4 text-[#F4D03F]/40" />
        <p className="text-[#A0A0B0]">Atividades</p>
      </div>
    </div>
  );
}