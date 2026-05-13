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
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] pb-24">
      <header className="glass-header sticky top-0 z-20 px-6 py-4">
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>Meus Ganhos</h1>
      </header>
      
      <main className="p-4 max-w-lg mx-auto mt-4 space-y-4">
        <div className="bg-gradient-to-br from-[#F4D03F]/20 to-amber-900/30 rounded-2xl p-6 border border-white/10 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={20} className="text-[#F4D03F]" />
            <span className="text-[#A0A0B0]">Saldo total</span>
          </div>
          {loading ? (
            <div className="animate-pulse h-10 bg-white/10 rounded" />
          ) : (
            <p className="text-4xl font-bold text-white">R$ {totalGanhos.toFixed(2)}</p>
          )}
          <p className="text-sm text-[#A0A0B0] mt-2 flex items-center gap-1">
            <Calendar size={14} />
            Desde o início
          </p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-5 border border-white/10">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#F4D03F]" />
            Resumo
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-[#A0A0B0]">Total de corridas</span>
              <span className="font-bold text-white">--</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-[#A0A0B0]">Média por corrida</span>
              <span className="font-bold text-white">--</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-[#A0A0B0]">Taxa da plataforma</span>
              <span className="font-bold text-white">--</span>
            </div>
          </div>
        </div>
      </main>

      <BottomNav role="motorista" />
    </div>
  )
}