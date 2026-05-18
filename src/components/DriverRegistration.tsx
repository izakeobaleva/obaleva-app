import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  ArrowLeft, Camera, Upload, FileText, Home, CreditCard, 
  CheckCircle, AlertCircle, User, Mail, Phone, MapPin, 
  Calendar, Car, Key, Shield, FileCheck, Image as ImageIcon,
  X, Plus, ChevronRight, Eye, EyeOff
} from 'lucide-react';

interface DriverRegistrationProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

const DriverRegistration: React.FC<DriverRegistrationProps> = ({ user, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Dados pessoais
  const [nome, setNome] = useState(user?.user_metadata?.nome_completo || user?.email?.split('@')[0] || '');
  const [email, setEmail] = useState(user?.email || '');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  
  // Documentos
  const [cnhNumero, setCnhNumero] = useState('');
  const [cnhCategoria, setCnhCategoria] = useState('');
  const [cnhValidade, setCnhValidade] = useState('');
  const [cnhImagem, setCnhImagem] = useState<File | null>(null);
  const [cnhPreview, setCnhPreview] = useState<string | null>(null);
  
  // Comprovante de residência
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [comprovanteImagem, setComprovanteImagem] = useState<File | null>(null);
  const [comprovantePreview, setComprovantePreview] = useState<string | null>(null);
  
  // Foto do perfil
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  
  // Veículo
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');
  const [fotoVeiculo, setFotoVeiculo] = useState<File | null>(null);
  const [fotoVeiculoPreview, setFotoVeiculoPreview] = useState<string | null>(null);
  
  const fotoPerfilRef = useRef<HTMLInputElement>(null);
  const cnhRef = useRef<HTMLInputElement>(null);
  const comprovanteRef = useRef<HTMLInputElement>(null);
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

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const buscarEnderecoPorCep = async () => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setEndereco(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const preview = URL.createObjectURL(file);
    
    switch(type) {
      case 'perfil':
        setFotoPerfil(file);
        setFotoPreview(preview);
        break;
      case 'cnh':
        setCnhImagem(file);
        setCnhPreview(preview);
        break;
      case 'comprovante':
        setComprovanteImagem(file);
        setComprovantePreview(preview);
        break;
      case 'veiculo':
        setFotoVeiculo(file);
        setFotoVeiculoPreview(preview);
        break;
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!nome || !telefone || !cpf || !dataNascimento) {
        alert('Preencha todos os campos obrigatórios');
        return;
      }
      if (!fotoPerfil) {
        alert('Adicione uma foto de perfil');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!cnhNumero || !cnhCategoria || !cnhValidade || !cnhImagem) {
        alert('Preencha todos os campos da CNH e envie a foto');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!cep || !endereco || !numero || !comprovanteImagem) {
        alert('Preencha o endereço e envie o comprovante');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (!placa || !modelo || !ano || !cor || !fotoVeiculo) {
        alert('Preencha todos os dados do veículo e envie a foto');
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
        dados_pessoais: { nome, email, telefone, cpf, data_nascimento, foto: fotoPreview },
        documentos: { cnh_numero: cnhNumero, cnh_categoria: cnhCategoria, cnh_validade: cnhValidade, cnh_foto: cnhPreview },
        endereco: { cep, endereco, numero, complemento, comprovante: comprovantePreview },
        veiculo: { placa: placa.toUpperCase(), modelo, ano, cor, foto: fotoVeiculoPreview }
      });
      
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
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <button onClick={onClose} className="text-[#A0A0B0] hover:text-white">
              <X size={24} />
            </button>
            <h2 className="text-white font-bold text-lg">Seja Motorista</h2>
            <div className="w-6" />
          </div>

          {/* Progresso */}
          <div className="px-4 pt-4">
            <div className="flex justify-between text-xs text-[#A0A0B0] mb-2">
              <span className={step >= 1 ? 'text-[#F4D03F]' : ''}>Dados</span>
              <span className={step >= 2 ? 'text-[#F4D03F]' : ''}>Documentos</span>
              <span className={step >= 3 ? 'text-[#F4D03F]' : ''}>Comprovante</span>
              <span className={step >= 4 ? 'text-[#F4D03F]' : ''}>Veículo</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#F4D03F] to-[#FFD966] rounded-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-5 max-h-[55vh] overflow-y-auto">
            
            {/* PASSO 1: DADOS PESSOAIS */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-2">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-[#F4D03F]/20 flex items-center justify-center border-2 border-[#F4D03F]/50">
                      {fotoPreview ? (
                        <img src={fotoPreview} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <Camera size={32} className="text-[#F4D03F]" />
                      )}
                    </div>
                    <button 
                      onClick={() => fotoPerfilRef.current?.click()}
                      className="absolute bottom-0 right-0 bg-[#F4D03F] rounded-full p-1.5"
                    >
                      <Camera size={14} className="text-black" />
                    </button>
                    <input type="file" ref={fotoPerfilRef} className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'perfil')} />
                  </div>
                  <p className="text-[#A0A0B0] text-xs mt-2">Tire sua foto do perfil *</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <User size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="Nome completo *" className="flex-1 bg-transparent text-white outline-none" value={nome} onChange={e => setNome(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Mail size={18} className="text-[#F4D03F]" />
                      <input type="email" placeholder="E-mail" className="flex-1 bg-transparent text-white outline-none" value={email} disabled />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Phone size={18} className="text-[#F4D03F]" />
                      <input type="tel" placeholder="Telefone *" className="flex-1 bg-transparent text-white outline-none" value={telefone} onChange={e => setTelefone(formatPhone(e.target.value))} maxLength={15} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <CreditCard size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="CPF *" className="flex-1 bg-transparent text-white outline-none" value={cpf} onChange={e => setCpf(formatCPF(e.target.value))} maxLength={14} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Calendar size={18} className="text-[#F4D03F]" />
                      <input type="date" placeholder="Data de nascimento *" className="flex-1 bg-transparent text-white outline-none" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PASSO 2: DOCUMENTOS (CNH) */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#F4D03F]/10 to-[#8B5CF6]/10 rounded-xl p-3 text-center">
                  <p className="text-[#A0A0B0] text-xs">Vamos coletar os dados da sua CNH</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Key size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="Número da CNH *" className="flex-1 bg-transparent text-white outline-none" value={cnhNumero} onChange={e => setCnhNumero(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Shield size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="Categoria (A, B, C, D, E) *" className="flex-1 bg-transparent text-white outline-none" value={cnhCategoria} onChange={e => setCnhCategoria(e.target.value.toUpperCase())} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Calendar size={18} className="text-[#F4D03F]" />
                      <input type="date" placeholder="Data de validade *" className="flex-1 bg-transparent text-white outline-none" value={cnhValidade} onChange={e => setCnhValidade(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <label className="text-[#F4D03F] text-sm font-bold">Foto da CNH (frente e verso) *</label>
                    <div className="mt-2 bg-white/5 rounded-xl border border-dashed border-[#F4D03F]/30 p-4 text-center cursor-pointer hover:bg-white/10 transition" onClick={() => cnhRef.current?.click()}>
                      {cnhPreview ? (
                        <img src={cnhPreview} className="w-full h-28 object-cover rounded-lg" />
                      ) : (
                        <><Upload size={24} className="text-[#F4D03F] mx-auto mb-2" /><p className="text-[#A0A0B0] text-xs">Clique para enviar a foto da CNH</p></>
                      )}
                    </div>
                    <input ref={cnhRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'cnh')} />
                  </div>
                </div>
              </div>
            )}

            {/* PASSO 3: COMPROVANTE DE RESIDÊNCIA */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-[#F4D03F]/10 to-[#8B5CF6]/10 rounded-xl p-3 text-center">
                  <p className="text-[#A0A0B0] text-xs">Comprovante de endereço</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <MapPin size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="CEP *" className="flex-1 bg-transparent text-white outline-none" value={cep} onChange={e => setCep(formatCep(e.target.value))} onBlur={buscarEnderecoPorCep} maxLength={9} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Home size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="Endereço *" className="flex-1 bg-transparent text-white outline-none" value={endereco} onChange={e => setEndereco(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Home size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="Número *" className="flex-1 bg-transparent text-white outline-none" value={numero} onChange={e => setNumero(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Home size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="Complemento" className="flex-1 bg-transparent text-white outline-none" value={complemento} onChange={e => setComplemento(e.target.value)} />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="text-[#F4D03F] text-sm font-bold">Comprovante de residência *</label>
                    <div className="mt-2 bg-white/5 rounded-xl border border-dashed border-[#F4D03F]/30 p-4 text-center cursor-pointer hover:bg-white/10 transition" onClick={() => comprovanteRef.current?.click()}>
                      {comprovantePreview ? (
                        <img src={comprovantePreview} className="w-full h-28 object-cover rounded-lg" />
                      ) : (
                        <><Upload size={24} className="text-[#F4D03F] mx-auto mb-2" /><p className="text-[#A0A0B0] text-xs">Enviar documento</p></>
                      )}
                    </div>
                    <input ref={comprovanteRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'comprovante')} />
                  </div>
                </div>
              </div>
            )}

            {/* PASSO 4: DADOS DO VEÍCULO */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Car size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="Placa *" className="flex-1 bg-transparent text-white outline-none" value={placa} onChange={e => setPlaca(e.target.value.toUpperCase())} maxLength={7} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Car size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="Modelo *" className="flex-1 bg-transparent text-white outline-none" value={modelo} onChange={e => setModelo(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Calendar size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="Ano *" className="flex-1 bg-transparent text-white outline-none" value={ano} onChange={e => setAno(e.target.value)} />
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 px-3 py-3">
                      <Car size={18} className="text-[#F4D03F]" />
                      <input type="text" placeholder="Cor *" className="flex-1 bg-transparent text-white outline-none" value={cor} onChange={e => setCor(e.target.value)} />
                    </div>
                  </div>

                  <div className="mt-2">
                    <label className="text-[#F4D03F] text-sm font-bold">Foto do veículo *</label>
                    <div className="mt-2 bg-white/5 rounded-xl border border-dashed border-[#F4D03F]/30 p-4 text-center cursor-pointer hover:bg-white/10 transition" onClick={() => fotoVeiculoRef.current?.click()}>
                      {fotoVeiculoPreview ? (
                        <img src={fotoVeiculoPreview} className="w-full h-28 object-cover rounded-lg" />
                      ) : (
                        <><Upload size={24} className="text-[#F4D03F] mx-auto mb-2" /><p className="text-[#A0A0B0] text-xs">Adicionar foto do veículo</p></>
                      )}
                    </div>
                    <input ref={fotoVeiculoRef} type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'veiculo')} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botões de navegação */}
          <div className="p-4 border-t border-white/10 flex gap-3">
            {step > 1 && (
              <button onClick={handleBack} className="flex-1 py-3 rounded-xl border border-white/20 text-white font-bold">
                Voltar
              </button>
            )}
            <button onClick={handleNext} disabled={loading} className={`flex-1 py-3 rounded-xl font-bold ${step < 4 ? 'bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black' : 'bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black'}`}>
              {loading ? 'Enviando...' : (step === 4 ? 'Enviar solicitação' : 'Continuar')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegistration;