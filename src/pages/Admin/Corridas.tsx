import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'

export default function Corridas() {
  const [corridas, setCorridas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<string>('todas')

  useEffect(() => {
    fetchCorridas()
  }, [filtro])

  async function fetchCorridas() {
    setLoading(true)
    let query = supabase
      .from('corridas')
      .select('*, passageiro:usuarios!passageiro_id(nome_completo), motorista:usuarios!motorista_id(nome_completo)')
      .order('created_at', { ascending: false })

    if (filtro !== 'todas') {
      query = query.eq('status', filtro)
    }

    const { data, error } = await query
    if (!error) setCorridas(data || [])
    else toast.error('Erro ao carregar corridas')
    setLoading(false)
  }

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Corridas</h2>
        <select
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="todas">Todas</option>
          <option value="pendente">Pendentes</option>
          <option value="em_andamento">Em andamento</option>
          <option value="finalizada">Finalizadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Passageiro</th>
                <th className="p-2 text-left">Motorista</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Valor</th>
                <th className="p-2 text-left">Data</th>
              </tr>
            </thead>
            <tbody>
              {corridas.map(c => (
                <tr key={c.id} className="border-b">
                  <td className="p-2">{c.passageiro?.nome_completo || 'N/A'}</td>
                  <td className="p-2">{c.motorista?.nome_completo || 'N/A'}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      c.status === 'finalizada' ? 'bg-green-100 text-green-800' :
                      c.status === 'em_andamento' ? 'bg-blue-100 text-blue-800' :
                      c.status === 'cancelada' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>{c.status}</span>
                  </td>
                  <td className="p-2">R$ {c.valor?.toFixed(2) || '0.00'}</td>
                  <td className="p-2">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}