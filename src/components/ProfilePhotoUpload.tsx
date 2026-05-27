import { useState, useRef } from 'react';
import { Camera, User, Upload } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

interface ProfilePhotoUploadProps {
  userId: string;
  currentPhotoUrl?: string | null;
  onPhotoUploaded: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function ProfilePhotoUpload({ userId, currentPhotoUrl, onPhotoUploaded, size = 'lg' }: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 20,
    md: 28,
    lg: 36,
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validações
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione apenas imagens (JPG, PNG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande! Máximo 5MB');
      return;
    }

    // Preview instantâneo (antes do upload)
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload para o Supabase
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Pegar URL pública
      const { data: publicUrl } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      const photoUrl = publicUrl.publicUrl;
      setPreviewUrl(photoUrl);
      onPhotoUploaded(photoUrl);
      toast.success('📸 Foto atualizada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err);
      toast.error('Erro ao enviar foto: ' + (err.message || 'Erro desconhecido'));
      // Reverter preview em caso de erro
      setPreviewUrl(currentPhotoUrl || null);
    }
    setUploading(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Botão circular para foto */}
      <button
        onClick={triggerFileInput}
        disabled={uploading}
        className={`${sizeClasses[size]} rounded-full relative overflow-hidden 
          bg-[#1A1528] border-2 border-dashed border-[#F4D03F]/50 
          hover:border-[#F4D03F] hover:bg-[#2D2342] 
          transition-all duration-200 flex items-center justify-center
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {previewUrl ? (
          <>
            <img 
              src={previewUrl} 
              alt="Foto de perfil" 
              className="w-full h-full object-cover rounded-full"
            />
            {/* Overlay na hover */}
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera size={iconSizes[size]} className="text-white" />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Camera size={iconSizes[size]} className="text-[#F4D03F]" />
            <span className="text-[10px] text-[#A0A0B0] font-medium">
              {uploading ? 'Enviando...' : 'Adicionar foto'}
            </span>
          </div>
        )}

        {/* Loading spinner */}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
          </div>
        )}
      </button>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Texto auxiliar */}
      <p className="text-[10px] text-[#A0A0B0] text-center max-w-[200px]">
        {previewUrl 
          ? 'Clique na foto para alterar' 
          : 'Toque para tirar uma foto ou escolher da galeria'}
      </p>
    </div>
  );
}