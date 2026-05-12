import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'
import { DollarSign, TrendingUp, Users, Car } from 'lucide-react'

export default function Financeiro() {
  const [stats, setStats] = useState({
    totalCorridas: 0,
    receitaTotal: 0,
    motoristasAtivos: 0,
    passageirosAtivos: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    setLoading(true)
    
    const { data: corridas } = await supabase.from('corridas').select('valor, status')
    const { data: motoristas } = await supabase.from('motoristas').select('status')
    const { data: passageiros } = await supabase.from('passageiros').select('*')

    if (corridas) {
      const receita = corridas
        .filter(c => c.status === 'finalizada')
        .reduce((acc, c) => acc + (c.valor || 0), 0)
      
      setStats({
        totalCorridas: corridas.filter(c => c.status === 'finalizada').length,
        receitaTotal: receita,
        motoristasAtivos: motoristas?.filter(m => m.status === 'aprovado').length || 0,
        passageirosAtivos: passageiros?.length || 0
      })
    }
    setLoading(false)
  }

  const cards = [
    { label: 'Corridas Finalizadas', value: stats.totalCorridas, icon: Car, color: '#3B82F6' },
    { label: 'Receita Total', value: `R$ ${stats.receitaTotal.toFixed(2)}`, icon: DollarSign, color: '#22C55E' },
    { label: 'Motoristas Ativos', value: stats.motoristasAtivos, icon: Users, color: '#A855F7' },
    { label: 'Passageiros', value: stats.passageirosAtivos, icon: TrendingUp, color: '#F97316' },
  ]

  if (loading) return <div className="text-center py-8 text-[#A0A0B0]">Carregando...</div>

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Financeiro</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-[#1A1528] p-4 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${card.color}20` }}>
                <card.icon size={24} color={card.color} />
              </div>
              <div>
                <p className="text-sm text-[#A0A0B0]">{card.label}</p>
                <p className="text-xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}