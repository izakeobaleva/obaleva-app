import { useState } from 'react';
import { Car, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface SignUpModalProps {
  onSuccess: () => void;
}

export function SignUpModal({ onSuccess }: SignUpModalProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Função de LOGIN
  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Preencha e-mail e senha');
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) throw signInError;

      localStorage.setItem('obaleva_onboarding', 'true');
      localStorage.setItem('location_permission_asked', 'true');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  // Função de CADASTRO
  const handleCreateAccount = async () => {
    setError('');
    if (!nome || !email || !password || !confirmPassword) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    if (!agreeTerms) {
      setError('Aceite os termos de uso');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            nome_completo: nome,
            telefone: telefone.replace(/\D/g, ''),
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        await supabase.from('usuarios').insert({
          id: data.user.id,
          nome_completo: nome,
          email: email,
          telefone: telefone.replace(/\D/g, ''),
          tipo: 'passageiro',
        });

        await supabase.from('passageiros').insert({ id: data.user.id });

        localStorage.setItem('obaleva_phone', telefone);
        localStorage.setItem('obaleva_onboarding', 'true');
        localStorage.setItem('location_permission_asked', 'true');

        setIsLoginMode(true);
        setError('Conta criada! Agora faça login.');
      }
    } catch (err: any) {
      if (err.message.includes('already registered')) {
        setError('Este e-mail já está cadastrado.');
        setIsLoginMode(true);
      } else {
        setError(err.message || 'Erro ao criar conta');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  // ========================
  // MODO LOGIN
  // ========================
  if (isLoginMode) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center pointer-events-auto">
        <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 max-h-[400px] overflow-y-auto">
          <div className="p-1.5 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
          <div className="px-5 pb-4">
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <Car size={24} className="text-[#F4D03F]" />
                <h2 className="text-white text-lg font-bold">Fazer login</h2>
              </div>
              <p className="text-[#A0A0B0] text-sm ml-8">Entre com sua conta</p>
            </div>

            {error && (
              <div className="mb-2 p-1.5 text-center text-sm text-red-400 bg-red-500/10 rounded">{error}</div>
            )}

            <div className="space-y-1.5">
              <div className="bg-white/5 rounded-xl border border-white/15">
                <div className="flex items-center px-3 py-1.5">
                  <span className="text-white mr-2 text-base">📧</span>
                  <input type="email" placeholder="E-mail *" className="flex-1 bg-transparent text-white outline-none text-base" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Senha *" className="w-full py-1.5 px-3 rounded-xl bg-white/10 border border-white/15 text-white pr-7 text-base" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1.5 text-gray-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>

              <button onClick={handleLogin} disabled={loading} className="w-full py-1.5 rounded-xl bg-[#F4D03F] text-black font-bold text-base">
                {loading ? 'Entrando...' : '🚪 ENTRAR'}
              </button>

              <div className="relative my-1.5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                <div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-sm text-gray-400">ou</span></div>
              </div>

              <button onClick={() => { setIsLoginMode(false); setError(''); }} className="w-full py-1.5 rounded-xl border border-white/20 text-white text-base">
                ✨ Criar nova conta
              </button>

              <button onClick={handleGoogleLogin} className="w-full py-1.5 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center gap-2 text-base">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
                  <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
                  <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
                  <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
                </svg>
                <span>Entrar com Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // MODO CADASTRO
  // ========================
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center pointer-events-auto">
      <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 max-h-[520px] overflow-y-auto">
        <div className="p-1.5 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
        <div className="px-5 pb-4">
          <div className="mb-2">
            <div className="flex items-center gap-2">
              <Car size={24} className="text-[#F4D03F]" />
              <h2 className="text-white text-lg font-bold">Criar sua conta</h2>
            </div>
            <p className="text-[#A0A0B0] text-sm ml-8">Preencha seus dados para começar</p>
          </div>

          {error && (
            <div className="mb-2 p-1.5 text-center text-sm text-red-400 bg-red-500/10 rounded">
              {error}
              {error.includes('já cadastrado') && (
                <button onClick={() => setIsLoginMode(true)} className="ml-2 text-[#F4D03F] underline font-bold">
                  Faça login
                </button>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="bg-white/5 rounded-xl border border-white/15">
              <div className="flex items-center px-3 py-1.5">
                <span className="text-white mr-2 text-base">👤</span>
                <input type="text" placeholder="Nome completo *" className="flex-1 bg-transparent text-white outline-none text-base" value={nome} onChange={(e) => setNome(e.target.value)} />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl border border-white/15">
              <div className="flex items-center px-3 py-1.5">
                <span className="text-white mr-2 text-base">📧</span>
                <input type="email" placeholder="E-mail *" className="flex-1 bg-transparent text-white outline-none text-base" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div className="bg-white/5 rounded-xl border border-white/15">
              <div className="flex items-center px-3 py-1.5">
                <span className="text-white mr-2 text-base">📱</span>
                <input type="tel" placeholder="Telefone (WhatsApp) - opcional" className="flex-1 bg-transparent text-white outline-none text-base" value={telefone} onChange={(e) => setTelefone(formatPhoneNumber(e.target.value))} maxLength={15} />
              </div>
            </div>

            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Senha * (mínimo 6 caracteres)" className="w-full py-1.5 px-3 rounded-xl bg-white/10 border border-white/15 text-white pr-7 text-base" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1.5 text-gray-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>

            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Confirmar senha *" className="w-full py-1.5 px-3 rounded-xl bg-white/10 border border-white/15 text-white pr-7 text-base" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1.5 text-gray-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>

            <label className="flex items-center gap-1.5 py-1">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-3.5 h-3.5" />
              <span className="text-[#A0A0B0] text-sm">Li e aceito os <span className="text-[#F4D03F]">Termos de Uso</span> e a <span className="text-[#F4D03F]">Política de Privacidade</span></span>
            </label>

            <button onClick={handleCreateAccount} disabled={loading} className="w-full py-1.5 rounded-xl bg-[#F4D03F] text-black font-bold text-base">{loading ? 'Criando conta...' : '✅ CRIAR CONTA'}</button>

            <div className="relative my-1.5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-sm text-gray-400">ou</span></div>
            </div>

            <button onClick={handleGoogleLogin} className="w-full py-1.5 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center gap-2 text-base">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
                <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
                <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
                <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
              </svg>
              <span>Entrar com Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}