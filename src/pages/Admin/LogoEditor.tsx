import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Image, Upload, Trash2, Eye } from 'lucide-react'
import { uploadFile } from '../../lib/uploadHelpers'

export default function LogoEditor() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLogo()
  }, [])

  async function loadLogo() {
    setLoading(true)
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'app_logo')
      .maybeSingle()
    
    if (data?.value) {
      setLogoUrl(data.value)
    }
    setLoading(false)
  }

  async function handleUpload(file: File) {
    setUploading(true)
    try {
      const url = await uploadFile('logos', file, `logo_`)
      
      // Salvar no Supabase
      const { error } = await supabase
        .from('app_config')
        .upsert({ key: 'app_logo', value: url, updated_at: new Date().toISOString() })
      
      if (error) throw error
      
      setLogoUrl(url)
      toast.success('Logo atualizado com sucesso!')
      
      // Disparar evento para outras abas atualizarem
      localStorage.setItem('app_logo_updated', Date.now().toString())
    } catch (err: any) {
      toast.error('Erro ao enviar logo: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove() {
    const { error } = await supabase
      .from('app_config')
      .delete()
      .eq('key', 'app_logo')
    
    if (error) {
      toast.error('Erro ao remover logo')
    } else {
      setLogoUrl(null)
      localStorage.setItem('app_logo_updated', Date.now().toString())
      toast.success('Logo removido!')
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-[#A0A0B0]">Carregando...</div>
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
        <Image size={22} className="text-[#F4D03F]" />
        Logo do Aplicativo
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload / Preview atual */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white/80">Logo atual</h3>
          <div className="bg-[#1A1528] rounded-2xl border border-white/10 p-8 flex items-center justify-center min-h-[200px]">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="Logo do app" 
                className="max-w-[200px] max-h-[120px] object-contain"
              />
            ) : (
              <div className="text-center text-[#A0A0B0]">
                <Image size={48} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhum logo definido</p>
                <p className="text-xs mt-1">O ícone padrão será usado</p>
              </div>
            )}
          </div>

          {logoUrl && (
            <div className="flex gap-2">
              <button
                onClick={() => window.open(logoUrl, '_blank')}
                className="btn-outline-dark px-4 py-2 text-sm flex items-center gap-2"
              >
                <Eye size={16} />
                Visualizar
              </button>
              <button
                onClick={handleRemove}
                className="px-4 py-2 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm flex items-center gap-2"
              >
                <Trash2 size={16} />
                Remover
              </button>
            </div>
          )}
        </div>

        {/* Upload */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white/80">Enviar novo logo</h3>
          <div className="bg-[#1A1528] rounded-2xl border border-dashed border-white/20 p-8 text-center">
            <label className="cursor-pointer flex flex-col items-center gap-3">
              <Upload size={32} className="text-[#F4D03F]" />
              <div>
                <p className="text-white font-medium">
                  {uploading ? 'Enviando...' : 'Clique para selecionar'}
                </p>
                <p className="text-xs text-[#A0A0B0] mt-1">
                  PNG, JPG ou SVG • Máx 2MB
                </p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                className="hidden"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (file.size > 2 * 1024 * 1024) {
                      toast.error('Arquivo muito grande! Máximo 2MB')
                      return
                    }
                    await handleUpload(file)
                  }
                }}
              />
            </label>
          </div>

          <div className="bg-[#1A1528]/50 rounded-2xl p-4 border border-white/10">
            <h4 className="text-xs font-semibold text-white/70 mb-2">Prévia no login</h4>
            <div className="bg-[#0F0B1A] rounded-xl p-4 flex items-center justify-center min-h-[80px]">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Preview" 
                  className="max-w-[120px] max-h-[60px] object-contain"
                />
              ) : (
                <div className="flex items-center gap-2 text-[#A0A0B0]">
                  <Image size={20} className="text-[#F4D03F]" />
                  <span className="text-xs">Ícone padrão</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}