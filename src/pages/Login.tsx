import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Car, UserPlus, Truck, Share2, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      toast.error('E-mail ou senha inválidos');
      setLoading(false);
      return;
    }
    
    if (data.user) {
      toast.success('Login realizado!');
      navigate('/home');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) toast.error('Erro ao logar com Google');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'OBALEVA',
      text: 'Mobilidade premium para sua cidade! Baixe o app e experimente.',
      url: window.location.origin,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.origin);
      toast.success('Link copiado! Compartilhe com seus amigos.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-dark w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F4D03F]/20 mb-4">
            <Car className="w-8 h-8 text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-[#A0A0B0] mt-1">Acesse sua conta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full px-4 py-3 rounded-2xl bg-[#1A1528] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full px-4 py-3 rounded-2xl bg-[#1A1528] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-premium w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? 'Entrando...' : <>Entrar <ArrowRight size={18} /></>}
          </motion.button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#1A1528] px-2 text-[#A0A0B0]">ou</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="btn-outline-dark w-full py-3 flex items-center justify-center gap-2 mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Entrar com Google
        </button>

        <div className="flex flex-col gap-3">
          <Link to="/register/passenger" className="btn-outline-dark w-full py-3 flex items-center justify-center gap-2">
            <UserPlus size={18} />
            Cadastrar como Passageiro
          </Link>
          <Link to="/register/driver" className="btn-outline-dark w-full py-3 flex items-center justify-center gap-2">
            <Truck size={18} />
            Cadastrar como Motorista
          </Link>
        </div>

        <button
          onClick={handleShare}
          className="w-full py-3 flex items-center justify-center gap-2 text-[#A0A0B0] hover:text-white transition mt-6"
        >
          <Share2 size={18} />
          Compartilhar OBALEVA
        </button>
      </motion.div>
    </div>
  );
}