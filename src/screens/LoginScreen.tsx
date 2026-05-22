import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, Loader } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onSignUp: () => void;
  onBack: () => void;
}

export function LoginScreen({ onLoginSuccess, onSignUp, onBack }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou senha inválidos');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Confirme seu email antes de fazer login');
        } else {
          setError(signInError.message);
        }
        return;
      }

      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) setError(error.message);
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com Google');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center mb-4 border-2 border-[#F4D03F]/40 shadow-xl">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">ObaLeva</h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Sua corrida, do seu jeito</p>
        </div>

        {/* Login form */}
        <div className="bg-[#1A1528] rounded-3xl p-6 border border-white/10 shadow-xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-4"
            >
              <p className="text-red-400 text-xs text-center">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F] transition-all">
              <Mail size={18} className="text-[#F4D03F] shrink-0" />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F] transition-all">
              <Lock size={18} className="text-[#F4D03F] shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#A0A0B0] hover:text-white transition shrink-0"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => window.location.href = '/forgot-password'}
                className="text-[#F4D03F] text-xs hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Login button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <><Loader size={18} className="animate-spin" /> Entrando...</>
              ) : (
                <><ArrowRight size={18} /> Entrar</>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#1A1528] px-3 text-xs text-[#A0A0B0]">ou continue com</span>
            </div>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
              <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
              <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
              <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
            </svg>
            Google
          </button>

          {/* Sign up link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#A0A0B0]">
              Não tem uma conta?{' '}
              <button onClick={onSignUp} className="text-[#F4D03F] font-medium hover:underline">
                Cadastre-se
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}