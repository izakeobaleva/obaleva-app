import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { Car, LogOut, Power, Wallet, Clock } from 'lucide-react'

export const DriverDashboard = () => {
  const { user, profile, signOut } = useAuth()
  const [online, setOnline] = useState(false)
  const [corridas, setCorridas] = useState<any[]>([])
  const [saldo, setSaldo] = useState(0)

  useEffect(() => {
    fetchDriverData()
  }, [])

  async function fetchDriverData() {
    const { data: motorista } = await supabase.from('motoristas').select('*').eq('id', user.id).single()
    if (motorista?.status !== 'aprovado') toast.error('Aguardando aprovação do admin')
    const { data: carteira } = await supabase.from('carteira_motorista').select('saldo_disponivel').eq('motorista_id', user.id).single()
    setSaldo(carteira?.saldo_disponivel || 0)
    const { data: rides } = await supabase.from('corridas').select('*').eq('motorista_id', user.id).order('created_at', { ascending: false })
    setCorridas(rides || [])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
      <header className="bg-[#1A1528]/80 backdrop-blur-lg border-b border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Car className="text-[#F4D03F] w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold text-white">Motorista</h1>
            <p className="text-sm text-[#A0A0B0]">{profile?.nome_completo}</p>
          </div>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-2xl hover:bg-red-500/30 transition">
          <LogOut size={18} /> Sair
        </button>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Status</h2>
            
            <button 
              onClick={() => setOnline(!online)} 
              className={`w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition ${
                online 
                  ? 'bg-green-500/20 text-green-400 border border-green-500' 
                  : 'bg-gray-700/50 text-gray-400 border border-gray-600'
              }`}
            >
              <Power size={24} /> {online ? 'Online' : 'Offline'}
            </button>

            <div className="mt-4 bg-[#0F0B1A] rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-[#A0A0B0] mb-2">
                <Wallet size={18} className="text-[#F4D03F]" />
                <span>Saldo disponível</span>
              </div>
              <p className="text-3xl font-bold text-white">R$ {saldo.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="text-[#F4D03F]" size={20} /> Histórico de Corridas
            </h2>
            
            {corridas.length === 0 ? (
              <p className="text-[#A0A0B0] text-center py-8">Nenhuma corrida ainda</p>
            ) : (
              <div className="space-y-2">
                {corridas.map(c => (
                  <div key={c.id} className="bg-[#0F0B1A] rounded-xl p-3 border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white">{c.destino?.endereco}</span>
                      <span className="text-[#F4D03F] font-bold">R$ {c.valor_final || c.valor_estimado}</span>
                    </div>
                    <span className={`text-xs ${
                      c.status === 'solicitada' ? 'text-yellow-400' : 
                      c.status === 'em_andamento' ? 'text-blue-400' : 'text-green-400'
                    }`}>{c.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}