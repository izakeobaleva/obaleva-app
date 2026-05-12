import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { BottomNav } from '../components/BottomNav'
import { supabase } from '../lib/supabaseClient'
import { DollarSign, TrendingUp, Calendar } from 'lucide-react'

export default function Earnings() {
  const { user } = useAuth()
  const [totalGanhos, setTotalGanhos] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEarnings()
  }, [])

  async function fetchEarnings() {
    if (!user) return
    const { data } = await supabase
      .from('corridas')
      .select('valor, status')
      .eq('motorista_id', user.id)
      .eq('status', 'finalizada')
    
    if (data) {
      const total = data.reduce((acc, c) => acc + (c.valor || 0), 0)
      setTotalGanhos(total)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <header className="glass-header sticky top-0 z-20 px-6 py-4">
        <h1 className="text-xl font-bold text-roxo-principal">Meus Ganhos</h1>
      </header>
      
      <main className="p-4 max-w-lg mx-auto">
        <div className="bg-gradient-to-br from-roxo-principal to-purple-600 rounded-2xl p-6 text-white shadow-xl mb-6">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} />
            <span className="text-purple-200">Saldo total</span>
          </div>
          {loading ? (
            <div className="animate-pulse h-10 bg-white/20 rounded" />
          ) : (
            <p className="text-4xl font-bold">R$ {totalGanhos.toFixed(2)}</p>
          )}
          <p className="text-sm text-purple-200 mt-2 flex items-center gap-1">
            <Calendar size={14} />
            Desde o início
          </p>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp size={18} />
            Resumo
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Total de corridas</span>
              <span className="font-bold">--</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Média por corrida</span>
              <span className="font-bold">--</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Taxa da plataforma</span>
              <span className="font-bold">--</span>
            </div>
          </div>
        </div>
      </main>

      <BottomNav role="motorista" />
    </div>
  )
}