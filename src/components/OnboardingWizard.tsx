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
  const [locationLoading, setLocationLoading] = useState(true);
  
  // Dados do formulário
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
  const [destino, setDestino] = useState('');
  const [destinoSugerido, setDestinoSugerido] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [precoEstimado, setPrecoEstimado] = useState<number | null>(null);

  // Pegar localização atual ao montar
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { lat, lng } = position.coords;
          setUserLocation({ lat, lng, address: 'Sua localização atual' });
          setLocationLoading(false);
          
          // Buscar endereço real
          try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
            const data = await response.json();
            if (data.results[0]) {
              setUserLocation({ lat, lng, address: data.results[0].formatted_address });
            }
          } catch (error) {
            console.log('Erro ao buscar endereço');
          }
        },
        () => {
          setLocationLoading(false);
        }
      );
    }
  }, []);

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
    setStep(step - 1);
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
      
      // PRIMEIRO: Verificar se o usuário já existe
      const { data: existingUser } = await supabase
        .from('usuarios')
        .select('email')
        .eq('email', formData.email)
        .maybeSingle();
      
      if (existingUser) {
        alert('❌ Este e-mail já está cadastrado! Faça login.');
        onComplete();
        return;
      }
      
      // SEGUNDO: Criar novo usuário
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
      
      if (error) {
        if (error.message.includes('already registered')) {
          alert('❌ Este e-mail já está cadastrado! Faça login.');
          onComplete();
        } else {
          throw error;
        }
        return;
      }
      
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
        
        alert('✅ Cadastro realizado com sucesso!');
        
        // Fazer login automático
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.senha
        });
        
        if (!signInError) {
          onComplete();
        }
      }
    } catch (error: any) {
      alert('❌ Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const calcularPreco = (destinoLat: number, destinoLng: number) => {
    if (userLocation) {
      const distancia = calcularDistancia(userLocation.lat, userLocation.lng, destinoLat, destinoLng);
      const preco = 3 + (distancia * 2.5);
      setPrecoEstimado(preco);
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

  // Tela final com mapa e destino
  if (step === 6) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
        <div className="max-w-md mx-auto px-4 pb-28">
          {/* Mapa com localização atual */}
          <div className="relative h-[300px] rounded-2xl overflow-hidden mt-4 shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#2D2342] flex items-center justify-center">
              {locationLoading ? (
                <div className="text-center">
                  <div className="w-10 h-10 border-2 border-[#F4D03F] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-white text-sm">Obtendo localização...</p>
                </div>
              ) : userLocation ? (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                    <MapPin size={40} className="text-[#F4D03F]" />
                  </div>
                  <p className="text-white text-sm font-medium">📍 Você está aqui</p>
                  <p className="text-[#A0A0B0] text-xs mt-1 max-w-[250px]">{userLocation.address}</p>
                </div>
              ) : (
                <div className="text-center">
                  <Navigation size={40} className="text-[#A0A0B0] mx-auto mb-2" />
                  <p className="text-white text-sm">Ative sua localização</p>
                </div>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-1.5 border border-[#F4D03F]/40">
                <div className="flex items-center gap-2"><Car className="text-[#F4D03F] w-5 h-5" /><span className="text-white font-bold">OBALEVA</span></div>
              </div>
            </div>
          </div>

          {/* Para onde vai agora? */}
          <div className="mt-4 bg-gradient-to-br from-[#1A1528] to-[#1A1528]/80 rounded-xl p-4 border border-[#F4D03F]/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
                <Navigation size={16} className="text-[#F4D03F]" />
              </div>
              <span className="text-white font-bold">Para onde você vai agora?</span>
            </div>
            
            <input
              type="text"
              placeholder="Digite seu destino..."
              className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white outline-none focus:border-[#F4D03F] transition"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />
            
            {precoEstimado && (
              <div className="mt-3 p-3 rounded-xl bg-[#F4D03F]/10 border border-[#F4D03F]/30">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">💰 Preço estimado</span>
                  <span className="text-[#F4D03F] text-2xl font-bold">R$ {precoEstimado.toFixed(2)}</span>
                </div>
                <button className="w-full mt-3 py-2 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
                  Confirmar corrida
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={handleBack} className="flex-1 py-2 rounded-xl bg-white/10 text-white">Voltar</button>
          </div>
        </div>
      </div>
    );
  }

  // Telas de perguntas sequenciais
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Progresso */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <p className="text-[#A0A0B0] text-sm">Passo {step} de 6</p>
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#F4D03F] to-[#FFD966] rounded-full transition-all duration-300" style={{ width: `${(step / 6) * 100}%` }} />
          </div>
        </div>

        {/* Cards de cada etapa */}
        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-6 border border-[#F4D03F]/20 shadow-2xl">
          
          {/* PASSO 1: Nome e Sobrenome */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <User size={48} className="text-[#F4D03F] mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-white">Qual seu nome?</h2>
                <p className="text-[#A0A0B0] text-sm">Como você gostaria de ser chamado?</p>
              </div>
              <input type="text" placeholder="Nome" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} />
              {errors.nome && <p className="text-red-400 text-xs">{errors.nome}</p>}
              <input type="text" placeholder="Sobrenome" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.sobrenome} onChange={e => setFormData({...formData, sobrenome: e.target.value})} />
              {errors.sobrenome && <p className="text-red-400 text-xs">{errors.sobrenome}</p>}
              <button onClick={handleNext} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold flex items-center justify-center gap-2">Continuar <ArrowRight size={18} /></button>
            </div>
          )}

          {/* PASSO 2: E-mail e confirmação */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Mail size={48} className="text-[#F4D03F] mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-white">Seu e-mail</h2>
                <p className="text-[#A0A0B0] text-sm">Usaremos para enviar recibos</p>
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

          {/* PASSO 3: WhatsApp e verificação */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <MessageCircle size={48} className="text-[#F4D03F] mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-white">Seu WhatsApp</h2>
                <p className="text-[#A0A0B0] text-sm">Para confirmação e segurança</p>
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

          {/* PASSO 4: CPF e Data de Nascimento */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <CreditCard size={48} className="text-[#F4D03F] mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-white">Dados pessoais</h2>
                <p className="text-[#A0A0B0] text-sm">Para sua segurança</p>
              </div>
              <input type="text" placeholder="CPF" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} />
              <input type="date" placeholder="Data de nascimento" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={formData.dataNascimento} onChange={e => setFormData({...formData, dataNascimento: e.target.value})} />
              <div className="flex gap-2">
                <button onClick={handleBack} className="flex-1 py-3 rounded-xl bg-white/10 text-white">Voltar</button>
                <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">Continuar</button>
              </div>
            </div>
          )}

          {/* PASSO 5: Criar senha - COM BOTÃO MOSTRAR SENHA */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <Lock size={48} className="text-[#F4D03F] mx-auto mb-2" />
                <h2 className="text-2xl font-bold text-white">Crie sua senha</h2>
                <p className="text-[#A0A0B0] text-sm">Mínimo 6 caracteres</p>
              </div>
              
              {/* Campo Senha com botão mostrar */}
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Senha" 
                  className="w-full p-3 pr-12 rounded-xl bg-white/10 border border-white/15 text-white focus:border-[#F4D03F] transition outline-none" 
                  value={formData.senha} 
                  onChange={e => setFormData({...formData, senha: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-[#F4D03F] transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.senha && <p className="text-red-400 text-xs">{errors.senha}</p>}
              
              {/* Campo Confirmar Senha com botão mostrar */}
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirmar senha" 
                  className="w-full p-3 pr-12 rounded-xl bg-white/10 border border-white/15 text-white focus:border-[#F4D03F] transition outline-none" 
                  value={formData.confirmarSenha} 
                  onChange={e => setFormData({...formData, confirmarSenha: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-[#F4D03F] transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmarSenha && <p className="text-red-400 text-xs">{errors.confirmarSenha}</p>}
              
              <div className="flex gap-2">
                <button onClick={handleBack} className="flex-1 py-3 rounded-xl bg-white/10 text-white">Voltar</button>
                <button onClick={handleRegister} disabled={loading} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
                  {loading ? 'Criando conta...' : 'Finalizar'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;