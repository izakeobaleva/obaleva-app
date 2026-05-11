interface UploadFileProps {
  onUpload: (url: string) => void
  accept?: string
}

export const UploadFile: React.FC<UploadFileProps> = ({ onUpload, accept = 'image/*' }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fakeUrl = URL.createObjectURL(file)
      onUpload(fakeUrl)
    }
  }
  return (
    <div className="border-2 border-dashed border-roxo-principal p-4 rounded-xl text-center cursor-pointer">
      <input type="file" accept={accept} onChange={handleFileChange} className="w-full" />
      <p className="text-sm">Clique ou arraste para enviar documento/foto</p>
    </div>
  )
}