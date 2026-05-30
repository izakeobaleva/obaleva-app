import { ArrowLeft } from 'lucide-react';

const COLORS = {
  amarelo: '#facc15',
  roxo: '#8b5cf6',
  verde: '#22c55e',
  fundo: '#0f0f0f',
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

interface EditProfileFormProps {
  formData: UserData;
  onFormChange: (data: UserData) => void;
  onSave: () => void;
  onCancel: () => void;
}

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d{1,})/, '$1.$2');
  if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3-$4');
};

const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0,2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0,2)}) ${numbers.slice(2,7)}-${numbers.slice(7,11)}`;
};

const formatDate = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0,2)}/${numbers.slice(2)}`;
  return `${numbers.slice(0,2)}/${numbers.slice(2,4)}/${numbers.slice(4,8)}`;
};

function FormField({ label, value, onChange, type, placeholder, maxLength }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: COLORS.fundo,
            border: `1px solid ${COLORS.roxo}40`,
            borderRadius: '12px',
            color: COLORS.texto,
            fontSize: '14px',
            resize: 'vertical',
          }}
        />
      ) : (
        <input
          type={type || 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: COLORS.fundo,
            border: `1px solid ${COLORS.roxo}40`,
            borderRadius: '12px',
            color: COLORS.texto,
            fontSize: '14px',
          }}
        />
      )}
    </div>
  );
}

export function EditProfileForm({ formData, onFormChange, onSave, onCancel }: EditProfileFormProps) {
  return (
    <div style={{
      height: '100vh',
      width: '100%',
      backgroundColor: COLORS.fundo,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    }}>
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.card,
        padding: '12px 16px',
        borderBottom: `1px solid ${COLORS.roxo}40`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <button onClick={onCancel} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={20} color={COLORS.verde} />
        </button>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.amarelo }}>
          ✏️ EDITAR PERFIL
        </span>
      </div>
      
      <div style={{ flex: 1, padding: '20px' }}>
        <div style={{
          backgroundColor: COLORS.card,
          borderRadius: '20px',
          padding: '20px',
          border: `1px solid ${COLORS.roxo}40`,
        }}>
          <FormField
            label="Nome completo"
            value={formData.nome}
            onChange={(v) => onFormChange({ ...formData, nome: v })}
          />
          <FormField
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(v) => onFormChange({ ...formData, email: v })}
          />
          <FormField
            label="CPF"
            value={formData.cpf}
            onChange={(v) => onFormChange({ ...formData, cpf: formatCPF(v) })}
            placeholder="000.000.000-00"
            maxLength={14}
          />
          <FormField
            label="Telefone"
            type="tel"
            value={formData.telefone}
            onChange={(v) => onFormChange({ ...formData, telefone: formatPhone(v) })}
            placeholder="(11) 99999-9999"
            maxLength={15}
          />
          <FormField
            label="Data de nascimento"
            value={formData.dataNascimento}
            onChange={(v) => onFormChange({ ...formData, dataNascimento: formatDate(v) })}
            placeholder="DD/MM/AAAA"
            maxLength={10}
          />
          <FormField
            label="Endereço"
            type="textarea"
            value={formData.endereco}
            onChange={(v) => onFormChange({ ...formData, endereco: v })}
          />
          
          <button
            onClick={onSave}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: COLORS.verde,
              color: COLORS.fundo,
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '12px',
            }}
          >
            💾 SALVAR ALTERAÇÕES
          </button>
          
          <button
            onClick={onCancel}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: COLORS.textoCinza,
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}