import { useState } from 'react'
import { Upload } from 'lucide-react'

interface UploadFileProps {
  onUpload: (url: string) => void
  label?: string
}

export function UploadFile({ onUpload, label = 'Upload' }: UploadFileProps) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(file)
      onUpload(fakeUrl)
      setUploading(false)
    }, 1000)
  }

  return (
    <div>
      <label className="block text-white/80 text-sm font-medium mb-1">{label}</label>
      <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white cursor-pointer hover:bg-white/20 transition">
        <Upload size={18} className="text-amarelo-oba" />
        <span className="flex-1 text-sm text-white/70">
          {uploading ? 'Enviando...' : 'Clique para selecionar arquivo'}
        </span>
        <input type="file" onChange={handleFileChange} disabled={uploading} className="hidden" />
      </label>
    </div>
  )
}