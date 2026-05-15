import { Activity, RefreshCw } from 'lucide-react'

interface DiagnosticoHeaderProps {
  checking: boolean
  totalTestes: number
  onRefresh: () => void
}

export function DiagnosticoHeader({ checking, totalTestes, onRefresh }: DiagnosticoHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity size={22} className="text-[#F4D03F]" />
          Diagnóstico Automático
        </h2>
        <p className="text-xs text-[#A0A0B0] mt-1">
          {checking 
            ? `${totalTestes} testes concluídos...` 
            : 'Testando todas as integrações do sistema'}
        </p>
      </div>
      <button
        onClick={onRefresh}
        disabled={checking}
        className="btn-outline-dark p-2"
        title="Executar novamente"
      >
        <RefreshCw size={16} className={checking ? 'animate-spin' : ''} />
      </button>
    </div>
  )
}