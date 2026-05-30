import { Smartphone, Users, Briefcase, History, CreditCard, Settings } from 'lucide-react';

const COLORS = {
  amarelo: '#facc15',
  roxo: '#8b5cf6',
  verde: '#22c55e',
  card: '#1a1a2e',
  texto: '#ffffff',
  textoCinza: '#9ca3af',
};

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  actionLabel: string;
  actionColor?: string;
}

function MenuItem({ icon, label, actionLabel, actionColor = COLORS.amarelo }: MenuItemProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: `1px solid ${COLORS.roxo}20`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon}
        <span style={{ color: COLORS.texto, fontSize: '13px' }}>{label}</span>
      </div>
      <button style={{ color: actionColor, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
        {actionLabel} →
      </button>
    </div>
  );
}

export function AppInfo() {
  return (
    <div style={{
      flexShrink: 0,
      backgroundColor: COLORS.card,
      margin: '0 16px 12px 16px',
      borderRadius: '16px',
      border: `1px solid ${COLORS.roxo}40`,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '12px 16px',
        backgroundColor: COLORS.roxo + '15',
        borderBottom: `1px solid ${COLORS.roxo}40`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Smartphone size={16} color={COLORS.amarelo} />
          <span style={{ color: COLORS.texto, fontSize: '14px', fontWeight: 'bold' }}>📌 INFORMAÇÕES DO APLICATIVO</span>
        </div>
      </div>
      
      <div style={{ padding: '8px 0' }}>
        <MenuItem icon={<Users size={16} color={COLORS.roxo} />} label="👤 Mudar passageiro" actionLabel="Selecionar" />
        <MenuItem icon={<Briefcase size={16} color={COLORS.verde} />} label="🚗 Seja Parceiro (Motorista)" actionLabel="Cadastrar" actionColor={COLORS.verde} />
        <MenuItem icon={<History size={16} color={COLORS.roxo} />} label="📜 Histórico de viagens" actionLabel="Ver" />
        <MenuItem icon={<CreditCard size={16} color={COLORS.roxo} />} label="💳 Formas de pagamento" actionLabel="Ver" />
        <MenuItem icon={<Settings size={16} color={COLORS.roxo} />} label="⚙️ Configurações" actionLabel="Abrir" />
      </div>
    </div>
  );
}