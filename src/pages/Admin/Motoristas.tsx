import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'

export default function Motoristas() {
  const [motoristas, setMotoristas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMotoristas()
  }, [])

  async function fetchMotoristas() {
    setLoading(true)
    try {
      // Buscar usuarios com tipo motorista
      const { data: usuarios, error: userError } = await supabase
        .from('usuarios')
        .select('id, nome_completo, email, telefone')
        .eq('tipo', 'motorista')
        .order('created_at', { ascending: false })

      if (userError) throw userError

      // Para cada usuario, buscar dados na tabela motoristas
      const motoristasComDados = await Promise.all(
        (usuarios || []).map(async (u) => {
          const { data: mData } = await supabase
            .from('motoristas')
            .select('status, dados_veiculo')
            .eq('id', u.id)
            .maybeSingle()
          
          return { 
            id: u.id,
            usuarios: { nome_completo: u.nome_completo, email: u.email, telefone: u.telefone },
            status: mData?.status || 'pendente',
            dados_veiculo: mData?.dados_veiculo || null
          }
        })
      )

      setMotoristas(motoristasComDados)
    } catch (err: any) {
      console.error('Erro ao carregar motoristas:', err)
      toast.error('Erro ao carregar motoristas: ' + (err.message || 'Erro desconhecido'))
    }
    setLoading(false)
  }

  async function updateStatus(id: string, status: 'aprovado' | 'reprovado' | 'suspenso') {
    try {
      // Verifica se existe registro na tabela motoristas
      const { data: existing } = await supabase
        .from('motoristas')
        .select('id')
        .eq('id', id)
        .maybeSingle()

      if (existing) {
        const { error } = await supabase.from('motoristas').update({ status }).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('motoristas').insert({ id, status })
        if (error) throw error
      }

      toast.success(`Motorista ${status === 'aprovado' ? 'aprovado' : status === 'reprovado' ? 'reprovado' : 'suspenso'}`)
      fetchMotoristas()
    } catch (err: any) {
      toast.error('Erro ao atualizar: ' + (err.message || 'Erro desconhecido'))
    }
  }

  if (loading) return <div className="text-center py-8 text-[#A0A0B0]">Carregando...</div>

  return (
    <div className="bg-[#1A1528] p-4 rounded-2xl border border-white/10 overflow-x-auto">
      <h2 className="text-xl font-bold text-white mb-4">Gerenciar Motoristas</h2>
      <table className="w-full text-sm">
        <thead className="bg-white/5">
          <tr>
            <th className="p-2 text-left text-[#A0A0B0] font-medium">Nome</th>
            <th className="p-2 text-left text-[#A0A0B0] font-medium">Email</th>
            <th className="p-2 text-left text-[#A0A0B0] font-medium">Status</th>
            <th className="p-2 text-left text-[#A0A0B0] font-medium">Veículo</th>
            <th className="p-2 text-left text-[#A0A0B0] font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {motoristas.map(m => (
            <tr key={m.id} className="border-b border-white/10">
              <td className="p-2 text-white">{m.usuarios?.nome_completo || 'N/A'}</td>
              <td className="p-2 text-white">{m.usuarios?.email || 'N/A'}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  m.status === 'aprovado' ? 'bg-green-900/40 text-green-400' :
                  m.status === 'reprovado' ? 'bg-red-900/40 text-red-400' : 'bg-yellow-900/40 text-yellow-400'
                }`}>{m.status}</span>
              </td>
              <td className="p-2 text-white text-xs">{m.dados_veiculo?.modelo || '-'}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => updateStatus(m.id, 'aprovado')} className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-2xl text-xs">Aprovar</button>
                <button onClick={() => updateStatus(m.id, 'reprovado')} className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-2xl text-xs">Reprovar</button>
                <button onClick={() => updateStatus(m.id, 'suspenso')} className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1.5 rounded-2xl text-xs">Suspender</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}