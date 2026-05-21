import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  ArrowLeft, Camera, Upload, FileText, Home, CreditCard, 
  User, Mail, Phone, MapPin, Calendar, Car, Key, Shield, X, 
  CheckCircle, AlertCircle, Image as ImageIcon
} from 'lucide-react';

interface DriverRegistrationModalProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

const DriverRegistrationModal: React.FC<DriverRegistrationModalProps> = ({ user, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Dados pessoais
  const [nome, setNome] = useState(user?.user_metadata?.nome_completo || user?.email?.split('@')[0] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  
  // Documentos
  const [cnhNumero, setCnhNumero] = useState('');
  const [cnhCategoria, setCnhCategoria] = useState('');
  const [cnhValidade, setCnhValidade] = useState('');
  const [cnhPreview, setCnhPreview] = useState<string | null>(null);
  
  // Veículo
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');
  const [fotoVeiculoPreview, setFotoVeiculoPreview] = useState<string | null>(null);
  
  const cnhRef = useRef<HTMLInputElement>(null);
  const fotoVeiculoRef = useRef<HTMLInputElement>(null);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === 'cnh') setCnhPreview(preview);
    else if (type === 'veiculo') setFotoVeiculoPreview(preview);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
      if (cpf.replace(/\D/g, '').length !== 11) newErrors.cpf = 'CPF inválido';
      if (!telefone) newErrors.telefone = 'Telefone é obrigatório';
      if (!dataNascimento) newErrors.dataNascimento = 'Data de nascimento é obrigatória';
      if (!endereco) newErrors.endereco = 'Endereço é obrigatório';
      if (!bairro) newErrors.bairro = 'Bairro é obrigatório';
      if (!cidade) newErrors.cidade = 'Cidade é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    
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
        endereco: `${endereco}, ${bairro} - ${cidade}`,
        dados_veiculo: {
          placa: placa.toUpperCase(),
          modelo,
          ano,
          cor
        },
        documentos: {
          cnh_numero: cnhNumero,
          cnh_categoria: cnhCategoria,
          cnh_validade: cnhValidade
        }
      });
      
      alert('✅ Solicitação enviada! Aguarde aprovação.');
      onSuccess();
    } catch (error: any) {
      alert('❌ Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] rounded-2xl border border-[#F4D03F]/20 shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            {step > 1 ? (
              <button onClick={handleBack} className="text-[#A0A0B0] hover:text-white p-1">
                <ArrowLeft size={22} />
              </button>
            ) : (
              <button onClick={onClose} className="text-[#A0A0B0] hover:text-white p-1">
                <X size={22} />
              </button>
            )}
            <h2 className="text-white text-base font-bold">Seja Motorista</h2>
            <div className="w-8" />
          </div>

          {/* Progresso */}
          <div className="px-4 pt-3">
            <div className="flex justify-between text-xs text-[#A0A0B0] mb-1.5">
              <span className={step >= 1 ? 'text-[#F4D03F] text-sm font-bold' : 'text-xs'}>📋 DADOS</span>
              <span className={step >= 2 ? 'text-[#F4D03F] text-sm font-bold' : 'text-xs'}>📄 CNH</span>
              <span className={step >= 3 ? 'text-[#F4D03F] text-sm font-bold' : 'text-xs'}>🚗 VEÍCULO</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-[#F4D03F] to-[#FFD966] rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="px-4 pb-3 max-h-[60vh] overflow-y-auto">
            
            {/* PASSO 1 */}
            {step === 1 && (
              <div className="space-y-2.5">
                <div className="bg-[#F4D03F]/10 rounded-lg p-2 text-center mb-1">
                  <p className="text-[#F4D03F] text-base font-bold">📝 Informações Pessoais</p>
                  <p className="text-[#A0A0B0] text-xs">Complete seus dados para começar</p>
                </div>
                
                <InputField icon={<User size={18} />} placeholder="Nome completo *" value={nome} onChange={setNome} error={errors.nome} />
                <InputField icon={<Mail size={18} />} placeholder="E-mail" value={email} onChange={setEmail} disabled />
                <InputField icon={<Phone size={18} />} placeholder="WhatsApp *" value={telefone} onChange={(v) => setTelefone(formatPhone(v))} maxLength={15} error={errors.telefone} />
                <InputField icon={<CreditCard size={18} />} placeholder="CPF *" value={cpf} onChange={(v) => setCpf(formatCPF(v))} maxLength={14} error={errors.cpf} />
                <InputField type="date" icon={<Calendar size={18} />} placeholder="Data de nascimento *" value={dataNascimento} onChange={setDataNascimento} error={errors.dataNascimento} />
                <InputField icon={<MapPin size={18} />} placeholder="Endereço * (Rua, Avenida)" value={endereco} onChange={setEndereco} error={errors.endereco} />
                <InputField icon={<MapPin size={18} />} placeholder="Bairro *" value={bairro} onChange={setBairro} error={errors.bairro} />
                <InputField icon={<MapPin size={18} />} placeholder="Cidade *" value={cidade} onChange={setCidade} error={errors.cidade} />
              </div>
            )}

            {/* PASSO 2 */}
            {step === 2 && (
              <div className="space-y-2.5">
                <div className="bg-[#F4D03F]/10 rounded-lg p-2 text-center mb-1">
                  <p className="text-[#F4D03F] text-base font-bold">📄 CNH</p>
                  <p className="text-[#A0A0B0] text-xs">Dados da sua Carteira de Habilitação</p>
                </div>
                <InputField icon={<Key size={18} />} placeholder="Número da CNH *" value={cnhNumero} onChange={setCnhNumero} />
                <InputField icon={<Shield size={18} />} placeholder="Categoria * (A, B, C, D, E)" value={cnhCategoria} onChange={(v) => setCnhCategoria(v.toUpperCase())} />
                <InputField type="date" icon={<Calendar size={18} />} placeholder="Data de validade *" value={cnhValidade} onChange={setCnhValidade} />
                <UploadField label="Foto da CNH (frente e verso) *" preview={cnhPreview} onClick={() => cnhRef.current?.click()} />
                <input ref={cnhRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cnh')} />
              </div>
            )}

            {/* PASSO 3 */}
            {step === 3 && (
              <div className="space-y-2.5">
                <div className="bg-[#F4D03F]/10 rounded-lg p-2 text-center mb-1">
                  <p className="text-[#F4D03F] text-base font-bold">🚗 Veículo</p>
                  <p className="text-[#A0A0B0] text-xs">Dados do seu veículo</p>
                </div>
                <InputField icon={<Car size={18} />} placeholder="Placa * (ABC-1234)" value={placa} onChange={(v) => setPlaca(v.toUpperCase())} maxLength={8} />
                <InputField icon={<Car size={18} />} placeholder="Modelo *" value={modelo} onChange={setModelo} />
                <InputField icon={<Calendar size={18} />} placeholder="Ano *" value={ano} onChange={setAno} maxLength={4} />
                <InputField icon={<Car size={18} />} placeholder="Cor *" value={cor} onChange={setCor} />
                <UploadField label="Foto do veículo *" preview={fotoVeiculoPreview} onClick={() => fotoVeiculoRef.current?.click()} />
                <input ref={fotoVeiculoRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'veiculo')} />
              </div>
            )}
          </div>

          {/* BOTÕES - SEMPRE VISÍVEIS */}
          <div className="p-4 border-t border-white/10 flex gap-2">
            {step > 1 ? (
              <button 
                onClick={handleBack} 
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/5 transition"
              >
                ← Voltar
              </button>
            ) : (
              <button 
                onClick={onClose} 
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white font-bold text-sm hover:bg-white/5 transition"
              >
                Cancelar
              </button>
            )}
            
            {step < 3 ? (
              <button 
                onClick={handleNext} 
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-sm hover:scale-[1.02] transition"
              >
                Continuar →
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold text-sm hover:scale-[1.02] transition disabled:opacity-50"
              >
                {loading ? 'Enviando...' : '✅ Enviar solicitação'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares
const InputField = ({ icon, placeholder, type = 'text', value, onChange, maxLength, disabled, error }: any) => (
  <div>
    <div className={`bg-white/5 rounded-xl border ${error ? 'border-red-500' : 'border-white/15'} flex items-center gap-3 px-3 py-2.5`}>
      <span className="text-[#F4D03F] shrink-0">{icon}</span>
      <input 
        type={type} 
        placeholder={placeholder} 
        className="flex-1 bg-transparent text-white outline-none text-base placeholder:text-[#A0A0B0]" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        maxLength={maxLength}
        disabled={disabled}
      />
      {value && !error && <CheckCircle size={16} className="text-green-400 shrink-0" />}
    </div>
    {error && <p className="text-red-400 text-xs mt-0.5 ml-2">{error}</p>}
  </div>
);

const UploadField = ({ label, preview, onClick }: any) => (
  <div className="mt-2">
    <label className="text-[#F4D03F] text-sm font-bold mb-1 block">{label}</label>
    <div 
      className="bg-white/5 rounded-xl border border-dashed border-[#F4D03F]/30 p-3 text-center cursor-pointer hover:bg-white/10 transition" 
      onClick={onClick}
    >
      {preview ? (
        <img src={preview} className="w-full h-28 object-cover rounded-lg" />
      ) : (
        <>
          <Upload size={24} className="text-[#F4D03F] mx-auto mb-1" />
          <p className="text-[#A0A0B0] text-sm">Clique para enviar a foto</p>
          <p className="text-[#A0A0B0] text-xs">PNG ou JPG • Máx 5MB</p>
        </>
      )}
    </div>
  </div>
);

export default DriverRegistrationModal;