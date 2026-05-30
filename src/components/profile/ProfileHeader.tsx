import { ArrowLeft, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  amarelo: '#facc15',
  roxo: '#8b5cf6',
  verde: '#22c55e',
  card: '#1a1a2e',
  texto: '#ffffff',
};

export function ProfileHeader() {
  const navigate = useNavigate();

  return (
    <div style={{
      flexShrink: 0,
      backgroundColor: COLORS.card,
      padding: '12px 16px',
      borderBottom: `1px solid ${COLORS.roxo}40`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <button
        onClick={() => navigate('/home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <ArrowLeft size={20} color={COLORS.verde} />
        <span style={{ color: COLORS.verde, fontSize: '14px' }}>Voltar</span>
      </button>
      <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.amarelo }}>
        👤 PERFIL
      </span>
      <div style={{ width: '60px' }} />
    </div>
  );
}