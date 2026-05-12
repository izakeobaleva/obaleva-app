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

  const tabs: { id: Tab; label: string }[]<dyad-write path="src/pages/AdminDashboard.tsx" description="Painel admin com paleta refinada">
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
    <div className="min-h-screen bg-[#F9F9FB]">
      <header className="glass-effect sticky top-0 z-10 flex justify-between items-center px-6 py-4 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#6B2D8C]/10 rounded-lg">
            <Shield size={24} className="text-[#6B2D8C]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1E1E2F]">
            Admin OBALEVA
          </h1>
        </div>
        <button
          onClick={signOut}
          className="bg-[#6B2D8C]/10 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-[#6B2D8C] hover:bg-[#6B2D8C]/20 transition"
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
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#6B2D8C] text-white shadow-md'
                  : 'bg-white/60 backdrop-blur text-[#6C6F85] hover:bg-white shadow-sm'
              }`}
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