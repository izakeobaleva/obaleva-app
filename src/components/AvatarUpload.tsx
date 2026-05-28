import { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Camera, Image as ImageIcon, Upload, Loader, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function AvatarUpload({ onComplete }: { onComplete?: () => void }) {
  const [user, setUser] = useState<any>(null);
  const [fotoBlob, setFotoBlob] = useState<Blob | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<'foto' | 'documento' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      console.log('🔵 Usuário carregado:', data.user?.email);
      setUser(data.user);
    });
  }, []);

  // ==================== PROCESSAR ARQUIVO (CONVERTE PARA JPEG) ====================
  const processarArquivo = (arquivo: File) => {
    console.log('📸 Processando arquivo:', {
      nome: arquivo.name || 'selfie',
      tipo: arquivo.type,
      tamanho: (arquivo.size / 1024).toFixed(2) + 'KB',
    });

    if (!arquivo || !arquivo.size) {
      console.error('❌ Arquivo inválido');
      toast.error('Arquivo inválido. Tente novamente.');
      return;
    }

    if (!arquivo.type.startsWith('image/')) {
      console.error('❌ Arquivo não é imagem:', arquivo.type);
      toast.error('Selecione apenas imagens.');
      return;
    }

    if (arquivo.size > 10 * 1024 * 1024) {
      toast.error('Imagem muito grande! Máximo 10MB.');
      return;
    }

    // Converter para JPEG para garantir compatibilidade
    const img = new Image();
    const url = URL.createObjectURL(arquivo);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      canvas.width = 400; // Redimensionar para 400px
      canvas.height = 400;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('❌ Erro ao criar contexto canvas');
        setFotoBlob(arquivo); // Fallback: usar arquivo original
        setFotoPreview(URL.createObjectURL(arquivo));
        setUploadStatus('foto_selecionada');
        return;
      }

      // Centralizar e cortar para quadrado
      const size = Math.min(img.width, img.height);
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 400, 400);

      // Converte para JPEG
      canvas.toBlob(
        (blobJpeg) => {
          if (blobJpeg) {
            console.log('✅ Imagem convertida para JPEG');
            console.log(`📊 Tamanho original: ${(arquivo.size / 1024).toFixed(2)}KB`);
            console.log(`📊 Tamanho convertido: ${(blobJpeg.size / 1024).toFixed(2)}KB`);

            setFotoBlob(blobJpeg);
            const previewUrl = URL.createObjectURL(blobJpeg);
            setFotoPreview(previewUrl);
            setUploadStatus('foto_selecionada');
          } else {
            console.error('❌ Falha na conversão para JPEG, usando original');
            setFotoBlob(arquivo);
            setFotoPreview(URL.createObjectURL(arquivo));
            setUploadStatus('foto_selecionada');
          }
        },
        'image/jpeg',
        0.85 // Qualidade 85%
      );
    };

    img.onerror = (error) => {
      console.error('❌ Erro ao carregar imagem:', error);
      toast.error('Erro ao processar imagem.');
    };

    img.src = url;
  };

  // ==================== HANDLE FILE ====================
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('🔵 handleFileSelect disparado', file?.name);
    if (file) processarArquivo(file);
    e.target.value = '';
  };

  const abrirCamera = () => {
    console.log('🔵 Abrindo câmera');
    cameraInputRef.current?.click();
  };

  const abrirGaleria = () => {
    console.log('🔵 Abrindo galeria');
    fileInputRef.current?.click();
  };

  const limparFoto = () => {
    console.log('🔵 Limpando foto');
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoBlob(null);
    setFotoPreview(null);
    setUploadStatus(null);
    setEditingType(null);
  };

  // ==================== UPLOAD ====================
  const fazerUpload = async () => {
    console.log('🚀 Iniciando upload...');
    console.log('fotoBlob existe?', !!fotoBlob);
    console.log('fotoBlob tipo:', fotoBlob?.type);
    console.log('fotoBlob tamanho:', fotoBlob?.size);
    console.log('user:', user?.email);
    console.log('user.id:', user?.id);

    if (!fotoBlob) {
      console.error('❌ fotoBlob é null');
      toast.error('Selecione ou tire uma foto primeiro');
      return;
    }

    if (!user) {
      console.error('❌ user é null');
      toast.error('Faça login primeiro');
      return;
    }

    setUploading(true);
    setUploadStatus('salvando');

    try {
      const filePath = `${user.id}/avatar-${Date.now()}.jpg`;
      console.log('📤 Upload para:', filePath);

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, fotoBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('❌ Erro Supabase:', error);
        throw error;
      }

      console.log('✅ Upload OK:', data);

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('🔗 URL pública:', publicUrl);

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        console.error('⚠️ Erro ao salvar no perfil:', updateError);
        throw updateError;
      }

      console.log('✅ Perfil atualizado!');
      toast.success('✅ Foto salva com sucesso!');
      setUploadStatus('sucesso');

      setTimeout(() => {
        limparFoto();
        if (onComplete) onComplete();
      }, 1500);
    } catch (err: any) {
      console.error('❌ Erro completo:', err);
      toast.error('Erro: ' + (err.message || 'Erro desconhecido'));
      setUploadStatus('erro');
    }
    setUploading(false);
  };

  const handleDocUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    toast.success(`✅ Documento "${file.name}" anexado!`);
  };

  return (
    <div className="text-center space-y-6">
      {editingType === 'foto' ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <button onClick={limparFoto} className="text-[#A0A0B0] hover:text-white transition text-sm">
              ← Voltar
            </button>
            <span className="text-white text-sm font-medium">Adicionar Foto</span>
          </div>

          {fotoPreview && (
            <div className="relative inline-block mb-4">
              <img src={fotoPreview} alt="Preview" className="w-40 h-40 rounded-full object-cover border-4 border-[#F4D03F] shadow-xl mx-auto" />
              <button onClick={limparFoto} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition">
                <X size={16} />
              </button>
            </div>
          )}

          {uploadStatus === 'salvando' && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-4 text-center mb-4">
              <Loader size={24} className="animate-spin mx-auto mb-2 text-[#F4D03F]" />
              <p className="text-sm text-white">Salvando foto...</p>
            </div>
          )}

          {uploadStatus === 'sucesso' && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-4 text-center mb-4">
              <CheckCircle size={24} className="mx-auto mb-2 text-green-400" />
              <p className="text-sm text-green-400 font-medium">Foto salva! ✅</p>
            </div>
          )}

          {uploadStatus === 'erro' && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 text-center mb-4">
              <AlertTriangle size={24} className="mx-auto mb-2 text-red-400" />
              <p className="text-sm text-red-400 font-medium">Erro ao salvar</p>
              <button onClick={() => setUploadStatus('foto_selecionada')} className="mt-2 text-xs bg-white/10 text-white px-3 py-1.5 rounded-xl hover:bg-white/20 transition">
                Tentar novamente
              </button>
            </div>
          )}

          {!fotoPreview && uploadStatus !== 'salvando' && (
            <div className="flex justify-center gap-4">
              <button onClick={abrirCamera} type="button" className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#1A1528] border-2 border-dashed border-white/20 hover:border-[#F4D03F] transition w-32 cursor-pointer">
                <Camera size={32} className="text-[#F4D03F]" />
                <span className="text-sm text-white font-medium">Câmera</span>
                <span className="text-[10px] text-[#A0A0B0]">Selfie</span>
              </button>
              <button onClick={abrirGaleria} type="button" className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#1A1528] border-2 border-dashed border-white/20 hover:border-[#F4D03F] transition w-32 cursor-pointer">
                <ImageIcon size={32} className="text-[#F4D03F]" />
                <span className="text-sm text-white font-medium">Galeria</span>
                <span className="text-[10px] text-[#A0A0B0]">Escolher foto</span>
              </button>
            </div>
          )}

          {fotoPreview && uploadStatus !== 'salvando' && uploadStatus !== 'sucesso' && (
            <button onClick={fazerUpload} disabled={uploading} className="w-full max-w-xs mx-auto py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-4">
              {uploading ? <><Loader size={18} className="animate-spin" /> Salvando...</> : <><Upload size={18} /> Salvar Foto</>}
            </button>
          )}
        </>
      ) : (
        <>
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#F4D03F]/30 to-amber-500/30 rounded-full flex items-center justify-center border-2 border-[#F4D03F]/50">
            <Camera size={36} className="text-[#F4D03F]" />
          </div>
          <p className="text-white text-sm font-medium">Personalize seu perfil</p>
          <p className="text-xs text-[#A0A0B0]">Adicione uma foto</p>
          <div className="space-y-3 max-w-xs mx-auto">
            <button onClick={() => setEditingType('foto')} className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
              <Camera size={18} /> Adicionar Foto
            </button>
          </div>
        </>
      )}

      <input ref={cameraInputRef} type="file" accept="image/*" className="hidden" capture="environment" onChange={handleFileSelect} />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
    </div>
  );
}