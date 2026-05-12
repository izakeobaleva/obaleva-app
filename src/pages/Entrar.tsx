import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Mail, Lock, Share2, Eye, EyeOff, ArrowRight, User } from 'lucide-react';

function Login() {
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
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-[380px] p-6"
      >
        {/* Logo no topo do card */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 rounded-full bg-[#F4D03F]/20 backdrop-blur-md border border-white/10 flex items-center justify-center overflow-hidden shadow-lg mb-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="ObaLeve"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="6" width="22" height="12" rx="2"/>
                <circle cx="7" cy="14" r="2"/>
                <circle cx="17" cy="14" r="2"/>
                <path d="M1 9h22"/>
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>ObaLeve</h1>
          <p className="text-[#A0A0B0] text-sm mt-0.5">Segurança e conforto em cada viagem</p>
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full rounded-2xl border border-white/20 bg-white/5 text-white flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/30 transition-all font-medium py-3"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-sm">Continuar com Google</span>
        </button>

        {/* Separador */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#1A1528] px-4 text-[#A0A0B0]">Entre com e-mail</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Mail size={18} className="text-[#F4D03F] shrink-0" />
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
            <Lock size={18} className="text-[#F4D03F] shrink-0" />
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

          <button
            type="submit"
            className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 py-3"
          >
            <span className="text-sm">Entrar</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Cadastro */}
        <div className="border-t border-white/10 pt-5 mt-5 space-y-3">
          <p className="text-xs text-[#A0A0B0] text-center">Ainda não tem conta?</p>
          <Link
            to="/register"
            className="w-full rounded-2xl border border-white/15 text-white flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/30 transition-all font-medium py-3"
          >
            <User size={18} className="text-[#F4D03F]" />
            <span className="text-sm">Criar conta como Passageiro</span>
          </Link>
          <Link
            to="/register-driver"
            className="w-full rounded-2xl border border-white/15 text-white flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/30 transition-all font-medium py-3"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#F4D03F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
              <path d="M12 6v6l-4 2"/>
              <path d="M12 6v5"/>
            </svg>
            <span className="text-sm">Criar conta como Motorista</span>
          </Link>
        </div>

        {/* Compartilhar */}
        <button
          onClick={handleShare}
          className="w-full mt-4 rounded-2xl text-[#A0A0B0] hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 border border-white/5 py-2.5"
        >
          <Share2 size={15} />
          <span className="text-xs">Compartilhar ObaLeve</span>
        </button>
      </motion.div>
    </div>
  )
}

export default Login;