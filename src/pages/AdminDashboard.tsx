<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import { Car, LogOut, CheckCircle, Users } from 'lucide-react'

export const AdminDashboard = () => {
  const { signOut } = useAuth()
  const [motoristas, setMotoristas] = useState<any[]>([])

  useEffect(() => { fetchMotoristas() }, [])

  async function fetchMotoristas() {
    const { data } = await supabase.from('motoristas').select('*, usuarios(nome_completo, email)')
    setMotoristas(data || [])
  }

  async function aprovar(id: string) {
    await supabase.from('motoristas').update({ status: 'aprovado' }).eq('id', id)
    toast.success('Motorista aprovado!')
    fetchMotoristas()
  }

  const pendentes = motoristas.filter(m => m.status === 'pendente')

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
      <header className="bg-[#1A1528]/80 backdrop-blur-lg border-b border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Car className="text-[#F4D03F] w-8 h-8" />
          <h1 className="text-xl font-bold text-white">Admin OBALEVA</h1>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-2xl hover:bg-red-500/30 transition">
          <LogOut size={18} /> Sair
        </button>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 p-6 mt-4">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Users className="text-[#F4D03F]" size={20} /> Motoristas Pendentes
            {pendentes.length > 0 && (
              <span className="bg-[#F4D03F] text-black text-xs px-2 py-1 rounded-full font-bold">{pendentes.length}</span>
            )}
          </h2>
          
          {pendentes.length === 0 ? (
            <p className="text-[#A0A0B0] text-center py-8">Nenhum motorista pendente</p>
          ) : (
            <div className="space-y-3">
              {pendentes.map(m => (
                <div key={m.id} className="bg-[#0F0B1A] rounded-2xl p-4 border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{m.usuarios?.nome_completo}</p>
                    <p className="text-sm text-[#A0A0B0]">{m.usuarios?.email}</p>
                    {m.dados_veiculo && (
                      <p className="text-xs text-[#A0A0B0] mt-1">
                        {m.dados_veiculo.modelo} - {m.dados_veiculo.placa}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => aprovar(m.id)} 
                    className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-xl hover:bg-green-500/30 transition"
                  >
                    <CheckCircle size={18} /> Aprovar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 p-6 mt-4">
          <h2 className="text-lg font-bold text-white mb-4">Motoristas Aprovados</h2>
          {motoristas.filter(m => m.status === 'aprovado').length === 0 ? (
            <p className="text-[#A0A0B0] text-center py-8">Nenhum motorista aprovado</p>
          ) : (
            <div className="space-y-3">
              {motoristas.filter(m => m.status === 'aprovado').map(m => (
                <div key={m.id} className="bg-[#0F0B1A] rounded-2xl p-4 border border-white/10">
                  <p className="text-white font-medium">{m.usuarios?.nome_completo}</p>
                  <p className="text-sm text-[#A0A0B0]">{m.usuarios?.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
=======
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Motoristas from './Admin/Motoristas'
import Passageiros from './Admin/Passageiros'
import Corridas from './Admin/Corridas'
import Financeiro from './Admin/Financeiro'
import LandingEditor from './Admin/LandingEditor'
import LogoEditor from './Admin/LogoEditor'
import { Shield, ArrowLeft, Image } from 'lucide-react'

type Tab = 'motoristas' | 'passageiros' | 'corridas' | 'financeiro' | 'landing' | 'logo'

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') as Tab | null

  const [activeTab, setActiveTab] = useState<Tab>(tabFromUrl || 'motoristas')

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  const tabs: { id: Tab; label: string; icon?: any }[] = [
    { id: 'motoristas', label: 'Motoristas' },
    { id: 'passageiros', label: 'Passageiros' },
    { id: 'corridas', label: 'Corridas' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'landing', label: 'Landing Page' },
    { id: 'logo', label: 'Logo', icon: Image },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'motoristas':
        return <Motoristas />
      case 'passageiros':
        return <Passageiros />
      case 'corridas':
        return <Corridas />
      case 'financeiro':
        return <Financeiro />
      case 'landing':
        return <LandingEditor />
      case 'logo':
        return <LogoEditor />
      default:
        return <Motoristas />
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A]">
      <header className="glass-header sticky top-0 z-10 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="btn-outline-dark p-2"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="p-2 bg-[#F4D03F]/20 rounded-2xl">
            <Shield size={24} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>ObaLeve Admin</h1>
        </div>
        <button
          onClick={signOut}
          className="btn-outline-dark px-4 py-2 text-sm"
        >
          Sair
        </button>
      </header>

      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-[#F4D03F] text-[#1E1E2F] shadow-md'
                  : 'bg-[#1A1528] text-[#A0A0A0] hover:bg-[#1A1528]/80 border border-white/10'
              }`}
              style={{ borderRadius: '2rem' }}
            >
              {tab.icon && <tab.icon size={16} />}
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
          {renderTabContent()}
        </motion.div>
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780
      </div>
    </div>
  )
}