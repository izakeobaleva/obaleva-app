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
  const [alugueis, setAlugueis] = useState<Aluguel[]>([
    { id: '1', motorista: 'João Silva', veiculo: 'Fiat Uno - ABC1234', dataInicio: '01/03/2024', dataFim: '15/03/2024', valor: 1500, status: 'ativo' },
    { id: '2', motorista: 'Maria Santos', veiculo: 'VW Gol - DEF5678', dataInicio: '05/03/2024', dataFim: '19/03/2024', valor: 1500, status: 'ativo' },
  ])

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Aluguel de Veículos</h2>
        <button className="btn-amarelo px-4 py-2 rounded-lg text-sm">Novo Aluguel</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Motorista</th>
              <th className="p-2 text-left">Veículo</th>
              <th className="p-2 text-left">Período</th>
              <th className="p-2 text-left">Valor</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {alugueis.map(a => (
              <tr key={a.id} className="border-b">
                <td className="p-2">{a.motorista}</td>
                <td className="p-2">{a.veiculo}</td>
                <td className="p-2">{a.dataInicio} até {a.dataFim}</td>
                <td className="p-2">R$ {a.valor.toFixed(2)}</td>
                <td className="p-2">
                  <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">{a.status}</span>
                </td>
                <td className="p-2 space-x-2">
                  <button className="text-blue-600 hover:underline">Editar</button>
                  <button className="text-red-600 hover:underline">Cancelar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}