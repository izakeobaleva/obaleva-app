import { Search } from 'lucide-react';

export function SearchScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-4 pb-24 pt-8">
        <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
          <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
        </div>
      </div>
    </div>
  );
}