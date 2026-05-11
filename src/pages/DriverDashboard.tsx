import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export const DriverDashboard = () => {
  const { user, signOut } = useAuth()
  const [online, setOnline] = useState(false)
  const [corridas, setCorridas] = useState<any[]>([])
  const [saldo, setSaldo] = useState(0)

  useEffect(() => {
    fetchDriverData()
    subscribeToRides()
  }, [])

  async function fetchDriverData() {
    const { data: motorista } = await supabase.from('motoristas').select('*').eq('id', user.id).single()
    if (motorista?.status !== 'aprovado') toast.error('Aguardando aprovação do admin')
    const { data: carteira } = await supabase.from('carteira_motorista').select('saldo_disponivel').eq('motorista_id', user.id).single()
    setSaldo(carteira?.saldo_disponivel || 0)
    const { data: rides } = await supabase.from('corridas').select('*').eq('motorista_id', user.id).order('data_solicitacao', { ascending: false })
    setCorridas(rides || [])
  }

  function subscribeToRides() {
    const subscription = supabase
      .channel('corridas')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'corridas', filter: `status=eq.solicitada` }, (payload: RealtimePostgresChangesPayload<any>) => {
        if (online) {
          toast.custom(() => (
            <div className="bg-roxo-principal text-white p-4 rounded-xl shadow-lg">
              <p>Nova corrida! Valor estimado: R$ {payload.new.valor_estimado}</p>
              <button onClick={() => acceptRide(payload.new.id)} className="btn-amarelo px-2 py-1 rounded mt-1">Aceitar</button>
            </div>
          ), { duration: 10000 })
        }
      })
      .subscribe()
    return () => subscription.unsubscribe()
  }

  async function acceptRide(rideId: string) {
    await supabase.from('corridas').update({ motorista_id: user.id, status: 'aceita' }).eq('id', rideId)
    toast.success('Corrida aceita! Vá até o passageiro.')
  }

  return (
    <div className="p-4 min-h-screen bg-gray-100">
      <header className="bg-roxo-principal text-white p-4 rounded-xl flex justify-between">
        <h1 className="text-2xl font-bold">OBALEVA - Motorista</h1>
        <button onClick={signOut} className="btn-amarelo px-3 py-1 rounded">Sair</button>
      </header>
      <div className="mt-4 flex justify-between">
        <button onClick={() => setOnline(!online)} className={`px-6 py-2 rounded ${online ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
          {online ? 'Online' : 'Offline'}
        </button>
        <div className="bg-white p-2 rounded shadow">Saldo: R$ {saldo.toFixed(2)}</div>
      </div>
      <h2 className="text-xl font-bold mt-4">Histórico</h2>
      {corridas.map(c => <div key={c.id} className="bg-white p-2 my-1 rounded">{c.destino?.endereco} - R$ {c.valor_final || c.valor_estimado}</div>)}
    </div>
  )
}