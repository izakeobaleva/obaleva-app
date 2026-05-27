import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Camera, Image as ImageIcon, Upload, CheckCircle, Loader, X, AlertTriangle, FlipHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export function AvatarUpload({ onComplete }: { onComplete?: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [usandoCameraFrontal, setUsandoCameraFrontal] = useState(false); // Estado para controlar frente/trás

  // Refs para inputs e câmera
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  // ✅ Função para iniciar/alternar a câmera
  const iniciarCamera = async (frente: boolean) => {
    setCameraError(null);
    
    // Verifica HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      const msg = '⚠️ Câmera só funciona em HTTPS. Usando modo alternativo.';
      setCameraError(msg);
      cameraInputRef.current?.click();
      return;
    }

    // Se já tem stream ativo, para antes de trocar
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    try {
      const facingMode = frente ? 'user' : 'environment'; // 'user' = frontal, 'environment' = traseira
      console.log(`🔵 Iniciando câmera: ${frente ? 'FRONTAL (selfie)' : 'TRASEIRA'}`);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1080 }
        },
      });
      
      streamRef.current = stream;
      setUsandoCameraFrontal(frente);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log('✅ Câmera ativada com sucesso');
      }
      
      setCameraError(null);
      
    } catch (err: any) {
      console.error('❌ Erro ao acessar câmera:', err);
      
      let mensagem = 'Não foi possível abrir a câmera. ';
      if (err.name === 'NotAllowedError') mensagem += 'Permissão negada.';
      else if (err.name === 'NotFoundError') mensagem += 'Nenhuma câmera encontrada.';
      else if (err.name === 'NotReadableError') mensagem += 'Câmera em uso.';
      else mensagem += err.message;
      
      setCameraError(mensagem);
      
      // Fallback: input nativo
      cameraInputRef.current?.click();
    }
  };

  // Alternar entre frente e trás
  const alternarCamera = () => {
    iniciarCamera(!usandoCameraFrontal);
  };

  // ✅ Abrir câmera frontal (selfie)
  const abrirSelfie = () => {
    const timestamp = Date.now();
    setDebugInfo(`🤳 Selfie em ${new Date(timestamp).toLocaleTimeString()}`);
    iniciarCamera(true);
  };

  // ✅ Abrir câmera traseira
  const abrirCameraTraseira = () => {
    const timestamp = Date.now();
    setDebugInfo(`📸 Câmera traseira em ${new Date(timestamp).toLocaleTimeString()}`);
    iniciarCamera(false);
  };

  // ✅ Input nativo (sistema mostra selfie/traseira/galeria)
  const abrirSeletorNativo = () => {
    console.log('🔵 Abrindo seletor nativo do sistema');
    setDebugInfo('📱 Abrindo seletor do sistema...');
    cameraInputRef.current?.click();
  };

  // ✅ Galeria
  const abrirGaleria = () => {
    console.log('🔵 Abrindo galeria');
    setDebugInfo('🖼️ Abrindo galeria...');
    fileInputRef.current?.click();
  };

  const processarArquivo = (file: File, origem: 'camera' | 'galeria') => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione apenas imagens (JPG, PNG)');
      return;
    }

    setFotoBlob(file);
    setFotoPreview(URL.createObjectURL(file));
    setCameraError(null);
    setDebugInfo('');

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const handleCameraFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processarArquivo(file, 'camera');
    e.target.value = '';
  };

  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processarArquivo(file, 'galeria');
    e.target.value = '';
  };

  const tirarFotoManual = () => {
    if (!videoRef.current || !canvasRef.current || !streamRef.current) return;
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      
      // Se for câmera frontal, espelha a imagem horizontalmente (efeito espelho)
      if (usandoCameraFrontal) {
        ctx?.translate(canvas.width, 0);
        ctx?.scale(-1, 1);
      }
      
      ctx?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setFotoBlob(blob);
          setFotoPreview(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 0.9);

      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      
    } catch (err: any) {
      console.error('Erro ao capturar foto:', err);
      toast.error('Erro ao capturar foto');
    }
  };

  const fazerUpload = async () => {
    if (!fotoBlob) { toast.error('Selecione ou tire uma foto primeiro'); return; }
    if (!user) { toast.error('Faça login primeiro'); return; }

    setUploading(true);
    const timestamp = Date.now();
    const filePath = `${user.id}/avatar-${timestamp}.jpg`;

    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, fotoBlob, { 
          contentType: 'image/jpeg', 
          cacheControl: '3600', 
          upsert: true 
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('usuarios')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      toast.success('✅ Foto salva com sucesso!');
      if (onComplete) onComplete();
    } catch (err: any) {
      console.error('❌ Erro no upload:', err);
      toast.error('Erro ao salvar: ' + (err.message || 'Erro desconhecido'));
    }
    setUploading(false);
  };

  const limparFoto = () => {
    setFotoBlob(null);
    setFotoPreview(null);
    setCameraError(null);
    setDebugInfo('');
  };

  // Para a câmera
  const pararCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  return (
    <div className="text-center space-y-4">
      
      {/* DEBUG INFO */}
      {debugInfo && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-2 text-center">
          <p className="text-blue-400 text-xs">{debugInfo}</p>
        </div>
      )}

      {/* === LIVE CAMERA === */}
      {streamRef.current && (
        <div className="relative bg-black rounded-2xl overflow-hidden max-w-sm mx-auto">
          <video 
            ref={videoRef} 
            className={`w-full aspect-square object-cover ${usandoCameraFrontal ? 'scale-x-[-1]' : ''}`} 
            playsInline autoPlay muted 
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Indicador de qual câmera está ativa */}
          <div className="absolute top-4 left-4 bg-black/60 rounded-full px-3 py-1">
            <span className="text-white text-xs font-medium">
              {usandoCameraFrontal ? '🤳 Selfie' : '📸 Traseira'}
            </span>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            {/* Botão para capturar */}
            <button 
              onClick={tirarFotoManual} 
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition"
            >
              <Camera size={28} className="text-gray-900" />
            </button>
            
            {/* Botão para alternar câmera */}
            <button 
              onClick={alternarCamera}
              className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center shadow-lg hover:scale-105 transition"
              title="Alternar câmera"
            >
              <FlipHorizontal size={22} className="text-gray-900" />
            </button>

            {/* Botão para fechar */}
            <button 
              onClick={pararCamera}
              className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* === PREVIEW DA FOTO === */}
      {fotoPreview && !streamRef.current && (
        <div className="relative inline-block">
          <img 
            src={fotoPreview} 
            alt="Preview" 
            className="w-40 h-40 rounded-full object-cover border-4 border-[#F4D03F] shadow-xl mx-auto"
          />
          <button 
            onClick={limparFoto} 
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* === BOTÕES DE AÇÃO === */}
      {!streamRef.current && !fotoBlob && (
        <>
          {/* Aviso de erro */}
          {cameraError && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 flex items-start gap-2 text-left">
              <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 text-xs font-medium">Câmera indisponível</p>
                <p className="text-[#A0A0B0] text-[10px] mt-0.5">{cameraError}</p>
              </div>
            </div>
          )}

          {/* 3 Botões principais */}
          <div className="flex justify-center gap-2">
            {/* 🤳 Selfie (Câmera Frontal) */}
            <button 
              onClick={abrirSelfie}
              type="button"
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#1A1528] border border-white/10 hover:border-[#F4D03F]/50 transition w-24"
            >
              <span className="text-2xl">🤳</span>
              <span className="text-xs text-white">Selfie</span>
            </button>

            {/* 📸 Câmera Traseira */}
            <button 
              onClick={abrirCameraTraseira}
              type="button"
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#1A1528] border border-white/10 hover:border-[#F4D03F]/50 transition w-24"
            >
              <Camera size={24} className="text-[#F4D03F]" />
              <span className="text-xs text-white">Traseira</span>
            </button>

            {/* 🖼️ Galeria */}
            <button 
              onClick={abrirGaleria}
              type="button"
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#1A1528] border border-white/10 hover:border-[#F4D03F]/50 transition w-24"
            >
              <ImageIcon size={24} className="text-[#F4D03F]" />
              <span className="text-xs text-white">Galeria</span>
            </button>
          </div>

          {/* Alternativa: seletor nativo do sistema */}
          <div className="mt-2">
            <button 
              onClick={abrirSeletorNativo}
              type="button"
              className="text-xs text-[#A0A0B0] hover:text-[#F4D03F] transition underline cursor-pointer"
            >
              🔄 Alternativa: selecionar foto ou câmera
            </button>
          </div>
        </>
      )}

      {/* === INPUTS OCULTOS === */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCameraFileChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleGalleryFileChange}
      />

      {/* === BOTÃO DE SALVAR === */}
      {fotoBlob && !streamRef.current && (
        <button 
          onClick={fazerUpload} 
          disabled={uploading || !user}
          className="w-full max-w-xs mx-auto py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {uploading ? (
            <><Loader size={18} className="animate-spin" /> Salvando...</>
          ) : (
            <><Upload size={18} /> Salvar Foto</>
          )}
        </button>
      )}

      {/* INFO */}
      {user && !fotoBlob && (
        <p className="text-[10px] text-[#A0A0B0]">
          ✅ Conta: {user.email}
        </p>
      )}
    </div>
  );
}