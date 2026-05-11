import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

export const AdminDashboard = () => {
  const { signOut } = useAuth()
  const [motoristas, setMotoristas] = useState<any[]>([])

  useEffect(() => { fetchMotoristas() }, [])

  async function fetchMotoristas() {
    const { data } = await supabase.from('motoristas').select('*, usuarios(nome_completo, email, telefone)')
    setMotoristas(data || [])
  }

  async function aprovar(id: string) {
    await supabase.from('motoristas').update({ status: 'aprovado' }).eq('id', id)
    toast.success('Motorista aprovado')
    fetchMotoristas()
  }

  async function reprovar(id: string) {
    await supabase.from('motoristas').update({ status: 'reprovado' }).eq('id', id)
    toast.success('Motorista reprovado')
    fetchMotoristas()
  }

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="bg-roxo-principal text-white p-4 rounded-xl flex justify-between">
        <h1 className="text-2xl font-bold">Admin - OBALEVA</h1>
        <button onClick={signOut} className="btn-amarelo px-3 py-1 rounded">Sair</button>
      </header>
      <h2 className="text-xl font-bold mt-4">Motoristas pendentes</h2>
      {motoristas.filter(m => m.status === 'pendente').map(m => (
        <div key={m.id} className="bg-white p-3 rounded shadow mb-2">
          <p><strong>{m.usuarios?.nome_completo}</strong> - {m.usuarios?.email}</p>
          <button onClick={() => aprovar(m.id)} className="bg-green-600 text-white px-2 py-1 rounded mr-2">Aprovar</button>
          <button onClick={() => reprovar(m.id)} className="bg-red-600 text-white px-2 py-1 rounded">Reprovar</button>
        </div>
      ))}
    </div>
  )
}