import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Save, Eye, Smartphone, Upload } from 'lucide-react'

export default function LandingEditor() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [apkUploading, setApkUploading] = useState(false)
  const [hasApk, setHasApk] = useState(false)

  const [form, setForm] = useState({
    title: 'Mobilidade premium para sua cidade',
    subtitle: 'Corridas rápidas, motoristas confiáveis e um app que se adapta a você.',
    ctaText: 'Baixar APK',
    appUrl: 'https://ovaleva-oficial.vercel.app',
  })

  useEffect(() => {
    loadContent()
    checkApkExists()
  }, [])

  async function loadContent() {
    setLoading(true)
    const keys = ['landing_title', 'landing_subtitle', 'landing_cta_text', 'landing_app_url']
    
    const results = await Promise.all(
      keys.map(key => 
        supabase.from('app_config').select('value').eq('key', key).maybeSingle()
      )
    )

    const titleValue = results[0]?.data?.value
    const subtitleValue = results[1]?.data?.value
    const ctaValue = results[2]?.data?.value
    const appUrlValue = results[3]?.data?.value

    if (titleValue) setForm(f => ({ ...f, title: String(titleValue) }))
    if (subtitleValue) setForm(f => ({ ...f, subtitle: String(subtitleValue) }))
    if (ctaValue) setForm(f => ({ ...f, ctaText: String(ctaValue) }))
    if (appUrlValue) setForm(f => ({ ...f, appUrl: String(appUrlValue) }))
    
    setLoading(false)
  }

  async function checkApkExists() {
    try {
      const response = await fetch('/apk/ovaleva.apk', { method: 'HEAD' })
      setHasApk(response.ok)
    } catch {
      setHasApk(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const entries = [
        { key: 'landing_title', value: form.title },
        { key: 'landing_subtitle', value: form.subtitle },
        { key: 'landing_cta_text', value: form.ctaText },
        { key: 'landing_app_url', value: form.appUrl },
      ]

      for (const entry of entries) {
        const { error } = await supabase
          .from('app_config')
          .upsert({ key: entry.key, value: entry.value, updated_at: new Date().toISOString() })
        
        if (error) throw error
      }

      toast.success('Landing Page atualizada com sucesso!')
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + (err.message || 'Erro desconhecido'))
    }
    setSaving(false)
  }

  async function handleApkUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.apk')) {
      toast.error('Selecione um arquivo .apk válido')
      return
    }

    setApkUploading(true)
    try {
      const fileExt = 'apk'
      const fileName = `ovaleva_${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('public')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (error) throw error

      const { data: publicUrl } = supabase.storage
        .from('public')
        .getPublicUrl(data!.path)

      await supabase
        .from('app_config')
        .upsert({ key: 'apk_url', value: publicUrl.publicUrl, updated_at: new Date().toISOString() })

      setHasApk(true)
      toast.success('APK enviado com sucesso!')
    } catch (err: any) {
      toast.error('Erro ao enviar APK: ' + (err.message || 'Erro desconhecido'))
    }
    setApkUploading(false)
  }

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/landing')}`

  if (loading) {
    return <div className="text-center py-8 text-[#A0A0B0]">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Eye size={24} className="text-[#F4D03F]" />
        Editor da Landing Page
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-dark p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Conteúdo</h3>
          
          <div>
            <label className="block text-white/80 text-sm mb-1">Título principal</label>
            <input 
              className="w-full bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" 
              value={form.title} 
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} 
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Subtítulo</label>
            <textarea 
              className="w-full bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" 
              rows={3} 
              value={form.subtitle} 
              onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} 
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">Texto do botão CTA</label>
            <input 
              className="w-full bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" 
              value={form.ctaText} 
              onChange={e => setForm(f => ({ ...f, ctaText: e.target.value }))} 
            />
          </div>

          <div>
            <label className="block text-white/80 text-sm mb-1">URL do App / Download</label>
            <input 
              className="w-full bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]" 
              value={form.appUrl} 
              onChange={e => setForm(f => ({ ...f, appUrl: e.target.value }))} 
            />
          </div>

          <div className="pt-2">
            <label className="block text-white/80 text-sm mb-1">Arquivo APK</label>
            <div className="bg-[#1A1528] border border-dashed border-white/20 rounded-2xl p-4 text-center">
              <label className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={24} className="text-[#F4D03F]" />
                <div>
                  <p className="text-white font-medium text-sm">
                    {apkUploading ? 'Enviando...' : hasApk ? 'APK já enviado. Clique para substituir' : 'Clique para enviar o APK'}
                  </p>
                  <p className="text-[#A0A0B0] text-xs mt-1">Arquivo .apk</p>
                </div>
                <input
                  type="file"
                  accept=".apk"
                  className="hidden"
                  disabled={apkUploading}
                  onChange={handleApkUpload}
                />
              </label>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="btn-premium px-6 py-3 flex items-center gap-2"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar alterações'}
          </motion.button>
        </div>

        <div className="card-dark p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Prévia</h3>
            <a 
              href="/landing" 
              target="_blank" 
              className="btn-outline-dark px-4 py-2 text-sm flex items-center gap-2"
            >
              <Eye size={16} />
              Abrir página
            </a>
          </div>

          <div className="bg-[#1A1528] rounded-2xl p-6 border border-white/10">
            <div className="inline-flex items-center gap-2 bg-[#F4D03F]/10 border border-[#F4D03F]/20 rounded-full px-3 py-1 mb-3">
              <span className="w-1.5 h-1.5 bg-[#F4D03F] rounded-full animate-pulse" />
              <span className="text-[#F4D03F] text-[10px] font-medium">Disponível na sua cidade</span>
            </div>
            <h4 className="text-xl font-bold text-white">{form.title}</h4>
            <p className="text-[#A0A0B0] text-sm mt-2">{form.subtitle}</p>
            <div className="mt-4 flex gap-3 flex-wrap">
              <span className="btn-premium inline-block px-5 py-2 text-sm flex items-center gap-2">
                <Smartphone size={16} />
                {form.ctaText}
              </span>
              <span className="btn-outline-dark inline-block px-5 py-2 text-sm flex items-center gap-2">
                <Eye size={16} />
                Criar Conta Grátis
              </span>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/70 text-sm mb-2">QR Code da Landing Page:</p>
            <div className="bg-white p-3 rounded-xl inline-block">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-32 h-32"
              />
            </div>
            <p className="text-[#A0A0B0] text-xs mt-2">Escaneie para acessar</p>
          </div>
        </div>
      </div>
    </div>
  )
}