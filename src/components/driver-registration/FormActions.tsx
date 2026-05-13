import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

interface FormActionsProps {
  etapa: number;
  totalEtapas: number;
  loading: boolean;
  disabled: boolean;
  onNext: () => void;
}

export function FormActions({ etapa, totalEtapas, loading, disabled, onNext }: FormActionsProps) {
  const isUltimaEtapa = etapa === totalEtapas;

  return (
    <div className="mt-3 pt-3 border-t border-white/10">
      {!isUltimaEtapa ? (
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="button"
          onClick={onNext}
          className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 py-2.5 text-xs"
        >
          Próximo <ArrowRight size={14} />
        </motion.button>
      ) : (
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading || disabled}
          className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 py-2.5 text-xs disabled:opacity-50"
        >
          {loading ? (
            'Enviando...'
          ) : (
            <>
              <Check size={14} /> Finalizar Cadastro
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}