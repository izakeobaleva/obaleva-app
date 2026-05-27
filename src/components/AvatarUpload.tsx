import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Camera, Image as ImageIcon, Upload, CheckCircle, Loader, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function AvatarUpload({ onComplete }: { onComplete?: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

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

  // ✅ MÉTODO 1: getUserMedia (câmera programática - funciona em PWA certificado)
  const abrirCameraMobile = async () => {
    // 🐛 DEBUG: Saber se o clique foi detectado
    const timestamp = Date.now();
    setDebugInfo(`📸 Clique capturado em ${new Date(timestamp).toLocaleTimeString()}`);
    console.log('🔵 Botão Câmera clicado em', new Date(timestamp).toLocaleTimeString());
    
    setCameraError(null);
    
    // Verifica HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      const msg = '⚠️ Câmera só funciona em HTTPS. Usando modo alternativo.';
      setCameraError(msg);
      console.warn('🔴', msg);
      // ✅ FALLBACK: input nativo
      cameraInputRef.current?.click();
      return;
    }

    try {
      console.log('🔵 Tentando getUserMedia com facingMode: environment');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1080 },
          height: { ideal: 1080 }
        },
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log('✅ Câmera getUserMedia ativada com sucesso');
      }
      
      setCameraError(null);
      
    } catch (err: any) {
      console.error('❌ Erro getUserMedia:', err.name, err.message);
      
      let mensagem = 'Não foi possível abrir a câmera. ';
      if (err.name === 'NotAllowedError') mensagem += 'Permissão negada.';
      else if (err.name === 'NotFoundError') mensagem += 'Nenhuma câmera encontrada.';
      else if (err.name === 'NotReadableError') mensagem += 'Câmera em uso.';
      else mensagem += err.message;
      
      setCameraError(mensagem);
      
      // ✅ FALLBACK: input nativo com capture="environment"
      console.log('🔄 Fallback: acionando input file com capture="environment"');
      cameraInputRef.current?.click();
    }
  };

  // ✅ MÉTODO 2: Input HTML nativo com capture (fallback + funciona em PWA)
  const abrirCameraInput = () => {
    console.log('🔵 Abrindo câmera via input nativo (capture="environment")');
    setDebugInfo('📸 Abrindo câmera do sistema...');
    cameraInputRef.current?.click();
  };

  // ✅ MÉTODO 3: Galeria (sempre funciona)
  const abrirGaleria = () => {
    console.log('🔵 Abrindo galeria via input nativo');
    setDebugInfo('🖼️ Abrindo galeria...');
    fileInputRef.current?.click();
  };

  const processarArquivo = (file: File, origem: 'camera' | 'galeria') => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione apenas imagens (JPG, PNG)');
      return;
    }

    console.log(`📸 Foto de origem: ${origem}`, {
      nome: file.name,
      tipo: file.type,
      tamanho: (file.size / 1024).toFixed(2) + ' KB'
    });

    setFotoBlob(file);
    setFotoPreview(URL.createObjectURL(file));
    setCameraError(null);
    setDebugInfo('');

    // Se estava com stream da câmera, para
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
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setFotoBlob(blob);
          setFotoPreview(URL.createObjectURL(blob));
          console.log('📸 Foto capturada manualmente:', (blob.size / 1024).toFixed(2) + ' KB');
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

  return (
    <div className="text-center space-y-4">
      
      {/* 🔍 DEBUG INFO (visível apenas se houver) */}
      {debugInfo && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-2 text-center">
          <p className="text-blue-400 text-xs">{debugInfo}</p>
        </div>
      )}

      {/* === LIVE CAMERA (captura manual) === */}
      {streamRef.current && (
        <div className="relative bg-black rounded-2xl overflow-hidden max-w-sm mx-auto">
          <video ref={videoRef} className="w-full aspect-square object-cover" playsInline autoPlay muted />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button 
              onClick={tirarFotoManual} 
              className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition"
            >
              <Camera size={28} className="text-gray-900" />
            </button>
            <button 
              onClick={() => { streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null; }} 
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
          {/* Aviso de erro da câmera */}
          {cameraError && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-3 flex items-start gap-2 text-left">
              <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-400 text-xs font-medium">Câmera indisponível</p>
                <p className="text-[#A0A0B0] text-[10px] mt-0.5">{cameraError}</p>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            {/* ✅ BOTÃO CÂMERA */}
            <button 
              onClick={abrirCameraMobile}
              type="button"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1A1528] border border-white/10 hover:border-[#F4D03F]/50 transition w-28 cursor-pointer"
            >
              <Camera size={28} className="text-[#F4D03F]" />
              <span className="text-xs text-white">Câmera 📸</span>
            </button>

            {/* ✅ BOTÃO GALERIA */}
            <button 
              onClick={abrirGaleria}
              type="button"
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1A1528] border border-white/10 hover:border-[#F4D03F]/50 transition w-28 cursor-pointer"
            >
              <ImageIcon size={28} className="text-[#F4D03F]" />
              <span className="text-xs text-white">Galeria 🖼️</span>
            </button>
          </div>

          {/* ✅ ALTERNATIVA: Câmera do sistema direto */}
          <div className="mt-2">
            <button 
              onClick={abrirCameraInput}
              type="button"
              className="text-xs text-[#A0A0B0] hover:text-[#F4D03F] transition underline cursor-pointer"
            >
              🔄 Alternativa: abrir câmera do sistema
            </button>
          </div>
        </>
      )}

      {/* === INPUTS OCULTOS === */}
      
      {/* ✅ Input para CÂMERA com capture="environment" (força câmera traseira) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraFileChange}
      />

      {/* ✅ Input para GALERIA (sem capture) */}
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

      {/* === INFO DO USUÁRIO === */}
      {user && !fotoBlob && (
        <p className="text-[10px] text-[#A0A0B0]">
          ✅ Conta: {user.email} <br />
          <span className="text-[#F4D03F]">📸 Tire uma foto ou escolha da galeria</span>
        </p>
      )}
    </div>
  );
}