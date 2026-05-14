import { User, Mail, Lock, Phone, Eye, EyeOff, Calendar } from 'lucide-react';
import { useState } from 'react';

interface PersonalDataStepProps {
  nome: string; cpf: string; dataNascimento: string; email: string; telefone: string;
  password: string; confirmPassword: string;
  onNomeChange: (v: string) => void; onCpfChange: (v: string) => void;
  onDataNascimentoChange: (v: string) => void; onEmailChange: (v: string) => void;
  onTelefoneChange: (v: string) => void; onPasswordChange: (v: string) => void;
  onConfirmPasswordChange: (v: string) => void;
  formatarCpf: (v: string) => string;
  errors?: Record<string, string>;
}

export function PersonalDataStep({
  nome, cpf, dataNascimento, email, telefone, password, confirmPassword,
  onNomeChange, onCpfChange, onDataNascimentoChange, onEmailChange, onTelefoneChange,
  onPasswordChange, onConfirmPasswordChange, formatarCpf, errors = {}
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

      <InputField icon={User} placeholder="Nome completo" autoComplete="name" value={nome} onChange={onNomeChange} error={errors.nome} />
      <InputField icon={User} placeholder="CPF" value={cpf} onChange={(v) => onCpfChange(formatarCpf(v))} maxLength={14} error={errors.cpf} />
      
      {/* Data de Nascimento */}
      <div className={`flex items-center gap-2 bg-[#0F0B1A] border ${errors.dataNascimento ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]`}>
        <Calendar size={14} className="text-[#F4D03F] shrink-0" />
        <input type="text" placeholder="Data de nascimento (DD/MM/AAAA)" autoComplete="bday"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
          value={dataNascimento} onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '').slice(0, 8);
            onDataNascimentoChange(digits.replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2'));
          }} maxLength={10} required />
      </div>
      {errors.dataNascimento && <p className="text-red-400 text-[10px] mt-0.5 ml-2">{errors.dataNascimento}</p>}

      <InputField icon={Phone} placeholder="Telefone / WhatsApp" autoComplete="tel" value={telefone} onChange={onTelefoneChange} error={errors.telefone} />
      <InputField icon={Mail} placeholder="E-mail" autoComplete="email" type="email" value={email} onChange={onEmailChange} error={errors.email} />

      <PasswordField placeholder="Senha (mín. 6 caracteres)" autoComplete="new-password" value={password} onChange={onPasswordChange} showPassword={showPassword} onTogglePassword={() => setShowPassword(!showPassword)} error={errors.password} />
      <PasswordField placeholder="Confirmar senha" autoComplete="new-password" value={confirmPassword} onChange={onConfirmPasswordChange} showPassword={showConfirm} onTogglePassword={() => setShowConfirm(!showConfirm)} error={errors.confirmPassword} />
    </div>
  );
}

function InputField({ icon: Icon, placeholder, autoComplete, type = 'text', value, onChange, maxLength, error }: any) {
  return (
    <div>
      <div className={`flex items-center gap-2 bg-[#0F0B1A] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]`}>
        <Icon size={14} className="text-[#F4D03F] shrink-0" />
        <input type={type} placeholder={placeholder} autoComplete={autoComplete}
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
          value={value} onChange={(e) => onChange(e.target.value)} required maxLength={maxLength} />
        {value && !error && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </div>
      {error && <p className="text-red-400 text-[10px] mt-0.5 ml-2">{error}</p>}
    </div>
  );
}

function PasswordField({ placeholder, autoComplete, value, onChange, showPassword, onTogglePassword, error }: any) {
  return (
    <div>
      <div className={`flex items-center gap-2 bg-[#0F0B1A] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]`}>
        <Lock size={14} className="text-[#F4D03F] shrink-0" />
        <input type={showPassword ? 'text' : 'password'} placeholder={placeholder} autoComplete={autoComplete}
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
          value={value} onChange={(e) => onChange(e.target.value)} required minLength={6} />
        <button type="button" onClick={onTogglePassword} className="text-[#A0A0B0] hover:text-white transition shrink-0">
          {showPassword ? <EyeOff size={12} /> : <Eye size={12} />}
        </button>
      </div>
      {error && <p className="text-red-400 text-[10px] mt-0.5 ml-2">{error}</p>}
    </div>
  );
}