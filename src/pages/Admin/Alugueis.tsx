import { useState } from 'react'

interface Aluguel {
  id: string
  motorista: string
  veiculo: string
  dataInicio: string
  dataFim: string
  valor: number
  status: string
}

export default function Alugueis() {
  const [alugueis] = useState<Aluguel[]>([
    { id: '1', motorista: 'João Silva', veiculo: 'Fiat Uno - ABC1234', dataInicio: '01/03/2024', dataFim: '15/03/2024', valor: 1500, status: 'ativo' },
    { id: '2', motorista: 'Maria Santos', veiculo: 'VW Gol - DEF5678', dataInicio: '05/03/2024', dataFim: '19/03/2024', valor: 1500, status: 'ativo' },
  ])

  return (
    <div className="bg-[#1A1528] p-4 rounded-2xl border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Aluguel de Veículos</h2>
        <button className="bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] px-4 py-2 rounded-2xl text-sm font-bold">Novo Aluguel</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="p-2 text-left text-[#A0A0B0] font-medium">Motorista</th>
              <th className="p-2 text-left text-[#A0A0B0] font-medium">Veículo</th>
              <th className="p-2 text-left text-[#A0A0B0] font-medium">Período</th>
              <th className="p-2 text-left text-[#A0A0B0] font-medium">Valor</th>
              <th className="p-2 text-left text-[#A0A0B0] font-medium">Status</th>
              <th className="p-2 text-left text-[#A0A0B0] font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {alugueis.map(a => (
              <tr key={a.id} className="border-b border-white/10">
                <td className="p-2 text-white">{a.motorista}</td>
                <td className="p-2 text-white">{a.veiculo}</td>
                <td className="p-2 text-white">{a.dataInicio} até {a.dataFim}</td>
                <td className="p-2 text-white">R$ {a.valor.toFixed(2)}</td>
                <td className="p-2">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-green-900/40 text-green-400">{a.status}</span>
                </td>
                <td className="p-2 space-x-2">
                  <button className="text-[#F4D03F] hover:underline">Editar</button>
                  <button className="text-red-400 hover:underline">Cancelar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}