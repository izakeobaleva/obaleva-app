import { Users } from 'lucide-react'

interface User {
  id: string
  nome_completo: string | null
  email: string
  telefone: string | null
  tipo: string
}

interface UserManagementProps {
  usuarios: User[]
  onApprove: (userId: string) => void
  onSuspend: (userId: string) => void
}

export default function UserManagement({ usuarios, onApprove, onSuspend }: UserManagementProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">👥 Usuários</h2>
      <div className="bg-[#1A1528] rounded-2xl border border-white/10 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="p-3 text-left text-[#A0A0B0]">Nome</th>
              <th className="p-3 text-left text-[#A0A0B0]">Email</th>
              <th className="p-3 text-left text-[#A0A0B0]">Tipo</th>
              <th className="p-3 text-left text-[#A0A0B0]">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-b border-white/10 hover:bg-white/5">
                <td className="p-3 text-white font-medium">{u.nome_completo || 'N/A'}</td>
                <td className="p-3 text-[#A0A0B0]">{u.email}</td>
                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    u.tipo === 'motorista' ? 'bg-purple-900/40 text-purple-400' : 'bg-blue-900/40 text-blue-400'
                  }`}>
                    {u.tipo === 'motorista' ? '🚗 Motorista' : '🚶 Passageiro'}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  {u.tipo === 'motorista' && (
                    <>
                      <button 
                        onClick={() => onApprove(u.id)}
                        className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-xl text-xs"
                      >
                        Aprovar
                      </button>
                      <button 
                        onClick={() => onSuspend(u.id)}
                        className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs"
                      >
                        Suspender
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}