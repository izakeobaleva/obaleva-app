import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader, Car } from 'lucide-react';
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
      navigate('/');
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
    <div className="relative h-screen w-full overflow-hidden bg-[#0F0B1A]">
      {/* Mapa de fundo */}
      <div className="absolute inset-0">
        <MapBackground />
      </div>

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal de Login */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1528]/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full border border-white/10 shadow-2xl"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Car size={28} className="text-[#1E1E2F]" />
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
              ObaLeva
            </h1>
            <p className="text-[#A0A0B0] text-sm mt-1">Sua corrida, do seu jeito</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <span className="text-lg">📧</span>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                required
              />
            </div>

            <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <span className="text-lg mr-2">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="flex-1 py-3 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
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
              className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader size={16} className="animate-spin" /> Entrando...</> : '🔐 Entrar'}
            </motion.button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-[#A0A0B0]">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3.5 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-sm"
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
              alt="Google Logo" 
              className="w-5 h-5"
            />
            Entrar com Google
          </button>

          <div className="mt-6 text-center text-sm space-y-2">
            <button onClick={() => navigate('/register')} className="text-[#F4D03F] hover:underline block w-full font-medium">
              Não tem conta? <strong>Cadastre-se</strong>
            </button>
            <button onClick={() => navigate('/forgot-password')} className="text-[#A0A0B0] hover:text-white block w-full text-xs">
              Esqueci minha senha
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}