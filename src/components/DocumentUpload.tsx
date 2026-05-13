import { useState } from 'react'
import { Upload, FileText, CheckCircle, X, AlertCircle } from 'lucide-react'

interface DocumentUploadProps {
  label: string
  description: string
  acceptedFiles: string
  value: string | null
  onChange: (url: string | null) => void
}

export function DocumentUpload({ label, description, acceptedFiles, value, onChange }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    
    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5MB.')
      return
    }

    setUploading(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      onChange(dataUrl)
    } catch {
      setError('Erro ao processar arquivo')
    }
    setUploading(false)
  }

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm text-white/80 font-medium">{label}</label>
      <p className="text-xs text-[#A0A0B0]">{description}</p>

      {value ? (
        <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-3 flex items-center gap-3">
          <FileText size={20} className="text-green-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-green-400 font-medium truncate">Documento anexado</p>
            <p className="text-xs text-green-400/70">Clique para visualizar</p>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-green-400 hover:text-red-400 transition shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className={`border-2 border-dashed rounded-2xl p-4 text-center transition ${
          error ? 'border-red-500/50 bg-red-500/5' : 'border-white/20 hover:border-[#F4D03F]/50 bg-[#0F0B1A]'
        }`}>
          <label className="cursor-pointer flex flex-col items-center gap-2">
            {uploading ? (
              <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload size={24} className={error ? 'text-red-400' : 'text-[#F4D03F]'} />
                <div>
                  <p className="text-sm text-white font-medium">
                    {error ? error : 'Clique para fazer upload'}
                  </p>
                  <p className="text-xs text-[#A0A0B0] mt-1">
                    {acceptedFiles.split(',').join(', ')} • Máx 5MB
                  </p>
                </div>
              </>
            )}
            <input
              type="file"
              accept={acceptedFiles}
              className="hidden"
              disabled={uploading}
              onChange={handleFile}
            />
          </label>
        </div>
      )}
    </div>
  )
}