import React from 'react'
import { Upload } from 'lucide-react'

interface UploadFileProps {
  onUpload: (url: string) => void
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
      </label>
    </div>
  )
}