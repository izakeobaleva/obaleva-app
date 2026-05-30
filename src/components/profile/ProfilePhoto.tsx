import { useState } from 'react';
import { User, Camera, Upload, Edit2 } from 'lucide-react';

const COLORS = {
  amarelo: '#facc15',
  roxo: '#8b5cf6',
  verde: '#22c55e',
  fundo: '#0f0f0f',
  card: '#1a1a2e',
  textoCinza: '#9ca3af',
};

interface ProfilePhotoProps {
  profileImage: string | null;
  onPhotoChange: (imageData: string) => void;
}

export function ProfilePhoto({ profileImage, onPhotoChange }: ProfilePhotoProps) {
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('environment');

  const handleOpenCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = cameraMode === 'user' ? 'user' : 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert('Arquivo muito grande! Máximo 2MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          onPhotoChange(event.target?.result as string);
          setShowPhotoOptions(false);
          alert('✅ Foto salva com sucesso!');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleOpenGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert('Arquivo muito grande! Máximo 2MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          onPhotoChange(event.target?.result as string);
          setShowPhotoOptions(false);
          alert('✅ Foto anexada com sucesso!');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div style={{
      flexShrink: 0,
      padding: '24px 20px 12px 20px',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{ position: 'relative' }}>
        <div
          onClick={() => setShowPhotoOptions(!showPhotoOptions)}
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: COLORS.roxo + '30',
            borderRadius: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: `3px solid ${COLORS.amarelo}`,
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          {profileImage ? (
            <img src={profileImage} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={48} color={COLORS.roxo} />
          )}
          
          <div style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            backgroundColor: COLORS.amarelo,
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${COLORS.fundo}`,
          }}>
            <Edit2 size={14} color={COLORS.fundo} />
          </div>
        </div>
        
        {showPhotoOptions && (
          <div style={{
            position: 'absolute',
            top: '110px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: COLORS.card,
            borderRadius: '16px',
            padding: '12px',
            border: `1px solid ${COLORS.roxo}40`,
            zIndex: 100,
            width: '200px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <button
              onClick={handleOpenCamera}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: COLORS.verde,
                border: 'none',
                borderRadius: '10px',
                marginBottom: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: COLORS.fundo,
              }}
            >
              <Camera size={14} /> TIRAR FOTO
            </button>
            
            <button
              onClick={handleOpenGallery}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: COLORS.amarelo,
                border: 'none',
                borderRadius: '10px',
                marginBottom: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: COLORS.fundo,
              }}
            >
              <Upload size={14} /> ANEXAR FOTO
            </button>
            
            <button
              onClick={() => setCameraMode(cameraMode === 'user' ? 'environment' : 'user')}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '11px',
                color: COLORS.amarelo,
              }}
            >
              🔄 Alternar câmera ({cameraMode === 'user' ? 'FRONTAL' : 'TRASEIRA'})
            </button>
            
            <button
              onClick={() => setShowPhotoOptions(false)}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '11px',
                color: COLORS.textoCinza,
                marginTop: '4px',
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}