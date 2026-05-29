import React from 'react';
import { Info, Shield, Clock, Star } from 'lucide-react';

const BottomBar: React.FC = () => {
  return (
    <footer className="h-[48px] min-h-[48px] bg-[#0F0B1A] border-t border-white/5 flex items-center justify-center px-4">
      <div className="flex items-center gap-5 text-[10px] text-[#A0A0B0] max-w-xl mx-auto w-full justify-center">
        <div className="flex items-center gap-1.5">
          <Shield size={12} className="text-[#F4D03F]" />
          <span>App seguro</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-[#F4D03F]" />
          <span>24h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star size={12} className="text-[#F4D03F]" />
          <span>4.8 ⭐</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🚕</span>
          <span>ObaLeva v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default BottomBar;