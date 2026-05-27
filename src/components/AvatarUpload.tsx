import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Camera, Image as ImageIcon, Upload, CheckCircle, Loader, X } from 'lucide-react';
import { toast } from 'sonner';

export function AvatarUpload({ onComplete }: { onComplete?: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [usingCamera, setUsingCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const abrirCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setUsingCamera(true);
    } catch (err) {
      toast.error('Permita o acesso à câmera para tirar foto');
    }
  };

  const tirarFoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        setFotoBlob(blob);
        setFotoPreview(URL.createObjectURL(blob));
      }
    }, 'image/jpeg', 0.9);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setUsingCamera(false);
  };

  const selecionarGaleria = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione apenas imagens');
      return;
    }
    setFotoBlob(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const fazerUpload = async () => {
    if (!fotoBlob) { toast.error('Tire ou selecione uma foto primeiro'); return; }
    if (!user) { toast.error('Faça login primeiro'); return; }

    setUploading(true);
    const timestamp = Date.now();
    const filePath = `${user.id}/avatar-${timestamp}.jpg`;

    try {
      // Upload
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, fotoBlob, { contentType: 'image/jpeg', cacheControl: '3600', upsert: true });

      if (error) throw error;

      // URL pública
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // Salvar no perfil
      const { error: perfilError } = await supabase
        .from('usuarios')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (perfilError) throw perfilError;

      toast.success('✅ Foto salva com sucesso!');
      if (onComplete) onComplete();
    } catch (err: any) {
      toast.error('Erro ao salvar: ' + (err.message || 'Erro desconhecido'));
    }
    setUploading(false);
  };

  const cancelarCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setUsingCamera(false);
  };

  return (
    <div className="text-center space-y-4">
      {/* Câmera ao vivo */}
      {usingCamera && (
        <div className="relative bg-black rounded-2xl overflow-hidden max-w-sm mx-auto">
          <video ref={videoRef} className="w-full aspect-square object-cover" playsInline />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button onClick={tirarFoto} className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition">
              <Camera size={28} className="text-gray-900" />
            </button>
            <button onClick={cancelarCamera} className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg">
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* Preview da foto tirada */}
      {fotoPreview && !usingCamera && (
        <div className="relative inline-block">
          <img src={fotoPreview} alt="Preview" className="w-40 h-40 rounded-full object-cover border-4 border-[#F4D03F] shadow-xl mx-auto" />
          <button onClick={() => { setFotoBlob(null); setFotoPreview(null); }} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Botões de ação (quando não está com câmera aberta) */}
      {!usingCamera && (
        <div className="flex justify-center gap-3">
          <button onClick={abrirCamera} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1A1528] border border-white/10 hover:border-[#F4D03F]/50 transition w-28">
            <Camera size={28} className="text-[#F4D03F]" />
            <span className="text-xs text-white">Tirar Foto</span>
          </button>
          <button onClick={selecionarGaleria} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1A1528] border border-white/10 hover:border-[#F4D03F]/50 transition w-28">
            <ImageIcon size={28} className="text-[#F4D03F]" />
            <span className="text-xs text-white">Galeria</span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </div>
      )}

      {/* Botão salvar */}
      {fotoBlob && !usingCamera && (
        <button onClick={fazerUpload} disabled={uploading || !user}
          className="w-full max-w-xs mx-auto py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploading ? <><Loader size={18} className="animate-spin" /> Salvando...</> : <><Upload size={18} /> Salvar Foto</>}
        </button>
      )}

      {/* Info do usuário logado */}
      {user && (
        <p className="text-[10px] text-[#A0A0B0]">
          ✅ Conta: {user.email}
        </p>
      )}
    </div>
  );
}