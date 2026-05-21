import React, { useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { LogOut, User, Phone, CreditCard, Calendar, MapPin, Car, Key, Shield, Upload, ChevronLeft, CheckCircle } from 'lucide-react';

interface DriverRegistrationWizardProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
  onLogout?: () => void;
}

interface ErrosType {
  nome?: string;
  telefone?: string;
  cpf?: string;
  dataNascimento?: string;
  endereco?: string;
  cnhNumero?: string;
  cnhCategoria?: string;
  cnhValidade?: string;
  placa?: string;
  modelo?: string;
  ano?: string;
  cor?: string;
}

const DriverRegistrationWizard: React.FC<DriverRegistrationWizardProps> = ({ user, onClose, onSuccess, onLogout }) => {
  const [etapa, setEtapa] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState<ErrosType>({});
  const [cnhFrente, setCnhFrente] = useState<File | null>(null);
  const [cnhVerso, setCnhVerso] = useState<File | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);

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
    if (onLogout) { onLogout(); return; }
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = '/';
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

  const validarCampo = (campo: string, valor: string): string => {
    if (!valor.trim()) return 'Campo obrigatório';
    if (campo === 'telefone') {
      const nums = valor.replace(/\D/g, '');
      if (nums.length < 10) return 'Telefone inválido';
    }
    if (campo === 'cpf') {
      const nums = valor.replace(/\D/g, '');
      if (nums.length !== 11) return 'CPF deve ter 11 dígitos';
    }
    if (campo === 'ano') {
      const year = parseInt(valor);
      if (year < 2000 || year > 2026) return 'Ano inválido';
    }
    return '';
  };

  const handleChange = (setter: any, campo: string) => (valor: string) => {
    setter(valor);
    const erro = validarCampo(campo, valor);
    setErros(prev => ({ ...prev, [campo]: erro }));
  };

  const validarEtapa = (): boolean => {
    const novosErros: ErrosType = {};
    
    if (etapa === 1) {
      const nomeErro = validarCampo('nome', nome);
      const telErro = validarCampo('telefone', telefone);
      const cpfErro = validarCampo('cpf', cpf);
      const dataErro = validarCampo('dataNascimento', dataNascimento);
      if (nomeErro) novosErros.nome = nomeErro;
      if (telErro) novosErros.telefone = telErro;
      if (cpfErro) novosErros.cpf = cpfErro;
      if (dataErro) novosErros.dataNascimento = dataErro;
    } else if (etapa === 2) {
      const endErro = validarCampo('endereco', endereco);
      if (endErro) novosErros.endereco = endErro;
    } else if (etapa === 3) {
      const cnhNumErro = validarCampo('cnhNumero', cnhNumero);
      const cnhCatErro = validarCampo('cnhCategoria', cnhCategoria);
      const cnhValErro = validarCampo('cnhValidade', cnhValidade);
      if (cnhNumErro) novosErros.cnhNumero = cnhNumErro;
      if (cnhCatErro) novosErros.cnhCategoria = cnhCatErro;
      if (cnhValErro) novosErros.cnhValidade = cnhValErro;
    } else if (etapa === 4) {
      const placaErro = validarCampo('placa', placa);
      const modeloErro = validarCampo('modelo', modelo);
      const anoErro = validarCampo('ano', ano);
      const corErro = validarCampo('cor', cor);
      if (placaErro) novosErros.placa = placaErro;
      if (modeloErro) novosErros.modelo = modeloErro;
      if (anoErro) novosErros.ano = anoErro;
      if (corErro) novosErros.cor = corErro;
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleAvancar = () => {
    if (validarEtapa()) {
      setErros({});
      if (etapa < totalEtapas) setEtapa(etapa + 1);
    }
  };

  const handleVoltar = () => {
    setErros({});
    if (etapa > 1) setEtapa(etapa - 1);
  };

  const handleSubmit = async () => {
    if (!validarEtapa()) return;
    setLoading(true);
    try {
      await supabase.from('usuarios').update({ tipo: 'motorista' }).eq('id', user.id);
      await supabase.from('motoristas').insert({
        id: user.id,
        status: 'pendente',
        nome_completo: nome,
        telefone: telefone.replace(/\D/g, ''),
        cpf: cpf.replace(/\D/g, ''),
        data_nascimento: dataNascimento,
        endereco: endereco,
        dados_veiculo: { placa: placa.toUpperCase(), modelo, ano, cor },
        documentos: { 
          cnh_numero: cnhNumero, cnh_categoria: cnhCategoria, 
          cnh_validade: cnhValidade,
          cnh_frente: cnhFrente?.name || null,
          cnh_verso: cnhVerso?.name || null
        }
      });
      alert('✅ Cadastro enviado! Aguarde aprovação.');
      onSuccess();
    } catch (error: any) { 
      alert('❌ Erro: ' + error.message); 
    }
    setLoading(false);
  };

  const InputField = ({ icon: Icon, placeholder, value, onChange, type = 'text', maxLength, erro, campo }: any) => (
    <div className="mb-[6px]">
      <div className={`flex items-center gap-2 px-3 py-[6px] rounded-xl border ${erro ? 'border-red-500/50' : 'border-white/15'} bg-[#1A1528] focus-within:ring-1 focus-within:ring-[#F4D03F]`}>
        <Icon size={13} className="text-[#F4D03F] shrink-0" />
        <input 
          type={type} placeholder={placeholder} value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-white outline-none text-xs placeholder:text-[#A0A0B0]"
          maxLength={maxLength} required
        />
        {value && !erro && <CheckCircle size={12} className="text-green-400 shrink-0" />}
      </div>
      {erro && <p className="text-red-400 text-[9px] mt-[2px] ml-1">{erro}</p>}
    </div>
  );

  const DateField = ({ icon: Icon, value, onChange, erro, campo }: any) => (
    <div className="mb-[6px]">
      <div className={`flex items-center gap-2 px-3 py-[6px] rounded-xl border ${erro ? 'border-red-500/50' : 'border-white/15'} bg-[#1A1528] focus-within:ring-1 focus-within:ring-[#F4D03F]`}>
        <Icon size={13} className="text-[#F4D03F] shrink-0" />
        <input 
          type="date" value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-white outline-none text-xs"
          style={{ colorScheme: 'dark' }} required
        />
        {value && !erro && <CheckCircle size={12} className="text-green-400 shrink-0" />}
      </div>
      {erro && <p className="text-red-400 text-[9px] mt-[2px] ml-1">{erro}</p>}
    </div>
  );

  const UploadField = ({ label, file, onChange }: any) => (
    <div className="mb-[4px]">
      <label className="text-[#A0A0B0] text-[10px] block">{label}</label>
      <div 
        className="bg-[#1A1528] rounded-xl border border-dashed border-[#F4D03F]/30 p-2 text-center cursor-pointer hover:bg-white/5 transition"
        onClick={() => document.getElementById(label.replace(/\s/g, ''))?.click()}
      >
        <Upload size={14} className="text-[#F4D03F] mx-auto mb-[2px]" />
        <p className="text-[#A0A0B0] text-[10px] truncate">{file ? file.name : 'Toque para enviar'}</p>
        <input 
          id={label.replace(/\s/g, '')} type="file" accept="image/*,.pdf" className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] || null)} 
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#0F0B1A] z-50 flex flex-col" style={{ height: '100dvh', overflow: 'hidden' }}>
      {/* Header fixo */}
      <div className="flex-shrink-0 px-4 py-[6px] border-b border-white/10 bg-[#1A1528] flex items-center justify-between">
        <button onClick={handleLogout} className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium">
          <LogOut size={14} /> Sair
        </button>
        <h2 className="text-white font-bold text-xs">Cadastro Motorista</h2>
        <span className="text-[#A0A0B0] text-[10px]">{etapa}/{totalEtapas}</span>
      </div>

      {/* Barra de progresso */}
      <div className="flex-shrink-0 px-4 py-1 bg-[#1A1528]">
        <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#F4D03F] to-[#FFD966] rounded-full transition-all duration-300"
            style={{ width: `${(etapa / totalEtapas) * 100}%` }} />
        </div>
      </div>

      {/* Título da etapa */}
      <div className="flex-shrink-0 px-4 py-1">
        <div className="bg-[#F4D03F]/10 rounded-lg p-1 text-center">
          <p className="text-[#F4D03F] text-[10px] font-bold">
            {etapa === 1 ? '📝 Dados Pessoais' : 
             etapa === 2 ? '🏠 Endereço & Documentos' : 
             etapa === 3 ? '📄 CNH' : '🚗 Veículo'}
          </p>
        </div>
      </div>

      {/* CONTEÚDO SEM SCROLL - tudo cabe na tela */}
      <div className="flex-1 px-4 py-1 overflow-hidden">
        {etapa === 1 && (
          <>
            <InputField icon={User} placeholder="Nome completo *" value={nome} onChange={handleChange(setNome, 'nome')} erro={erros.nome} campo="nome" />
            <InputField icon={Phone} placeholder="WhatsApp *" value={telefone} onChange={handleChange(setTelefone, 'telefone')} maxLength={15} erro={erros.telefone} campo="telefone" />
            <InputField icon={CreditCard} placeholder="CPF *" value={cpf} onChange={handleChange(setCpf, 'cpf')} maxLength={14} erro={erros.cpf} campo="cpf" />
            <DateField icon={Calendar} value={dataNascimento} onChange={handleChange(setDataNascimento, 'dataNascimento')} erro={erros.dataNascimento} campo="dataNascimento" />
          </>
        )}

        {etapa === 2 && (
          <>
            <InputField icon={MapPin} placeholder="Endereço completo *" value={endereco} onChange={handleChange(setEndereco, 'endereco')} erro={erros.endereco} campo="endereco" />
            <UploadField label="CNH - Frente" file={cnhFrente} onChange={setCnhFrente} />
            <UploadField label="CNH - Verso" file={cnhVerso} onChange={setCnhVerso} />
            <UploadField label="Foto de Perfil" file={fotoPerfil} onChange={setFotoPerfil} />
          </>
        )}

        {etapa === 3 && (
          <>
            <InputField icon={Key} placeholder="Número da CNH *" value={cnhNumero} onChange={handleChange(setCnhNumero, 'cnhNumero')} erro={erros.cnhNumero} campo="cnhNumero" />
            <InputField icon={Shield} placeholder="Categoria * (A, B, C, D, E)" value={cnhCategoria} onChange={handleChange(setCnhCategoria, 'cnhCategoria')} erro={erros.cnhCategoria} campo="cnhCategoria" />
            <DateField icon={Calendar} value={cnhValidade} onChange={handleChange(setCnhValidade, 'cnhValidade')} erro={erros.cnhValidade} campo="cnhValidade" />
          </>
        )}

        {etapa === 4 && (
          <>
            <InputField icon={Car} placeholder="Placa *" value={placa} onChange={handleChange(setPlaca, 'placa')} maxLength={8} erro={erros.placa} campo="placa" />
            <InputField icon={Car} placeholder="Modelo *" value={modelo} onChange={handleChange(setModelo, 'modelo')} erro={erros.modelo} campo="modelo" />
            <InputField icon={Calendar} placeholder="Ano *" value={ano} onChange={handleChange(setAno, 'ano')} maxLength={4} erro={erros.ano} campo="ano" />
            <InputField icon={Car} placeholder="Cor *" value={cor} onChange={handleChange(setCor, 'cor')} erro={erros.cor} campo="cor" />
          </>
        )}

        {/* Mensagem de propriedade - ocupa espaço restante */}
        <div className="flex items-center justify-center h-full min-h-[20px]">
          <p className="text-[#A0A0B0] text-[9px] text-center opacity-60">
            💡 Complete seu cadastro e comece a ganhar como motorista parceiro!
          </p>
        </div>
      </div>

      {/* BOTÃO FIXO ACIMA DA BARRA INFERIOR - SEMPRE VISÍVEL */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-white/10 bg-[#1A1528]">
        <div className="flex gap-2">
          {etapa > 1 && (
            <button onClick={handleVoltar}
              className="px-3 py-[7px] rounded-xl border border-white/20 text-white font-bold text-[10px] flex items-center gap-1 hover:bg-white/5 transition">
              <ChevronLeft size={12} /> Voltar
            </button>
          )}
          {etapa < totalEtapas ? (
            <button onClick={handleAvancar}
              className="flex-1 py-[7px] rounded-xl bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] font-bold text-[10px] hover:opacity-90 transition active:scale-[0.98]">
              Continuar
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={loading}
              className="flex-1 py-[7px] rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold text-[10px] hover:opacity-90 transition active:scale-[0.98] disabled:opacity-50">
              {loading ? 'Cadastrando...' : '✅ Confirmar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverRegistrationWizard;