import React, { useState } from 'react';
import { supabase } from "./lib/supabaseClient";
import { LogOut, User, Phone, CreditCard, Calendar, MapPin, Car, Key, Shield, ChevronLeft } from 'lucide-react';

interface DriverRegistrationWizardProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
  onLogout?: () => void;
}

const DriverRegistrationWizard: React.FC<DriverRegistrationWizardProps> = ({ user, onClose, onSuccess, onLogout }) => {
  const [etapa, setEtapa] = useState(1);
  const [loading, setLoading] = useState(false);

  // Dados do formulário
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

  const totalEtapas = 4;

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

  const handleAvancar = () => {
    if (etapa < totalEtapas) setEtapa(etapa + 1);
  };

  const handleVoltar = () => {
    if (etapa > 1) setEtapa(etapa - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await supabase.from('usuarios').update({ tipo: 'motorista' }).eq('id', user.id);
      await supabase.from('motoristas').insert({
        id: user.id, status: 'pendente', nome_completo: nome,
        telefone: telefone.replace(/\D/g, ''), cpf: cpf.replace(/\D/g, ''),
        data_nascimento: dataNascimento, endereco: endereco,
        dados_veiculo: { placa: placa.toUpperCase(), modelo, ano, cor },
        documentos: { cnh_numero: cnhNumero, cnh_categoria: cnhCategoria, cnh_validade: cnhValidade }
      });
      alert('✅ Cadastro enviado!');
      onSuccess();
    } catch (error: any) { alert('❌ Erro: ' + error.message); }
    setLoading(false);
  };

  const InputField = ({ icon: Icon, placeholder, value, onChange, type = 'text', maxLength }: any) => (
    <div className="bg-[#1A1528] rounded-xl border border-white/15">
      <div className="flex items-center gap-3 px-3 py-2">
        <Icon size={15} className="text-[#F4D03F] shrink-0" />
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
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </div>
  );

  const DateField = ({ icon: Icon, value, onChange, placeholder }: any) => (
    <div className="bg-[#1A1528] rounded-xl border border-white/15">
      <div className="flex items-center gap-3 px-3 py-2">
        <Icon size={15} className="text-[#F4D03F] shrink-0" />
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-white outline-none text-sm"
          style={{ colorScheme: 'dark' }}
          required
        />
        {value && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#0F0B1A] z-50 flex flex-col" style={{ height: '100dvh' }}>
      {/* Header fixo */}
      <div className="flex-shrink-0 px-4 py-2.5 border-b border-white/10 bg-[#1A1528] flex items-center justify-between">
        <button onClick={handleLogout} className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm font-medium">
          <LogOut size={16} />
          Sair
        </button>
        <h2 className="text-white font-bold text-sm">Cadastro Motorista</h2>
        <span className="text-[#A0A0B0] text-xs">{etapa}/{totalEtapas}</span>
      </div>

      {/* Barra de progresso */}
      <div className="flex-shrink-0 px-4 py-2 bg-[#1A1528]">
        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#F4D03F] to-[#FFD966] rounded-full transition-all duration-300"
            style={{ width: `${(etapa / totalEtapas) * 100}%` }}
          />
        </div>
      </div>

      {/* Conteúdo rolável - APENAS OS CAMPOS */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {/* ETAPA 1 - DADOS PESSOAIS */}
        {etapa === 1 && (
          <>
            <div className="bg-[#F4D03F]/10 rounded-xl p-1.5 text-center">
              <p className="text-[#F4D03F] text-xs font-bold">📝 Dados Pessoais</p>
            </div>
            <InputField icon={User} placeholder="Nome completo *" value={nome} onChange={setNome} />
            <InputField icon={Phone} placeholder="WhatsApp *" value={telefone} onChange={(v) => setTelefone(formatPhone(v))} maxLength={15} />
            <InputField icon={CreditCard} placeholder="CPF *" value={cpf} onChange={(v) => setCpf(formatCPF(v))} maxLength={14} />
            <DateField icon={Calendar} value={dataNascimento} onChange={setDataNascimento} placeholder="Data de nascimento" />
          </>
        )}

        {/* ETAPA 2 - ENDEREÇO */}
        {etapa === 2 && (
          <>
            <div className="bg-[#F4D03F]/10 rounded-xl p-1.5 text-center">
              <p className="text-[#F4D03F] text-xs font-bold">🏠 Endereço</p>
            </div>
            <InputField icon={MapPin} placeholder="Endereço completo *" value={endereco} onChange={setEndereco} />
          </>
        )}

        {/* ETAPA 3 - CNH */}
        {etapa === 3 && (
          <>
            <div className="bg-[#F4D03F]/10 rounded-xl p-1.5 text-center">
              <p className="text-[#F4D03F] text-xs font-bold">📄 CNH</p>
            </div>
            <InputField icon={Key} placeholder="Número da CNH *" value={cnhNumero} onChange={setCnhNumero} />
            <InputField icon={Shield} placeholder="Categoria * (A, B, C, D, E)" value={cnhCategoria} onChange={(v) => setCnhCategoria(v.toUpperCase())} />
            <DateField icon={Calendar} value={cnhValidade} onChange={setCnhValidade} placeholder="Validade da CNH" />
          </>
        )}

        {/* ETAPA 4 - VEÍCULO */}
        {etapa === 4 && (
          <>
            <div className="bg-[#F4D03F]/10 rounded-xl p-1.5 text-center">
              <p className="text-[#F4D03F] text-xs font-bold">🚗 Veículo</p>
            </div>
            <InputField icon={Car} placeholder="Placa *" value={placa} onChange={(v) => setPlaca(v.toUpperCase())} maxLength={8} />
            <InputField icon={Car} placeholder="Modelo *" value={modelo} onChange={setModelo} />
            <InputField icon={Calendar} placeholder="Ano *" value={ano} onChange={setAno} maxLength={4} />
            <InputField icon={Car} placeholder="Cor *" value={cor} onChange={setCor} />
          </>
        )}
      </div>

      {/* Botão fixo ACIMA da faixa inferior - fora do scroll */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-white/10 bg-[#1A1528]">
        <div className="flex gap-3">
          {etapa > 1 && (
            <button
              onClick={handleVoltar}
              className="px-4 py-3 rounded-xl border border-white/20 text-white font-bold text-sm flex items-center gap-1 hover:bg-white/5 transition"
            >
              <ChevronLeft size={16} />
              Voltar
            </button>
          )}
          
          {etapa < totalEtapas ? (
            <button
              onClick={handleAvancar}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-sm hover:opacity-90 transition active:scale-[0.98]"
            >
              Continuar
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold text-sm hover:opacity-90 transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Cadastrando...' : '✅ Confirmar Cadastro'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverRegistrationWizard;