import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Car, Chrome, Eye, EyeOff, Home, Search, ClipboardList, User, 
  Bell, Settings, Gift, MessageCircle, CreditCard, Tag, DollarSign, 
  HelpCircle, Shield, Camera, Users, Truck, ChevronRight, Key, 
  ArrowLeft, LogOut, Star
} from 'lucide-react';
import MapComponent from '../components/MapComponent';

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
      <div className="bg-[#1A1528] border border-[#F4D03F]/20 rounded-2xl max-w-md w-full mx-4">
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
// FUNÇÃO DE LOGOUT GLOBAL
// ============================================
const fazerLogout = async () => {
  console.log("🔴 Fazendo logout...");
  await supabase.auth.signOut();
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/';
};

// ============================================
// TELA PRINCIPAL (PEDIR CORRIDA)
// ============================================
const HomeScreen = ({ user }: any) => {
  const [origem] = useState('R. Manoel Dutra');
  const [destino, setDestino] = useState('');

  return (
    <div className="max-w-md mx-auto px-4 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center py-3">
        <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        <div className="flex items-center gap-4">
          <Bell size={20} className="text-[#A0A0B0]" />
          <MessageCircle size={20} className="text-[#A0A0B0]" />
          <button onClick={fazerLogout} className="text-red-400 text-xs">Sair</button>
        </div>
      </div>

      {/* Mapa */}
      <div className="h-[280px] rounded-xl overflow-hidden mb-3 shadow-lg">
        <MapComponent />
      </div>

      {/* Campo de endereço */}
      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-3">
        <div className="flex items-center gap-3 pb-2 border-b border-white/10">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-white text-sm flex-1">{origem}</span>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <input
            type="text"
            placeholder="Para onde vamos?"
            className="flex-1 bg-transparent text-white outline-none text-sm"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          />
        </div>
      </div>

      {/* Banner promoção */}
      <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-3 mb-3 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-1"><span className="text-2xl">🍔</span><span className="text-white font-bold text-sm">Almoço com até 50% OFF</span></div>
          <p className="text-[#A0A0B0] text-xs mt-1">Peça agora</p>
        </div>
        <ChevronRight size={20} className="text-[#F4D03F]" />
      </div>

      {/* Lojas recomendadas */}
      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/15 mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-bold text-sm">🏪 Lojas recomendadas na região</span>
          <span className="text-[#F4D03F] text-xs">Mais ›</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2"><div className="flex items-center gap-1"><Star size={14} className="text-[#F4D03F] fill-[#F4D03F]" /><span className="text-white text-sm font-bold">4.6</span></div><span className="text-[#A0A0B0] text-xs">Itens com até 95% ...</span></div>
          <div className="flex items-center gap-2"><div className="flex items-center gap-1"><Star size={14} className="text-[#F4D03F] fill-[#F4D03F]" /><span className="text-white text-sm font-bold">3.8</span></div><span className="text-[#A0A0B0] text-xs">Itens com até 80% ...</span></div>
          <div className="flex items-center gap-2"><div className="flex items-center gap-1"><Star size={14} className="text-[#F4D03F] fill-[#F4D03F]" /><span className="text-white text-sm font-bold">3</span></div><span className="text-[#A0A0B0] text-xs">Itens</span></div>
        </div>
      </div>

      {/* Categorias */}
      <div className="flex justify-around py-2 bg-[#1A1528]/50 rounded-xl">
        <div className="text-center"><div className="w-12 h-12 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mx-auto mb-1"><span className="text-lg">📍</span></div><span className="text-[10px] text-[#A0A0B0]">Poi*</span><span className="text-[8px] text-[#A0A0B0] block">10-25</span></div>
        <div className="text-center"><div className="w-12 h-12 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mx-auto mb-1"><span className="text-lg">🍔</span></div><span className="text-[10px] text-[#A0A0B0]">Food</span></div>
        <div className="text-center"><div className="w-12 h-12 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mx-auto mb-1"><span className="text-lg">🛵</span></div><span className="text-[10px] text-[#A0A0B0]">Entrega</span></div>
        <div className="text-center"><div className="w-12 h-12 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mx-auto mb-1"><span className="text-lg">💳</span></div><span className="text-[10px] text-[#A0A0B0]">Pay</span></div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE PERFIL COMPLETA (CLUBE)
// ============================================
const ProfileScreen = ({ user }: any) => {
  const [showMotoristaForm, setShowMotoristaForm] = useState(false);
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');

  const handleSejaMotorista = async () => {
    if (!placa || !modelo) {
      alert('Preencha a placa e o modelo do veículo');
      return;
    }
    await supabase.from('usuarios').update({ tipo: 'motorista' }).eq('id', user.id);
    await supabase.from('motoristas').insert({ id: user.id, status: 'pendente', dados_veiculo: { placa, modelo } });
    alert('Solicitação enviada! Aguarde aprovação.');
    setShowMotoristaForm(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24">
      <div className="flex justify-between items-center py-3">
        <div>
          <h2 className="text-white text-lg font-bold">{user?.email?.split('@')[0]}</h2>
          <button className="text-[#F4D03F] text-xs flex items-center gap-1"><Key size={12} /> Criar chave de acesso</button>
        </div>
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-[#A0A0B0]" />
          <Settings size={20} className="text-[#A0A0B0]" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-4 mb-4 flex justify-between items-center">
        <div><div className="flex items-center gap-2"><Gift size={20} className="text-[#F4D03F]" /><span className="text-white font-bold">Clube</span></div><p className="text-[#F4D03F] text-sm font-bold">Receba cupons de R$90</p></div>
        <ChevronRight size={20} className="text-[#F4D03F]" />
      </div>

      <div className="bg-[#1A1528] rounded-xl border border-[#F4D03F]/15 overflow-hidden mb-4">
        {[
          { icon: ClipboardList, label: "Solicitações", color: "#F4D03F" },
          { icon: MessageCircle, label: "Mensagens", color: "#F4D03F" },
          { icon: CreditCard, label: "99Pay", color: "#F4D03F" },
          { icon: Tag, label: "Descontos", color: "#F4D03F" },
          { icon: DollarSign, label: "Pagamento", color: "#F4D03F" },
          { icon: Settings, label: "Configurações", color: "#F4D03F" },
          { icon: HelpCircle, label: "Ajuda", color: "#F4D03F" },
          { icon: Shield, label: "Segurança", color: "#F4D03F" },
          { icon: Camera, label: "Escanear", color: "#F4D03F" },
        ].map((item, index) => (
          <button key={index} className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10 last:border-0">
            <div className="flex items-center gap-3"><item.icon size={18} style={{ color: item.color }} /><span className="text-white text-sm">{item.label}</span></div>
            <ChevronRight size={16} className="text-[#A0A0B0]" />
          </button>
        ))}
      </div>

      <div className="bg-[#1A1528] rounded-xl border border-[#F4D03F]/15 overflow-hidden mb-4">
        <div className="p-3 border-b border-white/10"><span className="text-white font-bold text-sm">🌟 OUTROS RECURSOS</span></div>
        <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10"><div className="flex items-center gap-3"><Users size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Convide Amigos</span></div><ChevronRight size={16} className="text-[#A0A0B0]" /></button>
        <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10"><div className="flex items-center gap-3"><Users size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Convide Motoristas</span></div><ChevronRight size={16} className="text-[#A0A0B0]" /></button>
        <button onClick={() => setShowMotoristaForm(true)} className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition"><div className="flex items-center gap-3"><Truck size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Seja Motorista</span></div><ChevronRight size={16} className="text-[#A0A0B0]" /></button>
      </div>

      {showMotoristaForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1528] rounded-2xl p-6 max-w-md w-full border border-[#F4D03F]/20">
            <h3 className="text-white text-xl font-bold mb-4">Seja Motorista</h3>
            <input type="text" placeholder="Placa do veículo" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={placa} onChange={e => setPlaca(e.target.value)} />
            <input type="text" placeholder="Modelo do veículo" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4" value={modelo} onChange={e => setModelo(e.target.value)} />
            <button onClick={handleSejaMotorista} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold mb-2">Enviar solicitação</button>
            <button onClick={() => setShowMotoristaForm(false)} className="w-full py-2 rounded-xl text-gray-400">Cancelar</button>
          </div>
        </div>
      )}

      <button onClick={fazerLogout} className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-bold mt-2">SAIR DA CONTA</button>
    </div>
  );
};

// ============================================
// TELAS PLACEHOLDER
// ============================================
const SearchScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
    </div>
  </div>
);

const ActivityScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <ClipboardList size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">📋 Atividade</h2>
      <p className="text-gray-400 mt-2">Histórico de corridas</p>
    </div>
  </div>
);

// ============================================
// TELA DE LOGIN
// ============================================
const LoginScreen = ({ onLogin, onGoogleLogin, onSignUp }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-gray-400 mt-1">Sua corrida de confiança</p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-6">
          {error && <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded">{error}</div>}
          <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-white/20 text-white flex items-center justify-center gap-2"><Chrome size={20} /> Entrar com Google</button>
          <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-gray-400">ou</span></div></div>
          <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4 pr-10" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <button onClick={async () => { setError(''); setLoading(true); const result = await onLogin(email, password); if (result?.error) setError('E-mail ou senha inválidos'); setLoading(false); }} disabled={loading} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">{loading ? 'Entrando...' : 'Entrar'}</button>
          <button onClick={onSignUp} className="w-full mt-3 text-[#F4D03F] text-sm">Criar conta</button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE CADASTRO COM BOTÃO VOLTAR
// ============================================
const SignUpScreen = ({ onBack, onSuccess }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    setError('');
    if (!nome || !email || !password) { setError('Preencha todos os campos'); return; }
    if (password.length < 6) { setError('Senha: mínimo 6 caracteres'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nome_completo: nome } } });
      if (error) throw error;
      if (data.user) {
        await supabase.from('usuarios').insert({ id: data.user.id, nome_completo: nome, email: email, tipo: 'passageiro' });
        await supabase.from('passageiros').insert({ id: data.user.id });
        alert('✅ Conta criada! Faça login.');
        onSuccess();
      }
    } catch (error: any) { setError(error.message.includes('already') ? 'E-mail já cadastrado' : error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button onClick={onBack} className="flex items-center gap-1 text-[#A0A0B0] mb-4 hover:text-[#F4D03F] transition"><ArrowLeft size={18} /> Voltar</button>
        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <h2 className="text-xl font-bold text-white text-center mb-6">Criar Conta</h2>
          {error && <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded">{error}</div>}
          <input type="text" placeholder="Nome completo" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={nome} onChange={e => setNome(e.target.value)} />
          <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Senha (mínimo 6)" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4 pr-10" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">{loading ? 'Criando...' : 'Cadastrar'}</button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN SCREEN
// ============================================
export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user || null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user || null); });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) window.location.reload();
    return { error: !!error };
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  if (loading) { return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>; }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        {activeTab === 'home' && <HomeScreen user={user} />}
        {activeTab === 'perfil' && <ProfileScreen user={user} />}
        {activeTab === 'buscar' && <SearchScreen />}
        {activeTab === 'atividade' && <ActivityScreen />}
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </div>
    );
  }

  if (showSignUp) { return <SignUpScreen onBack={() => setShowSignUp(false)} onSuccess={() => { setShowSignUp(false); window.location.reload(); }} />; }

  return <LoginScreen onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onSignUp={() => setShowSignUp(true)} />;
};