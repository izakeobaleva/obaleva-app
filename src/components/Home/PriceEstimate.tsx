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
      className="bg-gradient-to-r from-purple-900/40 to-amber-900/40 p-2 rounded-xl border border-white/10 mb-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-[#F4D03F]" />
          <span className="font-bold text-sm text-white">R$ {preco.toFixed(2)}</span>
          <span className="text-[10px] text-[#A0A0B0]">(estimativa)</span>
        </div>
        <span className="text-[10px] text-[#A0A0B0]">~15 min</span>
      </div>
    </motion.div>
  );
}