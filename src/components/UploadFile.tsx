<<<<<<< HEAD
import React from 'react'
=======
import { useState } from 'react'
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780
import { Upload } from 'lucide-react'

interface UploadFileProps {
  onUpload: (url: string) => void
<<<<<<< HEAD
  accept?: string
}

export const UploadFile: React.FC<UploadFileProps> = ({ onUpload, accept = 'image/*' }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onUpload(URL.createObjectURL(file))
  }
  return (
    <div className="border-2 border-dashed border-[#F4D03F]/50 bg-[#0F0B1A] p-6 rounded-2xl text-center hover:border-[#F4D03F] transition cursor-pointer">
      <input type="file" accept={accept} onChange={handleChange} className="hidden" id="file-upload" />
      <label htmlFor="file-upload" className="cursor-pointer">
        <Upload className="mx-auto text-[#F4D03F] mb-2" size={24} />
        <p className="text-sm text-[#A0A0B0]">Clique para enviar</p>
=======
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
      <label className="flex items-center gap-3 w-full px-5 py-3 rounded-2xl bg-[#1A1528] border border-white/10 text-white cursor-pointer hover:bg-white/10 transition">
        <Upload size={18} className="text-[#F4D03F]" />
        <span className="flex-1 text-sm text-white/50">
          {uploading ? 'Enviando...' : 'Clique para selecionar arquivo'}
        </span>
        <input type="file" onChange={handleFileChange} disabled={uploading} className="hidden" />
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780
      </label>
    </div>
  )
}