import { useState } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface Ticket {
  id: string
  usuario: string
  assunto: string
  mensagem: string
  status: string
  data: string
}

export default function Suporte() {
  const [tickets] = useState<Ticket[]>([
    { id: '1', usuario: 'Carlos Oliveira', assunto: 'Problema com pagamento', mensagem: 'Não consigo finalizar o pagamento da corrida', status: 'aberto', data: '10/03/2024' },
    { id: '2', usuario: 'Ana Beatriz', assunto: 'Dúvida sobre cadastro', mensagem: 'Como faço para atualizar meus documentos?', status: 'respondido', data: '09/03/2024' },
  ])

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Suporte</h2>
      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                {ticket.status === 'aberto' ? (
                  <AlertCircle className="text-red-500 mt-1" size={20} />
                ) : (
                  <CheckCircle className="text-green-500 mt-1" size={20} />
                )}
                <div>
                  <h3 className="font-bold">{ticket.assunto}</h3>
                  <p className="text-sm text-gray-500">{ticket.usuario}</p>
                  <p className="text-sm mt-2">{ticket.mensagem}</p>
                  <p className="text-xs text-gray-400 mt-2">{ticket.data}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-semibold ${
                ticket.status === 'aberto' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {ticket.status === 'aberto' ? 'Aberto' : 'Respondido'}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="bg-roxo-principal text-white px-4 py-2 rounded-lg text-sm">Responder</button>
              <button className="bg-gray-200 px-4 py-2 rounded-lg text-sm">Arquivar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}