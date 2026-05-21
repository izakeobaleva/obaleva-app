import React, { useState } from 'react';
import { supabase } from "./lib/supabaseClient";
import { LogOut, User, Phone, CreditCard, Calendar, MapPin, Car, Key, Shield, Upload } from 'lucide-react';

interface DriverRegistrationFixedProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
  onLogout?: () => void;
}

const DriverRegistrationFixed: React.FC<DriverRegistrationFixedProps> = ({ user, onClose, onSuccess, onLogout }) => {
  const [loading, setLoading] = useState(false);

  // Estados dos campos
  const [nome, setNome] = useState(user?.user_metadata?.nome_completo || '');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cnhNumero, setCnhNumero] = useState('');
  const [cnhCategoria, setCnhCategoria] = useState('');
  const [cnhValidade, setCnhValidade] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');

  const handleLogout = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await supabase.auth.signOut();
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Atualizar tipo do usuário
      await supabase.from('usuarios').update({ tipo: 'motorista' }).eq('id', user.id);
      
      // Inserir na tabela motoristas
      await supabase.from('motoristas').insert({
        id: user.id,
        status: 'pendente',
        nome_completo: nome,
        telefone: telefone.replace(/\D/g, ''),
        cpf: cpf.replace(/\D/g, ''),
        data_nascimento: dataNascimento,
        endereco: endereco,
        dados_veiculo: {
          placa: placa.toUpperCase(),
          modelo: modelo,
          ano: ano,
          cor: cor
        },
        documentos: {
          cnh_numero: cnhNumero,
          cnh_categoria: cnhCategoria,
          cnh_validade: cnhValidade
        }
      });

      alert('✅ Cadastro enviado com sucesso!');
      onSuccess();
    } catch (error: any) {
      alert('❌ Erro: ' + error.message);
    }
    
    setLoading(false);
  };

  const InputField = ({ icon: Icon, placeholder, value, onChange, type = 'text', maxLength, helper }: any) => (
    <div className="bg-[#1A1528] rounded-xl border border-white/15">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <Icon size={16} className="text-[#F4D03F] shrink-0" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-white outline-none text-sm placeholder:text-[#A0A0B0]"
          maxLength={maxLength}
          required
        />
        {value && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </div>
  );

  const DateField = ({ icon: Icon, placeholder, value, onChange }: any) => (
    <div className="bg-[#1A1528] rounded-xl border border-white/15">
      <div className="flex items-center gap-3 px-4 py-2.5">
        <Icon size={16} className="text-[#F4D03F] shrink-0" />
        <input
          type="date"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-white outline-none text-sm"
          style={{ colorScheme: 'dark' }}
          required
        />
        {value && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#0F0B1A] z-50 flex flex-col" style={{ height: '100dvh' }}>
      {/* Header com botão SAIR */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/10 bg-[#1A1528] flex items-center justify-between">
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition font-medium text-sm"
        >
          <LogOut size={18} />
          Sair
        </button>
        <h2 className="text-white font-bold text-base">Cadastro Motorista</h2>
        <div className="w-14" />
      </div>

      {/* Conteúdo rolável */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 pb-40">
        <div className="bg-[#F4D03F]/10 rounded-xl p-2 text-center">
          <p className="text-[#F4D03F] text-sm font-bold">📝 Dados Pessoais</p>
        </div>

        <InputField icon={User} placeholder="Nome completo *" value={nome} onChange={setNome} />
        <InputField icon={Phone} placeholder="WhatsApp *" value={telefone} onChange={(v: string) => setTelefone(formatPhone(v))} maxLength={15} />
        <InputField icon={CreditCard} placeholder="CPF *" value={cpf} onChange={(v: string) => setCpf(formatCPF(v))} maxLength={14} />
        <DateField icon={Calendar} placeholder="Data de nascimento *" value={dataNascimento} onChange={setDataNascimento} />

        <div className="bg-[#F4D03F]/10 rounded-xl p-2 text-center">
          <p className="text-[#F4D03F] text-sm font-bold">🏠 Endereço</p>
        </div>

        <InputField icon={MapPin} placeholder="Endereço completo *" value={endereco} onChange={setEndereco} />

        <div className="bg-[#F4D03F]/10 rounded-xl p-2 text-center">
          <p className="text-[#F4D03F] text-sm font-bold">📄 CNH</p>
        </div>

        <InputField icon={Key} placeholder="Número da CNH *" value={cnhNumero} onChange={setCnhNumero} />
        <InputField icon={Shield} placeholder="Categoria * (A, B, C, D, E)" value={cnhCategoria} onChange={(v: string) => setCnhCategoria(v.toUpperCase())} />
        <DateField icon={Calendar} placeholder="Validade da CNH *" value={cnhValidade} onChange={setCnhValidade} />

        <div className="bg-[#F4D03F]/10 rounded-xl p-2 text-center">
          <p className="text-[#F4D03F] text-sm font-bold">🚗 Veículo</p>
        </div>

        <InputField icon={Car} placeholder="Placa *" value={placa} onChange={(v: string) => setPlaca(v.toUpperCase())} maxLength={8} />
        <InputField icon={Car} placeholder="Modelo *" value={modelo} onChange={setModelo} />
        <InputField icon={Calendar} placeholder="Ano *" value={ano} onChange={setAno} maxLength={4} />
        <InputField icon={Car} placeholder="Cor *" value={cor} onChange={setCor} />
      </div>

      {/* Botão Confirmar SEMPRE VISÍVEL */}
      <div className="flex-shrink-0 p-4 border-t border-white/10 bg-[#1A1528]">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-sm hover:opacity-90 transition active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Cadastrando...' : '✅ Confirmar Cadastro'}
        </button>
      </div>
    </div>
  );
};

export default DriverRegistrationFixed;