import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'
import { Globe, Save, ExternalLink, Copy, ExternalLink as LinkIcon } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DominioConfig() {
  const [dominio, setDominio] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dominioAtual, setDominioAtual] = useState(window.location.origin)

  useEffect(() => {
    loadDominio()
  }, [])

  async function loadDominio() {
    setLoading(true)
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'app_domain')
      .maybeSingle()
    
    if (data?.value) {
      setDominio(String(data.value))
    }
    setLoading(false)
  }

  async function handleSave() {
    if (!dominio.trim()) {
      toast.error('Digite a URL do domínio')
      return
    }

    let url = dominio.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('app_config')
        .upsert({ 
          key: 'app_domain', 
          value: url, 
          updated_at: new Date().toISOString() 
        })

      if (error) throw error

      setDominio(url)
      toast.success('Domínio salvo com sucesso!')
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + (err.message || 'Erro desconhecido'))
    }
    setSaving(false)
  }

  function handleCopy() {
    const url = dominio || dominioAtual
    const linkDivulgacao = `${url}/divulgar`
    navigator.clipboard.writeText(linkDivulgacao)
    toast.success('Link copiado!')
  }

  if (loading) {
    return <div className="text-center py-8 text-[#A0A0B0]">Carregando...</div>
  }

  const linkPreview = `${dominio || dominioAtual}/divulgar`

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
        <Globe size={22} className="text-[#F4D03F]" />
        Configurar Domínio
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuração */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white/80">URL do seu site</h3>
          
          <div className="bg-[#1A1528] rounded-2xl p-4 border border-white/10">
            <label className="block text-xs text-[#A0A0B0] mb-2">Domínio personalizado</label>
            <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#F4D03F] transition">
              <Globe size={18} className="text-[#A0A0B0] shrink-0" />
              <input
                type="url"
                placeholder="https://obaleva.com.br"
                className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
                value={dominio}
                onChange={e => setDominio(e.target.value)}
              />
            </div>
            <p className="text-xs text-[#A0A0B0] mt-2">
              Insira a URL completa (ex: https://obaleva.com.br)
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={saving}
            className="btn-premium px-6 py-3 flex items-center gap-2 w-full justify-center"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar Domínio'}
          </motion.button>

          <div className="bg-[#1A1528]/50 rounded-2xl p-4 border border-white/10">
            <h4 className="text-xs font-semibold text-white/70 mb-2">Link de divulgação gerado:</h4>
            <div className="flex items-center gap-2 bg-[#0F0B1A] rounded-xl px-4 py-3">
              <code className="text-sm text-[#F4D03F] flex-1 truncate">
                {linkPreview}
              </code>
              <button
                onClick={handleCopy}
                className="text-[#A0A0B0] hover:text-white transition shrink-0"
                title="Copiar link"
              >
                <Copy size={16} />
              </button>
              <a
                href={linkPreview}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#A0A0B0] hover:text-white transition shrink-0"
                title="Abrir em nova aba"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Guia Vercel */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white/80">Guia Vercel</h3>
          
          <div className="bg-[#1A1528] rounded-2xl p-5 border border-white/10 space-y-4">
            {/* Passo a passo com prints mentais */}
            <div className="bg-[#0F0B1A] rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-bold text-sm mb-3">Passo a passo para adicionar domínio na Vercel:</h4>
              
              <ol className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="bg-[#F4D03F] text-[#1E1E2F] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">1</span>
                  <div>
                    <p className="text-white font-medium">Acesse o painel da Vercel</p>
                    <a 
                      href="https://vercel.com" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#F4D03F] hover:underline flex items-center gap-1 mt-1 text-xs"
                    >
                      <LinkIcon size={12} />
                      vercel.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="bg-[#F4D03F] text-[#1E1E2F] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">2</span>
                  <div>
                    <p className="text-white font-medium">Clique no seu projeto</p>
                    <p className="text-[#A0A0B0] text-xs mt-1">Encontre o projeto "obaleva" na lista de projetos.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="bg-[#F4D03F] text-[#1E1E2F] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">3</span>
                  <div>
                    <p className="text-white font-medium">Vá em Settings (Configurações)</p>
                    <p className="text-[#A0A0B0] text-xs mt-1">Menu superior: <strong className="text-white">Overview {'>'} Deployments {'>'} Settings</strong></p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="bg-[#F4D03F] text-[#1E1E2F] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">4</span>
                  <div>
                    <p className="text-white font-medium">Clique em "Domains"</p>
                    <p className="text-[#A0A0B0] text-xs mt-1">No menu lateral esquerdo, clique em <strong className="text-white">Domains</strong>.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="bg-[#F4D03F] text-[#1E1E2F] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">5</span>
                  <div>
                    <p className="text-white font-medium">Digite seu domínio e clique em "Add"</p>
                    <p className="text-[#A0A0B0] text-xs mt-1">Exemplo: <code className="text-[#F4D03F]">obaleva.com.br</code></p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="bg-[#F4D03F] text-[#1E1E2F] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">6</span>
                  <div>
                    <p className="text-white font-medium">Copie as configurações DNS que aparecerem</p>
                    <p className="text-[#A0A0B0] text-xs mt-1">A Vercel vai mostrar registros CNAME e/ou A para você adicionar no seu provedor de domínio.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="bg-[#F4D03F] text-[#1E1E2F] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">7</span>
                  <div>
                    <p className="text-white font-medium">Configure o DNS no seu provedor</p>
                    <p className="text-[#A0A0B0] text-xs mt-1">Vá no site onde você comprou o domínio (Registro.br, GoDaddy, etc.) e adicione os registros que a Vercel pediu.</p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="bg-[#F4D03F] text-[#1E1E2F] w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">8</span>
                  <div>
                    <p className="text-white font-medium">Aguarde a propagação (5 min a 24h)</p>
                    <p className="text-[#A0A0B0] text-xs mt-1">A Vercel vai emitir um certificado SSL automático. Quando aparecer "Valid" no Domains, está pronto!</p>
                  </div>
                </li>
              </ol>
            </div>

            <div className="bg-[#0F0B1A] rounded-xl p-4 border border-yellow-500/20">
              <p className="text-yellow-400 font-medium text-sm mb-1">⚠️ Importante</p>
              <p className="text-[#A0A0B0] text-xs">
                Se você usa <strong className="text-white">Cloudflare</strong>, desative o proxy (laranja {'>'} cinza) nos registros DNS para funcionar com a Vercel.
              </p>
            </div>

            <div className="bg-[#0F0B1A] rounded-xl p-4 border border-white/10">
              <p className="text-white font-medium text-sm mb-1">📹 Prefere vídeo?</p>
              <a 
                href="https://www.youtube.com/results?search_query=como+adicionar+dominio+na+vercel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#F4D03F] hover:underline flex items-center gap-1 text-xs"
              >
                <ExternalLink size={12} />
                Pesquise no YouTube: "como adicionar domínio na Vercel"
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}