import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'

export default function Passageiros() {
  const [passageiros, setPassageiros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPassageiros()
  }, [])

  async function fetchPassageiros() {
    setLoading(true)
    const { data, error } = await supabase
      .from('passageiros')
      .select('*, usuarios:usuarios(nome_completo, email, telefone)')
      .order('created_at', { ascending: false })
    if (!error) setPassageiros(data || [])
    else toast.error('Erro ao carregar passageiros')
    setLoading(false)
  }

  if (loading) return <div className="text-center py-8 text-[#A0A0B0]">Carregando...</div>

  return (
    <div className="bg-[#1A1528] p-4 rounded-2xl border border-white/10 overflow-x-auto">
      <h2 className="text-xl font-bold text-white mb-4">Passageiros</h2>
      <table className="w-full text-sm">
        <thead className="bg-white/5">
          <tr>
            <th className="p-2 text-left text-[#A0A0B0] font-medium">Nome</th>
            <th className="p-2 text-left text-[#A0A0B0] font-medium">Email</th>
            <th className="p-2 text-left text-[#A0A0B0] font-medium">Telefone</th>
            <th className="p-2 text-left text-[#A0A0B0] font-medium">Total de Corridas</th>
          </tr>
        </thead>
        <tbody>
          {passageiros.map(p => (
            <tr key={p.id} className="border-b border-white/10">
              <td className="p-2 text-white">{p.usuarios?.nome_completo || 'N/A'}</td>
              <td className="p-2 text-white">{p.usuarios?.email || 'N/A'}</td>
              <td className="p-2 text-white">{p.usuarios?.telefone || 'N/A'}</td>
              <td className="p-2 text-white">{p.total_corridas || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}