import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { BottomNav } from '../components/BottomNav'
import { supabase } from '../lib/supabaseClient'
import { Clock, Navigation, MapPin } from 'lucide-react'

export default function Trips() {
  const { user } = useAuth()
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
    <div className="min-h-screen bg-gray-100 pb-24">
      <header className="glass-header sticky top-0 z-20 px-6 py-4">
        <h1 className="text-xl font-bold text-roxo-principal">Minhas Viagens</h1>
      </header>
      
      <main className="p-4 max-w-lg mx-auto">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Carregando...</div>
        ) : trips.length === 0 ? (
          <div className="text-center py-16">
            <Clock size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">Nenhuma viagem ainda</p>
            <p className="text-sm text-gray-400 mt-1">Suas viagens aparecerão aqui</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip, index) => (
              <div key={trip.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Navigation size={16} className="text-roxo-principal" />
                    <span className="font-medium">{trip.destino}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    trip.status === 'finalizada' ? 'bg-green-100 text-green-700' :
                    trip.status === 'cancelada' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>{trip.status}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{new Date(trip.created_at).toLocaleDateString()}</span>
                  <span className="font-bold">R$ {trip.valor?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav role="passageiro" />
    </div>
  )
}