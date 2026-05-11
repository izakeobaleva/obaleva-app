import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const [motoristas, setMotoristas] = useState<any[]>([])

  useEffect(() => {
    loadMotoristas()
  }, [])

  async function loadMotoristas() {
    const { data, error } = await supabase.from('motoristas').select('*')
    if (error) toast.error('Erro ao carregar motoristas')
    else setMotoristas(data || [])
  }

  async function aprovarMotorista(id: string) {
    const { error } = await supabase.from('motoristas').update({ status: 'aprovado' }).eq('id', id)
    if (error) toast.error('Erro ao aprovar')
    else {
      toast.success('Motorista aprovado!')
      loadMotoristas()
    }
  }

  async function reprovarMotorista(id: string) {
    const { error } = await supabase.from('motoristas').update({ status: 'reprovado' }).eq('id', id)
    if (error) toast.error('Erro ao reprovar')
    else {
      toast.success('Motorista reprovado')
      loadMotoristas()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-roxo-principal text-white p-4 rounded-xl flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Admin - OBALEVA</h1>
        <button onClick={signOut} className="btn-amarelo px-4 py-2 rounded-lg">Sair</button>
      </header>
      <h2 className="text-xl font-bold mb-4">Motoristas Pendentes</h2>
      {motoristas.filter(m => m.status === 'pendente').length === 0 ? (
        <p className="text-gray-500">Nenhum motorista pendente.</p>
      ) : (
        <div className="grid gap-4">
          {motoristas.filter(m => m.status === 'pendente').map(m => (
            <div key={m.id} className="bg-white p-4 rounded-xl shadow">
              <p><strong>Nome:</strong> {m.nome}</p>
              <p><strong>E-mail:</strong> {m.email}</p>
              <p><strong>CNH:</strong> {m.cnh}</p>
              {m.cnh_foto && <img src={m.cnh_foto} alt="CNH" className="w-48 mt-2 rounded" />}
              <div className="flex gap-2 mt-4">
                <button onClick={() => aprovarMotorista(m.id)} className="bg-green-600 text-white px-4 py-2 rounded-lg">Aprovar</button>
                <button onClick={() => reprovarMotorista(m.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg">Reprovar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}