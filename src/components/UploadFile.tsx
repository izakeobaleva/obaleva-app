import { useState } from 'react'
import { Upload } from 'lucide-react'

interface UploadFileProps {
  onUpload: (url: string) => void
  accept?: string
  label?: string
}

export function UploadFile({ onUpload, accept = 'image/*', label = 'Upload' }: UploadFileProps) {
  const [uploading, setUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      setTimeout(() => {
        onUpload(URL.createObjectURL(file))
        setUploading(false)
      }, 500)
    }
  }

  return (
    <div className="border-2 border-dashed border-[#F4D03F]/50 bg-[#0F0B1A] p-6 rounded-2xl text-center hover:border-[#F4D03F] transition cursor-pointer">
      <input type="file" accept={accept} onChange={handleChange} className="hidden" id="file-upload" />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
        <Upload className="text-[#F4D03F]" size={24} />
        <p className="text-sm text-[#A0A0B0]">{uploading ? 'Enviando...' : 'Clique para enviar'}</p>
        {label && <p className="text-xs text-white/50">{label}</p>}
      </label>
    </div>
  )
}