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
    { label: 'Corridas Finalizadas', value: stats.totalCorridas, icon: Car, color: 'bg-blue-500' },
    { label: 'Receita Total', value: `R$ ${stats.receitaTotal.toFixed(2)}`, icon: DollarSign, color: 'bg-green-500' },
    { label: 'Motoristas Ativos', value: stats.motoristasAtivos, icon: Users, color: 'bg-purple-500' },
    { label: 'Passageiros', value: stats.passageirosAtivos, icon: TrendingUp, color: 'bg-orange-500' },
  ]

  if (loading) return <div className="text-center py-8">Carregando...</div>

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Financeiro</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-white p-4 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-xl font-bold">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}