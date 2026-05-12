import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Car, Chrome, Mail, Lock, UserPlus, Truck, Share2, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

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
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-md p-8"
      >
        {/* Logo e título */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F4D03F]/20 backdrop-blur mb-3"
          >
            <Car className="text-[#F4D03F] w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-[#A0A0B0] mt-1">Mobilidade premium para sua cidade</p>
        </div>

        {/* Botão Google - primeiro */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="w-full py-3.5 rounded-2xl border-2 border-white/20 bg-white/5 text-white flex items-center justify-center gap-3 hover:bg-white/10 hover:border-white/30 transition-all font-medium text-base mb-4"
        >
          <Chrome size={22} className="text-[#F4D03F]" />
          Entrar com Google
        </motion.button>

        {/* Separador */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#1A1528] px-3 text-[#A0A0B0]">ou acesse com e-mail</span>
          </div>
        </div>

        {/* Formulário de e-mail/senha */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#F4D03F]/50 transition-all">
            <Mail size={18} className="text-[#A0A0B0]" />
            <input
              type="email"
              placeholder="Seu e-mail"
              className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#F4D03F]/50 transition-all">
            <Lock size={18} className="text-[#A0A0B0]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#A0A0B0] hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
            className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base"
          >
            Entrar <ArrowRight size={18} />
          </motion.button>
        </form>

        {/* Botões de cadastro */}
        <div className="flex flex-col gap-3 mt-6">
          <Link
            to="/register"
            className="w-full py-3.5 rounded-2xl border border-white/15 text-white flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/30 transition-all font-medium text-sm"
          >
            <UserPlus size={18} className="text-[#F4D03F]" />
            Cadastrar como Passageiro
          </Link>
          <Link
            to="/register-driver"
            className="w-full py-3.5 rounded-2xl border border-white/15 text-white flex items-center justify-center gap-2 hover:bg-white/5 hover:border-white/30 transition-all font-medium text-sm"
          >
            <Truck size={18} className="text-[#F4D03F]" />
            Cadastrar como Motorista
          </Link>
        </div>

        {/* Compartilhar - último */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="w-full mt-6 py-3 rounded-2xl text-[#A0A0B0] hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm border border-white/5"
        >
          <Share2 size={16} />
          Compartilhar OBALEVA
        </motion.button>
      </motion.div>
    </div>
  );
}