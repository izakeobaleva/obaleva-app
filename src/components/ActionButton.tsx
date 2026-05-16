import React from 'react';
import { Car, ArrowRight } from 'lucide-react';

interface ActionButtonProps {
  onRequestRide: () => void;
  disabled?: boolean;
  label?: string;
}

export const ActionButton = React.memo(({ onRequestRide, disabled, label = 'SOLICITAR OBALEVALe' }: ActionButtonProps) => (
  <button
    onClick={onRequestRide}
    disabled={disabled}
    className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-black transition-all duration-200 flex items-center justify-center gap-3 shadow-xl ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl'
    }`}
  >
    <Car size={20} className="text-[#1A1528]" />
    <span className="text-base tracking-wider">{label}</span>
    <ArrowRight size={18} />
  </button>
));