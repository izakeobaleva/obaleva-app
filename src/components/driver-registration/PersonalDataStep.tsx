import { User, Mail, Lock, Phone, Home, Eye, EyeOff, Calendar } from 'lucide-react';
import { useState } from 'react';

interface PersonalDataStepProps {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  password: string;
  confirmPassword: string;
  onNomeChange: (value: string) => void;
  onCpfChange: (value: string) => void;
  onDataNascimentoChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onTelefoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  formatarCpf: (value: string) => string;
}

export function PersonalDataStep({
  nome,
  cpf,
  dataNascimento,
  email,
  telefone,
  password,
  confirmPassword,
  onNomeChange,
  onCpfChange,
  onDataNascimentoChange,
  onEmailChange,
  onTelefoneChange,
  onPasswordChange,
  onConfirmPasswordChange,
  formatarCpf,
}: PersonalDataStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="space-y-2.5">
      <div className="text-center mb-3">
        <div className="w-10 h-10 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-1">
          <User size={20} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-sm text-white font-bold">Dados Pessoais</h2>
      </div>

      <InputField icon={User} placeholder="Nome completo" autoComplete="name" value={nome} onChange={onNomeChange} />
      <InputField icon={User} placeholder="CPF" autoComplete="off" value={cpf} onChange={(v) => onCpfChange(formatarCpf(v))} maxLength={14} />
      
      {/* Data de Nascimento - AGORA EDITÁVEL com DOIS ÍCONES de calendário */}
      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
        <Calendar size={14} className="text-[#F4D03F] shrink-0" />
        <input
          type="text"
          placeholder="Data de nascimento (DD/MM/AAAA)"
          autoComplete="bday"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
          value={dataNascimento}
          onChange={(e) => {
            // Formata automaticamente como DD/MM/AAAA
            const digits = e.target.value.replace(/\D/g, '').slice(0, 8)
            let formatted = digits
              .replace(/(\d{2})(\d)/, '$1/$2')
              .replace(/(\d{2})(\d)/, '$1/$2')
            onDataNascimentoChange(formatted)
          }}
          maxLength={10}
          required
        />
        <Calendar size={14} className="text-[#F4D03F] shrink-0" />
      </div>

      <InputField icon={Phone} placeholder="Telefone / WhatsApp" autoComplete="tel" value={telefone} onChange={onTelefoneChange} />
      <InputField icon={Mail} placeholder="E-mail" autoComplete="email" type="email" value={email} onChange={onEmailChange} />

      <PasswordField
        placeholder="Senha (mín. 6 caracteres)"
        autoComplete="new-password"
        value={password}
        onChange={onPasswordChange}
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
      />

      <PasswordField
        placeholder="Confirmar senha"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={onConfirmPasswordChange}
        showPassword={showConfirm}
        onTogglePassword={() => setShowConfirm(!showConfirm)}
      />
    </div>
  );
}

function InputField({ icon: Icon, placeholder, autoComplete, type = 'text', value, onChange, maxLength }: any) {
  return (
    <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
      <Icon size={14} className="text-[#F4D03F] shrink-0" />
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        maxLength={maxLength}
      />
    </div>
  );
}

function PasswordField({ placeholder, autoComplete, value, onChange, showPassword, onTogglePassword }: any) {
  return (
    <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
      <Lock size={14} className="text-[#F4D03F] shrink-0" />
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        minLength={6}
      />
      <button type="button" onClick={onTogglePassword} className="text-[#A0A0B0] hover:text-white transition shrink-0">
        {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
      </button>
    </div>
  );
}