import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  ArrowLeft, Camera, Upload, FileText, Home, CreditCard, 
  User, Mail, Phone, MapPin, Calendar, Car, Key, Shield, X, 
  CheckCircle, Mail as MailIcon, Smartphone, Clock, Eye, EyeOff
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
  const [cnhImagem, setCnhImagem] = useState<File | null>(null);
  const [cnhPreview, setCnhPreview] = useState(savedData.cnhPreview || null);
  
  const [placa, setPlaca] = useState(savedData.placa || '');
  const [modelo, setModelo] = useState(savedData.modelo || '');
  const [ano, setAno] = useState(savedData.ano || '');
  const [cor, setCor] = useState(savedData.cor || '');
  const [fotoVeiculo, setFotoVeiculo] = useState<File | null>(null);
  const [fotoVeiculoPreview, setFotoVeiculoPreview] = useState(savedData.fotoVeiculoPreview || null);
  
  const cnhRef = useRef<HTMLInputElement>(null);
  const fotoVeiculoRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const saveToLocalStorage = (data: any) => {
    const newData = { ...savedData, ...data };
    setSavedData(newData);
    localStorage.setItem('driver_registration', JSON.stringify(newData));
  };

  const handleFieldChange = (field: string, value: any) => {
    saveToLocalStorage({ [field]: value });
    switch(field) {
      case 'nome': setNome(value); break;
      case 'telefone': setTelefone(value); break;
      case 'cpf': setCpf(value); break;
      case 'dataNascimento': setDataNascimento(value); break;
      case 'endereco': setEndereco(value); break;
      case 'cidade': setCidade(value); break;
      case 'bairro': setBairro(value); break;
      case 'cnhNumero': setCnhNumero(value); break;
      case 'cnhCategoria': setCnhCategoria(value); break;
      case 'cnhValidade': setCnhValidade(value); break;
      case 'placa': setPlaca(value); break;
      case 'modelo': setModelo(value); break;
      case 'ano': setAno(value); break;
      case 'cor': setCor(value); break;
    }
  };

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
    if (type === 'cnh') {
      setCnhImagem(file);
      setCnhPreview(preview);
      saveToLocalStorage({ cnhPreview: preview });
    } else if (type === 'veiculo') {
      setFotoVeiculo(file);
      setFotoVeiculoPreview(preview);
      saveToLocalStorage({ fotoVeiculoPreview: preview });
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!nome || !telefone || !cpf || !dataNascimento || !endereco || !cidade || !bairro) {
        alert('Por favor, preencha todos os campos obrigatórios');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!cnhNumero || !cnhCategoria || !cnhValidade || !cnhPreview) {
        alert('Por favor, preencha todos os campos da CNH e envie a foto');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!placa || !modelo || !ano || !cor || !fotoVeiculoPreview) {
        alert('Por favor, preencha todos os dados do veículo e envie a foto');
        return;
      }
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
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
        cnh_numero: cnhNumero,
        cnh_categoria: cnhCategoria,
        cnh_validade: cnhValidade,
        veiculo_placa: placa.toUpperCase(),
        veiculo_modelo: modelo,
        veiculo_ano: ano,
        veiculo_cor: cor
      });
      localStorage.removeItem('driver_registration');
      alert('✅ Solicitação enviada! Aguarde aprovação.');
      onSuccess();
    } catch (error) {
      alert('❌ Erro ao enviar solicitação. Tente novamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] rounded-2xl border border-[#F4D03F]/20 shadow-2xl overflow-hidden">
          
          <div className="p-3 border-b border-white/10 flex items-center justify-between">
            {step > 1 ? (
              <button onClick={handleBack} className="text-[#A0A0B0] hover:text-white"><ArrowLeft size={22} /></button>
            ) : (
              <button onClick={onClose} className="text-[#A0A0B0] hover:text-white"><X size={22} /></button>
            )}
            <h2 className="text-white text-base font-bold">Seja Motorista</h2>
            <div className="w-6" />
          </div>

          <div className="px-4 pt-3">
            <div className="flex justify-between text-[10px] text-[#A0A0B0] mb-1.5">
              <span className={step >= 1 ? 'text-[#F4D03F] text-xs font-bold' : 'text-[10px]'}>📋 DADOS</span>
              <span className={step >= 2 ? 'text-[#F4D03F] text-xs font-bold' : 'text-[10px]'}>📄 CNH</span>
              <span className={step >= 3 ? 'text-[#F4D03F] text-xs font-bold' : 'text-[10px]'}>🚗 VEÍCULO</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-gradient-to-r from-[#F4D03F] to-[#FFD966] rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }} />
            </div>
          </div>

          <div className="px-4 pb-3 max-h-[60vh] overflow-y-auto">
            
            {step === 1 && (
              <div className="space-y-2">
                <div className="bg-[#F4D03F]/10 rounded-lg p-1.5 text-center mb-1">
                  <p className="text-[#F4D03F] text-sm font-bold">📝 Informações Pessoais</p>
                  <p className="text-[#A0A0B0] text-[10px]">Complete seus dados para começar</p>
                </div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><User size={16} className="text-[#F4D03F]" /><input type="text" placeholder="Nome completo *" className="flex-1 bg-transparent text-white outline-none text-sm" value={nome} onChange={e => handleFieldChange('nome', e.target.value)} /></div></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><Mail size={16} className="text-[#F4D03F]" /><input type="email" placeholder="E-mail" className="flex-1 bg-transparent text-white outline-none text-sm" value={email} disabled /></div></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><Phone size={16} className="text-[#F4D03F]" /><input type="tel" placeholder="WhatsApp *" className="flex-1 bg-transparent text-white outline-none text-sm" value={telefone} onChange={e => handleFieldChange('telefone', formatPhone(e.target.value))} maxLength={15} /></div></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><CreditCard size={16} className="text-[#F4D03F]" /><input type="text" placeholder="CPF *" className="flex-1 bg-transparent text-white outline-none text-sm" value={cpf} onChange={e => handleFieldChange('cpf', formatCPF(e.target.value))} maxLength={14} /></div></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><Calendar size={16} className="text-[#F4D03F]" /><input type="date" placeholder="Data de nascimento *" className="flex-1 bg-transparent text-white outline-none text-sm" value={dataNascimento} onChange={e => handleFieldChange('dataNascimento', e.target.value)} /></div></div>
                <div className="bg-[#F4D03F]/10 rounded-lg p-1.5 text-center mt-1"><p className="text-[#F4D03F] text-sm font-bold">🏠 Endereço</p></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><MapPin size={16} className="text-[#F4D03F]" /><input type="text" placeholder="Rua, Avenida *" className="flex-1 bg-transparent text-white outline-none text-sm" value={endereco} onChange={e => handleFieldChange('endereco', e.target.value)} /></div></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><MapPin size={16} className="text-[#F4D03F]" /><input type="text" placeholder="Bairro *" className="flex-1 bg-transparent text-white outline-none text-sm" value={bairro} onChange={e => handleFieldChange('bairro', e.target.value)} /></div></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><MapPin size={16} className="text-[#F4D03F]" /><input type="text" placeholder="Cidade *" className="flex-1 bg-transparent text-white outline-none text-sm" value={cidade} onChange={e => handleFieldChange('cidade', e.target.value)} /></div></div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                <div className="bg-[#F4D03F]/10 rounded-lg p-1.5 text-center mb-1"><p className="text-[#F4D03F] text-sm font-bold">📄 Carteira Nacional de Habilitação (CNH)</p><p className="text-[#A0A0B0] text-[10px]">Preencha os dados da sua CNH</p></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><Key size={16} className="text-[#F4D03F]" /><input type="text" placeholder="Número do Registro da CNH *" className="flex-1 bg-transparent text-white outline-none text-sm" value={cnhNumero} onChange={e => handleFieldChange('cnhNumero', e.target.value)} /></div></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><Shield size={16} className="text-[#F4D03F]" /><input type="text" placeholder="Categoria * (A, B, C, D, E)" className="flex-1 bg-transparent text-white outline-none text-sm" value={cnhCategoria} onChange={e => handleFieldChange('cnhCategoria', e.target.value.toUpperCase())} /></div></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><Calendar size={16} className="text-[#F4D03F]" /><input type="date" placeholder="Data de validade *" className="flex-1 bg-transparent text-white outline-none text-sm" value={cnhValidade} onChange={e => handleFieldChange('cnhValidade', e.target.value)} /></div></div>
                <div className="mt-2"><label className="text-[#F4D03F] text-xs font-bold mb-0.5 block">Foto da CNH (frente e verso) *</label>
                  <div className="mt-1 bg-white/5 rounded-lg border border-dashed border-[#F4D03F]/30 p-2 text-center cursor-pointer hover:bg-white/10 transition" onClick={() => cnhRef.current?.click()}>
                    {cnhPreview ? <img src={cnhPreview} className="w-full h-24 object-cover rounded-lg" /> : <><Upload size={20} className="text-[#F4D03F] mx-auto mb-1" /><p className="text-[#A0A0B0] text-[10px]">Clique para enviar a foto da CNH</p></>}
                  </div>
                  <input ref={cnhRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cnh')} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <div className="bg-[#F4D03F]/10 rounded-lg p-1.5 text-center mb-1"><p className="text-[#F4D03F] text-sm font-bold">🚗 Dados do Veículo</p><p className="text-[#A0A0B0] text-[10px]">Informe os dados do seu veículo</p></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><Car size={16} className="text-[#F4D03F]" /><input type="text" placeholder="Placa * (ABC-1234)" className="flex-1 bg-transparent text-white outline-none text-sm" value={placa} onChange={e => handleFieldChange('placa', e.target.value.toUpperCase())} maxLength={8} /></div></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><Car size={16} className="text-[#F4D03F]" /><input type="text" placeholder="Modelo *" className="flex-1 bg-transparent text-white outline-none text-sm" value={modelo} onChange={e => handleFieldChange('modelo', e.target.value)} /></div></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><Calendar size={16} className="text-[#F4D03F]" /><input type="text" placeholder="Ano *" className="flex-1 bg-transparent text-white outline-none text-sm" value={ano} onChange={e => handleFieldChange('ano', e.target.value)} maxLength={4} /></div></div>
                <div className="bg-white/5 rounded-lg border border-white/15"><div className="flex items-center gap-2 px-3 py-2"><Car size={16} className="text-[#F4D03F]" /><input type="text" placeholder="Cor *" className="flex-1 bg-transparent text-white outline-none text-sm" value={cor} onChange={e => handleFieldChange('cor', e.target.value)} /></div></div>
                <div className="mt-2"><label className="text-[#F4D03F] text-xs font-bold mb-0.5 block">Foto do veículo *</label>
                  <div className="mt-1 bg-white/5 rounded-lg border border-dashed border-[#F4D03F]/30 p-2 text-center cursor-pointer hover:bg-white/10 transition" onClick={() => fotoVeiculoRef.current?.click()}>
                    {fotoVeiculoPreview ? <img src={fotoVeiculoPreview} className="w-full h-24 object-cover rounded-lg" /> : <><Upload size={20} className="text-[#F4D03F] mx-auto mb-1" /><p className="text-[#A0A0B0] text-[10px]">Adicionar foto do veículo</p></>}
                  </div>
                  <input ref={fotoVeiculoRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'veiculo')} />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex gap-2">
            {step > 1 && (
              <button onClick={handleBack} className="flex-1 py-2 rounded-xl border border-white/20 text-white font-bold text-sm">Voltar</button>
            )}
            <button onClick={handleNext} disabled={loading} className="flex-1 py-2 rounded-xl font-bold text-sm bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black">
              {loading ? 'Enviando...' : (step === 3 ? '✅ Enviar solicitação' : 'Continuar →')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegistrationModal;