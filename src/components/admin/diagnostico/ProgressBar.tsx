import { motion } from 'framer-motion'

interface ProgressBarProps {
  visible: boolean
  total: number
}

export function ProgressBar({ visible, total }: ProgressBarProps) {
  if (!visible) return null

  return (
    <div className="bg-[#0F0B1A] rounded-xl p-3 border border-white/10 mb-4">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-white">Executando testes...</span>
        <span className="text-xs text-[#F4D03F]">{total} testes</span>
      </div>
      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-[#FFD966] to-[#F4D03F]"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min((total / 22) * 100, 100)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}