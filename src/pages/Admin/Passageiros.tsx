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

  if (loading) return <div className="text-center py-8">Carregando...</div>

  return (
    <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Passageiros</h2>
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Telefone</th>
            <th className="p-2 text-left">Total de Corridas</th>
          </tr>
        </thead>
        <tbody>
          {passageiros.map(p => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.usuarios?.nome_completo || 'N/A'}</td>
              <td className="p-2">{p.usuarios?.email || 'N/A'}</td>
              <td className="p-2">{p.usuarios?.telefone || 'N/A'}</td>
              <td className="p-2">{p.total_corridas || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}