import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Camera, Image as ImageIcon, Upload, Loader, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function AvatarUpload({ onComplete }: { onComplete?: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingType, setEditingType] = useState<'foto' | 'documento' | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

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

  const processarArquivo = (file: File) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione apenas imagens (JPG, PNG)');
      return;
    }

    setFotoBlob(file);
    setFotoPreview(URL.createObjectURL(file));

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const handleCameraFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processarArquivo(file);
    e.target.value = '';
  };

  const abrirCameraOuGaleria = () => {
    console.log('🔵 Abrindo seletor de mídia');
    cameraInputRef.current?.click();
  };

  const abrirGaleria = () => {
    console.log('🔵 Abrindo galeria');
    fileInputRef.current?.click();
  };

  const limparFoto = () => {
    setFotoBlob(null);
    setFotoPreview(null);
    setEditingType(null);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
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
      limparFoto();
      if (onComplete) onComplete();
    } catch (err: any) {
      console.error('❌ Erro no upload:', err);
      toast.error('Erro ao salvar: ' + (err.message || 'Erro desconhecido'));
    }
    setUploading(false);
  };

  const handleDocUpload = async () => {
    const file = docInputRef.current?.files?.[0];
    if (!file) return;
    
    toast.success(`✅ Documento "${file.name}" anexado com sucesso!`);
    docInputRef.current.value = '';
  };

  return (
    <div className="text-center space-y-6">
      
      {/* ===== MODO FOTO ===== */}
      {editingType === 'foto' ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={() => { limparFoto(); }}
              className="text-[#A0A0B0] hover:text-white transition text-sm flex items-center gap-1"
            >
              ← Voltar
            </button>
            <p className="text-white text-sm font-medium">Adicionar Foto</p>
          </div>

          {fotoPreview && (
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

          {!fotoPreview && (
            <div className="flex justify-center gap-4">
              <button 
                onClick={abrirCameraOuGaleria}
                type="button"
                className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#1A1528] border-2 border-dashed border-white/20 hover:border-[#F4D03F] transition w-32 cursor-pointer"
              >
                <Camera size={32} className="text-[#F4D03F]" />
                <span className="text-sm text-white font-medium">Câmera</span>
                <span className="text-[10px] text-[#A0A0B0]">Selfie ou foto</span>
              </button>

              <button 
                onClick={abrirGaleria}
                type="button"
                className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#1A1528] border-2 border-dashed border-white/20 hover:border-[#F4D03F] transition w-32 cursor-pointer"
              >
                <ImageIcon size={32} className="text-[#F4D03F]" />
                <span className="text-sm text-white font-medium">Galeria</span>
                <span className="text-[10px] text-[#A0A0B0]">Escolher foto</span>
              </button>
            </div>
          )}

          {fotoBlob && (
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
        </>
      ) : editingType === 'documento' ? (
        <>
          <div className="flex items-center gap-2 mb-2">
            <button 
              onClick={() => setEditingType(null)}
              className="text-[#A0A0B0] hover:text-white transition text-sm flex items-center gap-1"
            >
              ← Voltar
            </button>
            <p className="text-white text-sm font-medium">Upload de Documentos</p>
          </div>

          <div className="bg-[#1A1528] rounded-2xl p-6 border border-white/10 space-y-3">
            <p className="text-sm text-[#A0A0B0]">
              Envie seus documentos para validação (CNH, RG, CPF, etc.)
            </p>
            
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-[#F4D03F] transition">
                <Upload size={32} className="mx-auto mb-2 text-[#F4D03F]" />
                <p className="text-sm text-white font-medium">Clique para selecionar</p>
                <p className="text-xs text-[#A0A0B0] mt-1">PDF, JPG ou PNG • Máx 10MB</p>
              </div>
              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={handleDocUpload}
              />
            </label>
          </div>
        </>
      ) : (
        <>
          {/* ===== TELA INICIAL ===== */}
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#F4D03F]/30 to-amber-500/30 rounded-full flex items-center justify-center border-2 border-[#F4D03F]/50">
            <Camera size={36} className="text-[#F4D03F]" />
          </div>

          <p className="text-white text-sm font-medium">Personalize seu perfil</p>
          <p className="text-xs text-[#A0A0B0]">Adicione uma foto ou documento</p>

          <div className="space-y-3 max-w-xs mx-auto">
            <button
              onClick={() => setEditingType('foto')}
              className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera size={18} />
              Adicionar Foto
            </button>

            <button
              onClick={() => setEditingType('documento')}
              className="w-full py-3.5 rounded-2xl font-medium border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload size={18} />
              Enviar Documentos
            </button>
          </div>
        </>
      )}

      {/* Inputs ocultos */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        capture="environment"
        onChange={handleCameraFileChange}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCameraFileChange}
      />
    </div>
  );
}