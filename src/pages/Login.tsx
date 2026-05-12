import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import toast from 'sonner';
import { motion } from 'framer-motion';
import { Car, Mail, Chrome, Share2, UserPlus, Truck } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate('/passenger'); // ou qualquer dashboard padrão; mas o App.tsx não redireciona automaticamente
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-dark w-full max-w-md p-8"
      >
        <div className="text-center mb-8">
          <Car className="text-[#F4D03F] w-12 h-12 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-[#A0A0B0] mt-1">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button type="submit" className="btn-premium w-full py-3">
            Entrar
          </button>
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
          <Chrome size={18} />
          Entrar com Google
        </button>

        <div className="flex flex-col gap-3 mt-4">
          <Link to="/register" className="btn-outline-dark w-full py-3 flex items-center justify-center gap-2">
            <UserPlus size={18} />
            Cadastrar como Passageiro
          </Link>
          <Link to="/register-driver" className="btn-outline-dark w-full py-3 flex items-center justify-center gap-2">
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
};