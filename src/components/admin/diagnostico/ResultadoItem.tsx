import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Shield, ExternalLink } from 'lucide-react'
import type { TestResult } from './TestRunner'

interface ResultadoItemProps {
  resultado: TestResult
  index: number
}

export function ResultadoItem({ resultado, index }: ResultadoItemProps) {
  const statusConfig = {
    ok: { bg: 'bg-green-900/15 border-green-500/20', icon: CheckCircle, color: 'text-green-400' },
    error: { bg: 'bg-red-900/15 border-red-500/20', icon: XCircle, color: 'text-red-400' },
    warn: { bg: 'bg-yellow-900/15 border-yellow-500/20', icon: AlertTriangle, color: 'text-yellow-400' },
    info: { bg: 'bg-blue-900/15 border-blue-500/20', icon: Shield, color: 'text-blue-400' },
  }

  const config = statusConfig[resultado.status]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`p-4 rounded-xl border ${config.bg}`}
    >
      <div className="flex items-start gap-3">
        <Icon size={18} className={`${config.color} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-sm ${config.color}`}>{resultado.nome}</p>
          <p className="text-xs text-white/70 mt-1 whitespace-pre-line leading-relaxed">{resultado.detalhes}</p>
          
          {resultado.resolucao && (
            <div className="flex items-start gap-2 mt-2 p-2 bg-[#0F0B1A] rounded-lg">
              {resultado.resolucao.includes('Abrir') ? (
                <button
                  onClick={() => window.open('https://supabase.com', '_blank')}
                  className="text-[#F4D03F] text-xs hover:underline flex items-center gap-1"
                >
                  <ExternalLink size={12} />
                  {resultado.resolucao}
                </button>
              ) : (
                <p className="text-yellow-400/80 text-xs">
                  💡 {resultado.resolucao}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}