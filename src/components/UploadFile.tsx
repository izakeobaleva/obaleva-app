import { useState } from 'react'

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
    // Simula upload - em produção, enviar para o Supabase Storage
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(file)
      onUpload(fakeUrl)
      setUploading(false)
    }, 1000)
  }

  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input type="file" onChange={handleFileChange} disabled={uploading} className="w-full p-2 border rounded" />
      {uploading && <p className="text-sm text-gray-500 mt-1">Enviando...</p>}
    </div>
  )
}