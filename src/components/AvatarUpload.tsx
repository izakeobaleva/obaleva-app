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
  const [fotoPreview, setFotoPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Preview local
    const reader = new FileReader();
    reader.onload = (event) => {
      setFotoPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    setUploadStatus('selecionada');

    // Pega userId
    let userId = propUserId;
    if (!userId) {
      const { data } = await supabase.auth.getUser();
      if (data.user) userId = data.user.id;
    }

    if (!userId) {
      toast.error('Faça login para enviar foto');
      return;
    }

    // Upload
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

      toast.success('Foto salva!');
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

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={`${sizeClasses[size]} rounded-full relative overflow-hidden bg-[#1A1528] border-2 border-dashed border-[#F4D03F]/50 hover:border-[#F4D03F] hover:bg-[#2D2342] transition-all flex items-center justify-center cursor-pointer ${uploading ? 'opacity-50' : ''}`}
      >
        {fotoPreview || currentUrl ? (
          <img
            src={fotoPreview || currentUrl || ''}
            alt="Foto de perfil"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <Camera size={size === 'sm' ? 20 : 32} className="text-[#F4D03F]" />
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
            <Loader className="animate-spin w-6 h-6 text-white" />
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {uploadStatus === 'sucesso' && (
        <div className="bg-green-900/20 border border-green-500/30 rounded-xl px-4 py-2">
          <p className="text-sm text-green-400">Foto salva com sucesso!</p>
        </div>
      )}

      {uploadStatus === 'erro' && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-2">
          <p className="text-sm text-red-400">Erro ao enviar foto</p>
        </div>
      )}
    </div>
  );
}