import { useState } from 'react';
import InputMask from 'react-input-mask';

// ─── COMPONENTE DATA INPUT ──────────────────
function DateInput({ value, onChange, label = "Data de Nascimento" }: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
        📅 {label}
      </label>
      <div className={`
        flex items-center gap-3 px-4 py-3
        bg-white border-2 rounded-xl transition-all duration-200
        ${focused
          ? 'border-[#7C3AED] shadow-[0_0_0_4px_rgba(124,58,237,0.15)]'
          : 'border-[#E5E7EB]'
        }
      `}>
        <span className="text-xl">📅</span>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-[#1E1B4B] text-base
                     outline-none [appearance:textfield]
                     [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          style={{ colorScheme: 'dark' }}
        />
      </div>
    </div>
  );
}

// ─── COMPONENTE PHONE INPUT ─────────────────
function PhoneInput({ value, onChange, label = "Celular" }: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
        📱 {label}
      </label>
      <div className={`
        flex items-center gap-3 px-4 py-3
        bg-white border-2 rounded-xl transition-all duration-200
        ${focused
          ? 'border-[#7C3AED] shadow-[0_0_0_4px_rgba(124,58,237,0.15)]'
          : 'border-[#E5E7EB]'
        }
      `}>
        <span className="text-xl">📱</span>
        <InputMask
          mask="(99) 9 9999-9999"
          maskChar=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-[#1E1B4B] text-base outline-none"
        >
          <input
            type="tel"
            placeholder="(11) 9 9999-9999"
            className="w-full bg-transparent outline-none"
          />
        </InputMask>
      </div>
    </div>
  );
}

// ─── REGISTER OVERLAY PRINCIPAL ─────────────
export default function RegisterOverlay() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    birthDate: '',
    email: '',
    password: '',
  });

  return (
    <div className="min-h-screen bg-[#FAF5FF] px-6 py-8">

      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-3xl flex items-center justify-center shadow-xl">
          <span className="text-4xl">🚕</span>
        </div>
        <h1 className="text-3xl font-bold text-[#1E1B4B] mt-4">
          ObaLeva
        </h1>
        <p className="text-[#6B7280] text-sm mt-1">
          Crie sua conta agora
        </p>
      </div>

      {/* Formulário */}
      <div className="space-y-4 max-w-sm mx-auto">

        {/* Nome */}
        <div>
          <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
            👤 Nome Completo
          </label>
          <input
            type="text"
            placeholder="Seu nome completo"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 bg-white border-2 border-[#E5E7EB] rounded-xl
                       text-[#1E1B4B] text-base outline-none
                       focus:border-[#7C3AED] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)]
                       transition-all"
          />
        </div>

        {/* 📱 TELEFONE — MÁSCARA BR */}
        <PhoneInput
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
          label="Celular"
        />

        {/* 📅 DATA — DIGITÁVEL 18/11/1977 */}
        <DateInput
          value={form.birthDate}
          onChange={(v) => setForm({ ...form, birthDate: v })}
          label="Data de Nascimento"
        />

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
            📧 Email
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 bg-white border-2 border-[#E5E7EB] rounded-xl
                       text-[#1E1B4B] text-base outline-none
                       focus:border-[#7C3AED] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)]
                       transition-all"
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
            🔒 Senha
          </label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full px-4 py-3 bg-white border-2 border-[#E5E7EB] rounded-xl
                       text-[#1E1B4B] text-base outline-none
                       focus:border-[#7C3AED] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)]
                       transition-all"
          />
        </div>

        {/* Botão Cadastrar */}
        <button className="w-full h-14 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6]
                           text-white font-bold text-lg rounded-2xl shadow-xl
                           active:scale-95 transition-transform">
          ✅ CADASTRAR
        </button>

        {/* Botão Google */}
        <button className="w-full h-14 bg-white border-2 border-[#E5E7EB]
                           text-[#1E1B4B] font-bold text-base rounded-2xl
                           active:scale-95 transition-transform
                           flex items-center justify-center gap-3">
          <span className="text-2xl">🔵</span>
          Cadastrar com Google
        </button>

        {/* Link Login */}
        <p className="text-center text-sm text-[#6B7280]">
          Já tem conta?{' '}
          <span className="text-[#7C3AED] font-semibold cursor-pointer">
            Entre aqui →
          </span>
        </p>
      </div>
    </div>
  );
}