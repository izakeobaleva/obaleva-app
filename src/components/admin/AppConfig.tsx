import { Settings } from 'lucide-react'

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

interface AppConfigProps {
  config: AppConfigData
  saving: boolean
  onConfigChange: (key: string, value: string | number) => void
  onSave: () => void
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

export default function AppConfig({ config, saving, onConfigChange, onSave }: AppConfigProps) {
  const fields = [
    { label: "Tarifa Base (R$)", key: "tarifaBase", value: config.tarifaBase, type: "number", step: "0.5" },
    { label: "Tarifa por KM (R$)", key: "tarifaKm", value: config.tarifaKm, type: "number", step: "0.1" },
    { label: "Tarifa por Minuto (R$)", key: "tarifaMin", value: config.tarifaMin, type: "number", step: "0.1" },
    { label: "Multiplicador Pico", key: "multiplicadorPico", value: config.multiplicadorPico, type: "number", step: "0.1" },
    { label: "Taxa da Plataforma (%)", key: "taxaPlataforma", value: config.taxaPlataforma, type: "number" },
    { label: "Início Horário de Pico", key: "horarioInicioPico", value: config.horarioInicioPico, type: "time" },
    { label: "Fim Horário de Pico", key: "horarioFimPico", value: config.horarioFimPico, type: "time" },
    { label: "Email de Suporte", key: "suporteEmail", value: config.suporteEmail, type: "text" },
    { label: "Versão do App", key: "versaoApp", value: config.versaoApp, type: "text" },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">⚙️ Configurações do App</h2>
      <div className="bg-[#1A1528] rounded-2xl border border-white/10 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(field => (
            <ConfigField
              key={field.key}
              {...field}
              onChange={(v: string) => {
                const value = field.type === "number" ? Number(v) : v
                onConfigChange(field.key, value)
              }}
            />
          ))}
        </div>
        <button
          onClick={onSave}
          disabled={saving}
          className="btn-premium px-6 py-3 text-sm"
        >
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </div>
  )
}