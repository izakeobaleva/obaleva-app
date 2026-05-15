import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Car, MapPin, Navigation, User, Truck, Shield, Star, Zap, Gift, ChevronRight, Chrome, Home, Search, Menu as MenuIcon } from 'lucide-react';
import { toast } from 'sonner';

// ==================== COMPONENTES INTERNOS ====================

// BottomNav (barra fixa inferior principal)
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1528] border-t border-white/10 z-50">
      <div className="flex justify-around items-center px-2 py-2">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${isActive ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}
              style={{ minHeight: '56px', minWidth: '70px' }}
            >
              <tab.icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#F4D03F] mt-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// DiscoverBar (segunda barra fixa inferior)
const DiscoverBar = () => {
  const cards = [
    { icon: <Gift size={18} />, title: "1ª corrida grátis", description: "Até R$ 20 de desconto", color: "#F4D03F" },
    { icon: <Shield size={18} />, title: "Seguro ObaLeva", description: "Proteção total", color: "#6B2D8C" },
    { icon: <Star size={18} />, title: "Avaliação 4.8★", description: "Motoristas nota 10", color: "#F4D03F" },
    { icon: <Zap size={18} />, title: "Rápido", description: "Chegada em minutos", color: "#9B59B6" },
  ];
  return (
    <div className="mb-20">
      <div className="flex justify-between items-center px-4 mb-3 mt-2">
        <h3 className="text-white font-bold text-lg">Descubra o ObaLeva</h3>
        <button className="flex items-center gap-1 text-[#F4D03F] text-sm font-medium">Ver todos <ChevronRight size={16} /></button>
      </div>
      <div className="overflow-x-auto scrollbar-hide px-4 pb-2">
        <div className="flex flex-row gap-3">
          {cards.map((card, idx) => (
            <div key={idx} className="min-w-[160px] bg-[#1A1528] rounded-2xl p-3 border border-white/10">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${card.color}20` }}>
                <div style={{ color: card.color }}>{card.icon}</div>
              </div>
              <h4 className="text-white font-semibold text-sm">{card.title}</h4>
              <p className="text-[#A0A0B0] text-xs mt-1">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tela de login dentro do "celular"
const LoginScreen = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading }: any) => (
  <div className="bg-[#1A1528] rounded-2xl p-5 border border-white/10">
    <div className="text-center mb-4">
      <Car className="text-[#F4D03F] w-12 h-12 mx-auto mb-2" />
      <h2 className="text-xl font-bold text-white">Bem-vindo</h2>
      <p className="text-[#A0A0B0] text-sm">Entre para solicitar corridas</p>
    </div>
    <div className="space-y-3">
      <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-white/20 bg-white/5 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition">
        <Chrome size={18} /> Entrar com Google
      </button>
      <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div><div className="relative flex justify-center text-xs"><span className="bg-[#1A1528] px-2 text-[#A0A0B0]">ou</span></div></div>
      <form onSubmit={onEmailLogin} className="space-y-3">
        <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-[#0F0B1A] border border-white/10 text-white" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" className="w-full p-3 rounded-xl bg-[#0F0B1A] border border-white/10 text-white" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
        <button type="submit" disabled={loginLoading} className="btn-amarelo w-full py-3 rounded-xl font-bold">Entrar com E-mail</button>
      </form>
    </div>
  </div>
);

// Dashboard do passageiro (dentro do "celular")
const PassengerDashboard = () => (
  <div className="bg-[#1A1528] rounded-2xl overflow-hidden border border-white/10">
    <div className="h-48 bg-gray-800 flex items-center justify-center">
      <p className="text-[#A0A0B0] text-sm">🗺️ Mapa ao vivo (Google Maps em breve)</p>
    </div>
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-3 bg-[#0F0B1A] p-3 rounded-xl">
        <MapPin size={20} className="text-[#F4D03F]" />
        <input type="text" placeholder="Onde você está?" className="flex-1 bg-transparent text-white outline-none" defaultValue="Local atual" />
      </div>
      <div className="flex items-center gap-3 bg-[#0F0B1A] p-3 rounded-xl">
        <Navigation size={20} className="text-[#6B2D8C]" />
        <input type="text" placeholder="Para onde vai?" className="flex-1 bg-transparent text-white outline-none" />
      </div>
      <button className="btn-amarelo w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2">
        <Car size={18} /> Solicitar ObaLeva
      </button>
    </div>
  </div>
);

// Cadastro rápido (quando usuário loga sem perfil)
const CadastroRapido = ({ tipo, onSuccess }: { tipo: 'passageiro' | 'motorista'; onSuccess: () => void }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);

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
      await supabase.from('usuarios').insert({ id: auth.user.id, nome_completo: nome, cpf, telefone, email, tipo });
      if (tipo === 'passageiro') {
        await supabase.from('passageiros').insert({ id: auth.user.id });
      } else {
        await supabase.from('motoristas').insert({ id: auth.user.id, status: 'pendente', dados_veiculo: { placa, modelo: 'Não informado', ano: '2024', cor: 'Não informado' } });
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
    <div className="bg-[#1A1528] rounded-2xl p-5 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4">Cadastro {tipo === 'passageiro' ? 'Passageiro' : 'Motorista'}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input placeholder="Nome completo" className="w-full p-3 rounded-xl bg-[#0F0B1A] border border-white/10 text-white" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="CPF" className="w-full p-3 rounded-xl bg-[#0F0B1A] border border-white/10 text-white" value={cpf} onChange={e => setCpf(e.target.value)} required />
        <input placeholder="Telefone" className="w-full p-3 rounded-xl bg-[#0F0B1A] border border-white/10 text-white" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-[#0F0B1A] border border-white/10 text-white" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" className="w-full p-3 rounded-xl bg-[#0F0B1A] border border-white/10 text-white" value={password} onChange={e => setPassword(e.target.value)} required />
        {tipo === 'motorista' && <input placeholder="Placa" className="w-full p-3 rounded-xl bg-[#0F0B1A] border border-white/10 text-white" value={placa} onChange={e => setPlaca(e.target.value)} required />}
        <button type="submit" disabled={loading} className="btn-amarelo w-full py-3 rounded-xl font-bold">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
      </form>
    </div>
  );
};

// ==================== TELA PRINCIPAL ====================

export const MainScreen = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showCadastroTipo, setShowCadastroTipo] = useState<'passageiro' | 'motorista' | null>(null);

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    if (error) toast.error('Erro ao logar com Google');
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) toast.error('E-mail ou senha inválidos');
    setLoginLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0F0B1A] pb-32">
      {/* HEADER COM LOGO */}
      <div className="bg-[#1A1528] pt-8 pb-4 px-4 border-b border-white/10">
        <div className="flex items-center justify-center gap-2">
          <Car className="text-[#F4D03F]" size={28} />
          <h1 className="text-2xl font-bold text-white">OBALEVA</h1>
        </div>
        <p className="text-[#A0A0B0] text-center text-sm mt-1">Mobilidade premium para sua cidade</p>
      </div>

      {/* CONTEÚDO PRINCIPAL (SIMULA UM CELULAR) */}
      <div className="max-w-md mx-auto p-4">
        {!user ? (
          <LoginScreen
            onGoogleLogin={handleGoogleLogin}
            onEmailLogin={handleEmailLogin}
            loginEmail={loginEmail}
            setLoginEmail={setLoginEmail}
            loginPassword={loginPassword}
            setLoginPassword={setLoginPassword}
            loginLoading={loginLoading}
          />
        ) : !profile ? (
          <div className="space-y-4">
            <div className="flex gap-3">
              <button onClick={() => setShowCadastroTipo('passageiro')} className="flex-1 py-3 rounded-xl border border-white/20 text-white bg-[#1A1528]">Passageiro</button>
              <button onClick={() => setShowCadastroTipo('motorista')} className="flex-1 py-3 rounded-xl border border-white/20 text-white bg-[#1A1528]">Motorista</button>
            </div>
            {showCadastroTipo === 'passageiro' && <CadastroRapido tipo="passageiro" onSuccess={() => window.location.reload()} />}
            {showCadastroTipo === 'motorista' && <CadastroRapido tipo="motorista" onSuccess={() => window.location.reload()} />}
          </div>
        ) : profile.tipo === 'passageiro' ? (
          <PassengerDashboard />
        ) : profile.tipo === 'motorista' ? (
          <div className="bg-[#1A1528] rounded-2xl p-5 border border-white/10 text-center">
            <Truck className="text-[#F4D03F] w-12 h-12 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-white">Painel do Motorista</h2>
            <p className="text-[#A0A0B0] text-sm">Aguardando aprovação do administrador</p>
            <button className="mt-3 px-6 py-2 rounded-full bg-green-600 text-white">🟢 Ficar Online</button>
          </div>
        ) : (
          <div className="bg-[#1A1528] rounded-2xl p-5 border border-white/10 text-center">
            <Shield className="text-[#F4D03F] w-12 h-12 mx-auto mb-2" />
            <h2 className="text-xl font-bold text-white">Painel Administrativo</h2>
            <p className="text-[#A0A0B0] text-sm">Gerencie motoristas, passageiros e corridas</p>
          </div>
        )}
      </div>

      {/* DISCOVER BAR (SEGUNDA BARRA FIXA INFERIOR) */}
      <DiscoverBar />

      {/* BOTTOM NAV (PRIMEIRA BARRA FIXA INFERIOR) */}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};