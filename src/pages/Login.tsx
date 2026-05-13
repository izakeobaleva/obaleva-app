import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '../lib/supabaseClient';
import { Car, Mail, Lock, Eye, EyeOff, Share2, User } from 'lucide-react';
import { useAppUrl } from '../hooks/useAppUrl';

export default function Entrar() {
  const navigate = useNavigate();
  const appUrl = useAppUrl();
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (data.user) {
        const tipo = data.user.user_metadata?.tipo;

        if (tipo === 'motorista') {
          navigate('/driver');
        } else if (tipo === 'admin') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
        toast.success('Login realizado com sucesso!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const landingUrl = `${appUrl}/landing`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ObaLeve',
          text: 'Mobilidade premium para sua cidade. Baixe o app ObaLeve!',
          url: landingUrl,
        });
      } catch (err) {
        // usuário cancelou
      }
    } else {
      navigator.clipboard.writeText(landingUrl);
      toast.success('Link da Landing Page copiado!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col items-center justify-center px-4 py-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50px] left-1/4 w-72 h-72 bg-[#F4D03F]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-50px] right-1/4 w-72 h-72 bg-[#6B2D8C]/30 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[360px]"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-3"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#F4D03F]/20">
              <Car size={32} className="text-[#1E1E2F]" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>ObaLeve</h1>
          <p className="text-[#A0A0B0] text-xs mt-0.5">Segurança e conforto em cada viagem</p>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3.5 text-white font-medium flex items-center justify-center gap-3 hover:bg-white/5 transition-all mb-3 text-sm"
          disabled
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continuar com Google</span>
          <span className="ml-auto text-[10px] text-[#A0A0B0] bg-white/10 px-2 py-0.5 rounded-full">Em breve</span>
        </motion.button>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-[#A0A0B0]">Entre com e-mail</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleLogin}
          className="space-y-2.5"
        >
          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Mail size={16} className="text-[#F4D03F] shrink-0" />
            <input
              type="email"
              placeholder="Seu e-mail"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Lock size={16} className="text-[#F4D03F] shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#A0A0B0] hover:text-white transition shrink-0 p-0 min-h-0 min-w-0"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-[#A0A0B0] hover:text-[#F4D03F] transition">
              Esqueceu a senha?
            </Link>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all py-3 text-sm"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </motion.button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 space-y-2.5"
        >
          <p className="text-xs text-[#A0A0B0] text-center">Ainda não tem conta?</p>
          <Link to="/register" className="block w-full rounded-2xl font-semibold bg-transparent border border-white/20 text-white hover:bg-white/5 transition-all py-3 text-sm text-center flex items-center justify-center gap-2">
            <User size={16} />
            Criar conta como Passageiro
          </Link>
          <Link to="/register-driver" className="block w-full rounded-2xl font-semibold bg-transparent border border-white/20 text-white hover:bg-white/5 transition-all py-3 text-sm text-center flex items-center justify-center gap-2">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#F4D03F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <line x1="12" y1="3" x2="12" y2="9" />
              <line x1="4.5" y1="9" x2="8.5" y2="11.5" />
              <line x1="19.5" y1="9" x2="15.5" y2="11.5" />
              <line x1="12" y1="12" x2="12" y2="20" />
            </svg>
            Criar conta como Motorista
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center"
        >
          <button
            onClick={handleShare}
            className="text-[#A0A0B0] hover:text-[#F4D03F] transition-all flex items-center justify-center gap-2 mx-auto text-xs"
          >
            <Share2 size={14} />
            Compartilhar ObaLeve
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}