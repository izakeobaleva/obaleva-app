import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Car, Eye, EyeOff } from 'lucide-react';
import TermsScreen from '../../pages/TermsScreen';
import PrivacyScreen from '../../pages/PrivacyScreen';

interface SignUpModalProps {
  onSuccess: () => void;
}

export function SignUpModal({ onSuccess }: SignUpModalProps) {
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
        options: {
          data: {
            nome_completo: nome,
            telefone: telefone.replace(/\D/g, ''),
            termos_aceitos: false,
          },
        },
      });
      if (signUpError) throw signUpError;
      if (data.user) {
        await supabase.from('usuarios').insert({
          id: data.user.id,
          nome_completo: nome,
          email,
          telefone: telefone.replace(/\D/g, ''),
          tipo: 'passageiro',
          termos_aceitos: false,
        });
        await supabase.from('passageiros').insert({ id: data.user.id });
        localStorage.setItem('obaleva_onboarding', 'true');
        localStorage.setItem('location_permission_asked', 'true');
        alert('✅ Conta criada! Faça login.');
        setIsLoginMode(true);
      }
    } catch (err: any) {
      if (err.message.includes('already registered')) {
        setErrors({ email: 'E-mail já cadastrado' });
        setIsLoginMode(true);
      } else {
        setErrors({ general: err.message || 'Erro ao criar conta' });
      }
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
    } catch (err: any) {
      setErrors({ general: err.message || 'Erro ao fazer login' });
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  if (showTermsModal) return <TermsScreen onBack={() => setShowTermsModal(false)} user={null} />;
  if (showPrivacyModal) return <PrivacyScreen onBack={() => setShowPrivacyModal(false)} user={null} />;

  if (isLoginMode) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
        <div className="bg-[#1A1528] w-full max-w-md mx-4 rounded-t-2xl border-t border-[#F4D03F]/30">
          <div className="p-2 flex justify-center"><div className="w-10 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
          <div className="px-4 pb-4">
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
      <div className="bg-[#1A1528] w-full max-w-md mx-4 rounded-t-2xl border-t border-[#F4D03F]/30">
        <div className="p-2 flex justify-center"><div className="w-10 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
        <div className="px-4 pb-4">
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
            <button onClick={handleCreateAccount} disabled={loading} className="w-full py-1.5 rounded-xl bg-[#F4D03F] text-black font-bold text-sm">{loading ? 'Criando conta...' : '✅ CRIAR CONTA'}</button>
            <div className="relative my-1.5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-[9px] text-gray-400">ou</span></div></div>
            <div className="flex gap-1.5"><button onClick={handleGoogleLogin} className="flex-1 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs flex items-center justify-center gap-1"><svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/><path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/></svg><span>Google</span></button><button onClick={() => setIsLoginMode(true)} className="flex-1 py-1.5 rounded-xl border border-white/20 text-white text-xs">🔐 Já tenho conta</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}