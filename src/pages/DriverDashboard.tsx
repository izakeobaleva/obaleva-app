import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { MapWithPersonCar } from '../components/MapWithPersonCar'
import { DollarSign, Users, Star, Clock } from 'lucide-react'
import { RatingStars } from '../components/RatingStars'

export default function DriverDashboard() {
  const { user, signOut } = useAuth()
  const [disponivel, setDisponivel] = useState(true)

  const stats = [
    { label: 'Corridas Hoje', value: 3, icon: Clock, color: 'bg-blue-500' },
    { label: 'Ganhos Hoje', value: 'R$ 97,50', icon: DollarSign, color: 'bg-green-500' },
    { label: 'Avaliação', value: <RatingStars value={4.5} readonly size={16} />, icon: Star, color: 'bg-yellow-500' },
    { label: 'Total Corridas', value: 156, icon: Users, color: 'bg-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-roxo-principal text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Olá, Motorista!</h1>
          <p className="text-sm text-purple-200">{user?.email}</p>
        </div>
        <button onClick={signOut} className="btn-amarelo px-4 py-2 rounded-lg text-sm">Sair</button>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Status online/offline */}
        <div className="bg-white p-4 rounded-xl shadow flex items-center justify-between">
          <div>
            <h2 className="font-bold">Status</h2>
            <p className={disponivel ? 'text-green-600' : 'text-red-600'}>
              {disponivel ? '🟢 Disponível para corridas' : '🔴 Indisponível'}
            </p>
          </div>
          <button
            onClick={() => setDisponivel(!disponivel)}
            className={`px-6 py-3 rounded-lg font-bold ${
              disponivel ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {disponivel ? 'Ficar Offline' : 'Ficar Online'}
          </button>
        </div>

        {/* Mapa */}
        <MapWithPersonCar />

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white p-4 rounded-xl shadow">
              <div className="flex items-center gap-2 mb-2">
                <div className={`${stat.color} p-2 rounded-lg`}>
                  <stat.icon size={16} className="text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Solicitações pendentes */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-3">Solicitações Próximas</h2>
          <div className="text-center py-4 text-gray-500">
            <Clock size={32} className="mx-auto mb-2 text-gray-300" />
            <p>Nenhuma solicitação no momento</p>
            <p className="text-sm">Quando houver corridas próximas, aparecerão aqui</p>
          </div>
        </div>
      </main>
    </div>
  )
}