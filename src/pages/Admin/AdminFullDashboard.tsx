import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'
import { BarChart3, Users, Settings, Bell } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardStats from '../../components/admin/DashboardStats'
import UserManagement from '../../components/admin/UserManagement'
import AppConfig from '../../components/admin/AppConfig'
import NotificationSender from '../../components/admin/NotificationSender'

interface StatsData {
  totalUsuarios: number
  passageiros: number
  motoristas: number
  motoristasPendentes: number
  corridasHoje: number
  corridasMes: number
  receitaMes: number
  receitaHoje: number
  corridasCanceladas: number
  taxaMedia: number
}

interface AppConfigData {
  tarifaBase: number
  tarifaKm: number
  tarifaMin: number
  multiplicadorPico: number
  taxaPlataforma: number
  horarioInicioPico: string
  horarioFimPico: string
  suporteEmail: string
  versaoApp: string
}

const initialStats: StatsData = {
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
}

const initialConfig: AppConfigData = {
  tarifaBase: 4,
  tarifaKm: 2.5,
  tarifaMin: 0.4,
  multiplicadorPico: 1.2,
  taxaPlataforma: 20,
  horarioInicioPico: '07:00',
  horarioFimPico: '09:00',
  suporteEmail: 'suporte@obaleva.com',
  versaoApp: '1.0.0'
}

export default function AdminFullDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatsData>(initialStats)
  const [config, setConfig] = useState<AppConfigData>(initialConfig)
  const [savingConfig, setSavingConfig] = useState(false)
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [notificacaoTexto, setNotificacaoTexto] = useState('')
  const [enviandoNotificacao, setEnviandoNotificacao] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    await Promise.all([loadStats(), loadConfig(), loadUsuarios()])
    setLoading(false)
  }

  async function loadStats() {
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

    setConfig(prev => ({
      ...prev,
      tarifaBase: Number(configMap.tarifa_base) || prev.tarifaBase,
      tarifaKm: Number(configMap.tarifa_km) || prev.tarifaKm,
      tarifaMin: Number(configMap.tarifa_min) || prev.tarifaMin,
      multiplicadorPico: Number(configMap.multiplicador_pico) || prev.multiplicadorPico,
      taxaPlataforma: Number(configMap.taxa_plataforma) || prev.taxaPlataforma,
      horarioInicioPico: configMap.horario_inicio_pico || prev.horarioInicioPico,
      horarioFimPico: configMap.horario_fim_pico || prev.horarioFimPico,
      suporteEmail: configMap.suporte_email || prev.suporteEmail,
      versaoApp: configMap.versao_app || prev.versaoApp,
    }))
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

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <DashboardStats 
            stats={stats} 
            loading={loading} 
            onRefresh={loadStats} 
          />
        )
      case 'usuarios':
        return (
          <UserManagement 
            usuarios={usuarios}
            onApprove={aprovarMotorista}
            onSuspend={suspenderUsuario}
          />
        )
      case 'config':
        return (
          <AppConfig 
            config={config}
            saving={savingConfig}
            onConfigChange={(key, value) => setConfig(prev => ({ ...prev, [key]: value }))}
            onSave={saveConfig}
          />
        )
      case 'notificacoes':
        return (
          <NotificationSender 
            text={notificacaoTexto}
            sending={enviandoNotificacao}
            onTextChange={setNotificacaoTexto}
            onSend={enviarNotificacao}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
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
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}