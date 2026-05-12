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
    <div className="bg-[#1A1528] p-4 rounded-2xl border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4">Suporte</h2>
      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-[#1A1528] border border-white/10 rounded-2xl p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-3">
                {ticket.status === 'aberto' ? (
                  <AlertCircle className="text-red-400 mt-1" size={20} />
                ) : (
                  <CheckCircle className="text-green-400 mt-1" size={20} />
                )}
                <div>
                  <h3 className="font-bold text-white">{ticket.assunto}</h3>
                  <p className="text-sm text-[#A0A0B0]">{ticket.usuario}</p>
                  <p className="text-sm text-white mt-2">{ticket.mensagem}</p>
                  <p className="text-xs text-[#A0A0B0] mt-2">{ticket.data}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                ticket.status === 'aberto' ? 'bg-red-900/40 text-red-400' : 'bg-green-900/40 text-green-400'
              }`}>
                {ticket.status === 'aberto' ? 'Aberto' : 'Respondido'}
              </span>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] px-4 py-2 rounded-2xl text-sm font-bold">Responder</button>
              <button className="border border-white/20 text-white/90 px-4 py-2 rounded-2xl text-sm">Arquivar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}