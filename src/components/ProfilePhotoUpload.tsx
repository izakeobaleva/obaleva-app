import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export function ProfilePhotoUpload({ userId, currentPhotoUrl, onPhotoUploaded, size = 'lg' }: ProfilePhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) { toast.error('Apenas imagens'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Máximo 5MB'); return; }

    const reader = new FileReader();
    reader.onload = (event) => setPreviewUrl(event.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fileName = `${userId}_${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(data.path);
      setPreviewUrl(publicUrl.publicUrl);
      onPhotoUploaded(publicUrl.publicUrl);
      toast.success('📸 Foto atualizada!');
    } catch (err: any) {
      toast.error('Erro: ' + (err.message || 'Erro desconhecido'));
      setPreviewUrl(currentPhotoUrl || null);
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className={`${sizeClasses[size]} rounded-full relative overflow-hidden 
          bg-[#1A1528] border-2 border-dashed border-[#F4D03F]/50 
          hover:border-[#F4D03F] hover:bg-[#2D2342] 
          transition-all duration-200 flex items-center justify-center
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Foto" className="w-full h-full object-cover rounded-full" />
        ) : (
          <Camera size={size === 'sm' ? 20 : 32} className="text-[#F4D03F]" />
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
          </div>
        )}
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
    </div>
  );
}