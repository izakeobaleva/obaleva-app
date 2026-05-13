import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { Car, LogOut, MapPin, Navigation } from 'lucide-react'

export const PassengerDashboard = () => {
  const { user, profile, signOut } = useAuth()
  const [destino, setDestino] = useState('')
  const [solicitando, setSolicitando] = useState(false)

  const solicitarCorrida = async () => {
    if (!destino) return toast.error('Digite o destino')
    setSolicitando(true)
    const { error } = await supabase.from('corridas').insert({
      passageiro_id: user.id,
      origem: { endereco: 'Local atual' },
      destino: { endereco: destino },
      status: 'solicitada',
      valor_estimado: 20
    })
    if (error) toast.error('Erro ao solicitar corrida')
    else toast.success('Corrida solicitada! Aguarde um motorista.')
    setSolicitando(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
      <header className="bg-[#1A1528]/80 backdrop-blur-lg border-b border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Car className="text-[#F4D03F] w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold text-white">OBALEVA</h1>
            <p className="text-sm text-[#A0A0B0]">Olá, {profile?.nome_completo?.split(' ')[0]}</p>
          </div>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-2xl hover:bg-red-500/30 transition">
          <LogOut size={18} /> Sair
        </button>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Navigation className="text-[#F4D03F]" size={20} /> Solicitar Corrida
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-[#0F0B1A] rounded-2xl p-3 border border-white/10">
                <MapPin className="text-green-400" size={20} />
                <span className="text-[#A0A0B0]">Local atual</span>
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Para onde vai?" 
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
                  value={destino} 
                  onChange={e => setDestino(e.target.value)} 
                />
              </div>

              <button 
                onClick={solicitarCorrida} 
                disabled={solicitando} 
                className="btn-amarelo w-full py-4 rounded-2xl text-lg"
              >
                {solicitando ? 'Solicitando...' : 'Solicitar OBALEVA'}
              </button>
            </div>
          </div>

          <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center h-96">
            <div className="text-center text-[#A0A0B0]">
              <MapPin size={48} className="mx-auto mb-2 opacity-50" />
              <p>Mapa será carregado aqui</p>
              <p className="text-sm mt-1">(Google Maps em breve)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}