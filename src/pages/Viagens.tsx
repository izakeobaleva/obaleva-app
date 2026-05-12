import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BottomNav } from '../components/BottomNav'
import { supabase } from '../lib/supabaseClient'
import { Clock, Navigation } from 'lucide-react'

export default function Trips() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrips()
  }, [])

  async function fetchTrips() {
    const { data } = await supabase
      .from('corridas')
      .select('*')
      .eq('passageiro_id', user?.id)
      .order('created_at', { ascending: false })
    if (data) setTrips(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] pb-24">
      <header className="glass-header sticky top-0 z-20 px-6 py-4">
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>Minhas Viagens</h1>
      </header>
      
      <main className="p-4 max-w-lg mx-auto mt-4">
        {loading ? (
          <div className="text-center py-8 text-[#A0A0B0]">Carregando...</div>
        ) : trips.length === 0 ? (
          <div className="bg-[#1A1528] rounded-2xl p-8 border border-white/10 text-center">
            <Clock size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-white font-medium">Nenhuma viagem ainda</p>
            <p className="text-sm text-[#A0A0B0] mt-1">Suas viagens aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="w-full text-left bg-[#1A1528] rounded-2xl p-4 border border-white/10 hover:border-[#F4D03F]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Navigation size={16} className="text-[#F4D03F]" />
                    <span className="font-medium text-white">{trip.destino}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    trip.status === 'finalizada' ? 'bg-green-900/40 text-green-400' :
                    trip.status === 'cancelada' ? 'bg-red-900/40 text-red-400' :
                    'bg-yellow-900/40 text-yellow-400'
                  }`}>{trip.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A0A0B0]">{new Date(trip.created_at).toLocaleDateString('pt-BR')}</span>
                  <span className="font-bold text-white">R$ {trip.valor?.toFixed(2) || '0.00'}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>

      <BottomNav role="passageiro" />
    </div>
  )
}