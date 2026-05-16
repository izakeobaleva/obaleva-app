import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  Car, MapPin, Navigation, User, Truck, Shield, Star, Zap, 
  Gift, Chrome, Home, Search, Menu as MenuIcon, LogOut, 
  ChevronLeft, Video, Megaphone, Coffee, Heart, Eye, EyeOff,
  Map, Target, ArrowRight, Clock, Award, Users, Headphones
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import MapComponent from '../components/MapComponent';

// ============================================
// BOTTOM NAVIGATION - FAIXA FIXA
// ============================================
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] via-[#0F0B1A] to-transparent pt-4 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/20 rounded-2xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center px-4 py-2">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                  isActive ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'
                }`}
              >
                <tab.icon size={24} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && <div className="w-1.5 h-1 rounded-full bg-[#F4D03F] mt-0.5 animate-pulse" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================
// DISCOVER BAR - CARDS ROLÁVEIS (ROLAGEM HORIZONTAL)
// ============================================
const DiscoverBar = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const cards = [
    { icon: <Gift size={22} />, title: "1ª corrida grátis", description: "Até R$ 20 de desconto", color: "#F4D03F", type: "promo", badge: "🔥 PROMO" },
    { icon: <Shield size={22} />, title: "Seguro ObaLeva", description: "Proteção total", color: "#8B5CF6", type: "info", badge: "✓ INCLUÍDO" },
    { icon: <Star size={22} />, title: "Avaliação 4.8★", description: "Motoristas nota 10", color: "#F4D03F", type: "info", badge: "⭐ TOP" },
    { icon: <Zap size={22} />, title: "Rápido", description: "Chegada em minutos", color: "#A855F7", type: "info", badge: "⚡ RÁPIDO" },
    { icon: <Video size={22} />, title: "Como funciona?", description: "Assista ao vídeo", color: "#F4D03F", type: "video", badge: "▶️ WATCH" },
    { icon: <Megaphone size={22} />, title: "Indique e ganhe", description: "R$ 10 de crédito", color: "#8B5CF6", type: "promo", badge: "🔥 PROMO" },
    { icon: <Coffee size={22} />, title: "Parceiros", description: "Descontos exclusivos", color: "#A855F7", type: "promo", badge: "🎁 BÔNUS" },
    { icon: <Heart size={22} />, title: "ObaLeva Solidário", description: "Doação por corrida", color: "#F4D03F", type: "promo", badge: "💚 SOLIDÁRIO" },
  ];

  return (
    <div className="relative mt-4 mb-28">
      {/* Seta esquerda */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A1528]/90 rounded-full p-2 backdrop-blur-sm border border-[#F4D03F]/30 shadow-lg hover:scale-110 transition-all"
      >
        <ChevronLeft size={18} className="text-[#F4D03F]" />
      </button>
      
      {/* Container de rolagem */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-3 pb-2 px-1 snap-x snap-mandatory"
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="min-w-[170px] max-w-[170px] bg-gradient-to-br from-[#1A1528] to-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/10 hover:border-[#F4D03F]/30 hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg"
          >
            <div className="flex items-start gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0`} 
                   style={{ backgroundColor: `${card.color}20` }}>
                <div style={{ color: card.color }}>{card.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-xs truncate">{card.title}</h4>
                <p className="text-[#A0A0B0] text-[10px] mt-0.5 truncate">{card.description}</p>
                <div className="mt-1.5 inline-block bg-[#F4D03F]/15 text-[#F4D03F] text-[8px] px-2 py-0.5 rounded-full font-bold">
                  {card.badge}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Seta direita */}
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A1528]/90 rounded-full p-2 backdrop-blur-sm border border-[#F4D03F]/30 shadow-lg hover:scale-110 transition-all"
      >
        <ChevronRight size={18} className="text-[#F4D03F]" />
      </button>
    </div>
  );
};

// ============================================
// COMPONENTE DE ORIGEM E DESTINO (CONTAINER SEPARADO)
// ============================================
const LocationInputs = ({ 
  pickupAddress, setPickupAddress, 
  dropoffAddress, setDropoffAddress 
}: any) => (
  <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528] rounded-2xl p-4 border border-[#F4D03F]/15 shadow-xl">
    {/* Título */}
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
      <Map size={16} className="text-[#F4D03F]" />
      <h3 className="text-white font-semibold text-sm">Definir rota</h3>
      <div className="flex-1"></div>
      <div className="flex items-center gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
      </div>
    </div>

    {/* Campo Origem */}
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-[#F4D03F]/30 transition-all">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <div className="absolute top-4 left-1.5 w-0.5 h-6 bg-gradient-to-b from-green-500 to-red-500"></div>
        </div>
        <input
          type="text"
          placeholder="Onde você está?"
          className="flex-1 bg-transparent text-white outline-none text-sm font-medium placeholder:text-[#A0A0B0]/50"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
        />
        {pickupAddress && (
          <button 
            onClick={() => setPickupAddress('')}
            className="text-[#A0A0B0] hover:text-red-400 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>
    
    {/* Espaço entre campos */}
    <div className="mt-2"></div>
    
    {/* Campo Destino */}
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden hover:border-[#F4D03F]/30 transition-all">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <input
          type="text"
          placeholder="Para onde vai?"
          className="flex-1 bg-transparent text-white outline-none text-sm font-medium placeholder:text-[#A0A0B0]/50"
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
        />
        {dropoffAddress && (
          <button 
            onClick={() => setDropoffAddress('')}
            className="text-[#A0A0B0] hover:text-red-400 transition"
          >
            ✕
          </button>
        )}
      </div>
    </div>

    {/* Trocar rota */}
    <button 
      className="mt-3 w-full flex items-center justify-center gap-2 text-[10px] text-[#A0A0B0] hover:text-[#F4D03F] transition-all py-1"
      onClick={() => {
        const temp = pickupAddress;
        setPickupAddress(dropoffAddress);
        setDropoffAddress(temp);
      }}
    >
      <ArrowRight size={12} />
      Trocar origem e destino
      <ArrowRight size={12} />
    </button>
  </div>
);

// ============================================
// ÁREA DE AÇÃO - BOTÃO SOLICITAR
// ============================================
const ActionButton = ({ onRequestRide, disabled }: any) => (
  <button 
    onClick={onRequestRide} 
    disabled={disabled}
    className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-black transition-all duration-200 flex items-center justify-center gap-3 shadow-xl ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl'
    }`}
  >
    <Car size={20} className="text-[#1A1528]" />
    <span className="text-base tracking-wider">SOLICITAR OBALEVALe</span>
    <ArrowRight size={18} />
  </button>
);

// ============================================
// TELA DE LOGIN
// ============================================
const LoginScreen = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20 shadow-xl">
      {/* Header do Login */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#F4D03F]/20 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/30">
          <Car className="text-[#F4D03F] w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-white">Bem-vindo</h2>
        <p className="text-[#A0A0B0] text-sm mt-1">Entre para solicitar corridas</p>
      </div>
      
      <div className="space-y-4">
        {/* Botão Google */}
        <button 
          onClick={onGoogleLogin} 
          className="w-full py-3 rounded-xl border border-[#F4D03F]/30 bg-white/5 text-white flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-200 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
            <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
            <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
            <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
          </svg>
          <span className="font-medium">Entrar com Google</span>
        </button>
        
        {/* Divisor */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#1A1528] px-3 text-[#A0A0B0]">ou</span>
          </div>
        </div>

        {/* Formulário Email/Senha */}
        <form onSubmit={onEmailLogin} className="space-y-3">
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden focus-within:border-[#F4D03F]/50 transition-all">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-[#A0A0B0] text-lg">📧</span>
              <input 
                type="email" 
                placeholder="E-mail" 
                className="flex-1 bg-transparent text-white outline-none text-sm"
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)} 
                autoComplete="username"
                required 
              />
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden focus-within:border-[#F4D03F]/50 transition-all">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-[#A0A0B0] text-lg">🔒</span>
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Senha" 
                className="flex-1 bg-transparent text-white outline-none text-sm"
                value={loginPassword} 
                onChange={e => setLoginPassword(e.target.value)} 
                autoComplete="current-password"
                required 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#A0A0B0] hover:text-[#F4D03F] transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loginLoading} 
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loginLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin" />
                Entrando...
              </>
            ) : (
              <>
                <LogOut size={16} />
                Entrar
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD DO PASSAGEIRO (COMPLETO)
// ============================================
const PassengerDashboard = ({ 
  pickupAddress, setPickupAddress, 
  dropoffAddress, setDropoffAddress, 
  onRequestRide 
}: any) => (
  <div className="space-y-4">
    {/* 1. Mapa com Logo */}
    <div className="h-[220px] rounded-2xl overflow-hidden shadow-2xl">
      <MapComponent />
    </div>

    {/* 2. Container de Origem e Destino (separado) */}
    <LocationInputs 
      pickupAddress={pickupAddress}
      setPickupAddress={setPickupAddress}
      dropoffAddress={dropoffAddress}
      setDropoffAddress={setDropoffAddress}
    />

    {/* 3. Botão Solicitar ObaLeva */}
    <ActionButton 
      onRequestRide={onRequestRide}
      disabled={!pickupAddress || !dropoffAddress}
    />
  </div>
);

// ============================================
// TELA PRINCIPAL
// ============================================
export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showCadastroTipo, setShowCadastroTipo] = useState<'passageiro' | 'motorista' | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');

  const handleRequestRide = () => {
    if (!pickupAddress || !dropoffAddress) {
      toast.error('📍 Por favor, preencha a origem e o destino!');
      return;
    }
    toast.success(`🚗 Corrida solicitada!\n\n📍 De: ${pickupAddress}\n📍 Para: ${dropoffAddress}`, {
      duration: 5000,
      icon: '🚗',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#F4D03F]/20 flex items-center justify-center animate-bounce">
            <Car className="text-[#F4D03F] w-8 h-8" />
          </div>
          <p className="text-white text-lg font-bold mt-4">Carregando ObaLeva...</p>
          <p className="text-[#A0A0B0] text-xs mt-1">Mobilidade premium</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <Toaster position="top-center" richColors />
      
      <div className="max-w-md mx-auto px-4 pb-32">
        {/* CABEÇALHO */}
        <div className="py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F4D03F]/20 to-[#8B5CF6]/20 flex items-center justify-center">
              <Car className="text-[#F4D03F] w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">
              OBALEVA
            </h1>
          </div>
          {user && (
            <button 
              onClick={signOut} 
              className="text-[#A0A0B0] text-xs flex items-center gap-1 hover:text-red-400 transition-all px-3 py-1 rounded-full bg-white/5"
            >
              <LogOut size={12} /> Sair
            </button>
          )}
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        {!user ? (
          <LoginScreen
            onGoogleLogin={async () => { 
              const { error } = await supabase.auth.signInWithOAuth({ 
                provider: 'google', 
                options: { redirectTo: window.location.origin } 
              }); 
              if (error) toast.error('Erro ao logar com Google'); 
            }}
            onEmailLogin={async (e) => { 
              e.preventDefault(); 
              setLoginLoading(true); 
              const { error } = await supabase.auth.signInWithPassword({ 
                email: loginEmail, 
                password: loginPassword 
              }); 
              if (error) toast.error('E-mail ou senha inválidos'); 
              setLoginLoading(false); 
            }}
            loginEmail={loginEmail} 
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword} 
            setLoginPassword={setLoginPassword}
            loginLoading={loginLoading}
          />
        ) : !profile ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <button onClick={() => setShowCadastroTipo('passageiro')} className="flex-1 py-3 rounded-xl border border-[#F4D03F]/30 text-white bg-white/5 text-sm font-medium hover:bg-white/10 transition">Passageiro</button>
              <button onClick={() => setShowCadastroTipo('motorista')} className="flex-1 py-3 rounded-xl border border-[#F4D03F]/30 text-white bg-white/5 text-sm font-medium hover:bg-white/10 transition">Motorista</button>
            </div>
            {showCadastroTipo === 'passageiro' && <CadastroRapido tipo="passageiro" onSuccess={() => window.location.reload()} />}
            {showCadastroTipo === 'motorista' && <CadastroRapido tipo="motorista" onSuccess={() => window.location.reload()} />}
          </div>
        ) : profile.tipo === 'passageiro' ? (
          <PassengerDashboard
            pickupAddress={pickupAddress}
            setPickupAddress={setPickupAddress}
            dropoffAddress={dropoffAddress}
            setDropoffAddress={setDropoffAddress}
            onRequestRide={handleRequestRide}
          />
        ) : profile.tipo === 'motorista' ? (
          <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20 text-center">
            <Truck className="text-[#F4D03F] w-12 h-12 mx-auto mb-3" />
            <h2 className="text-white font-bold text-lg">Painel do Motorista</h2>
            <p className="text-[#A0A0B0] text-sm mt-1">Aguardando aprovação</p>
            <button className="mt-4 px-4 py-1.5 rounded-full bg-green-600 text-white text-xs flex items-center gap-1 mx-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              Online
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20 text-center">
            <Shield className="text-[#F4D03F] w-12 h-12 mx-auto mb-3" />
            <h2 className="text-white font-bold text-lg">Painel Administrativo</h2>
          </div>
        )}

        {/* 5. DISCOVER BAR - ROLAGEM HORIZONTAL */}
        <DiscoverBar />
      </div>

      {/* 6. FAIXA FIXA - BOTTOM NAVIGATION */}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};

// ============================================
// CADASTRO RÁPIDO
// ============================================
const CadastroRapido = ({ tipo, onSuccess }: { tipo: 'passageiro' | 'motorista'; onSuccess: () => void }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: auth, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: { nome_completo: nome, tipo } } 
      });
      if (error) throw error;
      if (!auth.user) throw new Error('Erro ao criar usuário');
      
      await supabase.from('usuarios').insert({ 
        id: auth.user.id, 
        nome_completo: nome, 
        cpf, 
        telefone, 
        email, 
        tipo 
      });
      
      if (tipo === 'passageiro') {
        await supabase.from('passageiros').insert({ id: auth.user.id });
      } else {
        await supabase.from('motoristas').insert({ 
          id: auth.user.id, 
          status: 'pendente', 
          dados_veiculo: { placa, modelo: 'Não informado', ano: '2024', cor: 'Não informado' } 
        });
      }
      
      toast.success('Cadastro realizado! Faça login.');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528] rounded-2xl p-5 border border-[#F4D03F]/20">
      <h2 className="text-white font-bold text-lg mb-4">Cadastro {tipo === 'passageiro' ? 'Passageiro' : 'Motorista'}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-[#A0A0B0]">👤</span>
            <input placeholder="Nome completo" className="flex-1 bg-transparent text-white outline-none text-sm" value={nome} onChange={e => setNome(e.target.value)} required />
          </div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-[#A0A0B0]">🆔</span>
            <input placeholder="CPF" className="flex-1 bg-transparent text-white outline-none text-sm" value={cpf} onChange={e => setCpf(e.target.value)} required />
          </div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-[#A0A0B0]">📱</span>
            <input placeholder="Telefone" className="flex-1 bg-transparent text-white outline-none text-sm" value={telefone} onChange={e => setTelefone(e.target.value)} required />
          </div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-[#A0A0B0]">📧</span>
            <input type="email" placeholder="E-mail" className="flex-1 bg-transparent text-white outline-none text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-[#A0A0B0]">🔒</span>
            <input type={showPassword ? "text" : "password"} placeholder="Senha" className="flex-1 bg-transparent text-white outline-none text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-[#F4D03F] transition">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        {tipo === 'motorista' && (
          <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-[#A0A0B0]">🚗</span>
              <input placeholder="Placa" className="flex-1 bg-transparent text-white outline-none text-sm" value={placa} onChange={e => setPlaca(e.target.value)} required />
            </div>
          </div>
        )}
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all duration-200">
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
};

// ============================================
// ICONES
// ============================================
const ChevronRight = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);