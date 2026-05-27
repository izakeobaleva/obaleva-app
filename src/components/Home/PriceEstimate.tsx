import { DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface PriceEstimateProps {
  preco: number | null;
  visible: boolean;
}

export function PriceEstimate({ preco, visible }: PriceEstimateProps) {
  if (!visible || !preco) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="bg-gradient-to-r from-purple-900/40 to-amber-900/40 p-2.5 rounded-xl border border-white/10 mb-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign size={18} className="text-[#F4D03F]" />
          <span className="font-bold text-base text-white">R$ {preco.toFixed(2)}</span>
          <span className="text-xs text-[#A0A0B0]">(estimativa)</span>
        </div>
        <span className="text-xs text-[#A0A0B0]">~15 min</span>
      </div>
    </motion.div>
  );
}