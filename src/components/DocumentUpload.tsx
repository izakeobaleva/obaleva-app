import { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface DocumentUploadProps {
  label: string; description: string; acceptedFiles: string;
  value: string | null; onChange: (url: string | null) => void;
  error?: string;
}

export function DocumentUpload({ label, description, acceptedFiles, value, onChange, error }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo muito grande. Máximo 5MB.');
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
    } catch {
      alert('Erro ao processar arquivo');
    }
    setUploading(false);
  };

  function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const showError = error && !value;

  return (
    <div className="space-y-1">
      <label className="block text-white/80 text-xs">{label}</label>
      <p className="text-[#A0A0B0] text-[10px] mb-1">{description}</p>

      {value ? (
        <div className="bg-green-900/30 border border-green-500/30 rounded-2xl p-2.5 flex items-center gap-2">
          <FileText size={16} className="text-green-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-green-400 font-medium truncate">Documento anexado</p>
            {value.startsWith('data:image') && (
              <img src={value} alt="Preview" className="mt-1 max-h-20 rounded-lg object-contain bg-[#0F0B1A]" />
            )}
          </div>
          <button type="button" onClick={() => onChange(null)} className="text-green-400 hover:text-red-400 transition shrink-0">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className={`border-2 border-dashed rounded-2xl p-3 text-center transition ${showError ? 'border-red-500/50 bg-red-500/5' : 'border-white/20 hover:border-[#F4D03F]/50 bg-[#0F0B1A]'}`}>
          <label className="cursor-pointer flex flex-col items-center gap-1.5">
            {uploading ? (
              <div className="animate-spin h-6 w-6 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
            ) : (
              <>
                <Upload size={18} className={showError ? 'text-red-400' : 'text-[#F4D03F]'} />
                <p className="text-xs text-white font-medium">{showError ? error : 'Clique para enviar'}</p>
                <p className="text-[10px] text-[#A0A0B0]">{acceptedFiles.split(',').join(', ')} • Máx 5MB</p>
              </>
            )}
            <input type="file" accept={acceptedFiles} className="hidden" disabled={uploading} onChange={handleFile} />
          </label>
        </div>
      )}
    </div>
  );
}