import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader } from 'lucide-react';
import MapBackground from '../components/MapBackground';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login realizado!');
      navigate('/home');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login com Google');
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0F0B1A]">
      <div className="absolute inset-0 z-0">
        <MapBackground />
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

      <div className="relative z-20 h-full flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="bg-[#1A1528]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-4xl">🚕</span>
              </div>
              <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
                ObaLeva
              </h1>
              <p className="text-[#A0A0B0] text-sm mt-1">Faça login para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <span className="text-lg">📧</span>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <span className="text-lg mr-2">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Senha"
                  className="flex-1 py-3 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
              >
                {loading ? <><Loader size={18} className="animate-spin" /> Entrando...</> : '🔐 Entrar'}
              </motion.button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-[#A0A0B0]">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </button>

            <div className="mt-6 text-center space-y-2">
              <button onClick={() => navigate('/register')} className="text-[#F4D03F] hover:underline font-medium text-sm w-full">
                Não tem conta? Cadastre-se
              </button>
              <button onClick={() => navigate('/forgot-password')} className="text-[#A0A0B0] hover:text-white text-xs w-full">
                Esqueci minha senha
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-20 text-center">
        <p className="text-xs text-white/20">ObaLeva © 2025</p>
      </div>
    </div>
  );
}