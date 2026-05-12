import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MapWithPersonCar } from '../components/MapWithPersonCar'
import { PaymentMethodSelector } from '../components/PaymentMethodSelector'
import { calcularPrecoCorrida } from '../lib/priceCalculator'
import { MapPin, Navigation, Clock, DollarSign } from 'lucide-react'

export default function PassengerDashboard() {
  const { user, signOut } = useAuth()
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')
  const [metodoPagamento, setMetodoPagamento] = useState<'dinheiro' | 'cartao' | 'pix'>('dinheiro')

  // Simulando valores - em produção viriam de uma API de rotas
  const precoEstimado = origem && destino ? calcularPrecoCorrida({
    distanciaKm: 5.2,
    tempoMin: 15,
  }) : null

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-roxo-principal text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Olá, Passageiro!</h1>
          <p className="text-sm text-purple-200">{user?.email}</p>
        </div>
        <button onClick={signOut} className="btn-amarelo px-4 py-2 rounded-lg text-sm">Sair</button>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Mapa */}
        <MapWithPersonCar />

        {/* Solicitar carona */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <h2 className="font-bold text-lg">Solicitar Carona</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <MapPin size={20} className="text-green-600" />
              </div>
              <input 
                type="text" 
                placeholder="Onde você está?" 
                className="flex-1 p-3 border rounded-lg"
                value={origem}
                onChange={e => setOrigem(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Navigation size={20} className="text-red-600" />
              </div>
              <input 
                type="text" 
                placeholder="Para onde vai?" 
                className="flex-1 p-3 border rounded-lg"
                value={destino}
                onChange={e => setDestino(e.target.value)}
              />
            </div>
          </div>

          {precoEstimado && (
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-roxo-principal" />
                <span className="font-bold text-lg text-roxo-principal">R$ {precoEstimado.toFixed(2)}</span>
                <span className="text-sm text-gray-500">(estimativa)</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Forma de pagamento</label>
            <PaymentMethodSelector value={metodoPagamento} onChange={setMetodoPagamento} />
          </div>

          <button className="btn-amarelo w-full py-3 rounded-lg text-lg font-bold">
            🔍 Solicitar Carona
          </button>
        </div>

        {/* Histórico rápido */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-2">Últimas Corridas</h2>
          <p className="text-gray-500 text-center py-4">Nenhuma corrida ainda</p>
        </div>
      </main>
    </div>
  )
}