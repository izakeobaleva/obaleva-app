import { useAuth } from '../contexts/AuthContext'
import { MapWithPersonCar } from '../components/MapWithPersonCar'

export default function DriverDashboard() {
  const { user, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-roxo-principal text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Olá, Motorista!</h1>
        <button onClick={signOut} className="btn-amarelo px-4 py-2 rounded-lg text-sm">Sair</button>
      </header>
      <main className="p-4 max-w-lg mx-auto space-y-4">
        <MapWithPersonCar />
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold text-lg mb-2">Suas viagens</h2>
          <p className="text-gray-500">Em breve você poderá gerenciar suas viagens aqui.</p>
        </div>
      </main>
    </div>
  )
}