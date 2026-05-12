import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { motion } from 'framer-motion'
import Motoristas from './Admin/Motoristas'
import Passageiros from './Admin/Passageiros'
import Corridas from './Admin/Corridas'
import Financeiro from './Admin/Financeiro'
import Alugueis from './Admin/Alugueis'
import Suporte from './Admin/Suporte'
import { Shield } from 'lucide-react'

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
    <div className="min-h-screen bg-[#0F0B1A]">
      <header className="glass-header sticky top-0 z-10 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#F4D03F]/20 rounded-2xl">
            <Shield size={24} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin OBALEVA</h1>
        </div>
        <button
          onClick={signOut}
          className="btn-outline-dark px-4 py-2 text-sm"
        >
          Sair
        </button>
      </header>

      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#F4D03F] text-[#1E1E2F] shadow-md'
                  : 'bg-[#1A1528] text-[#A0A0A0] hover:bg-[#1A1528]/80 border border-white/10'
              }`}
              style={{ borderRadius: '2rem' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          {activeTab === 'motoristas' && <Motoristas />}
          {activeTab === 'passageiros' && <Passageiros />}
          {activeTab === 'corridas' && <Corridas />}
          {activeTab === 'financeiro' && <Financeiro />}
          {activeTab === 'alugueis' && <Alugueis />}
          {activeTab === 'suporte' && <Suporte />}
        </motion.div>
      </div>
    </div>
  )
}