import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoginOverlayProps {
  onSuccess: () => void;
  onSignUp: () => void;
}

export function LoginOverlay({ onSuccess, onSignUp }: LoginOverlayProps) {
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
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(), password
      });
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) setError('Email ou senha inválidos');
        else if (signInError.message.includes('Email not confirmed')) setError('Confirme seu email');
        else setError(signInError.message);
        return;
      }
      onSuccess();
    } catch (err: any) { setError(err.message || 'Erro ao fazer login'); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google', options: { redirectTo: window.location.origin }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-screen relative">
      {/* MAPA DE FUNDO */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14625.123!2d-46.6333!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjgiUyA0NsKwMzgnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1"
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ border: 0, filter: 'brightness(0.5)' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* CARD DE LOGIN */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-[#1A1528] rounded-3xl p-6 border border-white/10 shadow-2xl max-w-md mx-auto"
        >
          <div className="text-center mb-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center mb-3 border-2 border-[#F4D03F]/40">
              <svg className="w-8 h-8 text-[#F4D03F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">ObaLeva</h1>
            <p className="text-[#A0A0B0] text-xs mt-1">Sua corrida, do seu jeito</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4">
              <p className="text-red-400 text-xs text-center">{error}</p>
            </div>
          )}

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

            <button type="submit" disabled={loading} className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
              {loading ? <><Loader size={16} className="animate-spin" /> Entrando...</> : <><ArrowRight size={16} /> Entrar</>}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-[10px] text-[#A0A0B0]">ou</span></div>
          </div>

          <button onClick={handleGoogleLogin} className="w-full py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-xs mb-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
              <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
              <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
              <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
            </svg>
            Entrar com Google
          </button>

          <p className="text-center text-xs text-[#A0A0B0]">
                Não tem conta?{'  '}
            <button onClick={onSignUp} className="text-[#F4D03F] font-medium hover:underline">Cadastre-se</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}