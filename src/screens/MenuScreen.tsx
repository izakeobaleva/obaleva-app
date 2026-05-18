import { Menu } from 'lucide-react';

export function MenuScreen() {
  return (
    <div className="max-w-md mx-auto px-4 pb-28 mt-8">
      <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
        <Menu size={48} className="text-[#F4D03F] mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold">☰ Menu</h2>
      </div>
    </div>
  );
}