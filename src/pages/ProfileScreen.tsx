import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      carregarFoto();
    }
  }, [user]);

  const carregarFoto = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_photos')
        .select('photo_url')
        .eq('user_id', user?.id)
        .single();

      if (data && !error && data.photo_url) {
        setImageUrl(data.photo_url);
      }
    } catch (err) {
      console.log('Nenhuma foto encontrada');
    }
  };

  // Função de compressão de imagem
  const comprimirImagem = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Reduz para 500px (bem pequeno)
          const maxSize = 500;
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Qualidade 0.6 (60%)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Função principal de upload
  const fazerUpload = async (file: File) => {
    if (!user) {
      setMessage('❌ Usuário não logado');
      return;
    }

    setUploading(true);
    setMessage('📤 Comprimindo imagem...');

    try {
      // Comprimir imagem
      const imagemComprimida = await comprimirImagem(file);
      setMessage('📤 Enviando para o servidor...');

      // Converter base64 para blob
      const blob = await fetch(imagemComprimida).then(res => res.blob());
      
      // Nome único
      const nomeUnico = `${user.id}_${Date.now()}.jpg`;
      const caminho = `fotos/${nomeUnico}`;

      // Upload para Supabase
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(caminho, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Pegar URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(caminho);

      // Salvar no banco
      const { error: dbError } = await supabase
        .from('profile_photos')
        .upsert({
          user_id: user.id,
          photo_url: urlData.publicUrl,
          updated_at: new Date()
        });

      if (dbError) throw dbError;

      setImageUrl(urlData.publicUrl);
      setMessage('✅ Foto salva com sucesso!');
      
      setTimeout(() => setMessage(''), 3000);
      
    } catch (err: any) {
      console.error('Erro:', err);
      setMessage('❌ Erro: ' + (err.message || 'Tente novamente'));
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setUploading(false);
    }
  };

  // Selecionar arquivo (funciona para câmera E galeria)
  const selecionarArquivo = (accept: string, capture?: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    if (capture) {
      input.setAttribute('capture', capture);
    }
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Verificar tamanho
        if (file.size > 10 * 1024 * 1024) {
          setMessage('❌ Foto muito grande! Máximo 10MB');
          setTimeout(() => setMessage(''), 3000);
          return;
        }
        await fazerUpload(file);
      }
    };
    input.click();
  };

  return (
    <div style={{ padding: 20, background: '#000', minHeight: '100vh' }}>
      <button onClick={() => navigate('/home')} style={{ color: '#22c55e', marginBottom: 20, background: 'none', border: 'none', fontSize: 16 }}>
        ← Voltar
      </button>
      
      <h1 style={{ color: '#facc15', textAlign: 'center' }}>Meu Perfil</h1>
      
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        {/* Foto */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          background: '#333',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '3px solid #facc15'
        }}>
          {imageUrl ? (
            <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Perfil" />
          ) : (
            <span style={{ fontSize: 50 }}>👤</span>
          )}
        </div>

        {/* Botões */}
        <div style={{ marginTop: 30, display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => selecionarArquivo('image/*', 'environment')}
            disabled={uploading}
            style={{
              padding: '12px 24px',
              background: '#22c55e',
              color: '#000',
              border: 'none',
              borderRadius: 30,
              fontWeight: 'bold',
              fontSize: 16,
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            📸 TIRAR FOTO
          </button>

          <button
            onClick={() => selecionarArquivo('image/*')}
            disabled={uploading}
            style={{
              padding: '12px 24px',
              background: '#facc15',
              color: '#000',
              border: 'none',
              borderRadius: 30,
              fontWeight: 'bold',
              fontSize: 16,
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            🖼️ ESCOLHER FOTO
          </button>
        </div>

        {/* Status */}
        {message && (
          <div style={{
            marginTop: 20,
            padding: 12,
            borderRadius: 10,
            background: message.includes('✅') ? '#22c55e20' : '#ef444420',
            color: message.includes('✅') ? '#22c55e' : '#ef4444',
            fontSize: 14
          }}>
            {message}
          </div>
        )}

        {uploading && (
          <div style={{ marginTop: 20 }}>
            <div style={{
              width: '50%',
              height: 3,
              background: '#facc15',
              margin: '0 auto',
              borderRadius: 2,
              animation: 'pulse 1s ease-in-out infinite'
            }} />
          </div>
        )}

        {/* Info do usuário */}
        <div style={{ marginTop: 40, padding: 16, background: '#1a1a2e', borderRadius: 16 }}>
          <p style={{ color: '#fff', margin: 0 }}><strong>Nome:</strong> {user?.user_metadata?.name || 'Passageiro'}</p>
          <p style={{ color: '#fff', marginTop: 8, marginBottom: 0 }}><strong>Email:</strong> {user?.email}</p>
        </div>

        {/* Botão sair */}
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/login');
          }}
          style={{
            width: '100%',
            padding: 12,
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 30
          }}
        >
          SAIR DA CONTA
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; width: 50%; }
          50% { opacity: 0.5; width: 30%; }
        }
      `}</style>
    </div>
  );
};

export default ProfileScreen;