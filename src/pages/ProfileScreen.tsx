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

  // ============================================
  // CARREGAR FOTO EXISTENTE
  // ============================================
  useEffect(() => {
    if (user) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`perfil/${user.id}.jpg`);
      
      fetch(data.publicUrl, { method: 'HEAD' })
        .then(res => {
          if (res.ok) setImageUrl(data.publicUrl);
        })
        .catch(() => console.log('Sem foto'));
    }
  }, [user]);

  // ============================================
  // FUNÇÃO PARA REDIMENSIONAR E COMPRIMIR (TAMANHO CONTROLADO)
  // ============================================
  const processarImagem = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          // Define o tamanho MÁXIMO da imagem
          const TAMANHO_MAXIMO = 500; // 500x500 pixels (foto leve)
          
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Redimensiona mantendo proporção
          if (width > height && width > TAMANHO_MAXIMO) {
            height = (height * TAMANHO_MAXIMO) / width;
            width = TAMANHO_MAXIMO;
          } else if (height > TAMANHO_MAXIMO) {
            width = (width * TAMANHO_MAXIMO) / height;
            height = TAMANHO_MAXIMO;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Converte para JPEG com qualidade 70%
          canvas.toBlob((blob) => {
            if (blob) {
              console.log(`📸 Tamanho original: ${(file.size / 1024).toFixed(2)} KB`);
              console.log(`📸 Tamanho comprimido: ${(blob.size / 1024).toFixed(2)} KB`);
              resolve(blob);
            } else {
              reject(new Error('Erro ao comprimir imagem'));
            }
          }, 'image/jpeg', 0.7);
        };
        img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    });
  };

  // ============================================
  // FUNÇÃO PRINCIPAL DE UPLOAD (FUNCIONA PARA TUDO)
  // ============================================
  const fazerUpload = async (file: File) => {
    if (!user) {
      setMessage('❌ Usuário não logado');
      return;
    }

    // Verifica tamanho do arquivo original
    if (file.size > 20 * 1024 * 1024) {
      setMessage('❌ Foto muito grande! Máximo 20MB');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setUploading(true);
    setMessage('📸 Processando imagem...');

    try {
      // Processa a imagem (redimensiona e comprime)
      const imagemProcessada = await processarImagem(file);
      
      setMessage('📤 Enviando para o servidor...');
      
      // Caminho fixo para a foto do perfil
      const caminho = `perfil/${user.id}.jpg`;
      
      // Upload para o Supabase
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(caminho, imagemProcessada, {
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      // Pega a URL pública
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(caminho);

      setImageUrl(urlData.publicUrl);
      setMessage('✅ Foto salva com sucesso!');
      
      setTimeout(() => setMessage(''), 3000);
      
    } catch (err: any) {
      console.error('Erro:', err);
      setMessage('❌ ' + (err.message || 'Erro ao salvar foto'));
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setUploading(false);
    }
  };

  // ============================================
  // ABRIR CÂMERA
  // ============================================
  const abrirCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('capture', 'environment');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) fazerUpload(file);
    };
    input.click();
  };

  // ============================================
  // ABRIR GALERIA
  // ============================================
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

  // ============================================
  // SAIR
  // ============================================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // ============================================
  // TELA
  // ============================================
  return (
    <div style={{ padding: 20, background: '#000', minHeight: '100vh' }}>
      {/* Botão voltar */}
      <button 
        onClick={() => navigate('/home')} 
        style={{ 
          color: '#22c55e', 
          marginBottom: 20, 
          background: 'none', 
          border: 'none', 
          fontSize: 16, 
          cursor: 'pointer' 
        }}
      >
        ← Voltar
      </button>
      
      {/* Título */}
      <h1 style={{ color: '#facc15', textAlign: 'center' }}>Meu Perfil</h1>
      
      {/* Conteúdo central */}
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        
        {/* Círculo da foto */}
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
            <img 
              src={imageUrl} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt="Perfil" 
            />
          ) : (
            <span style={{ fontSize: 50 }}>👤</span>
          )}
        </div>

        {/* Botões */}
        <div style={{ marginTop: 30, display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
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
              fontSize: 16,
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
              fontSize: 16,
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            🖼️ ESCOLHER FOTO
          </button>
        </div>

        {/* Mensagem de status */}
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

        {/* Indicador de upload */}
        {uploading && (
          <div style={{ marginTop: 20 }}>
            <div style={{
              width: 40,
              height: 40,
              border: '3px solid #facc15',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}

        {/* Informações do usuário */}
        <div style={{ 
          marginTop: 40, 
          padding: 16, 
          background: '#1a1a2e', 
          borderRadius: 16,
          textAlign: 'left'
        }}>
          <p style={{ color: '#fff', margin: 0 }}>
            <strong>👤 Nome:</strong> {user?.user_metadata?.name || 'Passageiro'}
          </p>
          <p style={{ color: '#fff', marginTop: 8, marginBottom: 0 }}>
            <strong>📧 Email:</strong> {user?.email}
          </p>
        </div>

        {/* Botão sair */}
        <button
          onClick={handleLogout}
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

      {/* Animação CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfileScreen;