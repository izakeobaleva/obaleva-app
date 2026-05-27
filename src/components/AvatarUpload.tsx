import { useState, useRef } from 'react';
import { Camera, User, Loader } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

interface AvatarUploadProps {
  userId: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

export function AvatarUpload({ userId, currentUrl, onUpload, size = 'lg', editable = true }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 14,
    md: 22,
    lg: 32,
  };

  const cameraSize = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione uma imagem válida');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande (máx 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${userId}/${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      setPreview(publicUrl);
      onUpload(publicUrl);
      toast.success('✅ Foto salva!');
    } catch (err: any) {
      toast.error('Erro ao enviar: ' + (err.message || 'Erro'));
      setPreview(currentUrl || null);
    }
    setUploading(false);
  };

  return (
    <div className="relative inline-block">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-[#1A1528] border-2 border-[#F4D03F]/30 flex items-center justify-center`}>
        {preview ? (
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <User size={iconSizes[size]} className="text-[#F4D03F]/60" />
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
            <Loader size={20} className="animate-spin text-[#F4D03F]" />
          </div>
        )}
      </div>

      {editable && (
        <>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`absolute bottom-0 right-0 ${cameraSize[size]} rounded-full bg-[#F4D03F] border-2 border-[#1E1E2F] flex items-center justify-center hover:bg-[#FFD966] transition shadow-lg ${uploading ? 'opacity-50' : ''}`}
            title="Trocar foto"
          >
            <Camera size={size === 'sm' ? 10 : 14} className="text-[#1E1E2F]" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFile}
          />
        </>
      )}
    </div>
  );
}