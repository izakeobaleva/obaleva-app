import { useState } from 'react'
import { toast } from 'sonner'
import { Save, Eye, Download } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingEditor() {
  const [title, setTitle] = useState('Mobilidade premium para sua cidade')
  const [subtitle, setSubtitle] = useState('Corridas rápidas, motoristas confiáveis e um app que se adapta a você.')
  const [ctaText, setCtaText] = useState('Baixar APK')
  const [appUrl, setAppUrl] = useState('https://obaleva-oficial.vercel.app')

  const handleSave = () => {
    toast.success('Landing page atualizada com sucesso!')
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}`

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Eye size={24} className="text-[#F4D03F]" />
        Editor da Landing Page
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de edição */}
        <div className="card-dark p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Conteúdo</h3>
          
          <div>
            <label className="block text-white/80 text-sm mb-1">Título principal</label>
            <input 
              className="w-full p-3 rounded-2xl bg-[#1A1528] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Subtítulo</label>
            <textarea 
              className="w-full p-3 rounded-2xl bg-[#1A1528] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" 
              rows={3} 
              value={subtitle} 
              onChange={e => setSubtitle(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Texto do botão CTA</label>
            <input 
              className="w-full p-3 rounded-2xl bg-[#1A1528] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" 
              value={ctaText} 
              onChange={e => setCtaText(e.target.value)} 
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">URL do App / Download</label>
            <input 
              className="w-full p-3 rounded-2xl bg-[#1A1528] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" 
              value={appUrl} 
              onChange={e => setAppUrl(e.target.value)} 
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="btn-premium px-6 py-3 flex items-center gap-2"
          >
            <Save size={18} />
            Salvar alterações
          </motion.button>
        </div>

        {/* Prévia */}
        <div className="card-dark p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Prévia</h3>
            <a 
              href="/" 
              target="_blank" 
              className="btn-outline-dark px-4 py-2 text-sm flex items-center gap-2"
            >
              <Download size={16} />
              Abrir página
            </a>
          </div>

          <div className="bg-[#1A1528] rounded-2xl p-6 border border-white/10">
            <h4 className="text-xl font-bold text-white">{title}</h4>
            <p className="text-[#A0A0B0] text-sm mt-2">{subtitle}</p>
            <div className="mt-4 flex gap-3">
              <span className="btn-premium inline-block px-5 py-2 text-sm">{ctaText}</span>
              <span className="btn-outline-dark inline-block px-5 py-2 text-sm">📲 QR Code</span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/70 text-sm mb-2">QR Code do app:</p>
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="inline-block w-32 h-32 rounded-xl border border-white/10"
            />
            <p className="text-[#A0A0B0] text-xs mt-2">Escaneie para baixar</p>
          </div>
        </div>
      </div>
    </div>
  )
}