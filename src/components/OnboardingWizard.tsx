import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, ArrowRight, ArrowLeft, Check, MapPin, Navigation, User, Mail, Phone, Lock, Calendar, CreditCard, Smartphone, MessageCircle, Eye, EyeOff } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [destino, setDestino] = useState('');
  const [precoEstimado, setPrecoEstimado] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    confirmarEmail: '',
    whatsapp: '',
    codigoWhatsapp: '',
    cpf: '',
    dataNascimento: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [whatsappVerified, setWhatsappVerified] = useState(false);

  // CARREGAR DADOS SALVOS
  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setFormData(parsed);
      if (parsed.step) setStep(parsed.step);
    }
  }, []);

  // SALVAR DADOS AO MODIFICAR
  useEffect(() => {
    localStorage.setItem('onboarding_data', JSON.stringify({ ...formData, step }));
  }, [formData, step]);

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.nome) newErrors.nome = 'Digite seu nome';
      if (!formData.sobrenome) newErrors.sobrenome = 'Digite seu sobrenome';
    }
    
    if (step === 2) {
      if (!formData.email) newErrors.email = 'Digite seu e-mail';
      if (formData.email !== formData.confirmarEmail) newErrors.confirmarEmail = 'E-mails não coincidem';
    }
    
    if (step === 3) {
      if (!formData.whatsapp) newErrors.whatsapp = 'Digite seu WhatsApp';
      if (!whatsappVerified) newErrors.codigoWhatsapp = 'Verifique seu WhatsApp';
    }
    
    if (step === 4) {
      if (!formData.cpf) newErrors.cpf = 'Digite seu CPF';
      if (!formData.dataNascimento) newErrors.dataNascimento = 'Digite sua data de nascimento';
    }
    
    if (step === 5) {
      if (!formData.senha) newErrors.senha = 'Crie uma senha';
      if (formData.senha.length < 6) newErrors.senha = 'Mínimo 6 caracteres';
      if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'Senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSendWhatsappCode = () => {
    if (formData.whatsapp) {
      alert(`📱 Código enviado para ${formData.whatsapp}\nCódigo: 123456 (simulado)`);
      setWhatsappVerified(true);
    }
  };

  const handleRegister = async () => {
    if (!validateStep()) return;
    
    setLoading(true);
    try {
      const nomeCompleto = `${formData.nome} ${formData.sobrenome}`;
      
      const { data: auth, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome_completo: nomeCompleto,
            telefone: formData.whatsapp,
            cpf: formData.cpf,
            data_nascimento: formData.dataNascimento
          }
        }
      });
      
      if (error) throw error;
      
      if (auth.user) {
        await supabase.from('usuarios').insert({
          id: auth.user.id,
          nome_completo: nomeCompleto,
          email: formData.email,
          telefone: formData.whatsapp,
          cpf: formData.cpf,
          tipo: 'passageiro'
        });
        
        await supabase.from('passageiros').insert({ id: auth.user.id });
        
        // Login automático
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.senha
        });
        
        // Limpar dados salvos
        localStorage.removeItem('onboarding_data');
        
        // Ir para tela do mapa (passo 6)
        setStep(6);
        setLoading(false);
      }
    } catch (error: any) {
      alert('❌ Erro: ' + error.message);
      setLoading(false);
    }
  };

  const calcularDistancia = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dlat = (lat2 - lat1) * Math.PI / 180;
    const dlng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dlat/2) * Math.sin(dlat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dlng/2) * Math.sin(dlng/2);
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
  };

  // Tela final com mapa (passo 6)
  if (step === 6) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
        <div className="max-w-md mx-auto px-4 pb-28">
          <div className="relative h-[300px] rounded-2xl overflow-hidden mt-4 shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#2D2342] flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-[#F4D03F] mx-auto mb-3 animate-pulse" />
                <p className="text-white text-sm font-medium">📍 Você está aqui</p>
                <p className="text-[#A0A0B0] text-xs mt-1">Obtendo localização...</p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-1.5 border border-[#F4D03F]/40">
                <div className="flex items-center gap-2"><Car className="text-[#F4D03F] w-5 h-5" /><span className="text-white font-bold">OBALEVA</span></div>
              </div>
            </div>
          </div>

          <div className="mt-4 bg-gradient-to-br from-[#1A1528] to-[#1A1528]/80 rounded-xl p-4 border border-[#F4D03F]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
                <Navigation size={16} className="text-[#F4D03F]" />
              </div>
              <span className="text-white font-bold text-lg">Para onde você vai agora?</span>
            </div>
            
            <input
              type="text"
              placeholder="Digite seu destino..."
              className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white outline-none focus:border-[#F4D03F] transition text-base"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />
            
            <button className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base">
              Confirmar corrida
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Telas de cadastro (passos 1 a 5)
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <p className="text-[#A0A0B0] text-sm">Passo {step} de 5</p>
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#F4D03F] to-[#FFD966] rounded-full transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-6 border border-[#F4D03F]/20 shadow-2xl">
          <form onSubmit={(e) => e.preventDefault()}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <User size={48} className="text-[#F4D03F] mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-white">Qual seu nome?</h2>
                </div>
                <input type="text" placeholder="Nome" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
                {errors.nome && <p className="text-red-400 text-xs">{errors.nome}</p>}
                <input type="text" placeholder="Sobrenome" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.sobrenome} onChange={e => setFormData({...formData, sobrenome: e.target.value})} />
                {errors.sobrenome && <p className="text-red-400 text-xs">{errors.sobrenome}</p>}
                <button onClick={handleNext} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold flex items-center justify-center gap-2">Continuar <ArrowRight size={18} /></button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Mail size={48} className="text-[#F4D03F] mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-white">Seu e-mail</h2>
                </div>
                <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                <input type="email" placeholder="Confirmar e-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.confirmarEmail} onChange={e => setFormData({...formData, confirmarEmail: e.target.value})} />
                {errors.confirmarEmail && <p className="text-red-400 text-xs">{errors.confirmarEmail}</p>}
                <div className="flex gap-2">
                  <button onClick={handleBack} className="flex-1 py-3 rounded-xl bg-white/10 text-white">Voltar</button>
                  <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">Continuar</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <MessageCircle size={48} className="text-[#F4D03F] mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-white">Seu WhatsApp</h2>
                </div>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                  <input type="tel" placeholder="(11) 99999-9999" className="w-full p-3 pl-10 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} />
                </div>
                {!whatsappVerified ? (
                  <button onClick={handleSendWhatsappCode} className="w-full py-2 rounded-xl bg-white/10 text-white">Enviar código</button>
                ) : (
                  <div className="text-center text-green-400 text-sm">✅ WhatsApp verificado!</div>
                )}
                <div className="flex gap-2">
                  <button onClick={handleBack} className="flex-1 py-3 rounded-xl bg-white/10 text-white">Voltar</button>
                  <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">Continuar</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <CreditCard size={48} className="text-[#F4D03F] mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-white">Dados pessoais</h2>
                </div>
                <input type="text" placeholder="CPF" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
                <input type="date" placeholder="Data de nascimento" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.dataNascimento} onChange={e => setFormData({...formData, dataNascimento: e.target.value})} />
                <div className="flex gap-2">
                  <button onClick={handleBack} className="flex-1 py-3 rounded-xl bg-white/10 text-white">Voltar</button>
                  <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">Continuar</button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <Lock size={48} className="text-[#F4D03F] mx-auto mb-2" />
                  <h2 className="text-2xl font-bold text-white">Crie sua senha</h2>
                  <p className="text-[#A0A0B0] text-sm">Mínimo 6 caracteres</p>
                </div>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Senha" autoComplete="new-password" className="w-full p-3 pr-12 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirmar senha" autoComplete="new-password" className="w-full p-3 pr-12 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.confirmarSenha} onChange={e => setFormData({...formData, confirmarSenha: e.target.value})} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]">{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleBack} className="flex-1 py-3 rounded-xl bg-white/10 text-white">Voltar</button>
                  <button onClick={handleRegister} disabled={loading} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">{loading ? 'Criando...' : 'Finalizar'}</button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;