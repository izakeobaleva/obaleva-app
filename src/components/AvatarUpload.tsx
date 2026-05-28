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
  const [debugInfo, setDebugInfo] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (!data.user) {
        setDebugInfo('❌ Nenhum usuário logado');
      } else {
        setDebugInfo(`✅ Usuário: ${data.user.email?.substring(0, 20)}...`);
      }
    });
  }, []);

  const processarArquivo = (file: File) => {
    if (!file) return;
    
    const info = `📸 ${file.name || 'selfie'} - ${(file.size / 1024).toFixed(1)}KB - ${file.type}`;
    setDebugInfo(info);
    console.log(info);

    if (!file.type.startsWith('image/')) {
      toast.error('Selecione apenas imagens');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande! Máximo 5MB');
      return;
    }

    setFotoBlob(file);
    setFotoPreview(URL.createObjectURL(file));
    setUploadStatus('foto_selecionada');
    setDebugInfo(info + ' ✅ Preview OK');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processarArquivo(file);
    e.target.value = '';
  };

  const abrirCamera = () => cameraInputRef.current?.click();
  const abrirGaleria = () => fileInputRef.current?.click();

  const limparFoto = () => {
    if (fotoPreview) URL.revokeObjectURL(fotoPreview);
    setFotoBlob(null);
    setFotoPreview(null);
    setUploadStatus(null);
    setEditingType(null);
    setDebugInfo('');
  };

  const fazerUpload = async () => {
    if (!fotoBlob) { toast.error('Selecione uma foto primeiro'); return; }
    if (!user) { toast.error('Faça login primeiro'); return; }

    setUploading(true);
    setUploadStatus('salvando');
    setDebugInfo('🔄 Iniciando upload...');

    try {
      const filePath = `${user.id}/avatar-${Date.now()}.jpg`;
      setDebugInfo(`📤 Upload: ${filePath}`);

      // COM TIMEOUT para não travar
      const uploadPromise = supabase.storage
        .from('avatars')
        .upload(filePath, fotoBlob, { 
          contentType: 'image/jpeg',
          upsert: true 
        });

      // Timeout de 15 segundos
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('⏱️ Timeout - upload demorou mais de 15 segundos')), 15000)
      );

      const { data, error } = await Promise.race([uploadPromise, timeoutPromise]) as any;

      if (error) throw error;

      setDebugInfo('✅ Upload OK! Obtendo URL...');

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setDebugInfo('✅ URL obtida! Atualizando perfil...');

      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('✅ Foto salva com sucesso!');
      setUploadStatus('sucesso');
      setDebugInfo('✅ COMPLETO! Perfil atualizado');
      
      setTimeout(() => {
        limparFoto();
        if (onComplete) onComplete();
      }, 1500);

    } catch (err: any) {
      console.error('❌ Erro:', err);
      setDebugInfo(`❌ ${err.message || 'Erro desconhecido'}`);
      
      // Mensagens amigáveis
      let msg = err.message || 'Erro desconhecido';
      if (msg.includes('bucket')) msg = 'Bucket "avatars" não existe no Storage do Supabase';
      else if (msg.includes('permission') || msg.includes('401')) msg = 'Sem permissão. Configure as políticas RLS';
      else if (msg.includes('Timeout')) msg = 'Tempo esgotado. Verifique sua internet';
      else if (msg.includes('NetworkError') || msg.includes('Failed to fetch')) msg = 'Erro de rede. Conexão com Supabase falhou';
      
      toast.error('❌ ' + msg);
      setUploadStatus('erro');
    }
    setUploading(false);
  };

  return (
    <div className="text-center space-y-6">
      {/* DEBUG - mostra informações na tela */}
      {debugInfo && (
        <div className="bg-[#0F0B1A] border border-white/10 rounded-xl p-3 text-left">
          <p className="text-[10px] text-[#A0A0B0] font-mono break-all">{debugInfo}</p>
        </div>
      )}

      {editingType === 'foto' ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <button onClick={limparFoto} className="text-[#A0A0B0] hover:text-white transition text-sm">← Voltar</button>
            <span className="text-white text-sm font-medium">Adicionar Foto</span>
          </div>

          {fotoPreview && (
            <div className="relative inline-block mb-4">
              <img src={fotoPreview} alt="Preview" className="w-40 h-40 rounded-full object-cover border-4 border-[#F4D03F] shadow-xl mx-auto" />
              <button onClick={limparFoto} className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg">
                <X size={16} />
              </button>
            </div>
          )}

          {uploadStatus === 'salvando' && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-4 text-center">
              <Loader size={24} className="animate-spin mx-auto mb-2 text-[#F4D03F]" />
              <p className="text-sm text-white">Salvando... (aguarde até 15s)</p>
            </div>
          )}

          {uploadStatus === 'sucesso' && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-2xl p-4 text-center">
              <CheckCircle size={24} className="mx-auto mb-2 text-green-400" />
              <p className="text-sm text-green-400 font-medium">✅ Foto salva!</p>
            </div>
          )}

          {uploadStatus === 'erro' && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-4 text-center">
              <AlertTriangle size={24} className="mx-auto mb-2 text-red-400" />
              <p className="text-sm text-red-400 font-medium">Erro ao salvar</p>
              <button onClick={() => setUploadStatus('foto_selecionada')} className="mt-2 bg-white/10 text-white px-3 py-1.5 rounded-xl text-xs">
                Tentar de novo
              </button>
            </div>
          )}

          {!fotoPreview && uploadStatus !== 'salvando' && (
            <div className="flex justify-center gap-4">
              <button onClick={abrirCamera} type="button" className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#1A1528] border-2 border-dashed border-white/20 hover:border-[#F4D03F] transition w-32 cursor-pointer">
                <Camera size={32} className="text-[#F4D03F]" />
                <span className="text-sm text-white font-medium">Câmera</span>
              </button>
              <button onClick={abrirGaleria} type="button" className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-[#1A1528] border-2 border-dashed border-white/20 hover:border-[#F4D03F] transition w-32 cursor-pointer">
                <ImageIcon size={32} className="text-[#F4D03F]" />
                <span className="text-sm text-white font-medium">Galeria</span>
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
          <button onClick={() => setEditingType('foto')} className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Camera size={18} /> Adicionar Foto
          </button>
        </>
      )}

      <input ref={cameraInputRef} type="file" accept="image/*" className="hidden" capture="environment" onChange={handleFileSelect} />
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
    </div>
  );
}