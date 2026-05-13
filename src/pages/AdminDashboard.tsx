import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import { Car, LogOut, CheckCircle, Users } from 'lucide-react'

export const AdminDashboard = () => {
  const { signOut } = useAuth()
  const [motoristas, setMotoristas] = useState<any[]>([])

  useEffect(() => { fetchMotoristas() }, [])

  async function fetchMotoristas() {
    const { data } = await supabase.from('motoristas').select('*, usuarios(nome_completo, email)')
    setMotoristas(data || [])
  }

  async function aprovar(id: string) {
    await supabase.from('motoristas').update({ status: 'aprovado' }).eq('id', id)
    toast.success('Motorista aprovado!')
    fetchMotoristas()
  }

  const pendentes = motoristas.filter(m => m.status === 'pendente')

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
      <header className="bg-[#1A1528]/80 backdrop-blur-lg border-b border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Car className="text-[#F4D03F] w-8 h-8" />
          <h1 className="text-xl font-bold text-white">Admin OBALEVA</h1>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-2xl hover:bg-red-500/30 transition">
          <LogOut size={18} /> Sair
        </button>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 p-6 mt-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="text-[#F4D03F]" size={20} /> Motoristas Pendentes
            {pendentes.length > 0 && (
              <span className="bg-[#F4D03F] text-black text-xs px-2 py-1 rounded-full font-bold">{pendentes.length}</span>
            )}
          </h2>
          
          {pendentes.length === 0 ? (
            <p className="text-[#A0A0B0] text-center py-8">Nenhum motorista pendente</p>
          ) : (
            <div className="space-y-3">
              {pendentes.map(m => (
                <div key={m.id} className="bg-[#0F0B1A] rounded-2xl p-4 border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{m.usuarios?.nome_completo}</p>
                    <p className="text-sm text-[#A0A0B0]">{m.usuarios?.email}</p>
                    {m.dados_veiculo && (
                      <p className="text-xs text-[#A0A0B0] mt-1">
                        {m.dados_veiculo.modelo} - {m.dados_veiculo.placa}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => aprovar(m.id)} 
                    className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition"
                  >
                    <CheckCircle size={18} /> Aprovar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 p-6 mt-4">
          <h2 className="text-lg font-bold text-white mb-4">Motoristas Aprovados</h2>
          {motoristas.filter(m => m.status === 'aprovado').length === 0 ? (
            <p className="text-[#A0A0B0] text-center py-8">Nenhum motorista aprovado</p>
          ) : (
            <div className="space-y-3">
              {motoristas.filter(m => m.status === 'aprovado').map(m => (
                <div key={m.id} className="bg-[#0F0B1A] rounded-2xl p-4 border border-white/10">
                  <p className="text-white font-medium">{m.usuarios?.nome_completo}</p>
                  <p className="text-sm text-[#A0A0B0]">{m.usuarios?.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}