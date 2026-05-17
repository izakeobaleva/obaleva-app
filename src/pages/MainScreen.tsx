import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Car, Home, Search, User, Menu, Mail, Lock, UserPlus, ArrowRight, CheckCircle, Eye, EyeOff, Chrome, Sparkles, Shield, Star, Zap } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import RotatingBanner from '../components/RotatingBanner';
import ProfileScreen from '../screens/ProfileScreen';
import { solicitarCorrida, buscarCorridaAtiva, subscribeToRide, cancelarCorrida, Ride } from '../services/rideService';
import RideStatusModal from '../components/RideStatusModal';

// ============================================
// BOTTOM NAVIGATION PREMIUM
// ============================================
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: Menu },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 bg-gradient-to-t from-[#0F0B1A] via-[#0F0B1A]/95 to-transparent pt-4 z-50">
      <div className="bg-gradient-to-br from-[#1A1528] to-[#1F1A30] border border-[#F4D03F]/30 rounded-2xl max-w-md w-full mx-4 shadow-2xl backdrop-blur-sm">
        <div className="flex justify-between items-center px-6 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                active === tab.id 
                  ? 'text-[#F4D03F] transform scale-110' 
                  : 'text-[#A0A0B0] hover:text-white/70'
              }`}
            >
              <tab.icon size={24} strokeWidth={active === tab.id ? 2.5 : 1.8} />
              <span className={`text-[11px] font-medium ${active === tab.id ? 'opacity-100' : 'opacity-70'}`}>{tab.label}</span>
              {active === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-[#F4D03F] mt-0.5 animate-pulse" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE LOGIN PREMIUM
// ============================================
const LoginScreen = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading, onSignUpClick }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] via-[#120E1F] to-[#1A1528] flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#F4D03F]/30 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50 shadow-2xl animate-bounce-slow">
              <Car className="w-12 h-12 text-[#F4D03F]" />
            </div>
          </div>
          <h1 className="text-3xl font-black mt-4 bg-gradient-to-r from-white via-[#F4D03F] to-white bg-clip-text text-transparent">
            OBALEVA
          </h1>
          <p className="text-[#A0A0B0] text-sm mt-1 flex items-center justify-center gap-1">
            <Sparkles size={14} className="text-[#F4D03F]" />
            Sua corrida de confiança
            <Sparkles size={14} className="text-[#F4D03F]" />
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-6 border border-[#F4D03F]/20 shadow-2xl animate-fade-in-up">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">Bem-vindo de volta!</h2>
            <p className="text-[#A0A0B0] text-sm mt-1">Faça login para continuar</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onGoogleLogin} 
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/15 text-white flex items-center justify-center gap-3 font-medium transition-all duration-300 hover:scale-[1.02] hover:border-[#F4D03F]/50 hover:shadow-lg group"
            >
              <Chrome size={20} className="group-hover:scale-110 transition" />
              <span>Continuar com Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-r from-transparent via-[#1A1528] to-transparent px-3 text-xs text-[#A0A0B0]">ou</span>
              </div>
            </div>

            <form onSubmit={onEmailLogin} className="space-y-3">
              <div className={`relative transition-all duration-300 ${isFocused.email ? 'transform scale-[1.02]' : ''}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail size={18} className={`transition-colors ${isFocused.email ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`} />
                </div>
                <input 
                  type="email" 
                  placeholder="Seu e-mail"
                  className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/10 border-2 transition-all duration-300 focus:outline-none text-white placeholder:text-[#A0A0B0]"
                  style={{ borderColor: isFocused.email ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                  value={loginEmail} 
                  onFocus={() => setIsFocused({ ...isFocused, email: true })}
                  onBlur={() => setIsFocused({ ...isFocused, email: false })}
                  onChange={e => setLoginEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className={`relative transition-all duration-300 ${isFocused.password ? 'transform scale-[1.02]' : ''}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock size={18} className={`transition-colors ${isFocused.password ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Sua senha"
                  className="w-full py-3.5 pl-12 pr-12 rounded-xl bg-white/10 border-2 transition-all duration-300 focus:outline-none text-white placeholder:text-[#A0A0B0]"
                  style={{ borderColor: isFocused.password ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                  value={loginPassword} 
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                  onChange={e => setLoginPassword(e.target.value)} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-[#F4D03F] transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loginLoading} 
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                {loginLoading ? (
                  <div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-[#A0A0B0] text-sm">
                Não tem uma conta?{' '}
                <button 
                  onClick={onSignUpClick}
                  className="text-[#F4D03F] font-bold hover:underline transition-all flex items-center gap-1 inline-flex group"
                >
                  Criar conta grátis
                  <UserPlus size={14} className="group-hover:scale-110 transition" />
                </button>
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1">
                <Shield size={12} className="text-[#F4D03F]" />
                <span className="text-[10px] text-[#A0A0B0]">Seguro total</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-[#F4D03F]" />
                <span className="text-[10px] text-[#A0A0B0]">Motoristas top</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={12} className="text-[#F4D03F]" />
                <span className="text-[10px] text-[#A0A0B0]">Chegada rápida</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE CADASTRO PREMIUM
// ============================================
const SignUpScreen = ({ onBack, onSuccess }: any) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ nome: false, email: false, telefone: false, password: false });

  const handleSignUp = async () => {
    if (!nome || !email || !password) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      const { data: auth, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome, tipo: 'passageiro' } }
      });
      
      if (signUpError) throw signUpError;
      
      if (auth.user) {
        await supabase.from('usuarios').insert({
          id: auth.user.id,
          nome_completo: nome,
          telefone: telefone || null,
          email: email,
          tipo: 'passageiro'
        });
        
        await supabase.from('passageiros').insert({ id: auth.user.id });
        
        alert('✅ Conta criada com sucesso! Faça login.');
        onSuccess();
      }
    } catch (error: any) {
      alert('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] via-[#120E1F] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-6 animate-fade-in-down">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#F4D03F]/20 rounded-full blur-lg"></div>
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50 shadow-xl">
              <UserPlus className="w-10 h-10 text-[#F4D03F]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mt-3">Criar Conta</h2>
          <p className="text-[#A0A0B0] text-sm">Comece sua jornada com a ObaLeva</p>
        </div>

        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-6 border border-[#F4D03F]/20 shadow-2xl animate-fade-in-up">
          
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[#A0A0B0] mb-2">
              <span className={step >= 1 ? 'text-[#F4D03F]' : ''}>📝 Dados</span>
              <span className={step >= 2 ? 'text-[#F4D03F]' : ''}>🔐 Conta</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#F4D03F] to-[#FFD966] rounded-full transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }} />
            </div>
          </div>

          <div className="space-y-4">
            {step === 1 ? (
              <>
                <div className={`relative transition-all duration-300 ${isFocused.nome ? 'transform scale-[1.02]' : ''}`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User size={18} className={isFocused.nome ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Nome completo *"
                    className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/10 border-2 transition-all text-white placeholder:text-[#A0A0B0] focus:outline-none"
                    style={{ borderColor: isFocused.nome ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                    value={nome} 
                    onFocus={() => setIsFocused({ ...isFocused, nome: true })}
                    onBlur={() => setIsFocused({ ...isFocused, nome: false })}
                    onChange={(e) => setNome(e.target.value)} 
                  />
                </div>

                <div className={`relative transition-all duration-300 ${isFocused.telefone ? 'transform scale-[1.02]' : ''}`}>
                  <input 
                    type="tel" 
                    placeholder="Telefone (opcional)"
                    className="w-full py-3.5 px-4 rounded-xl bg-white/10 border-2 transition-all text-white placeholder:text-[#A0A0B0] focus:outline-none"
                    style={{ borderColor: isFocused.telefone ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                    value={telefone} 
                    onFocus={() => setIsFocused({ ...isFocused, telefone: true })}
                    onBlur={() => setIsFocused({ ...isFocused, telefone: false })}
                    onChange={(e) => setTelefone(e.target.value)} 
                  />
                </div>

                <button 
                  onClick={() => setStep(2)} 
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
                >
                  Continuar
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                </button>
              </>
            ) : (
              <>
                <div className={`relative transition-all duration-300 ${isFocused.email ? 'transform scale-[1.02]' : ''}`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail size={18} className={isFocused.email ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'} />
                  </div>
                  <input 
                    type="email" 
                    placeholder="E-mail *"
                    className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/10 border-2 transition-all text-white placeholder:text-[#A0A0B0] focus:outline-none"
                    style={{ borderColor: isFocused.email ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                    value={email} 
                    onFocus={() => setIsFocused({ ...isFocused, email: true })}
                    onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>

                <div className={`relative transition-all duration-300 ${isFocused.password ? 'transform scale-[1.02]' : ''}`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock size={18} className={isFocused.password ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Senha (mínimo 6 caracteres) *"
                    className="w-full py-3.5 pl-12 pr-12 rounded-xl bg-white/10 border-2 transition-all text-white placeholder:text-[#A0A0B0] focus:outline-none"
                    style={{ borderColor: isFocused.password ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                    value={password} 
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-[#F4D03F] transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button 
                  onClick={handleSignUp} 
                  disabled={loading} 
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Criar minha conta
                    </>
                  )}
                </button>

                <button 
                  onClick={() => setStep(1)} 
                  className="w-full py-2 text-[#A0A0B0] text-sm hover:text-[#F4D03F] transition"
                >
                  ← Voltar
                </button>
              </>
            )}
          </div>

          <div className="text-center mt-4 pt-3 border-t border-white/10">
            <button onClick={onBack} className="text-[#A0A0B0] text-sm hover:text-[#F4D03F] transition">
              ← Já tenho conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE BUSCAR (PLACEHOLDER PREMIUM)
// ============================================
const SearchScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
    <div className="max-w-md w-full">
      <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-8 text-center border border-[#F4D03F]/20">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4 animate-pulse">
          <Search size={40} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-white text-2xl font-bold">🔍 Buscar</h2>
        <p className="text-[#A0A0B0] mt-2">Em breve você poderá:</p>
        <ul className="text-[#A0A0B0] text-sm mt-3 space-y-1">
          <li>• Ver histórico de corridas</li>
          <li>• Salvar lugares favoritos</li>
          <li>• Buscar endereços rapidamente</li>
        </ul>
      </div>
    </div>
  </div>
);

// ============================================
// TELA DE MENU (PLACEHOLDER PREMIUM)
// ============================================
const MenuScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
    <div className="max-w-md w-full">
      <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-8 text-center border border-[#F4D03F]/20">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4 animate-pulse">
          <Menu size={40} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-white text-2xl font-bold">☰ Menu</h2>
        <p className="text-[#A0A0B0] mt-2">Em breve você terá acesso a:</p>
        <ul className="text-[#A0A0B0] text-sm mt-3 space-y-1">
          <li>• Programa de indicação</li>
          <li>• Central de ajuda</li>
          <li>• Termos e segurança</li>
        </ul>
      </div>
    </div>
  </div>
);

// ============================================
// HOME SCREEN CONTENT (MANTER O QUE JÁ FUNCIONAVA)
// ============================================
const HomeScreenContent = ({ user, onSignOut }: any) => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupLocation, setPickupLocation] = useState<any>(null);
  const [dropoffLocation, setDropoffLocation] = useState<any>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [showRideModal, setShowRideModal] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  const subscriptionRef = useRef<any>(null);

  async function carregarCorridaAtiva() {
    if (user?.id) {
      const corrida = await buscarCorridaAtiva(user.id);
      if (corrida) {
        setActiveRide(corrida);
        setShowRideModal(true);
        subscriptionRef.current = subscribeToRide(corrida.id, (updatedRide) => {
          setActiveRide(updatedRide);
          if (updatedRide.status === 'finalizada' || updatedRide.status === 'cancelada') {
            setTimeout(() => { setShowRideModal(false); setActiveRide(null); }, 3000);
          }
        });
      }
    }
  }

  useEffect(() => {
    if (user?.id) carregarCorridaAtiva();
    return () => { if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); };
  }, [user]);

  const handleRequestRide = async () => {
    if (!user) { alert('🔐 Faça login para solicitar uma corrida!'); return; }
    if (!pickupLocation || !dropoffLocation) { alert('📍 Selecione a origem e destino no mapa!'); return; }
    setSolicitando(true);
    try {
      const corrida = await solicitarCorrida(user.id, pickupLocation, dropoffLocation);
      if (corrida) {
        setActiveRide(corrida);
        setShowRideModal(true);
        setPickupAddress('');
        setDropoffAddress('');
        setPickupLocation(null);
        setDropoffLocation(null);
        alert('🚗 Corrida solicitada! Buscando motorista...');
      }
    } catch (error: any) { alert('❌ Erro: ' + error.message); } 
    finally { setSolicitando(false); }
  };

  async function handleCancelRide() {
    if (activeRide) {
      const success = await cancelarCorrida(activeRide.id);
      if (success) { alert('✅ Corrida cancelada'); setShowRideModal(false); setActiveRide(null); if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); } 
      else { alert('❌ Erro ao cancelar corrida'); }
    }
  }

  return (
    <div className="max-w-md mx-auto px-3 pb-28">
      <div className="py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F4D03F]/30 flex items-center justify-center">
            <Car className="text-[#F4D03F] w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1>
        </div>
        <button onClick={onSignOut} className="text-[#A0A0B0] text-sm flex items-center gap-1 hover:text-red-400 transition px-3 py-1 rounded-full bg-white/5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Sair</button>
      </div>

      <div className="relative h-[200px] rounded-xl overflow-hidden shadow-lg mb-3">
        <MapComponent pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} onPickupChange={setPickupAddress} onDropoffChange={setDropoffAddress} onLocationSelect={(location: any) => { if (!dropoffAddress) { setPickupLocation(location); setPickupAddress(location.address); } else { setDropoffLocation(location); setDropoffAddress(location.address); } }} />
      </div>

      <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/20 shadow-lg">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/15">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-white font-bold text-sm">Definir sua rota</span>
        </div>
        <div className="bg-white/10 rounded-xl border border-white/15 mb-2">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <input type="text" placeholder="Digite onde você está..." className="flex-1 bg-transparent text-white outline-none text-base font-medium" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} />
          </div>
        </div>
        <div className="bg-white/10 rounded-xl border border-white/15">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <input type="text" placeholder="Digite seu destino..." className="flex-1 bg-transparent text-white outline-none text-base font-medium" value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} />
          </div>
        </div>
        <button onClick={() => { const temp = pickupAddress; setPickupAddress(dropoffAddress); setDropoffAddress(temp); }} className="mt-3 w-full text-center text-sm text-[#A0A0B0] hover:text-[#F4D03F] transition py-1.5 font-medium">🔄 Inverter origem e destino</button>
      </div>

      <div className="mt-3">
        <button onClick={handleRequestRide} disabled={!pickupLocation || !dropoffLocation || solicitando} className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-extrabold flex items-center justify-center gap-3 text-lg transition-all duration-200 ${(!pickupLocation || !dropoffLocation || solicitando) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] shadow-xl'}`}>
          {solicitando ? (
            <><div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin" /> Buscando motorista...</>
          ) : (
            <><Car size={22} /> SOLICITAR CORRIDA <ArrowRight size={18} /></>
          )}
        </button>
      </div>

      <RotatingBanner />
      
      {showRideModal && activeRide && <RideStatusModal ride={activeRide} onClose={() => setShowRideModal(false)} onCancel={handleCancelRide} />}
    </div>
  );
};

// ============================================
// TELA PRINCIPAL - EXPORT
// ============================================
export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[#F4D03F]/20 flex items-center justify-center animate-bounce">
            <Car className="w-10 h-10 text-[#F4D03F]" />
          </div>
          <p className="text-white mt-4 font-medium">Carregando ObaLeva...</p>
          <p className="text-[#A0A0B0] text-xs mt-1">Sua corrida de confiança</p>
        </div>
      </div>
    );
  }

  if (!user && showSignUp) {
    return <SignUpScreen onBack={() => setShowSignUp(false)} onSuccess={() => setShowSignUp(false)} />;
  }

  if (!user) {
    return (
      <>
        <LoginScreen
          onGoogleLogin={async () => { 
            await supabase.auth.signInWithOAuth({ 
              provider: 'google', 
              options: { redirectTo: window.location.origin } 
            }); 
          }}
          onEmailLogin={async (e) => { 
            e.preventDefault(); 
            setLoginLoading(true); 
            const { error } = await supabase.auth.signInWithPassword({ 
              email: loginEmail, 
              password: loginPassword 
            }); 
            if (error) alert('❌ E-mail ou senha inválidos'); 
            setLoginLoading(false); 
          }}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          loginLoading={loginLoading}
          onSignUpClick={() => setShowSignUp(true)}
        />
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      {activeTab === 'home' && <HomeScreenContent user={user} onSignOut={signOut} key={refreshKey} />}
      {activeTab === 'perfil' && <ProfileScreen user={user} profile={profile} onSignOut={signOut} onRefresh={handleRefresh} />}
      {activeTab === 'buscar' && <SearchScreen />}
      {activeTab === 'menu' && <MenuScreen />}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};