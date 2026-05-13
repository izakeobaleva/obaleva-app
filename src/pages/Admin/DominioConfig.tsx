dentro do JSX">
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'
import { Globe, Save, ExternalLink, Copy } from 'lucide-react'
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

        {/* Preview / Ajuda */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white/80">Como configurar</h3>
          
          <div className="bg-[#1A1528] rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F4D03F]/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#F4D03F] font-bold text-sm">1</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Adquira um domínio</p>
                <p className="text-xs text-[#A0A0B0] mt-1">
                  Compre em serviços como GoDaddy, HostGator, Registro.br ou Cloudflare.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F4D03F]/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#F4D03F] font-bold text-sm">2</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Aponte o DNS para a Vercel</p>
                <p className="text-xs text-[#A0A0B0] mt-1">
                  No painel do seu domínio, crie um registro CNAME apontando para cname.vercel-dns.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F4D03F]/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#F4D03F] font-bold text-sm">3</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Adicione na Vercel</p>
                <p className="text-xs text-[#A0A0B0] mt-1">
                  Acesse: Vercel.com {'>'} Projeto obaleva {'>'} Settings {'>'} Domains
                  <br />
                  Adicione seu domínio e siga as instruções.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F4D03F]/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[#F4D03F] font-bold text-sm">4</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Salve aqui no painel</p>
                <p className="text-xs text-[#A0A0B0] mt-1">
                  Volte aqui, digite seu domínio e clique em salvar. Pronto!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}