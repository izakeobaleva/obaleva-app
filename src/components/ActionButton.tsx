import { Car, ArrowRight } from 'lucide-react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ActionButton({ onClick, disabled = false, loading = false }: ActionButtonProps) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`w-full py-2 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold flex items-center justify-center gap-2 text-sm transition-all duration-200 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99] shadow-md'
      }`}
    >
      {loading ? (
        <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Buscando...</>
      ) : (
        <><Car size={16} /> SOLICITAR OBALEVALe <ArrowRight size={14} /></>
      )}
    </button>
  );
}