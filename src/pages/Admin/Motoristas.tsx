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
    const { data, error } = await supabase
      .from('motoristas')
      .select('*, usuarios:usuarios(nome_completo, email, telefone)')
      .order('created_at', { ascending: false })
    if (!error) setMotoristas(data || [])
    else toast.error('Erro ao carregar motoristas')
    setLoading(false)
  }

  async function updateStatus(id: string, status: 'aprovado' | 'reprovado' | 'suspenso') {
    const { error } = await supabase.from('motoristas').update({ status }).eq('id', id)
    if (error) {
      toast.error('Erro ao atualizar')
    } else {
      toast.success(`Motorista ${status === 'aprovado' ? 'aprovado' : status === 'reprovado' ? 'reprovado' : 'suspenso'}`)
      fetchMotoristas()
    }
  }

  if (loading) return <div className="text-center py-8">Carregando...</div>

  return (
    <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Gerenciar Motoristas</h2>
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {motoristas.map(m => (
            <tr key={m.id} className="border-b">
              <td className="p-2">{m.usuarios?.nome_completo || 'N/A'}</td>
              <td className="p-2">{m.usuarios?.email || 'N/A'}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  m.status === 'aprovado' ? 'bg-green-100 text-green-800' :
                  m.status === 'reprovado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>{m.status}</span>
              </td>
              <td className="p-2 space-x-2">
                <button onClick={() => updateStatus(m.id, 'aprovado')} className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs">Aprovar</button>
                <button onClick={() => updateStatus(m.id, 'reprovado')} className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs">Reprovar</button>
                <button onClick={() => updateStatus(m.id, 'suspenso')} className="bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs">Suspender</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}