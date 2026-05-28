import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Camera, Upload, Loader, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function AvatarUpload({ onComplete }: { onComplete?: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [fotoArquivo, setFotoArquivo] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setDebugInfo(data.user ? `User: ${data.user.email}` : 'Sem user');
    });
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDebugInfo(`📸 ${file.name} - ${(file.size / 1024).toFixed(1)}KB`);

    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Máximo 5MB');
      return;
    }

    setFotoArquivo(file);
    setFotoPreview(URL.createObjectURL(file));
    setUploadStatus('selecionada');
    e.target.value = '';
  };

  const uploadDireto = async () => {
    if (!fotoArquivo || !user) {
      toast.error('Selecione uma foto');
      return;
    }

    setUploading(true);
    setUploadStatus('enviando');
    setDebugInfo('🔄 Enviando...');

    try {
      const filePath = `${user.id}/avatar-${Date.now()}.jpg`;
      
      // Usar o arquivo original (já validamos que é pequeno)
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, fotoArquivo, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('usuarios')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      toast.success('✅ Foto salva!');
      setUploadStatus('sucesso');
      setDebugInfo('✅ OK!');
      
      setTimeout(() => {
        setFotoArquivo(null);
        setFotoPreview(null);
        setUploadStatus(null);
        if (onComplete) onComplete();
      }, 1500);

    } catch (err: any) {
      setDebugInfo(`❌ ${err.message}`);
      toast.error('Erro: ' + err.message);
      setUploadStatus('erro');
    }
    setUploading(false);
  };

  const resetar = () => {
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoArquivo(null);
    setFotoPreview(null);
    setUploadStatus(null);
    setDebugInfo('');
  };

  return (
    <div className="text-center space-y-4">
      {/* Debug */}
      {debugInfo && (
        <div className="bg-[#0F0B1A] rounded-xl p-2 border border-white/10">
          <p className="text-[10px] text-[#A0A0B0] font-mono">{debugInfo}</p>
        </div>
      )}

      {/* Preview */}
      {fotoPreview && (
        <div className="relative inline-block">
          <img src={fotoPreview} alt="" className="w-32 h-32 rounded-full object-cover border-4 border-[#F4D03F]" />
          <button onClick={resetar} className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 rounded-full text-white text-xs">✕</button>
        </div>
      )}

      {/* Status */}
      {uploadStatus === 'enviando' && (
        <div className="bg-blue-900/20 rounded-2xl p-4 border border-blue-500/30">
          <Loader className="animate-spin mx-auto mb-2" size={24} />
          <p className="text-sm text-white">Enviando...</p>
        </div>
      )}

      {uploadStatus === 'sucesso' && (
        <div className="bg-green-900/20 rounded-2xl p-4 border border-green-500/30">
          <CheckCircle size={24} className="text-green-400 mx-auto mb-2" />
          <p className="text-sm text-green-400">✅ Salvo!</p>
        </div>
      )}

      {uploadStatus === 'erro' && (
        <div className="bg-red-900/20 rounded-2xl p-4 border border-red-500/30">
          <AlertTriangle size={24} className="text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-400">Erro</p>
          <button onClick={() => setUploadStatus('selecionada')} className="mt-2 text-xs bg-white/10 text-white px-3 py-1 rounded-xl">
            Tentar de novo
          </button>
        </div>
      )}

      {/* Botões */}
      {!fotoPreview && uploadStatus !== 'enviando' && (
        <div className="flex justify-center gap-4">
          <button onClick={() => cameraRef.current?.click()} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1A1528] border-2 border-dashed border-white/20 hover:border-[#F4D03F] w-28 cursor-pointer">
            <Camera size={28} className="text-[#F4D03F]" />
            <span className="text-sm text-white">Selfie</span>
          </button>
          <button onClick={() => inputRef.current?.click()} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1A1528] border-2 border-dashed border-white/20 hover:border-[#F4D03F] w-28 cursor-pointer">
            <Upload size={28} className="text-[#F4D03F]" />
            <span className="text-sm text-white">Galeria</span>
          </button>
        </div>
      )}

      {fotoPreview && uploadStatus === 'selecionada' && (
        <button onClick={uploadDireto} disabled={uploading} className="w-full max-w-xs mx-auto py-3 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] flex items-center justify-center gap-2 cursor-pointer">
          {uploading ? <Loader size={18} className="animate-spin" /> : <Upload size={18} />}
          {uploading ? 'Enviando...' : 'Salvar Foto'}
        </button>
      )}

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}