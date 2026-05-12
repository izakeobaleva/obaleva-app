import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Motoristas from './Admin/Motoristas'
import Passageiros from './Admin/Passageiros'
import Corridas from './Admin/Corridas'
import Financeiro from './Admin/Financeiro'
import Alugueis from './Admin/Alugueis'
import Suporte from './Admin/Suporte'

type Tab = 'motoristas' | 'passageiros' | 'corridas' | 'financeiro' | 'alugueis' | 'suporte'

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('motoristas')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'motoristas', label: 'Motoristas' },
    { id: 'passageiros', label: 'Passageiros' },
    { id: 'corridas', label: 'Corridas' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'alugueis', label: 'Aluguel' },
    { id: 'suporte', label: 'Suporte' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-roxo-principal text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin OBALEVA</h1>
        <button onClick={signOut} className="btn-amarelo px-4 py-2 rounded-lg">Sair</button>
      </header>
      <div className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                activeTab === tab.id ? 'bg-roxo-principal text-white' : 'bg-white text-gray-700 shadow hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-4">
          {activeTab === 'motoristas' && <Motoristas />}
          {activeTab === 'passageiros' && <Passageiros />}
          {activeTab === 'corridas' && <Corridas />}
          {activeTab === 'financeiro' && <Financeiro />}
          {activeTab === 'alugueis' && <Alugueis />}
          {activeTab === 'suporte' && <Suporte />}
        </div>
      </div>
    </div>
  )
}