import { RefreshCw } from 'lucide-react'
import { 
  Users, Car, AlertTriangle, Activity, 
  BarChart3, DollarSign, CreditCard, UserCheck, UserX 
} from 'lucide-react'

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

interface DashboardStatsProps {
  stats: StatsData
  loading: boolean
  onRefresh: () => void
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

export default function DashboardStats({ stats, loading, onRefresh }: DashboardStatsProps) {
  const cards = [
    { icon: Users, label: "Total de Usuários", value: stats.totalUsuarios, color: "#3B82F6" },
    { icon: UserCheck, label: "Passageiros", value: stats.passageiros, color: "#22C55E" },
    { icon: Car, label: "Motoristas", value: stats.motoristas, color: "#A855F7" },
    { icon: AlertTriangle, label: "Pendentes", value: stats.motoristasPendentes, color: "#F59E0B" },
    { icon: Activity, label: "Corridas Hoje", value: stats.corridasHoje, color: "#3B82F6" },
    { icon: BarChart3, label: "Corridas no Mês", value: stats.corridasMes, color: "#22C55E" },
    { icon: DollarSign, label: "Receita Hoje", value: `R$ ${stats.receitaHoje.toFixed(2)}`, color: "#F4D03F" },
    { icon: CreditCard, label: "Receita no Mês", value: `R$ ${stats.receitaMes.toFixed(2)}`, color: "#22C55E" },
    { icon: UserX, label: "Canceladas", value: stats.corridasCanceladas, color: "#EF4444" },
    { icon: Activity, label: "Taxa Média", value: `${stats.taxaMedia} ⭐`, color: "#F59E0B" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">📊 Dashboard</h2>
        <button onClick={onRefresh} className="btn-outline-dark p-2">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  )
}