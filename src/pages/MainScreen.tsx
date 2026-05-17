import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, Eye, EyeOff, Chrome, Home, Search, User, Menu, LogOut, MapPin, Lock } from 'lucide-react';
import MapComponent from '../components/MapComponent';

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
      <div className="bg-[#1A1528] border border-[#F4D03F]/30 rounded-2xl max-w-md w-full mx-4">
        <div className="flex justify-between px-5 py-3">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => onNavigate(tab.id)} className={`flex flex-col items-center gap-1 ${active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
              <tab.icon size={22} />
              <span className="text-[10px]">{tab.label}</span>
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
const LoginScreen = ({ onLogin, onGoogleLogin, onSignUp }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Sua corrida de confiança</p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-[#F4D03F]/30 bg-white/10 text-white flex items-center justify-center gap-2">
            <Chrome size={20} /> Entrar com Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-[#A0A0B0]">ou</span></div>
          </div>

          <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
          
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4 pr-10" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>

          <button onClick={async () => { setLoading(true); await onLogin(email, password); setLoading(false); }} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <button onClick={onSignUp} className="w-full mt-3 text-[#F4D03F] text-sm">Criar nova conta</button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE CADASTRO ESTILO 99
// ============================================
const SignUpScreen = ({ onBack, onSuccess }: any) => {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [confirmarEmail, setConfirmarEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!nome || !sobrenome || !email || !password || !cpf || !dataNascimento) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }
    if (email !== confirmarEmail) {
      alert('E-mails não coincidem');
      return;
    }
    if (password !== confirmarSenha) {
      alert('Senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      alert('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const nomeCompleto = `${nome} ${sobrenome}`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nomeCompleto, cpf, data_nascimento: dataNascimento, whatsapp } }
      });
      
      if (error) throw error;
      
      if (data.user) {
        await supabase.from('usuarios').insert({
          id: data.user.id,
          nome_completo: nomeCompleto,
          email,
          telefone: whatsapp,
          cpf,
          tipo: 'passageiro'
        });
        await supabase.from('passageiros').insert({ id: data.user.id });
        alert('✅ Conta criada! Faça login.');
        onSuccess();
      }
    } catch (error: any) {
      alert('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatWhatsapp = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button onClick={onBack} className="text-[#A0A0B0] mb-4">← Voltar</button>
          <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
                <User size={32} className="text-[#F4D03F]" />
              </div>
              <h2 className="text-xl font-bold text-white">Qual seu nome?</h2>
              <p className="text-[#A0A0B0] text-sm">Como você gostaria de ser chamado?</p>
            </div>
            <input type="text" placeholder="Nome" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={nome} onChange={e => setNome(e.target.value)} />
            <input type="text" placeholder="Sobrenome" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={sobrenome} onChange={e => setSobrenome(e.target.value)} />
            <button onClick={() => setStep(2)} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">Continuar</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button onClick={() => setStep(1)} className="text-[#A0A0B0] mb-4">← Voltar</button>
          <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
                <MapPin size={32} className="text-[#F4D03F]" />
              </div>
              <h2 className="text-xl font-bold text-white">Seu e-mail</h2>
              <p className="text-[#A0A0B0] text-sm">Usaremos para enviar recibos</p>
            </div>
            <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="email" placeholder="Confirmar e-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={confirmarEmail} onChange={e => setConfirmarEmail(e.target.value)} />
            <button onClick={() => setStep(3)} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">Continuar</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button onClick={() => setStep(2)} className="text-[#A0A0B0] mb-4">← Voltar</button>
          <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
                <User size={32} className="text-[#F4D03F]" />
              </div>
              <h2 className="text-xl font-bold text-white">Dados pessoais</h2>
              <p className="text-[#A0A0B0] text-sm">Para sua segurança</p>
            </div>
            <input type="text" placeholder="CPF" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={cpf} onChange={e => setCpf(formatCPF(e.target.value))} maxLength={14} />
            <input type="date" placeholder="Data de nascimento" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />
            <input type="tel" placeholder="WhatsApp" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={whatsapp} onChange={e => setWhatsapp(formatWhatsapp(e.target.value))} maxLength={15} />
            <button onClick={() => setStep(4)} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">Continuar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button onClick={() => setStep(3)} className="text-[#A0A0B0] mb-4">← Voltar</button>
        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
              <Lock size={32} className="text-[#F4D03F]" />
            </div>
            <h2 className="text-xl font-bold text-white">Crie sua senha</h2>
            <p className="text-[#A0A0B0] text-sm">Mínimo 6 caracteres</p>
          </div>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3 pr-10" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <input type="password" placeholder="Confirmar senha" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={confirmarSenha} onChange={e => setConfirmarSenha(e.target.value)} />
          <button onClick={handleSignUp} disabled={loading} className="w-full mt-6 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
            {loading ? 'Criando...' : 'Finalizar Cadastro'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA PRINCIPAL (HOME)
// ============================================
const HomeScreen = ({ user, onSignOut }: any) => {
  const [destino, setDestino] = useState('');

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      {/* Header */}
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <Car size={24} className="text-[#F4D03F]" />
          <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        </div>
        <button onClick={onSignOut} className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-sm">
          <LogOut size={14} className="inline mr-1" /> Sair
        </button>
      </div>

      {/* Mapa */}
      <div className="h-[220px] rounded-xl overflow-hidden mb-3 shadow-lg">
        <MapComponent />
      </div>

      {/* Campo Para onde vai? */}
      <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528]/80 rounded-xl p-4 border border-[#F4D03F]/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
            <MapPin size={16} className="text-[#F4D03F]" />
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
  );
};

// ============================================
// TELA DE PERFIL
// ============================================
const ProfileScreen = ({ user, onSignOut }: any) => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-6 text-center border border-[#F4D03F]/20">
      <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
        <User size={40} className="text-[#F4D03F]" />
      </div>
      <h2 className="text-white text-xl font-bold">{user?.email?.split('@')[0]}</h2>
      <p className="text-[#A0A0B0] text-sm mt-1">{user?.email}</p>
      <button onClick={onSignOut} className="mt-6 w-full py-3 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-bold">
        Sair da conta
      </button>
    </div>
  </div>
);

// ============================================
// TELAS PLACEHOLDER
// ============================================
const SearchScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
      <p className="text-gray-400 mt-2">Em breve</p>
    </div>
  </div>
);

const MenuScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Menu size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">☰ Menu</h2>
      <p className="text-gray-400 mt-2">Em breve</p>
    </div>
  </div>
);

// ============================================
// MAIN SCREEN
// ============================================
export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      window.location.reload();
    } else {
      alert('❌ E-mail ou senha inválidos');
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        {activeTab === 'home' && <HomeScreen user={user} onSignOut={handleSignOut} />}
        {activeTab === 'perfil' && <ProfileScreen user={user} onSignOut={handleSignOut} />}
        {activeTab === 'buscar' && <SearchScreen />}
        {activeTab === 'menu' && <MenuScreen />}
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </div>
    );
  }

  if (showSignUp) {
    return <SignUpScreen onBack={() => setShowSignUp(false)} onSuccess={() => setShowSignUp(false)} />;
  }

  return <LoginScreen onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onSignUp={() => setShowSignUp(true)} />;
};