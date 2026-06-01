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

  // Carregar foto do perfil
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

      if (data && !error) {
        setImageUrl(data.photo_url);
      }
    } catch (err) {
      console.log('Nenhuma foto encontrada');
    }
  };

  // Função para fazer upload da foto
  const fazerUpload = async (file: File) => {
    if (!user) return;
    
    setUploading(true);
    setMessage('📤 Enviando foto...');

    try {
      // 1. Comprimir a imagem (reduzir tamanho)
      const imagemComprimida = await comprimirImagem(file);
      
      // 2. Gerar nome único
      const nomeUnico = `${Date.now()}_${file.name}`;
      const caminho = `public/${user.id}/${nomeUnico}`;
      
      // 3. Upload para o Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(caminho, imagemComprimida, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 4. Pegar URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(caminho);

      // 5. Salvar URL na tabela
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
      setMessage('❌ Erro: ' + err.message);
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setUploading(false);
    }
  };

  // Função para comprimir imagem (reduz tamanho para upload rápido)
  const comprimirImagem = (file: File): Promise<Blob> => {
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
          
          // Reduz para no máximo 800px
          const maxSize = 800;
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
          
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Erro ao comprimir imagem'));
          }, 'image/jpeg', 0.7);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Abrir câmera
  const abrirCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) fazerUpload(file);
    };
    input.click();
  };

  // Abrir galeria
  const abrirGaleria = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) fazerUpload(file);
    };
    input.click();
  };

  return (
    <div style={{ padding: 20, background: '#000', minHeight: '100vh' }}>
      <button onClick={() => navigate('/home')} style={{ color: '#22c55e', marginBottom: 20 }}>
        ← Voltar
      </button>
      
      <h1 style={{ color: '#facc15', textAlign: 'center' }}>Perfil</h1>
      
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
            <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 50 }}>👤</span>
          )}
        </div>

        {/* Botões */}
        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={abrirCamera}
            disabled={uploading}
            style={{
              padding: '12px 24px',
              background: '#22c55e',
              color: '#000',
              border: 'none',
              borderRadius: 30,
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            📸 TIRAR FOTO
          </button>

          <button
            onClick={abrirGaleria}
            disabled={uploading}
            style={{
              padding: '12px 24px',
              background: '#facc15',
              color: '#000',
              border: 'none',
              borderRadius: 30,
              fontWeight: 'bold',
              fontSize: '16px',
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
            padding: 10,
            borderRadius: 10,
            background: message.includes('✅') ? '#22c55e20' : '#ef444420',
            color: message.includes('✅') ? '#22c55e' : '#ef4444'
          }}>
            {message}
          </div>
        )}

        {uploading && (
          <div style={{ marginTop: 20 }}>
            <div style={{
              width: '100%',
              height: 4,
              background: '#333',
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <div style={{
                width: '50%',
                height: '100%',
                background: '#facc15',
                borderRadius: 2,
                animation: 'progress 1s infinite'
              }} />
            </div>
            <p style={{ color: '#facc15', fontSize: 12, marginTop: 8 }}>Enviando foto...</p>
          </div>
        )}

        {/* Info usuário */}
        <div style={{ marginTop: 30, padding: 16, background: '#1a1a2e', borderRadius: 16 }}>
          <p style={{ color: '#fff' }}><strong>Nome:</strong> {user?.user_metadata?.name || 'Passageiro'}</p>
          <p style={{ color: '#fff', marginTop: 8 }}><strong>Email:</strong> {user?.email}</p>
        </div>

        {/* Sair */}
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
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: 20
          }}
        >
          SAIR DA CONTA
        </button>
      </div>

      {/* Animação CSS */}
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default ProfileScreen;