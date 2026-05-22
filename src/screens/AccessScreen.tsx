import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, ChevronLeft, ChevronRight, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Loader, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// ============================================
// TELA 1: LOGIN
// ============================================
function LoginForm({ onSuccess, onNavigate }: { onSuccess: () => void; onNavigate: (tab: number) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Preencha todos os campos'); return; }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) setError('Email ou senha inválidos');
        else if (signInError.message.includes('Email not confirmed')) setError('Confirme seu email antes de fazer login');
        else setError(signInError.message);
        return;
      }
      onSuccess();
    } catch (err: any) { setError(err.message || 'Erro ao fazer login'); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
      if (error) setError(error.message);
    } catch (err: any) { setError(err.message || 'Erro ao conectar com Google'); }
  };

  return (
    <div className="px-2">
      <h2 className="text-white text-lg font-bold text-center mb-4">Entrar</h2>
      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2 mb-3"><p className="text-red-400 text-xs text-center">{error}</p></div>}
      <form onSubmit={handleLogin} className="space-y-3">
        <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
          <Mail size={16} className="text-[#F4D03F] shrink-0" />
          <input type="email" placeholder="E-mail" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
          <Lock size={16} className="text-[#F4D03F] shrink-0" />
          <input type={showPassword ? 'text' : 'password'} placeholder="Senha" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white shrink-0">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div className="text-right">
          <button type="button" onClick={() => onNavigate(2)} className="text-[#F4D03F] text-xs hover:underline">Esqueceu a senha?</button>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
          {loading ? <><Loader size={16} className="animate-spin" /> Entrando...</> : <><ArrowRight size={16} /> Entrar</>}
        </button>
      </form>
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
        <div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-[10px] text-[#A0A0B0]">ou</span></div>
      </div>
      <button onClick={handleGoogleLogin} className="w-full py-2 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-xs font-medium">
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
          <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
          <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
          <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
        </svg>
        Google
      </button>
      <p className="text-center text-[10px] text-[#A0A0B0] mt-3">
        Não tem conta? <button onClick={() => onNavigate(1)} className="text-[#F4D03F] font-medium hover:underline">Cadastre-se</button>
      </p>
    </div>
  );
}

// ============================================
// TELA 2: CADASTRO
// ============================================
function RegisterForm({ onNavigate }: { onNavigate: (tab: number) => void }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!nome || !email || !password) { setError('Preencha os campos obrigatórios'); return; }
    if (password.length < 6) { setError('Senha deve ter no mínimo 6 caracteres'); return; }
    if (password !== confirmPassword) { setError('As senhas não conferem'); return; }

    setLoading(true);
    try {
      const { data: auth, error: signUpError } = await supabase.auth.signUp({
        email, password,
        options: { data: { nome_completo: nome, telefone } }
      });
      if (signUpError) throw signUpError;
      if (auth.user) {
        await supabase.from('usuarios').insert({
          id: auth.user.id, nome_completo: nome, email, telefone: telefone || null, tipo: 'passageiro'
        });
        await supabase.from('passageiros').insert({ id: auth.user.id });
        setError('✅ Conta criada! Faça login.');
        setTimeout(() => onNavigate(0), 2000);
      }
    } catch (err: any) {
      if (err.message?.includes('already registered')) setError('Este e-mail já está cadastrado');
      else setError(err.message || 'Erro ao cadastrar');
    }
    finally { setLoading(false); }
  };

  return (
    <div className="px-2">
      <h2 className="text-white text-lg font-bold text-center mb-4">Criar Conta</h2>
      {error && <div className={`rounded-xl p-2 mb-3 ${error.includes('✅') ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
        <p className={`text-xs text-center ${error.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>{error}</p>
      </div>}
      <form onSubmit={handleRegister} className="space-y-2.5">
        <InputField icon={User} placeholder="Nome completo *" value={nome} onChange={setNome} />
        <InputField icon={Mail} placeholder="E-mail *" type="email" value={email} onChange={setEmail} />
        <InputField icon={Phone} placeholder="Telefone" value={telefone} onChange={setTelefone} />
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <Lock size={14} className="text-[#F4D03F] shrink-0" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Senha *" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white shrink-0">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <Lock size={14} className="text-[#F4D03F] shrink-0" />
              <input type={showConfirm ? 'text' : 'password'} placeholder="Confirmar *" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#A0A0B0] hover:text-white shrink-0">
                {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
          {loading ? <><Loader size={16} className="animate-spin" /> Cadastrando...</> : <><ArrowRight size={16} /> Criar Conta</>}
        </button>
      </form>
      <p className="text-center text-[10px] text-[#A0A0B0] mt-3">
        Já tem conta? <button onClick={() => onNavigate(0)} className="text-[#F4D03F] font-medium hover:underline">Entrar</button>
      </p>
    </div>
  );
}

function InputField({ icon: Icon, placeholder, type = 'text', value, onChange }: any) {
  return (
    <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
      <Icon size={14} className="text-[#F4D03F] shrink-0" />
      <input type={type} placeholder={placeholder} className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

// ============================================
// TELA 3: RECUPERAR SENHA
// ============================================
function ForgotPasswordForm({ onNavigate }: { onNavigate: (tab: number) => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Digite seu e-mail'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/update-password` });
      if (error) throw error;
      setSent(true);
    } catch (err: any) { setError(err.message || 'Erro ao enviar e-mail'); }
    finally { setLoading(false); }
  };

  if (sent) {
    return (
      <div className="px-2 text-center">
        <h2 className="text-white text-lg font-bold mb-4">Email Enviado!</h2>
        <p className="text-[#A0A0B0] text-xs mb-4">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
        <button onClick={() => onNavigate(0)} className="text-[#F4D03F] text-sm font-medium hover:underline">Voltar ao login</button>
      </div>
    );
  }

  return (
    <div className="px-2">
      <h2 className="text-white text-lg font-bold text-center mb-4">Recuperar Senha</h2>
      {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-2 mb-3"><p className="text-red-400 text-xs text-center">{error}</p></div>}
      <p className="text-[#A0A0B0] text-xs text-center mb-4">Digite seu e-mail e enviaremos um link para redefinir sua senha.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
          <Mail size={16} className="text-[#F4D03F] shrink-0" />
          <input type="email" placeholder="Seu e-mail" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
          {loading ? <><Loader size={16} className="animate-spin" /> Enviando...</> : <><ArrowRight size={16} /> Enviar Link</>}
        </button>
      </form>
      <p className="text-center text-[10px] text-[#A0A0B0] mt-3">
        Lembrou? <button onClick={() => onNavigate(0)} className="text-[#F4D03F] font-medium hover:underline">Voltar ao login</button>
      </p>
    </div>
  );
}

// ============================================
// TELA PRINCIPAL: MAPA + CARROSSEL
// ============================================
interface AccessScreenProps {
  onAccessSuccess: () => void;
}

export function AccessScreen({ onAccessSuccess }: AccessScreenProps) {
  const [activeTab, setActiveTab] = useState(0); // 0=Login, 1=Cadastro, 2=Recuperar
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const tabs = ['Entrar', 'Criar Conta', 'Recuperar Senha'];

  const handleNavigate = (tab: number) => {
    setActiveTab(tab);
    if (containerRef.current) {
      const child = containerRef.current.children[tab] as HTMLElement;
      if (child) {
        containerRef.current.scrollTo({ left: child.offsetLeft, behavior: 'smooth' });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollLeft / containerRef.current.clientWidth);
      setActiveTab(index);
    }
  };

  const handleTouchEnd = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollLeft / containerRef.current.clientWidth);
      setActiveTab(index);
    }
  };

  // Scroll para a aba ativa
  useEffect(() => {
    handleNavigate(activeTab);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0B1A] flex flex-col">
      {/* MAPA (metade superior) */}
      <div className="h-[40vh] relative overflow-hidden">
        {/* Iframe do Google Maps com marcador central */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14624.123456789!2d-46.6333!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjgiUyA0NsKwMzgnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'brightness(0.7) saturate(1.2)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa ObaLeva"
        />
        
        {/* Overlay do logo */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-[#0F0B1A]/80 via-transparent to-transparent pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-[#F4D03F]/30 flex items-center justify-center mb-2 border-2 border-[#F4D03F]/50 shadow-xl">
            <Car size={32} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">ObaLeva</h1>
          <p className="text-sm text-[#F4D03F] font-medium drop-shadow-md">Sua corrida, do seu jeito</p>
        </div>
      </div>

      {/* CARROSSEL DE TELAS (metade inferior) */}
      <div className="flex-1 bg-[#1A1528] rounded-t-3xl -mt-6 relative z-10 shadow-xl">
        {/* TABS */}
        <div className="flex border-b border-white/10 pt-4 px-2">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => handleNavigate(index)}
              className={`flex-1 py-3 text-xs font-medium transition-all relative ${
                activeTab === index ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'
              }`}
            >
              {tab}
              {activeTab === index && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#F4D03F] rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* CONTEÚDO COM SCROLL HORIZONTAL */}
        <div
          ref={containerRef}
          className="flex-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollBehavior: 'smooth' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex min-h-full">
            <div className="w-full flex-shrink-0 snap-center p-4">
              <LoginForm onSuccess={onAccessSuccess} onNavigate={handleNavigate} />
            </div>
            <div className="w-full flex-shrink-0 snap-center p-4">
              <RegisterForm onNavigate={handleNavigate} />
            </div>
            <div className="w-full flex-shrink-0 snap-center p-4">
              <ForgotPasswordForm onNavigate={handleNavigate} />
            </div>
          </div>
        </div>

        {/* INDICADORES DE PÁGINA */}
        <div className="flex justify-center gap-1.5 pb-4">
          {[0, 1, 2].map(index => (
            <button
              key={index}
              onClick={() => handleNavigate(index)}
              className={`h-1.5 rounded-full transition-all ${
                activeTab === index ? 'w-6 bg-[#F4D03F]' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}