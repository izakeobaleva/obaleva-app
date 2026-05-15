interface ResumoCounts {
  ok: number
  warn: number
  error: number
  info: number
}

interface ResumoCardsProps {
  totais: ResumoCounts
  loading: boolean
}

export function ResumoCards({ totais, loading }: ResumoCardsProps) {
  if (loading) return null

  const cards = [
    { label: 'OK', value: totais.ok, bg: 'bg-green-900/20', border: 'border-green-500/30', text: 'text-green-400', sub: 'text-green-300' },
    { label: 'Alertas', value: totais.warn, bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', text: 'text-yellow-400', sub: 'text-yellow-300' },
    { label: 'Erros', value: totais.error, bg: 'bg-red-900/20', border: 'border-red-500/30', text: 'text-red-400', sub: 'text-red-300' },
    { label: 'Info', value: totais.info, bg: 'bg-blue-900/20', border: 'border-blue-500/30', text: 'text-blue-400', sub: 'text-blue-300' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 mb-6">
      {cards.map(card => (
        <div key={card.label} className={`${card.bg} ${card.border} rounded-xl p-3 text-center border`}>
          <p className={`text-2xl font-bold ${card.text}`}>{card.value}</p>
          <p className={`text-xs ${card.sub}`}>{card.label}</p>
        </div>
      ))}
    </div>
  )
}