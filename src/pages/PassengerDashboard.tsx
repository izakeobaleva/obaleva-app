import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MapWithPersonCar } from '../components/MapWithPersonCar'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'

export const PassengerDashboard = () => {
  const { user, signOut } = useAuth()
  const [destino, setDestino] = useState('')
  const [solicitando, setSolicitando] = useState(false)

  if (!user) {
    return <div className="p-4 text-center text-red-500">Usuário não autenticado.</div>
  }

  const solicitarCorrida = async () => {
    if (!destino) return toast.error('Digite o destino')
    setSolicitando(true)
    const { error } = await supabase.from('corridas').insert({
      passageiro_id: user.id,
      origem: { endereco: 'Local atual' },
      destino: { endereco: destino },
      status: 'solicitada',
      valor_estimado: 20
    })
    if (error) toast.error('Erro ao solicitar: ' + error.message)
    else toast.success('Corrida solicitada! Aguardando motorista...')
    setSolicitando(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-roxo-principal text-white p-4 rounded-xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">OBALEVA - Passageiro</h1>
        <button onClick={signOut} className="btn-amarelo px-4 py-2 rounded-lg">Sair</button>
      </header>
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <label className="block font-medium mb-2">Destino</label>
          <input type="text" placeholder="Para onde você vai?" className="w-full p-3 border rounded-lg" value={destino} onChange={e => setDestino(e.target.value)} />
          <button onClick={solicitarCorrida} disabled={solicitando} className="btn-amarelo w-full mt-4 py-3 rounded-lg text-lg font-bold">
            {solicitando ? 'Solicitando...' : 'Solicitar OBALEVA'}
          </button>
        </div>
        <div className="bg-white rounded-xl overflow-hidden shadow">
          <MapWithPersonCar />
        </div>
      </div>
    </div>
  )
}