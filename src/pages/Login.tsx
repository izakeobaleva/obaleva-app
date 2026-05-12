import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Mail, Lock, Share2, Eye, EyeOff, ArrowRight, User, Car } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadLogo();
    const handleStorage = () => loadLogo();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  async function loadLogo() {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'app_logo')
      .maybeSingle();

    if (data?.value) {
      setLogoUrl(data.value);
    } else {
      setLogoUrl(null);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      toast.success('Login bem-sucedido!');
      navigate('/passenger');
    } catch (err) {
      toast.error('E-mail ou senha inválidos');
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/passenger' },
    });
    if (error) toast.error('Erro ao logar com Google');
  };

  const handleShare = async () => {
    const shareData = {
      title: 'ObaLeve',
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
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed top-6 left-6 z-20"
      >
        <div className="w-12 h-12 rounded-full bg-[#F4D03F]/20 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden shadow-lg">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="ObaLeve"
              className="w-full h-full object-contain p-2"
            />
          ) : (
            <Car className="text-[#F4D03F] w-6 h-6" />
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-[320px] p-4"
      >
        <div className="text-center mb-3">
          <h1 className="text-base font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>ObaLeve</h1>
          <p className="text-[#A0A0B0] text-[11px] mt-0.5">Segurança e conforto em cada viagem</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="w-full py-2 rounded-2xl border-2 border-white/20 bg-white/5 text-white flex items-center justify-center gap-2 hover:bg-white/10 hover:border-white/30 transition-all font-medium text-sm"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar com Google
        </motion.button>

        <div className="relative my-2.5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#1A1528] px-3 text-[#A0A0B0]">ou com e-mail</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl mb-1.5">
          <div className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/leandrofahur/map-assets/main/map-bg.png')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0B1A]/90 via-[#0F0B1A]/70 to-[#0F0B1A]/90"></div>
          <div className="relative flex items-center gap-3 px-3 py-1">
            <Mail size={14} className="text-[#F4D03F] shrink-0" />
            <input
              type="email"
              placeholder="Seu e-mail"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl mb-2">
          <div className="absolute inset-0 bg-[url('https://raw.githubusercontent.com/leandrofahur/map-assets/main/map-bg.png')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0B1A]/90 via-[#0F0B1A]/70 to-[#0F0B1A]/90"></div>
          <div className="relative flex items-center gap-3 px-3 py-0">
            <Lock size={14} className="text-[#F4D03F] shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm py-0.5"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#A0A0B0] hover:text-white transition shrink-0"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        <div className="text-right mb-2">
          <Link to="/forgot-password" className="text-[11px] text-[#A0A0B0] hover:text-[#F4D03F] transition">
            Esqueceu a senha?
          </Link>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-[8px] rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm mb-2"
        >
          Entrar <ArrowRight size={15} />
        </motion.button>

        <div className="border-t border-white/10 pt-2">
          <p className="text-[11px] text-[#A0A0B0] text-center mb-1.5">Ainda não tem conta?</p>
          <Link
            to="/register"
            className="w-full py-[6px] rounded-2xl border border-white/15 text-white flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/30 transition-all font-medium text-[11px] mb-1"
          >
            <User size={13} className="text-[#F4D03F]" />
            Criar conta como Passageiro
          </Link>
          <Link
            to="/register-driver"
            className="w-full py-[6px] rounded-2xl border border-white/15 text-white flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/30 transition-all font-medium text-[11px]"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#F4D03F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" strokeWidth="3"/>
              <path d="M12 4 L13 12 L17 14" strokeWidth="3"/>
              <path d="M12 4 L11 12 L7 14" strokeWidth="3"/>
              <path d="M12 4 L12 10" strokeWidth="3"/>
            </svg>
            Criar conta como Motorista
          </Link>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="w-full mt-2 py-[6px] rounded-2xl text-[#A0A0B0] hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-[11px] border border-white/5"
        >
          <Share2 size={12} />
          Compartilhar ObaLeve
        </motion.button>
      </motion.div>
    </div>
  );
}