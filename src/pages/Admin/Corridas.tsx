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
      .select('*')
      .order('created_at', { ascending: false })

    if (filtro !== 'todas') {
      query = query.eq('status', filtro)
    }

    const { data, error } = await query
    
    if (!error && data) {
      // Carregar dados dos passageiros e motoristas separadamente
      const corridasComNomes = await Promise.all(
        data.map(async (c) => {
          let passageiroNome = 'N/A'
          let motoristaNome = 'N/A'
          
          if (c.passageiro_id) {
            const { data: pData } = await supabase
              .from('usuarios')
              .select('nome_completo')
              .eq('id', c.passageiro_id)
              .single()
            if (pData) passageiroNome = pData.nome_completo
          }
          
          if (c.motorista_id) {
            const { data: mData } = await supabase
              .from('usuarios')
              .select('nome_completo')
              .eq('id', c.motorista_id)
              .single()
            if (mData) motoristaNome = mData.nome_completo
          }
          
          return { ...c, passageiro_nome: passageiroNome, motorista_nome: motoristaNome }
        })
      )
      setCorridas(corridasComNomes)
    } else {
      toast.error('Erro ao carregar corridas')
    }
    setLoading(false)
  }

  return (
    <div className="bg-[#1A1528] p-4 rounded-2xl border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Corridas</h2>
        <select
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          className="bg-[#1A1528] text-white border border-white/10 rounded-2xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
        >
          <option value="todas" className="bg-[#1A1528]">Todas</option>
          <option value="pendente" className="bg-[#1A1528]">Pendentes</option>
          <option value="em_andamento" className="bg-[#1A1528]">Em andamento</option>
          <option value="finalizada" className="bg-[#1A1528]">Finalizadas</option>
          <option value="cancelada" className="bg-[#1A1528]">Canceladas</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8 text-[#A0A0B0]">Carregando...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="p-2 text-left text-[#A0A0B0] font-medium">Passageiro</th>
                <th className="p-2 text-left text-[#A0A0B0] font-medium">Motorista</th>
                <th className="p-2 text-left text-[#A0A0B0] font-medium">Status</th>
                <th className="p-2 text-left text-[#A0A0B0] font-medium">Valor</th>
                <th className="p-2 text-left text-[#A0A0B0] font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {corridas.map(c => (
                <tr key={c.id} className="border-b border-white/10">
                  <td className="p-2 text-white">{c.passageiro_nome}</td>
                  <td className="p-2 text-white">{c.motorista_nome}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      c.status === 'finalizada' ? 'bg-green-900/40 text-green-400' :
                      c.status === 'em_andamento' ? 'bg-blue-900/40 text-blue-400' :
                      c.status === 'cancelada' ? 'bg-red-900/40 text-red-400' : 'bg-yellow-900/40 text-yellow-400'
                    }`}>{c.status}</span>
                  </td>
                  <td className="p-2 text-white">R$ {c.valor?.toFixed(2) || '0.00'}</td>
                  <td className="p-2 text-white">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}