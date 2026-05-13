import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'
import { 
  Users, Car, CreditCard, Settings, Bell, 
  BarChart3, TreePine, AlertTriangle, RefreshCw,
  DollarSign, Activity, UserCheck, UserX
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminFullDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    passageiros: 0,
    motoristas: 0,
    motoristasPendentes: 0,
    corridasHoje: 0,
    corridasMes: 0,
    receitaMes: 0,
    receitaHoje: 0,
    corridasCanceladas: 0,
    taxaMedia: 4.5
  })
  const [config, setConfig] = useState({
    tarifaBase: 4,
    tarifaKm: 2.5,
    tarifaMin: 0.4,
    multiplicadorPico: 1.2,
    taxaPlataforma: 20,
    horarioInicioPico: '07:00',
    horarioFimPico: '09:00',
    suporteEmail: 'suporte@obaleva.com',
    versaoApp: '1.0.0'
  })
  const [savingConfig, setSavingConfig] = useState(false)
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [notificacaoTexto, setNotificacaoTexto] = useState('')
  const [enviandoNotificacao, setEnviandoNotificacao] = useState(false)

  useEffect(() => {
    loadStats()
    loadConfig()
    loadUsuarios()
  }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)

      const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1)

      const [usuariosData, corridasData] = await Promise.all([
        supabase.from('usuarios').select('tipo'),
        supabase.from('corridas').select('valor, status, created_at')
      ])

      if (usuariosData.data) {
        const passageiros = usuariosData.data.filter(u => u.tipo === 'passageiro').length
        const motoristas = usuariosData.data.filter(u => u.tipo === 'motorista').length

        // Buscar motoristas pendentes
        const { data: motoristasPendentes } = await supabase
          .from('motoristas')
          .select('id')
          .eq('status', 'pendente')

        setStats(s => ({
          ...s,
          totalUsuarios: usuariosData.data!.length,
          passageiros,
          motoristas,
          motoristasPendentes: motoristasPendentes?.length || 0
        }))
      }

      if (corridasData.data) {
        const corridasHoje = corridasData.data.filter(c => 
          new Date(c.created_at) >= hoje && c.status === 'finalizada'
        )
        const corridasMes = corridasData.data.filter(c => 
          new Date(c.created_at) >= mesAtual && c.status === 'finalizada'
        )
        const canceladas = corridasData.data.filter(c => c.status === 'cancelada')

        setStats(s => ({
          ...s,
          corridasHoje: corridasHoje.length,
          corridasMes: corridasMes.length,
          receitaHoje: corridasHoje.reduce((acc, c) => acc + (c.valor || 0), 0),
          receitaMes: corridasMes.reduce((acc, c) => acc + (c.valor || 0), 0),
          corridasCanceladas: canceladas.length
        }))
      }
    } catch (err) {
      console.error('Erro ao carregar stats:', err)
    }
    setLoading(false)
  }

  async function loadConfig() {
    const keys = ['tarifa_base', 'tarifa_km', 'tarifa_min', 'multiplicador_pico', 
                  'taxa_plataforma', 'horario_inicio_pico', 'horario_fim_pico',
                  'suporte_email', 'versao_app']
    
    const results = await Promise.all(
      keys.map(key => 
        supabase.from('app_config').select('value').eq('key', key).maybeSingle()
      )
    )

    const configMap: any = {}
    keys.forEach((key, index) => {
      if (results[index]?.data?.value) {
        configMap[key] = results[index].data.value
      }
    })

    if (configMap.tarifa_base) config.tarifaBase = Number(configMap.tarifa_base)
    if (configMap.tarifa_km) config.tarifaKm = Number(configMap.tarifa_km)
    if (configMap.tarifa_min) config.tarifaMin = Number(configMap.tarifa_min)
    if (configMap.multiplicador_pico) config.multiplicadorPico = Number(configMap.multiplicador_pico)
    if (configMap.taxa_plataforma) config.taxaPlataforma = Number(configMap.taxa_plataforma)
    if (configMap.horario_inicio_pico) config.horarioInicioPico = configMap.horario_inicio_pico
    if (configMap.horario_fim_pico) config.horarioFimPico = configMap.horario_fim_pico
    if (configMap.suporte_email) config.suporteEmail = configMap.suporte_email
    if (configMap.versao_app) config.versaoApp = configMap.versao_app

    setConfig({...config})
  }

  async function saveConfig() {
    setSavingConfig(true)
    try {
      const entries = [
        { key: 'tarifa_base', value: String(config.tarifaBase) },
        { key: 'tarifa_km', value: String(config.tarifaKm) },
        { key: 'tarifa_min', value: String(config.tarifaMin) },
        { key: 'multiplicador_pico', value: String(config.multiplicadorPico) },
        { key: 'taxa_plataforma', value: String(config.taxaPlataforma) },
        { key: 'horario_inicio_pico', value: config.horarioInicioPico },
        { key: 'horario_fim_pico', value: config.horarioFimPico },
        { key: 'suporte_email', value: config.suporteEmail },
        { key: 'versao_app', value: config.versaoApp },
      ]

      for (const entry of entries) {
        const { error } = await supabase
          .from('app_config')
          .upsert({ key: entry.key, value: entry.value, updated_at: new Date().toISOString() })
        if (error) throw error
      }

      toast.success('Configurações salvas!')
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + err.message)
    }
    setSavingConfig(false)
  }

  async function loadUsuarios() {
    const { data } = await supabase
      .from('usuarios')
      .select('id, nome_completo, email, telefone, tipo')
      .order('created_at', { ascending: false })
    
    if (data) setUsuarios(data)
  }

  async function aprovarMotorista(userId: string) {
    try {
      const { data: existing } = await supabase
        .from('motoristas')
        .select('id')
        .eq('id', userId)
        .maybeSingle()

      if (existing) {
        await supabase.from('motoristas').update({ status: 'aprovado' }).eq('id', userId)
      } else {
        await supabase.from('motoristas').insert({ id: userId, status: 'aprovado' })
      }
      toast.success('Motorista aprovado!')
      loadStats()
    } catch {
      toast.error('Erro ao aprovar motorista')
    }
  }

  async function suspenderUsuario(userId: string) {
    try {
      await supabase.from('motoristas').update({ status: 'suspenso' }).eq('id', userId)
      toast.success('Usuário suspenso')
    } catch {
      toast.error('Erro ao suspender')
    }
  }

  async function enviarNotificacao() {
    if (!notificacaoTexto.trim()) {
      toast.error('Digite o texto da notificação')
      return
    }
    setEnviandoNotificacao(true)
    try {
      await supabase.from('notificacoes').insert({
        titulo: 'Comunicado Admin',
        mensagem: notificacaoTexto,
        tipo: 'admin',
        created_at: new Date().toISOString()
      })
      toast.success('Notificação enviada a todos os usuários!')
      setNotificacaoTexto('')
    } catch (err: any) {
      toast.error('Erro: ' + err.message)
    }
    setEnviandoNotificacao(false)
  }

  const sections = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'usuarios', label: 'Usuários', icon: Users },
    { id: 'config', label: 'Configurações', icon: Settings },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Navegação */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-5 py-2.5 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
              activeSection === section.id
                ? 'bg-[#F4D03F] text-[#1E1E2F] shadow-md'
                : 'bg-[#1A1528] text-[#A0A0A0] hover:bg-[#1A1528]/80 border border-white/10'
            }`}
            style={{ borderRadius: '2rem' }}
          >
            <section.icon size={16} />
            {section.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Dashboard */}
        {activeSection === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">📊 Dashboard</h2>
              <button onClick={loadStats} className="btn-outline-dark p-2">
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard 
                icon={Users} 
                label="Total de Usuários" 
                value={stats.totalUsuarios} 
                color="#3B82F6" 
              />
              <StatCard 
                icon={UserCheck} 
                label="Passageiros" 
                value={stats.passageiros} 
                color="#22C55E" 
              />
              <StatCard 
                icon={Car} 
                label="Motoristas" 
                value={stats.motoristas} 
                color="#A855F7" 
              />
              <StatCard 
                icon={AlertTriangle} 
                label="Pendentes" 
                value={stats.motoristasPendentes} 
                color="#F59E0B" 
              />
              <StatCard 
                icon={Activity} 
                label="Corridas Hoje" 
                value={stats.corridasHoje} 
                color="#3B82F6" 
              />
              <StatCard 
                icon={BarChart3} 
                label="Corridas no Mês" 
                value={stats.corridasMes} 
                color="#22C55E" 
              />
              <StatCard 
                icon={DollarSign} 
                label="Receita Hoje" 
                value={`R$ ${stats.receitaHoje.toFixed(2)}`} 
                color="#F4D03F" 
              />
              <StatCard 
                icon={CreditCard} 
                label="Receita no Mês" 
                value={`R$ ${stats.receitaMes.toFixed(2)}`} 
                color="#22C55E" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <StatCard 
                icon={UserX} 
                label="Canceladas" 
                value={stats.corridasCanceladas} 
                color="#EF4444" 
              />
              <StatCard 
                icon={Activity} 
                label="Taxa Média" 
                value={`${stats.taxaMedia} ⭐`} 
                color="#F59E0B" 
              />
            </div>
          </motion.div>
        )}

        {/* Usuários */}
        {activeSection === 'usuarios' && (
          <motion.div
            key="usuarios"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">👥 Usuários</h2>
            <div className="bg-[#1A1528] rounded-2xl border border-white/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="p-3 text-left text-[#A0A0B0]">Nome</th>
                    <th className="p-3 text-left text-[#A0A0B0]">Email</th>
                    <th className="p-3 text-left text-[#A0A0B0]">Tipo</th>
                    <th className="p-3 text-left text-[#A0A0B0]">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map(u => (
                    <tr key={u.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="p-3 text-white font-medium">{u.nome_completo || 'N/A'}</td>
                      <td className="p-3 text-[#A0A0B0]">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.tipo === 'motorista' ? 'bg-purple-900/40 text-purple-400' : 'bg-blue-900/40 text-blue-400'
                        }`}>
                          {u.tipo === 'motorista' ? '🚗 Motorista' : '🚶 Passageiro'}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        {u.tipo === 'motorista' && (
                          <>
                            <button 
                              onClick={() => aprovarMotorista(u.id)}
                              className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-xl text-xs"
                            >
                              Aprovar
                            </button>
                            <button 
                              onClick={() => suspenderUsuario(u.id)}
                              className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-xl text-xs"
                            >
                              Suspender
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Configurações */}
        {activeSection === 'config' && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">⚙️ Configurações do App</h2>
            <div className="bg-[#1A1528] rounded-2xl border border-white/10 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ConfigField 
                  label="Tarifa Base (R$)" 
                  value={config.tarifaBase}
                  onChange={v => setConfig({...config, tarifaBase: Number(v)})}
                  type="number"
                  step="0.5"
                />
                <ConfigField 
                  label="Tarifa por KM (R$)" 
                  value={config.tarifaKm}
                  onChange={v => setConfig({...config, tarifaKm: Number(v)})}
                  type="number"
                  step="0.1"
                />
                <ConfigField 
                  label="Tarifa por Minuto (R$)" 
                  value={config.tarifaMin}
                  onChange={v => setConfig({...config, tarifaMin: Number(v)})}
                  type="number"
                  step="0.1"
                />
                <ConfigField 
                  label="Multiplicador Pico" 
                  value={config.multiplicadorPico}
                  onChange={v => setConfig({...config, multiplicadorPico: Number(v)})}
                  type="number"
                  step="0.1"
                />
                <ConfigField 
                  label="Taxa da Plataforma (%)" 
                  value={config.taxaPlataforma}
                  onChange={v => setConfig({...config, taxaPlataforma: Number(v)})}
                  type="number"
                />
                <ConfigField 
                  label="Início Horário de Pico" 
                  value={config.horarioInicioPico}
                  onChange={v => setConfig({...config, horarioInicioPico: v})}
                  type="time"
                />
                <ConfigField 
                  label="Fim Horário de Pico" 
                  value={config.horarioFimPico}
                  onChange={v => setConfig({...config, horarioFimPico: v})}
                  type="time"
                />
                <ConfigField 
                  label="Email de Suporte" 
                  value={config.suporteEmail}
                  onChange={v => setConfig({...config, suporteEmail: v})}
                  type="text"
                />
                <ConfigField 
                  label="Versão do App" 
                  value={config.versaoApp}
                  onChange={v => setConfig({...config, versaoApp: v})}
                  type="text"
                />
              </div>
              <button
                onClick={saveConfig}
                disabled={savingConfig}
                className="btn-premium px-6 py-3 text-sm"
              >
                {savingConfig ? 'Salvando...' : 'Salvar Configurações'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Notificações */}
        {activeSection === 'notificacoes' && (
          <motion.div
            key="notificacoes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">🔔 Enviar Notificação</h2>
            <div className="bg-[#1A1528] rounded-2xl border border-white/10 p-6 space-y-4">
              <p className="text-sm text-[#A0A0B0]">
                Envie uma notificação para todos os usuários do aplicativo.
              </p>
              <textarea
                value={notificacaoTexto}
                onChange={e => setNotificacaoTexto(e.target.value)}
                placeholder="Digite a mensagem da notificação..."
                className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] h-32"
              />
              <button
                onClick={enviarNotificacao}
                disabled={enviandoNotificacao || !notificacaoTexto.trim()}
                className="btn-premium px-6 py-3 text-sm"
              >
                {enviandoNotificacao ? 'Enviando...' : '🚀 Enviar para Todos'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }: any) {
  return (
    <div className="bg-[#1A1528] p-4 rounded-2xl border border-white/10">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}20` }}>
          <Icon size={18} color={color} />
        </div>
      </div>
      <p className="text-xs text-[#A0A0B0] mb-1">{label}</p>
      <p className="text-lg font-bold text-white">{value}</p>
    </div>
  )
}

function ConfigField({ label, value, onChange, type, step }: any) {
  return (
    <div>
      <label className="block text-sm text-white/70 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        step={step}
        className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
      />
    </div>
  )
}
</dyad-file>

Agora vou atualizar o AdminDashboard para incluir essa nova aba:

<dyad-write path="src/pages/AdminDashboard.tsx" description="Atualizando AdminDashboard com nova aba de gerenciamento completo">
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
import AdminFullDashboard from './Admin/AdminFullDashboard'
import { Shield, ArrowLeft, Image, BarChart3, Globe } from 'lucide-react'

type Tab = 'dashboard' | 'motoristas' | 'passageiros' | 'corridas' | 'financeiro' | 'landing' | 'logo'

export default function AdminDashboard() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') as Tab | null

  const [activeTab, setActiveTab] = useState<Tab>(tabFromUrl || 'dashboard')

  useEffect(() => {
    if (tabFromUrl) setActiveTab(tabFromUrl)
  }, [tabFromUrl])

  const tabs: { id: Tab; label: string; icon?: any }[] = [
    { id: 'dashboard', label: 'Painel', icon: BarChart3 },
    { id: 'motoristas', label: 'Motoristas' },
    { id: 'passageiros', label: 'Passageiros' },
    { id: 'corridas', label: 'Corridas' },
    { id: 'financeiro', label: 'Financeiro' },
    { id: 'landing', label: 'Landing', icon: Globe },
    { id: 'logo', label: 'Logo', icon: Image },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminFullDashboard />
      case 'motoristas': return <Motoristas />
      case 'passageiros': return <Passageiros />
      case 'corridas': return <Corridas />
      case 'financeiro': return <Financeiro />
      case 'landing': return <LandingEditor />
      case 'logo': return <LogoEditor />
      default: return <AdminFullDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A]">
      <header className="glass-header sticky top-0 z-10 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="btn-outline-dark p-2">
            <ArrowLeft size={20} />
          </button>
          <div className="p-2 bg-[#F4D03F]/20 rounded-2xl">
            <Shield size={24} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>ObaLeve Admin</h1>
        </div>
        <button onClick={signOut} className="btn-outline-dark px-4 py-2 text-sm">Sair</button>
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
      </div>
    </div>
  )
}