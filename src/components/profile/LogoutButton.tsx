import { LogOut } from 'lucide-react';

const COLORS = {
  vermelho: '#ef4444',
  texto: '#ffffff',
};

interface LogoutButtonProps {
  onLogout: () => void;
}

export function LogoutButton({ onLogout }: LogoutButtonProps) {
  return (
    <div style={{
      flexShrink: 0,
      margin: '0 16px 16px 16px',
    }}>
      <button
        onClick={onLogout}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: COLORS.vermelho,
          color: COLORS.texto,
          border: 'none',
          borderRadius: '14px',
          fontSize: '15px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <LogOut size={18} /> SAIR DA CONTA
      </button>
    </div>
  );
}