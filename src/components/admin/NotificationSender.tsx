import { Bell } from 'lucide-react'

interface NotificationSenderProps {
  text: string
  sending: boolean
  onTextChange: (text: string) => void
  onSend: () => void
}

export default function NotificationSender({ text, sending, onTextChange, onSend }: NotificationSenderProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">🔔 Enviar Notificação</h2>
      <div className="bg-[#1A1528] rounded-2xl border border-white/10 p-6 space-y-4">
        <p className="text-sm text-[#A0A0B0]">
          Envie uma notificação para todos os usuários do aplicativo.
        </p>
        <textarea
          value={text}
          onChange={e => onTextChange(e.target.value)}
          placeholder="Digite a mensagem da notificação..."
          className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] h-32"
        />
        <button
          onClick={onSend}
          disabled={sending || !text.trim()}
          className="btn-premium px-6 py-3 text-sm"
        >
          {sending ? 'Enviando...' : '🚀 Enviar para Todos'}
        </button>
      </div>
    </div>
  )
}