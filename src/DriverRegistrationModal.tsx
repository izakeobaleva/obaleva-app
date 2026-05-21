import React, { useState, useRef } from 'react';
import { supabase } from "./lib/supabaseClient";
import { 
  ArrowLeft, Upload, User, Mail, Phone, MapPin, Calendar, Car, 
  Key, Shield, X, CreditCard
} from 'lucide-react';

interface DriverRegistrationModalProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

const DriverRegistrationModal: React.FC<DriverRegistrationModalProps> = ({ user, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [savedData, setSavedData] = useState<any>(() => {
    const saved = localStorage.getItem('driver_registration');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [nome, setNome] = useState(savedData.nome || user?.user_metadata?.nome_completo || user?.email?.split('@')[0] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefone, setTelefone] = useState(savedData.telefone || '');
  const [cpf, setCpf] = useState(savedData.cpf || '');
  const [dataNascimento, setDataNascimento] = useState(savedData.dataNascimento || '');
  const [endereco, setEndereco] = useState(savedData.endereco || '');
  const [cidade, setCidade] = useState(savedData.cidade || '');
  const [bairro, setBairro] = useState(savedData.bairro || '');
  const [cnhNumero, setCnhNumero] = useState(savedData.cnhNumero || '');
  const [cnhCategoria, setCnhCategoria] = useState(savedData.cnhCategoria || '');
  const [cnhValidade, setCnhValidade] = useState(savedData.cnhValidade || '');
  const [cnhPreview, setCnhPreview] = useState(savedData.cnhPreview || null);
  const [placa, setPlaca] = useState(savedData.placa || '');
  const [modelo, setModelo] = useState(savedData.modelo || '');
  const [ano, setAno] = useState(savedData.ano || '');
  const [cor, setCor] = useState(savedData.cor || '');
  const [fotoVeiculoPreview, setFotoVeiculoPreview] = useState(savedData.fotoVeiculoPreview || null);
  
  const cnhRef = useRef<HTMLInputElement>(null);
  const fotoVeiculoRef = useRef<HTMLInputElement>(null);

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

  const saveToLocalStorage = (data: any) => {
    const newData = { ...savedData, ...data };
    setSavedData(newData);
    localStorage.setItem('driver_registration', JSON.stringify(newData));
  };

  const handleFieldChange = (field: string, value: any) => {
    saveToLocalStorage({ [field]: value });
    const setters: any = { 
      nome: setNome, telefone: setTelefone, cpf: setCpf, 
      dataNascimento: setDataNascimento, endereco: setEndereco, 
      cidade: setCidade, bairro: setBairro, cnhNumero: setCnhNumero, 
      cnhCategoria: setCnhCategoria, cnhValidade: setCnhValidade, 
      placa: setPlaca, modelo: setModelo, ano: setAno, cor: setCor 
    };
    if (setters[field]) setters[field](value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === 'cnh') { setCnhPreview(preview); saveToLocalStorage({ cnhPreview: preview }); }
    else if (type === 'veiculo') { setFotoVeiculoPreview(preview); saveToLocalStorage({ fotoVeiculoPreview: preview }); }
  };

  const handleNext = () => {
    if (step === 1 && (!nome || !telefone || !cpf || !dataNascimento || !endereco || !bairro || !cidade)) {
      alert('Preencha todos os campos obrigatórios'); return;
    }
    if (step === 2 && (!cnhNumero || !cnhCategoria || !cnhValidade || !cnhPreview)) {
      alert('Preencha os campos da CNH e envie a foto'); return;
    }
    if (step === 3) {
      if (!placa || !modelo || !ano || !cor || !fotoVeiculoPreview) { alert('Preencha os dados do veículo'); return; }
      handleSubmit(); return;
    }
    setStep(step + 1);
  };

  const handleBack = () => step > 1 && setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await supabase.from('usuarios').update({ tipo: 'motorista' }).eq('id', user.id);
      await supabase.from('motoristas').insert({
        id: user.id, status: 'pendente', nome_completo: nome,
        telefone: telefone.replace(/\D/g, ''), cpf: cpf.replace(/\D/g, ''),
        data_nascimento: dataNascimento, endereco: `${endereco}, ${bairro} - ${cidade}`,
        dados_veiculo: { placa: placa.toUpperCase(), modelo, ano, cor },
        documentos: { cnh_numero: cnhNumero, cnh_categoria: cnhCategoria, cnh_validade: cnhValidade }
      });
      localStorage.removeItem('driver_registration');
      alert('✅ Solicitação enviada!');
      onSuccess();
    } catch (error: any) { alert('❌ Erro: ' + error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-[#0F0B1A] z-50 flex flex-col h-full h-[100dvh]">
      {/* Header fixo no topo */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-white/10 bg-[#1A1528] flex items-center justify-between">
        <button onClick={step > 1 ? handleBack : onClose} className="text-[#A0A0A0] hover:text-white p-2 -ml-2">
          {step > 1 ? <ArrowLeft size={22} /> : <X size={22} />}
        </button>
        <h2 className="text-white text-base font-bold">Cadastro de Motorista</h2>
        <div className="w-8" />
      </div>

      {/* Progresso */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 bg-[#1A1528]">
        <div className="flex justify-between text-[10px] text-[#A0A0B0] mb-1">
          {['📋 DADOS', '📄 CNH', '🚗 VEÍCULO'].map((label, i) => (
            <span key={i} className={step >= i + 1 ? 'text-[#F4D03F] text-xs font-bold' : ''}>{label}</span>
          ))}
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#F4D03F] to-[#FFD966] rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      {/* Conteúdo rolável - ocupa o espaço restante */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
        
        {/* Etapa 1 - Dados Pessoais */}
        {step === 1 && (
          <>
            <div className="bg-[#F4D03F]/10 rounded-xl p-3 text-center">
              <p className="text-[#F4D03F] text-sm font-bold">📝 Dados Pessoais</p>
            </div>
            
            <Campo icon={<User size={18} />} placeholder="Nome completo *" value={nome} onChange={v => handleFieldChange('nome', v)} />
            <Campo icon={<Mail size={18} />} placeholder="E-mail" value={email} disabled />
            <Campo icon={<Phone size={18} />} placeholder="WhatsApp *" value={telefone} onChange={v => handleFieldChange('telefone', formatPhone(v))} maxLength={15} />
            <Campo icon={<CreditCard size={18} />} placeholder="CPF *" value={cpf} onChange={v => handleFieldChange('cpf', formatCPF(v))} maxLength={14} />
            
            {/* Campo de data - digitável e com calendário */}
            <div className="bg-[#1A1528] rounded-xl border border-white/15 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <Calendar size={18} className="text-[#F4D03F] shrink-0" />
                <input 
                  type="date" 
                  value={dataNascimento}
                  onChange={e => handleFieldChange('dataNascimento', e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none text-base"
                  style={{ colorScheme: 'dark' }}
                  required
                />
                {dataNascimento && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                )}
              </div>
            </div>

            <div className="bg-[#F4D03F]/10 rounded-xl p-3 text-center">
              <p className="text-[#F4D03F] text-sm font-bold">🏠 Endereço</p>
            </div>
            
            <Campo icon={<MapPin size={18} />} placeholder="Rua, Avenida *" value={endereco} onChange={v => handleFieldChange('endereco', v)} />
            <Campo icon={<MapPin size={18} />} placeholder="Bairro *" value={bairro} onChange={v => handleFieldChange('bairro', v)} />
            <Campo icon={<MapPin size={18} />} placeholder="Cidade *" value={cidade} onChange={v => handleFieldChange('cidade', v)} />
          </>
        )}

        {/* Etapa 2 - CNH */}
        {step === 2 && (
          <>
            <div className="bg-[#F4D03F]/10 rounded-xl p-3 text-center">
              <p className="text-[#F4D03F] text-sm font-bold">📄 Carteira de Habilitação</p>
            </div>
            
            <Campo icon={<Key size={18} />} placeholder="Número da CNH *" value={cnhNumero} onChange={v => handleFieldChange('cnhNumero', v)} />
            <Campo icon={<Shield size={18} />} placeholder="Categoria * (A, B, C, D, E)" value={cnhCategoria} onChange={v => handleFieldChange('cnhCategoria', v.toUpperCase())} />
            
            {/* Campo de data - válidade da CNH */}
            <div className="bg-[#1A1528] rounded-xl border border-white/15 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3">
                <Calendar size={18} className="text-[#F4D03F] shrink-0" />
                <input 
                  type="date" 
                  value={cnhValidade}
                  onChange={e => handleFieldChange('cnhValidade', e.target.value)}
                  className="flex-1 bg-transparent text-white outline-none text-base"
                  style={{ colorScheme: 'dark' }}
                  required
                />
                {cnhValidade && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                )}
              </div>
            </div>

            <UploadField label="Foto da CNH (frente e verso) *" preview={cnhPreview} onClick={() => cnhRef.current?.click()} />
            <input ref={cnhRef} type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'cnh')} />
          </>
        )}

        {/* Etapa 3 - Veículo */}
        {step === 3 && (
          <>
            <div className="bg-[#F4D03F]/10 rounded-xl p-3 text-center">
              <p className="text-[#F4D03F] text-sm font-bold">🚗 Dados do Veículo</p>
            </div>
            
            <Campo icon={<Car size={18} />} placeholder="Placa *" value={placa} onChange={v => handleFieldChange('placa', v.toUpperCase())} maxLength={8} />
            <Campo icon={<Car size={18} />} placeholder="Modelo *" value={modelo} onChange={v => handleFieldChange('modelo', v)} />
            <Campo icon={<Calendar size={18} />} placeholder="Ano *" value={ano} onChange={v => handleFieldChange('ano', v)} maxLength={4} />
            <Campo icon={<Car size={18} />} placeholder="Cor *" value={cor} onChange={v => handleFieldChange('cor', v)} />
            
            <UploadField label="Foto do veículo *" preview={fotoVeiculoPreview} onClick={() => fotoVeiculoRef.current?.click()} />
            <input ref={fotoVeiculoRef} type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'veiculo')} />
          </>
        )}

        {/* Espaço extra no final para não esconder atrás dos botões */}
        <div className="h-6" />
      </div>

      {/* Botões fixos no final */}
      <div className="flex-shrink-0 p-4 border-t border-white/10 bg-[#1A1528]">
        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={handleBack} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/5 transition active:scale-[0.98]">
              Voltar
            </button>
          )}
          <button 
            onClick={handleNext} 
            disabled={loading} 
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-sm hover:opacity-90 transition active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Enviando...' : (step === 3 ? '✅ Enviar' : 'Continuar')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de campo - otimizado para celular
const Campo = ({ icon, placeholder, type = 'text', value, onChange, maxLength, disabled }: any) => (
  <div className="bg-[#1A1528] rounded-xl border border-white/15 overflow-hidden">
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="text-[#F4D03F] shrink-0">{icon}</span>
      <input 
        type={type} 
        placeholder={placeholder} 
        className="flex-1 bg-transparent text-white outline-none text-base placeholder:text-[#A0A0B0]" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        maxLength={maxLength} 
        disabled={disabled} 
        style={{ minHeight: '24px' }}
      />
      {value && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
    </div>
  </div>
);

const UploadField = ({ label, preview, onClick }: any) => (
  <div>
    <label className="text-[#F4D03F] text-sm font-bold mb-2 block">{label}</label>
    <div 
      className="bg-[#1A1528] rounded-xl border border-dashed border-[#F4D03F]/30 p-6 text-center cursor-pointer hover:bg-white/5 transition active:scale-[0.98]" 
      onClick={onClick}
    >
      {preview ? (
        <img src={preview} className="w-full h-32 object-cover rounded-xl" />
      ) : (
        <>
          <Upload size={28} className="text-[#F4D03F] mx-auto mb-2" />
          <p className="text-[#A0A0B0] text-sm">Toque para enviar foto</p>
          <p className="text-[#A0A0B0] text-xs mt-1">PNG ou JPG • Máx 5MB</p>
        </>
      )}
    </div>
  </div>
);

export default DriverRegistrationModal;