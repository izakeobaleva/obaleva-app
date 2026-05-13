import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { 
  ArrowLeft, MapPin, Navigation, DollarSign, 
  Clock, User, CreditCard, Car, Phone 
} from 'lucide-react'
import { RatingStars } from '../components/RatingStars'
import { BottomNav } from '../components/BottomNav'

interface TripData {
  id: string
  origem: string
  destino: string
  status: string
  valor: number
  metodo_pagamento: string
  distancia_km: number
  tempo_min: number
  created_at: string
  passageiro_id: string
  motorista_id: string | null
}

export default function TripDetails() {
  const { id } = useParams<{ id: string }>()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<TripData | null>(null)
  const [passageiroNome, setPassageiroNome] = useState('N/A')
  const [motoristaNome, setMotoristaNome] = useState('N/A')
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)

  const role = profile?.tipo || user?.user_metadata?.tipo || 'passageiro'

  useEffect(() => {
    if (!id) return
    fetchTrip()
  }, [id])

  async function fetchTrip() {
    if (!id) return
    setLoading(true)
    
    const { data: corrida, error } = await supabase
      .from('corridas')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !corrida) {
      toast.error('Erro ao carregar detalhes da corrida')
      navigate('/')
      return
    }

    setTrip(corrida)

    if (corrida.passageiro_id) {
      const { data: pData } = await supabase
        .from('usuarios')
        .select('nome_completo')
        .eq('id', corrida.passageiro_id)
        .maybeSingle()
      if (pData?.nome_completo) setPassageiroNome(pData.nome_completo)
    }

    if (corrida.motorista_id) {
      const { data: mData } = await supabase
        .from('usuarios')
        .select('nome_completo')
        .eq('id', corrida.motorista_id)
        .maybeSingle()
      if (mData?.nome_completo) setMotoristaNome(mData.nome_completo)
    }

    setLoading(false)
  }

  const statusColors: Record<string, string> = {
    pendente: 'bg-yellow-900/40 text-yellow-400',
    aceita: 'bg-blue-900/40 text-blue-400',
    em_andamento: 'bg-indigo-900/40 text-indigo-400',
    finalizada: 'bg-green-900/40 text-green-400',
    cancelada: 'bg-red-900/40 text-red-400',
  }

  const statusLabels: Record<string, string> = {
    pendente: 'Pendente',
    aceita: 'Aceita',
    em_andamento: 'Em andamento',
    finalizada: 'Finalizada',
    cancelada: 'Cancelada',
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!trip) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] pb-24">
      <header className="glass-header sticky top-0 z-20 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="btn-outline-dark p-2"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>Detalhes da Corrida</h1>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto mt-4 space-y-4">
        {/* Status badge */}
        <div className="flex justify-center">
          <span className={`px-5 py-2 rounded-full text-sm font-bold ${statusColors[trip.status] || 'bg-gray-100 text-gray-800'}`}>
            {statusLabels[trip.status] || trip.status}
          </span>
        </div>

        {/* Route card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1528] rounded-2xl p-5 border border-white/10"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-green-500/20 p-2 rounded-full mt-0.5">
                <MapPin size={18} className="text-green-400" />
              </div>
              <div>
                <p className="text-xs text-[#A0A0B0]">Origem</p>
                <p className="text-white font-medium">{trip.origem}</p>
              </div>
            </div>
            <div className="border-l-2 border-dashed border-white/20 ml-5 h-6" />
            <div className="flex items-start gap-3">
              <div className="bg-red-500/20 p-2 rounded-full mt-0.5">
                <Navigation size={18} className="text-red-400" />
              </div>
              <div>
                <p className="text-xs text-[#A0A0B0]">Destino</p>
                <p className="text-white font-medium">{trip.destino}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Price & time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1A1528] rounded-2xl p-5 border border-white/10"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <DollarSign size={20} className="text-[#F4D03F] mx-auto mb-1" />
              <p className="text-xs text-[#A0A0B0]">Valor</p>
              <p className="text-xl font-bold text-white">R$ {trip.valor?.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <Clock size={20} className="text-[#A0A0B0] mx-auto mb-1" />
              <p className="text-xs text-[#A0A0B0]">Tempo estimado</p>
              <p className="text-xl font-bold text-white">{trip.tempo_min || '--'} min</p>
            </div>
          </div>
          {trip.distancia_km ? (
            <div className="text-center mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-[#A0A0B0]">Distância</p>
              <p className="text-white font-medium">{trip.distancia_km.toFixed(1)} km</p>
            </div>
          ) : null}
        </motion.div>

        {/* Driver/Passenger info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A1528] rounded-2xl p-5 border border-white/10"
        >
          <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
            <Car size={18} className="text-[#F4D03F]" />
            {role === 'motorista' ? 'Passageiro' : 'Motorista'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-[#1E1E2F]" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">
                {role === 'motorista' ? passageiroNome : motoristaNome}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <RatingStars value={4.5} readonly size={14} />
                <span className="text-xs text-[#A0A0B0]">4.5</span>
              </div>
            </div>
            <button className="btn-outline-dark p-2">
              <Phone size={18} />
            </button>
          </div>
        </motion.div>

        {/* Payment info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1A1528] rounded-2xl p-5 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-[#A0A0B0]" />
              <span className="text-white">Pagamento</span>
            </div>
            <span className="text-white font-medium capitalize">{trip.metodo_pagamento || 'Não informado'}</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <span className="text-[#A0A0B0] text-sm">Data</span>
            <span className="text-white text-sm">
              {new Date(trip.created_at).toLocaleString('pt-BR')}
            </span>
          </div>
        </motion.div>
      </main>

      <BottomNav role={role as 'passageiro' | 'motorista'} />
    </div>
  )
}