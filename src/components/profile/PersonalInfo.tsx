import { FileText, Edit2 } from 'lucide-react';

const COLORS = {
  amarelo: '#facc15',
  roxo: '#8b5cf6',
  card: '#1a1a2e',
  texto: '#ffffff',
  textoCinza: '#9ca3af',
};

interface UserData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
}

interface PersonalInfoProps {
  userData: UserData;
  onEdit: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <span style={{ color: COLORS.textoCinza, fontSize: '11px' }}>{label}</span>
      <p style={{ color: COLORS.texto, fontSize: '14px', marginTop: '2px' }}>{value}</p>
    </div>
  );
}

export function PersonalInfo({ userData, onEdit }: PersonalInfoProps) {
  return (
    <div style={{
      flexShrink: 0,
      backgroundColor: COLORS.card,
      margin: '12px 16px',
      borderRadius: '16px',
      border: `1px solid ${COLORS.roxo}40`,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: COLORS.roxo + '15',
        borderBottom: `1px solid ${COLORS.roxo}40`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} color={COLORS.amarelo} />
          <span style={{ color: COLORS.texto, fontSize: '14px', fontWeight: 'bold' }}>📝 INFORMAÇÕES PESSOAIS</span>
        </div>
        <button
          onClick={onEdit}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Edit2 size={12} color={COLORS.amarelo} />
          <span style={{ color: COLORS.amarelo, fontSize: '11px' }}>Editar</span>
        </button>
      </div>
      
      <div style={{ padding: '12px 16px' }}>
        <InfoRow label="Nome completo" value={userData.nome} />
        <InfoRow label="E-mail" value={userData.email} />
        <InfoRow label="CPF" value={userData.cpf} />
        <InfoRow label="Telefone" value={userData.telefone} />
        <InfoRow label="Data de nascimento" value={userData.dataNascimento} />
        <InfoRow label="Endereço" value={userData.endereco} />
      </div>
    </div>
  );
}