import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  Car, Home, Search, User, Menu, LogOut, MapPin, Navigation, 
  ArrowRight, Shield, Star, Zap, Chrome, Mail, Lock, Eye, EyeOff,
  ArrowLeft, Check, Gift, Coffee, Heart, Truck, Phone, Map
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import RotatingBanner from '../components/RotatingBanner';
import { solicitarCorrida, buscarCorridaAtiva, subscribeToRide, cancelarCorrida, Ride } from '../services/rideService';
import RideStatusModal from '../components/RideStatusModal';

// ============================================
// BOTTOM NAVIGATION
// ============================================
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: Menu },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-3 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/30 rounded-2xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center px-5 py-3">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => onNavigate(tab.id)} className={`flex flex-col items-center gap-1 transition-all ${active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
              <tab.icon size={24} strokeWidth={active === tab.id ? 2 : 1.5} />
              <span className="text-xs font-medium">{tab.label}</span>
              {active === tab.id && <div className="w-2 h-1 rounded-full bg-[#F4D03F] mt-0.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE LOGIN
// ============================================
const LoginScreen = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading, onSignUpClick, onBack }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50 shadow-2xl animate-bounce">
            <Car size={48} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Sua corrida de confiança</p>
        </div>

        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-6 border border-[#F4D03F]/20 shadow-2xl">
          <h2 className="text-xl font-bold text-white text-center mb-6">Bem-vindo de volta!</h2>
          
          <div className="space-y-4">
            <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-[#F4D03F]/30 bg-white/10 text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] group">
              <Chrome size={20} className="group-hover:scale-110 transition" />
              <span>Entrar com Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-[#A0A0B0]">ou</span></div>
            </div>

            <form onSubmit={onEmailLogin} className="space-y-3">
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                <input type="email" placeholder="E-mail" className="w-full p-3 pl-10 rounded-xl bg-white/10 border border-white/15 text-white focus:border-[#F4D03F] transition-all outline-none" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
              </div>
              
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-3 pl-10 pr-12 rounded-xl bg-white/10 border border-white/15 text-white focus:border-[#F4D03F] transition-all outline-none" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-[#F4D03F] transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button type="submit" disabled={loginLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base transition-all hover:scale-[1.02]">
                {loginLoading ? <div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin mx-auto" /> : 'Entrar'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button onClick={onSignUpClick} className="text-[#F4D03F] text-sm hover:underline transition-all inline-flex items-center gap-1">
                Criar nova conta <ArrowRight size={14} />
              </button>
            </div>

            <div className="flex justify-center gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1"><Shield size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-[#A0A0B0]">Seguro total</span></div>
              <div className="flex items-center gap-1"><Star size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-[#A0A0B0]">Motoristas top</span></div>
              <div className="flex items-center gap-1"><Zap size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-[#A0A0B0]">Chegada rápida</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE CADASTRO
// ============================================
const SignUpScreen = ({ onBack, onSuccess }: any) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tipo, setTipo] = useState<'passageiro' | 'motorista'>('passageiro');
  const [veiculo, setVeiculo] = useState({ placa: '', modelo: '', cor: '' });

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
      const { data: auth, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: { nome_completo: nome, tipo: tipo } } 
      });
      if (error) throw error;
      
      if (auth.user) {
        await supabase.from('usuarios').insert({ 
          id: auth.user.id, 
          nome_completo: nome, 
          telefone: telefone || null,
          email: email, 
          tipo: tipo 
        });
        
        if (tipo === 'passageiro') {
          await supabase.from('passageiros').insert({ id: auth.user.id });
        } else {
          await supabase.from('motoristas').insert({ 
            id: auth.user.id, 
            status: 'pendente',
            dados_veiculo: veiculo
          });
        }
        
        alert('✅ Conta criada! Faça login.');
        onSuccess();
      }
    } catch (error: any) {
      if (error.message.includes('already registered')) {
        alert('Este e-mail já está cadastrado! Faça login.');
        onBack();
      } else {
        alert('❌ Erro: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button onClick={onBack} className="flex items-center gap-1 text-[#A0A0B0] mb-4 hover:text-[#F4D03F] transition">
            <ArrowLeft size={20} /> Voltar
          </button>
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
              <Car size={40} className="text-[#F4D03F]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Criar Conta</h2>
            <p className="text-[#A0A0B0] mt-1">Escolha como você quer usar o app</p>
          </div>

          <div className="space-y-4">
            <button onClick={() => { setTipo('passageiro'); setStep(2); }} className="w-full p-6 rounded-2xl bg-gradient-to-r from-[#1A1528] to-[#2D2342] border-2 border-[#F4D03F]/30 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#F4D03F]/20 flex items-center justify-center"><User size={28} className="text-[#F4D03F]" /></div>
                <div className="flex-1 text-left"><h3 className="text-lg font-bold text-white">Sou Passageiro</h3><p className="text-[#A0A0B0] text-xs">Quero solicitar corridas</p></div>
                <ArrowRight size={20} className="text-[#F4D03F]" />
              </div>
            </button>

            <button onClick={() => { setTipo('motorista'); setStep(2); }} className="w-full p-6 rounded-2xl bg-gradient-to-r from-[#1A1528] to-[#2D2342] border-2 border-white/10 hover:border-[#F4D03F]/30 hover:scale-[1.02] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center"><Truck size={28} className="text-white" /></div>
                <div className="flex-1 text-left"><h3 className="text-lg font-bold text-white">Sou Motorista</h3><p className="text-[#A0A0B0] text-xs">Quero ganhar dinheiro</p></div>
                <ArrowRight size={20} className="text-gray-500" />
              </div>
            </button>

            <div className="text-center pt-4">
              <button onClick={onBack} className="text-[#A0A0B0] text-sm hover:text-[#F4D03F] transition">← Já tenho conta</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button onClick={() => setStep(1)} className="flex items-center gap-1 text-[#A0A0B0] mb-4 hover:text-[#F4D03F] transition">
          <ArrowLeft size={20} /> Voltar
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
            {tipo === 'passageiro' ? <User size={32} className="text-[#F4D03F]" /> : <Truck size={32} className="text-[#F4D03F]" />}
          </div>
          <h2 className="text-xl font-bold text-white">Complete seu cadastro</h2>
          <p className="text-[#A0A0B0] text-sm">{tipo === 'passageiro' ? 'Dados do Passageiro' : 'Dados do Motorista'}</p>
        </div>

        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-2xl p-6 border border-[#F4D03F]/20">
          <div className="space-y-3">
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
              <input type="text" placeholder="Nome completo *" className="w-full p-3 pl-10 rounded-xl bg-white/10 border border-white/15 text-white" value={nome} onChange={e => setNome(e.target.value)} />
            </div>
            
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
              <input type="tel" placeholder="Telefone / WhatsApp" className="w-full p-3 pl-10 rounded-xl bg-white/10 border border-white/15 text-white" value={telefone} onChange={e => setTelefone(e.target.value)} />
            </div>
            
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
              <input type="email" placeholder="E-mail *" className="w-full p-3 pl-10 rounded-xl bg-white/10 border border-white/15 text-white" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
              <input type={showPassword ? "text" : "password"} placeholder="Senha (mínimo 6 caracteres) *" className="w-full p-3 pl-10 pr-12 rounded-xl bg-white/10 border border-white/15 text-white" value={password} onChange={e => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
            </div>

            {tipo === 'motorista' && (
              <>
                <div className="text-[#F4D03F] text-xs font-bold mt-2 mb-1">Dados do veículo</div>
                <input type="text" placeholder="Placa" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={veiculo.placa} onChange={e => setVeiculo({...veiculo, placa: e.target.value})} />
                <input type="text" placeholder="Modelo" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={veiculo.modelo} onChange={e => setVeiculo({...veiculo, modelo: e.target.value})} />
                <input type="text" placeholder="Cor" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={veiculo.cor} onChange={e => setVeiculo({...veiculo, cor: e.target.value})} />
              </>
            )}

            <button onClick={handleSignUp} disabled={loading} className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all hover:scale-[1.02]">
              {loading ? <div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin mx-auto" /> : <><Check size={18} className="inline mr-1" /> Finalizar Cadastro</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA PRINCIPAL (HOME)
// ============================================
const HomeScreen = ({ user, onSignOut }: any) => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupLocation, setPickupLocation] = useState<any>(null);
  const [dropoffLocation, setDropoffLocation] = useState<any>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [showRideModal, setShowRideModal] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (user?.id) carregarCorridaAtiva();
    return () => { if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); };
  }, [user]);

  const carregarCorridaAtiva = async () => {
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
  };

  const handleRequestRide = async () => {
    if (!user) { alert('Faça login primeiro!'); return; }
    if (!pickupLocation || !dropoffLocation) { alert('Selecione origem e destino no mapa!'); return; }
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
        alert('🚗 Corrida solicitada!');
      }
    } catch (error: any) { alert('Erro: ' + error.message); } 
    finally { setSolicitando(false); }
  };

  const handleCancelRide = async () => {
    if (activeRide) {
      const success = await cancelarCorrida(activeRide.id);
      if (success) { alert('Corrida cancelada'); setShowRideModal(false); setActiveRide(null); if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); } 
      else { alert('Erro ao cancelar'); }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
            <Car size={18} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        </div>
        <button onClick={onSignOut} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-sm hover:bg-red-500/30 transition">
          <LogOut size={14} /> Sair
        </button>
      </div>

      <div className="relative h-[220px] rounded-xl overflow-hidden mb-3">
        <MapComponent
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          onPickupChange={setPickupAddress}
          onDropoffChange={setDropoffAddress}
          onLocationSelect={(location: any) => {
            if (!dropoffAddress) { setPickupLocation(location); setPickupAddress(location.address); } 
            else { setDropoffLocation(location); setDropoffAddress(location.address); }
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-1.5 border border-[#F4D03F]/40">
            <div className="flex items-center gap-2"><Car className="text-[#F4D03F] w-5 h-5" /><span className="text-white font-bold">OBALEVA</span></div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528]/80 rounded-xl p-3 border border-[#F4D03F]/15">
        <div className="bg-white/10 rounded-lg mb-2">
          <div className="flex items-center gap-2 p-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <input type="text" placeholder="Onde você está?" className="flex-1 bg-transparent text-white outline-none" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} />
          </div>
        </div>
        <div className="bg-white/10 rounded-lg">
          <div className="flex items-center gap-2 p-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <input type="text" placeholder="Para onde vai?" className="flex-1 bg-transparent text-white outline-none" value={dropoffAddress} onChange={e => setDropoffAddress(e.target.value)} />
          </div>
        </div>
      </div>

      <button onClick={handleRequestRide} disabled={solicitando || !pickupLocation || !dropoffLocation} className="w-full py-3 mt-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all hover:scale-[1.02] disabled:opacity-50">
        {solicitando ? <div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin mx-auto" /> : '🚗 SOLICITAR CORRIDA'}
      </button>

      <RotatingBanner />
      {showRideModal && activeRide && <RideStatusModal ride={activeRide} onClose={() => setShowRideModal(false)} onCancel={handleCancelRide} />}
    </div>
  );
};

// ============================================
// TELA PERFIL
// ============================================
const ProfileScreen = ({ user, profile, onSignOut }: any) => (
  <div className="max-w-md mx-auto px-4 pb-28">
    <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-6 border border-[#F4D03F]/20 mt-4 text-center shadow-xl">
      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50">
        {profile?.tipo === 'motorista' ? <Truck size={40} className="text-[#F4D03F]" /> : <User size={40} className="text-[#F4D03F]" />}
      </div>
      <h2 className="text-white text-2xl font-bold mt-4">{profile?.nome_completo || user?.email?.split('@')[0]}</h2>
      <p className="text-[#A0A0B0] text-sm mt-1">{user?.email}</p>
      <div className="inline-block mt-3 px-4 py-1 rounded-full bg-[#F4D03F]/20">
        <span className="text-[#F4D03F] text-xs font-bold">{profile?.tipo?.toUpperCase() || 'PASSAGEIRO'}</span>
      </div>
      <button onClick={onSignOut} className="mt-8 w-full py-3 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-bold hover:bg-red-500/30 transition">Sair da conta</button>
    </div>
  </div>
);

// ============================================
// TELAS PLACEHOLDER
// ============================================
const SearchScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
      <p className="text-[#A0A0B0] mt-2">Em breve: histórico e lugares favoritos</p>
    </div>
  </div>
);

const MenuScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Menu size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">☰ Menu</h2>
      <p className="text-[#A0A0B0] mt-2">Em breve: ajuda, indicação e configurações</p>
    </div>
  </div>
);

// ============================================
// MAIN SCREEN PRINCIPAL
// ============================================
export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (err) {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4D03F]/20 animate-bounce mx-auto mb-3" />
          <p className="text-white">Carregando ObaLeva...</p>
        </div>
      </div>
    );
  }

  // Tela SIGNUP
  if (!user && showSignUp) {
    return <SignUpScreen onBack={() => setShowSignUp(false)} onSuccess={() => setShowSignUp(false)} />;
  }

  // Tela LOGIN
  if (!user) {
    return (
      <LoginScreen 
        onSignUpClick={() => setShowSignUp(true)} 
        onGoogleLogin={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); }} 
        onEmailLogin={async (e) => { e.preventDefault(); setLoginLoading(true); const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword }); if (error) alert('E-mail ou senha inválidos'); setLoginLoading(false); }} 
        loginEmail={loginEmail} setLoginEmail={setLoginEmail} loginPassword={loginPassword} setLoginPassword={setLoginPassword} loginLoading={loginLoading} 
      />
    );
  }

  // App LOGADO
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      {activeTab === 'home' && <HomeScreen user={user} onSignOut={handleSignOut} />}
      {activeTab === 'perfil' && <ProfileScreen user={user} profile={profile} onSignOut={handleSignOut} />}
      {activeTab === 'buscar' && <SearchScreen />}
      {activeTab === 'menu' && <MenuScreen />}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};