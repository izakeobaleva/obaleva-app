import { useState, useEffect } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { 
  BarChart3, Users, Car, DollarSign, Settings, Bell, 
  Globe, Image, MessageSquare, LogOut, Calendar, Menu, X, 
  ArrowLeft, RefreshCw
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Corridas from './Admin/Corridas'
import Motoristas from './Admin/Motoristas'
import Passageiros from './Admin/Passageiros'
import Financeiro from './Admin/Financeiro'
import Alugueis from './Admin/Alugueis'
import Suporte from './Admin/Suporte'
import AdminFullDashboard from './Admin/AdminFullDashboard'
import LandingEditor from './Admin/LandingEditor'
import LogoEditor from './Admin/LogoEditor'
import DominioConfig from './Admin/DominioConfig'
import EmailConfigCheck from './Admin/EmailConfigCheck'

function AdminDashboard() {
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dominio, setDominio] = useState(window.location.origin)

  useEffect(() => {
    loadDominio()
  }, [])

  async function loadDominio() {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'app_domain')
      .maybeSingle()
    if (data?.value) setDominio(String(data.value))
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'corridas', label: 'Corridas', icon: Car },
    { id: 'motoristas', label: 'Motoristas', icon: Users },
    { id: 'passageiros', label: 'Passageiros', icon: Users },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'alugueis', label: 'Aluguel', icon: Calendar },
    { id: 'landing', label: 'Landing Page', icon: Globe },
    { id: 'logo', label: 'Logo', icon: Image },
    { id: 'dominio', label: 'Domínio', icon: Globe },
    { id: 'suporte', label: 'Suporte', icon: MessageSquare },
    { id: 'diagnostico', label: 'Diagnóstico', icon: RefreshCw },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminFullDashboard />
      case 'corridas': return <Corridas />
      case 'motoristas': return <Motoristas />
      case 'passageiros': return <Passageiros />
      case 'financeiro': return <Financeiro />
      case 'alugueis': return <Alugueis />
      case 'landing': return <LandingEditor />
      case 'logo': return <LogoEditor />
      case 'dominio': return <DominioConfig />
      case 'suporte': return <Suporte />
      case 'diagnostico': return <EmailConfigCheck />
      default: return <AdminFullDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A] flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-[#1A1528] border-r border-white/10 p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <button onClick={() => navigate('/')} className="back-button-outline" type="button">
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Admin</h1>
            <p className="text-xs text-[#A0A0B0]">{profile?.email || 'Admin'}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#F4D03F]/10 text-[#F4D03F] border border-[#F4D03F]/20'
                  : 'text-[#A0A0B0] hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-4"
        >
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      {/* Header mobile */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="lg:hidden glass-header sticky top-0 z-30 flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="back-button-outline" type="button">
              <ArrowLeft size={22} />
            </button>
            <h1 className="text-lg font-bold text-white">Admin</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-[#A0A0B0] hover:text-white transition"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Sidebar mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-72 bg-[#1A1528] border-l border-white/10 z-50 lg:hidden p-4"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-white">Menu</h2>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 text-[#A0A0B0] hover:text-white">
                    <X size={24} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-[#F4D03F]/10 text-[#F4D03F] border border-[#F4D03F]/20'
                          : 'text-[#A0A0B0] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </button>
                  ))}
                </nav>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all mt-4 w-full"
                >
                  <LogOut size={18} />
                  Sair
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard