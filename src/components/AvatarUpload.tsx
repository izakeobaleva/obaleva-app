import { useState, useRef } from 'react';
import { Camera, Upload, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

interface AvatarUploadProps {
  userId?: string;
  currentUrl?: string | null;
  onUpload?: (url: string) => void;
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export function AvatarUpload({ userId: propUserId, currentUrl, onUpload, onComplete, size = 'lg' }: AvatarUploadProps) {
  const [user, setUser] = useState<any>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, isSelfie: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Máximo 5MB');
      return;
    }

    setFotoPreview(URL.createObjectURL(file));
    setUploadStatus('selecionada');

    // Se não tem userId, tenta pegar do auth
    let userId = propUserId;
    if (!userId) {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        userId = data.user.id;
        setUser(data.user);
      }
    }

    if (!userId) {
      toast.error('Faça login para enviar foto');
      return;
    }

    // Upload automático
    setUploading(true);
    setUploadStatus('enviando');

    try {
      const filePath = `${userId}/avatar-${Date.now()}.jpg`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('usuarios')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', userId);

      toast.success('✅ Foto salva!');
      setUploadStatus('sucesso');
      
      if (onUpload) onUpload(publicUrl);
      
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 1000);

    } catch (err: any) {
      toast.error('Erro: ' + err.message);
      setUploadStatus('erro');
    }
    setUploading(false);
    e.target.value = '';
  };

  const resetar = () => {
    if (fotoPreview && !currentUrl) URL.revokeObjectURL(fotoPreview);
    setFotoPreview(currentUrl || null);
    setUploadStatus(null);
  };

  const handleSelfie = () => {
    // Tenta abrir câmera frontal primeiro
    if (selfieRef.current) {
      selfieRef.current.setAttribute('capture', 'user');
      selfieRef.current.click();
    }
  };

  const handleGaleria = () => {
    if (inputRef.current) {
      inputRef.current.removeAttribute('capture');
      inputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview */}
      {fotoPreview && (
        <div className="relative">
          <img 
            src={fotoPreview} 
            alt="Preview" 
            className={`${sizeClasses[size]} rounded-full object-cover border-4 border-[#F4D03F] shadow-lg`}
          />
          {uploadStatus !== 'sucesso' && (
            <button 
              onClick={resetar}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full text-white text-xs flex items-center justify-center hover:bg-red-600 transition shadow"
              title="Remover foto"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Status */}
      {uploadStatus === 'enviando' && (
        <div className="bg-blue-900/20 rounded-2xl p-4 border border-blue-500/30 text-center w-full max-w-xs">
          <Loader className="animate-spin mx-auto mb-2" size={24} />
          <p className="text-sm text-white">Enviando...</p>
        </div>
      )}

      {uploadStatus === 'sucesso' && (
        <div className="bg-green-900/20 rounded-2xl p-4 border border-green-500/30 text-center w-full max-w-xs">
          <CheckCircle size={24} className="text-green-400 mx-auto mb-2" />
          <p className="text-sm text-green-400">✅ Foto salva com sucesso!</p>
        </div>
      )}

      {uploadStatus === 'erro' && (
        <div className="bg-red-900/20 rounded-2xl p-4 border border-red-500/30 text-center w-full max-w-xs">
          <AlertTriangle size={24} className="text-red-400 mx-auto mb-2" />
          <p className="text-sm text-red-400">Erro ao enviar</p>
          <button onClick={() => setUploadStatus(null)} className="mt-2 text-xs bg-white/10 text-white px-3 py-1.5 rounded-xl">
            Tentar novamente
          </button>
        </div>
      )}

      {/* Botões de seleção */}
      {!fotoPreview && uploadStatus !== 'enviando' && uploadStatus !== 'sucesso' && (
        <div className="flex justify-center gap-4 w-full max-w-xs">
          <button
            onClick={handleSelfie}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1A1528] border-2 border-dashed border-white/20 hover:border-[#F4D03F] hover:bg-[#2D2342] transition-all w-28 cursor-pointer"
          >
            <Camera size={28} className="text-[#F4D03F]" />
            <span className="text-sm text-white font-medium">Selfie</span>
            <span className="text-[10px] text-[#A0A0B0]">Câmera frontal</span>
          </button>
          <button
            onClick={handleGaleria}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1A1528] border-2 border-dashed border-white/20 hover:border-[#F4D03F] hover:bg-[#2D2342] transition-all w-28 cursor-pointer"
          >
            <Upload size={28} className="text-[#F4D03F]" />
            <span className="text-sm text-white font-medium">Galeria</span>
            <span className="text-[10px] text-[#A0A0B0]">Escolher foto</span>
          </button>
        </div>
      )}

      {/* Input oculto para selfie (câmera frontal) */}
      <input
        ref={selfieRef}
        type="file"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => handleFile(e, true)}
      />

      {/* Input oculto para galeria */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e, false)}
      />

      {fotoPreview && uploadStatus === 'selecionada' && (
        <p className="text-xs text-[#A0A0B0]">Foto selecionada. Aguarde o upload automático...</p>
      )}
    </div>
  );
}