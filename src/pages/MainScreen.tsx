import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Car, Chrome, Eye, EyeOff, Home, Search, ClipboardList, User, 
  Bell, MapPin, ChevronRight, LogOut, Edit, CreditCard, History, 
  Truck, X, ArrowLeft, Upload, Key, Shield, Calendar, Phone, Mail, 
  Map, Smartphone, MessageCircle
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import DriverRegistrationModal from '../components/DriverRegistrationModal';
import ProfileScreen from '../components/ProfileScreen';
import TermsScreen from '../pages/TermsScreen';
import PrivacyScreen from '../pages/PrivacyScreen';

// ============================================
// BOTTOM NAVIGATION
// ============================================
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'atividade', label: 'Atividade', icon: ClipboardList },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-3 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/20 rounded-2xl max-w-md w-full mx-4 shadow-lg">
        <div className="flex justify-between px-6 py-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => onNavigate(tab.id)} className={`flex flex-col items-center gap-0.5 ${active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
              <tab.icon size={22} strokeWidth={active === tab.id ? 2 : 1.5} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA PRINCIPAL (HOME)
// ============================================
const HomeScreen = ({ user, onLogout, showFullUI }: any) => {
  const [destino, setDestino] = useState('');
  const [origem, setOrigem] = useState(localStorage.getItem('user_address') || 'Rua Santo Antônio, 1095 - Centro, São Paulo - SP');
  const [modoEdicaoOrigem, setModoEdicaoOrigem] = useState(false);
  const [modoEdicaoDestino, setModoEdicaoDestino] = useState(false);
  const [enderecoEditadoOrigem, setEnderecoEditadoOrigem] = useState(origem);
  const [enderecoEditadoDestino, setEnderecoEditadoDestino] = useState(destino);
  
  const origemInputRef = useRef<HTMLInputElement>(null);
  const destinoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(checkGoogleMaps);
        if (origemInputRef.current) {
          new window.google.maps.places.Autocomplete(origemInputRef.current, { fields: ['formatted_address'] });
        }
        if (destinoInputRef.current) {
          new window.google.maps.places.Autocomplete(destinoInputRef.current, { fields: ['formatted_address'] });
        }
      }
    }, 100);
    return () => clearInterval(checkGoogleMaps);
  }, []);

  const handleChamarObaLeva = () => {
    if (!destino) {
      alert('Digite um destino primeiro!');
      return;
    }
    alert(`🚗 Corrida solicitada de: ${origem}\nPara: ${destino}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-4 pb-24">
        <div className="flex justify-between items-center py-3">
          <h1 className="text-xl font-bold text-white">ObaLeva</h1>
          {showFullUI && (
            <div className="flex items-center gap-3">
              <button className="text-[#A0A0B0] text-xs">Mudar passageiro</button>
              <button onClick={onLogout} className="text-red-400 text-xs font-bold">SAIR</button>
            </div>
          )}
        </div>

        <div className="relative h-[280px] rounded-xl overflow-hidden mb-3 shadow-lg">
          <MapComponent />
        </div>

        <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-white text-xs font-bold">ONDE VOCÊ ESTÁ?</span>
            </div>
            <button onClick={() => setModoEdicaoOrigem(!modoEdicaoOrigem)} className="text-[#F4D03F] text-xs hover:underline flex items-center gap-1">
              {modoEdicaoOrigem ? '❌ Cancelar' : '✏️ Editar'}
            </button>
          </div>
          {modoEdicaoOrigem ? (
            <div className="flex gap-2">
              <input ref={origemInputRef} type="text" className="flex-1 bg-white/10 text-white p-2 rounded-lg outline-none text-sm" value={enderecoEditadoOrigem} onChange={(e) => setEnderecoEditadoOrigem(e.target.value)} />
              <button onClick={() => { setOrigem(enderecoEditadoOrigem); setModoEdicaoOrigem(false); localStorage.setItem('user_address', enderecoEditadoOrigem); }} className="px-3 bg-green-500/20 text-green-400 rounded-lg text-sm font-bold">✅</button>
            </div>
          ) : (
            <div className="flex items-center gap-2"><span className="text-white text-sm flex-1">{origem}</span></div>
          )}
        </div>

        {showFullUI && (
          <>
            <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-white text-xs font-bold">PARA ONDE VOCÊ VAI?</span></div>
                <button onClick={() => setModoEdicaoDestino(!modoEdicaoDestino)} className="text-[#F4D03F] text-xs hover:underline flex items-center gap-1">{modoEdicaoDestino ? '❌ Cancelar' : '✏️ Editar'}</button>
              </div>
              {modoEdicaoDestino ? (
                <div className="flex gap-2"><input ref={destinoInputRef} type="text" placeholder="Digite o endereço ou cidade..." className="flex-1 bg-white/10 text-white p-2 rounded-lg outline-none text-sm" value={enderecoEditadoDestino} onChange={(e) => setEnderecoEditadoDestino(e.target.value)} /><button onClick={() => { setDestino(enderecoEditadoDestino); setModoEdicaoDestino(false); }} className="px-3 bg-green-500/20 text-green-400 rounded-lg text-sm font-bold">✅</button></div>
              ) : (
                <input ref={destinoInputRef} type="text" placeholder="Digite o endereço ou cidade..." className="w-full bg-white/10 text-white p-2 rounded-lg outline-none text-sm" value={destino} onChange={(e) => setDestino(e.target.value)} />
              )}
            </div>
            <button onClick={handleChamarObaLeva} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-base flex items-center justify-center gap-2 mb-3"><Car size={18} /> Chamar ObaLeva</button>
            <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-3 flex justify-between items-center">
              <div><div className="flex items-center gap-1"><span className="text-2xl">🍔</span><span className="text-white font-bold text-sm">Almoço com até 50% OFF</span></div><p className="text-[#A0A0B0] text-xs mt-1">Peça agora</p></div>
              <ChevronRight size={20} className="text-[#F4D03F]" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================
// TELAS PLACEHOLDER
// ============================================
const SearchScreen = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
    <div className="max-w-md mx-auto px-4 pb-24 pt-8">
      <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
        <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
      </div>
    </div>
  </div>
);

const ActivityScreen = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
    <div className="max-w-md mx-auto px-4 pb-24 pt-8">
      <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
        <ClipboardList size={48} className="text-[#F4D03F] mx-auto mb-4" />
        <h2 className="text-white text-xl font-bold">📋 Atividade</h2>
        <p className="text-gray-400 mt-2">Histórico de corridas</p>
      </div>
    </div>
  </div>
);

// ============================================
// MODAL DE LOCALIZAÇÃO
// ============================================
const LocationModal = ({ onAllow, onDeny }: any) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
    <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30">
      <div className="p-2 flex justify-center"><div className="w-10 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
      <div className="px-5 pb-4">
        <div className="flex items-center justify-center gap-2 mb-2"><MapPin size={20} className="text-[#F4D03F]" /><h2 className="text-white text-base font-bold">Acesso à localização</h2></div>
        <p className="text-[#A0A0B0] text-[11px] text-center mb-3">Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.</p>
        <div className="space-y-1.5">
          <button onClick={() => { onAllow('exact'); }} className="w-full py-2 px-4 rounded-xl bg-[#F4D03F] text-black font-bold text-left">
            <div className="flex justify-between items-center"><span className="text-sm">📍 SEMPRE PERMITIR</span><span className="text-[9px] text-black/70">Recomendado</span></div>
            <p className="text-[9px] text-black/70">O app pode usar sua localização a qualquer momento</p>
          </button>
          <button onClick={() => { onAllow('approximate'); }} className="w-full py-2 px-4 rounded-xl border border-white/20 text-white font-bold text-left">
            <div><span className="text-sm">📍 SÓ DESTA VEZ</span><p className="text-[9px] text-[#A0A0B0]">O app usa sua localização apenas agora</p></div>
          </button>
          <button onClick={onDeny} className="w-full py-2 px-4 rounded-xl text-[#A0A0B0] text-left text-sm">🚫 NÃO PERMITIR</button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// MODAL DE NOTIFICAÇÕES
// ============================================
const NotificationModal = ({ onAllow, onDeny }: any) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
    <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30">
      <div className="p-2 flex justify-center"><div className="w-10 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
      <div className="px-5 pb-4">
        <div className="flex items-center justify-center gap-2 mb-2"><Bell size={20} className="text-[#F4D03F]" /><h2 className="text-white text-base font-bold">Permitir notificações?</h2></div>
        <p className="text-[#A0A0B0] text-[11px] text-center mb-2">Para receber alertas importantes como:</p>
        <div className="bg-white/5 rounded-lg p-1.5 mb-2 space-y-0.5">
          <p className="text-white text-[10px] text-center">• 🚗 "Motorista a caminho"</p>
          <p className="text-white text-[10px] text-center">• 📍 "Estou chegando!"</p>
          <p className="text-white text-[10px] text-center">• ✅ "Corrida confirmada"</p>
          <p className="text-white text-[10px] text-center">• 💰 "Promoções e descontos"</p>
        </div>
        <div className="space-y-1.5">
          <button onClick={onAllow} className="w-full py-2 rounded-xl bg-[#F4D03F] text-black font-bold text-sm">PERMITIR</button>
          <button onClick={onDeny} className="w-full py-2 rounded-xl border border-white/20 text-white font-bold text-sm">NÃO PERMITIR</button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// MODAL DE CRIAÇÃO DE CONTA
// ============================================
const SignUpModal = ({ onSuccess }: any) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    if (field === 'nome' && !value) newErrors.nome = 'Nome é obrigatório';
    else if (field === 'email' && !value) newErrors.email = 'E-mail é obrigatório';
    else if (field === 'telefone' && value && value.replace(/\D/g, '').length < 10) newErrors.telefone = 'Telefone inválido';
    else if (field === 'password' && !value) newErrors.password = 'Senha é obrigatória';
    else if (field === 'password' && value.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    else if (field === 'confirmPassword' && value !== password) newErrors.confirmPassword = 'As senhas não coincidem';
    else delete newErrors[field];
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAll = () => {
    const newErrors: Record<string, string> = {};
    if (!nome) newErrors.nome = 'Nome é obrigatório';
    if (!email) newErrors.email = 'E-mail é obrigatório';
    if (telefone && telefone.replace(/\D/g, '').length < 10) newErrors.telefone = 'Telefone inválido';
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (password !== confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAccount = async () => {
    if (!validateAll()) return;
    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email, password,
        options: { data: { nome_completo: nome, telefone: telefone.replace(/\D/g, ''), termos_aceitos: false } },
      });
      if (signUpError) throw signUpError;
      if (data.user) {
        await supabase.from('usuarios').insert({
          id: data.user.id, nome_completo: nome, email, telefone: telefone.replace(/\D/g, ''), tipo: 'passageiro', termos_aceitos: false,
        });
        await supabase.from('passageiros').insert({ id: data.user.id });
        localStorage.setItem('obaleva_onboarding', 'true');
        localStorage.setItem('location_permission_asked', 'true');
        alert('✅ Conta criada! Faça login.');
        setIsLoginMode(true);
      }
    } catch (err: any) {
      if (err.message.includes('already registered')) { setErrors({ email: 'E-mail já cadastrado' }); setIsLoginMode(true); }
      else { setErrors({ general: err.message || 'Erro ao criar conta' }); }
    } finally { setLoading(false); }
  };

  const handleLogin = async () => {
    setErrors({});
    if (!email || !password) {
      if (!email) setErrors({ email: 'E-mail é obrigatório' });
      if (!password) setErrors({ password: 'Senha é obrigatória' });
      return;
    }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      localStorage.setItem('obaleva_onboarding', 'true');
      onSuccess();
    } catch (err: any) { setErrors({ general: err.message || 'Erro ao fazer login' }); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  if (showTermsModal) return <TermsScreen onBack={() => setShowTermsModal(false)} user={null} />;
  if (showPrivacyModal) return <PrivacyScreen onBack={() => setShowPrivacyModal(false)} user={null} />;

  if (isLoginMode) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
        <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30">
          <div className="p-2 flex justify-center"><div className="w-10 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
          <div className="px-5 pb-4">
            <div className="flex items-center justify-center gap-2 mb-3"><Car size={20} className="text-[#F4D03F]" /><h2 className="text-white text-base font-bold">Fazer login</h2></div>
            {errors.general && <div className="mb-2 p-1.5 text-center text-xs text-red-400 bg-red-500/10 rounded">{errors.general}</div>}
            <div className="space-y-1.5">
              <div><div className="bg-white/5 rounded-xl border border-white/15"><div className="flex items-center gap-2 px-3 py-1.5"><span className="text-white">📧</span><input type="email" placeholder="E-mail *" className="flex-1 bg-transparent text-white outline-none text-sm" value={email} onChange={(e) => setEmail(e.target.value)} /></div></div>{errors.email && <p className="text-red-400 text-[10px] px-1">{errors.email}</p>}</div>
              <div><div className="relative"><input type={showPassword ? 'text' : 'password'} placeholder="Senha *" className="w-full py-1.5 px-3 rounded-xl bg-white/10 border border-white/15 text-white pr-7 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1.5 text-gray-400">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button></div>{errors.password && <p className="text-red-400 text-[10px] px-1">{errors.password}</p>}</div>
              <button onClick={handleLogin} disabled={loading} className="w-full py-1.5 rounded-xl bg-[#F4D03F] text-black font-bold text-sm">{loading ? 'Entrando...' : '🚪 ENTRAR'}</button>
              <div className="relative my-1.5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-[9px] text-gray-400">ou</span></div></div>
              <div className="flex gap-1.5"><button onClick={handleGoogleLogin} className="flex-1 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center justify-center gap-1"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/><path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/></svg><span>Google</span></button><button onClick={() => { setIsLoginMode(false); setErrors({}); }} className="flex-1 py-1.5 rounded-xl border border-white/20 text-white text-xs">✨ Criar conta</button></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
      <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30">
        <div className="p-2 flex justify-center"><div className="w-10 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
        <div className="px-5 pb-4">
          <div className="flex items-center justify-center gap-2 mb-2"><Car size={20} className="text-[#F4D03F]" /><h2 className="text-white text-base font-bold">Criar sua conta</h2></div>
          <p className="text-[#A0A0B0] text-[11px] text-center mb-3">Comece a usar o ObaLeva</p>
          {errors.general && <div className="mb-2 p-1.5 text-center text-xs text-red-400 bg-red-500/10 rounded">{errors.general}</div>}
          <div className="space-y-1.5">
            <div><div className="bg-white/5 rounded-xl border border-white/15"><div className="flex items-center gap-2 px-3 py-1.5"><span className="text-white">👤</span><input type="text" placeholder="Nome completo *" className="flex-1 bg-transparent text-white outline-none text-sm" value={nome} onChange={(e) => { setNome(e.target.value); validateField('nome', e.target.value); }} /></div></div>{errors.nome && <p className="text-red-400 text-[10px] px-1">{errors.nome}</p>}</div>
            <div><div className="bg-white/5 rounded-xl border border-white/15"><div className="flex items-center gap-2 px-3 py-1.5"><span className="text-white">📧</span><input type="email" placeholder="E-mail *" className="flex-1 bg-transparent text-white outline-none text-sm" value={email} onChange={(e) => { setEmail(e.target.value); validateField('email', e.target.value); }} /></div></div>{errors.email && <p className="text-red-400 text-[10px] px-1">{errors.email}</p>}</div>
            <div><div className="bg-white/5 rounded-xl border border-white/15"><div className="flex items-center gap-2 px-3 py-1.5"><span className="text-white">📱</span><span className="text-green-500 text-[10px] font-bold mr-0.5">WhatsApp</span><span className="text-white text-[10px]">+55</span><input type="tel" placeholder="(11) 99999-9999" className="flex-1 bg-transparent text-white outline-none text-sm" value={telefone} onChange={(e) => { setTelefone(formatPhoneNumber(e.target.value)); validateField('telefone', e.target.value); }} maxLength={15} /></div></div>{errors.telefone && <p className="text-red-400 text-[10px] px-1">{errors.telefone}</p>}</div>
            <div className="flex gap-1.5">
              <div className="flex-1"><div className="relative"><input type={showPassword ? 'text' : 'password'} placeholder="Senha *" className="w-full py-1.5 px-3 rounded-xl bg-white/10 border border-white/15 text-white pr-7 text-sm" value={password} onChange={(e) => { setPassword(e.target.value); validateField('password', e.target.value); }} /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1.5 text-gray-400">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button></div>{errors.password && <p className="text-red-400 text-[10px] px-1">{errors.password}</p>}</div>
              <div className="flex-1"><div className="relative"><input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirmar *" className="w-full py-1.5 px-3 rounded-xl bg-white/10 border border-white/15 text-white pr-7 text-sm" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); validateField('confirmPassword', e.target.value); }} /><button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1.5 text-gray-400">{showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button></div>{errors.confirmPassword && <p className="text-red-400 text-[10px] px-1">{errors.confirmPassword}</p>}</div>
            </div>
            <label className="flex items-start gap-2 py-1">
              <input type="checkbox" className="w-3.5 h-3.5 mt-0.5" />
              <span className="text-[#A0A0B0] text-[9px] leading-tight">Li e aceito os <button onClick={() => setShowTermsModal(true)} className="text-[#F4D03F] underline">Termos de Uso</button> e a <button onClick={() => setShowPrivacyModal(true)} className="text-[#F4D03F] underline">Política de Privacidade</button></span>
            </label>
            <button onClick={handleCreateAccount} disabled={loading} className="w-full py-1.5 rounded-xl bg-[#F4D03F] text-black font-bold text-sm">{loading ? 'Criando conta...' : '✅ CRIAR CONTA'}</button>
            <div className="relative my-1.5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-[9px] text-gray-400">ou</span></div></div>
            <div className="flex gap-1.5"><button onClick={handleGoogleLogin} className="flex-1 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center justify-center gap-1"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/><path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/></svg><span>Google</span></button><button onClick={() => setIsLoginMode(true)} className="flex-1 py-1.5 rounded-xl border border-white/20 text-white text-xs">🔐 Já tenho conta</button></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN SCREEN PRINCIPAL (EXPORTADA CORRETAMENTE)
// ============================================
export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        const { data } = await supabase.from('usuarios').select('*').eq('id', session.user.id).maybeSingle();
        setProfile(data);
      }
      
      const completed = localStorage.getItem('obaleva_onboarding') === 'true';
      const locationAsked = localStorage.getItem('location_permission_asked') === 'true';
      setOnboardingCompleted(completed || !!session?.user);
      
      if (!completed && !session?.user) {
        if (!locationAsked) setShowLocationModal(true);
        else setShowNotificationModal(true);
      }
      setLoading(false);
    };
    checkStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase.from('usuarios').select('*').eq('id', session.user.id).maybeSingle();
        setProfile(data);
        setOnboardingCompleted(true);
        localStorage.setItem('obaleva_onboarding', 'true');
        setShowLocationModal(false);
        setShowNotificationModal(false);
        setShowSignUpModal(false);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLocationAllow = () => {
    localStorage.setItem('location_permission_asked', 'true');
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(() => {}, () => {});
    setShowLocationModal(false);
    setShowNotificationModal(true);
  };

  const handleLocationDeny = () => {
    localStorage.setItem('location_permission_asked', 'true');
    setShowLocationModal(false);
    setShowNotificationModal(true);
  };

  const handleNotificationAllow = () => {
    if ('Notification' in window) Notification.requestPermission();
    setShowNotificationModal(false);
    setShowSignUpModal(true);
  };

  const handleNotificationDeny = () => {
    setShowNotificationModal(false);
    setShowSignUpModal(true);
  };

  const handleSignUpSuccess = () => {
    setShowSignUpModal(false);
    window.location.reload();
  };

  // FUNÇÃO DE LOGOUT GARANTIDA
  const handleLogout = async () => {
    console.log("🔴 Logout");
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;
  }

  const showFullUI = onboardingCompleted || !!user;

  return (
    <>
      {activeTab === 'home' && <HomeScreen user={user} onLogout={user ? handleLogout : undefined} showFullUI={showFullUI} />}
      {activeTab === 'perfil' && user && <ProfileScreen user={user} profile={profile} onLogout={handleLogout} onRefresh={() => {}} />}
      {activeTab === 'buscar' && showFullUI && <SearchScreen />}
      {activeTab === 'atividade' && showFullUI && <ActivityScreen />}
      {showFullUI && <BottomNav active={activeTab} onNavigate={setActiveTab} />}
      
      {!showFullUI && showLocationModal && <LocationModal onAllow={handleLocationAllow} onDeny={handleLocationDeny} />}
      {!showFullUI && showNotificationModal && <NotificationModal onAllow={handleNotificationAllow} onDeny={handleNotificationDeny} />}
      {!showFullUI && showSignUpModal && <SignUpModal onSuccess={handleSignUpSuccess} />}
    </>
  );
};