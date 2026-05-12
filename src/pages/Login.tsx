import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Car, User, Truck, ArrowRight } from 'lucide-react';

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
      
      const { data: userData } = await supabase
        .from('usuarios')
        .select('tipo')
        .eq('id', data.user.id)
        .single();

      if (userData?.tipo === 'motorista') {
        navigate('/driver');
      } else if (userData?.tipo === 'admin') {
        navigate('/admin');
      } else {
        navigate('/passenger');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card-dark p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#F4D03F]/20 backdrop-blur mb-4"
            >
              <Car className="w-10 h-10 text-[#F4D03F]" />
            </motion.div>
            <h1 className="text-4xl font-bold text-white tracking-tight">OBALEVA</h1>
            <p className="text-[#A0A0B0] text-sm mt-2">Mobilidade noturna premium</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full px-5 py-3 rounded-2xl bg-[#1A1528] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-medium mb-1">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-5 py-3 rounded-2xl bg-[#1A1528] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-premium w-full text-lg flex items-center justify-center gap-2"
            >
              {loading ? 'Entrando...' : <>Entrar <ArrowRight size={18} /></>}
            </motion.button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <p className="text-[#A0A0B0] text-sm">Ainda não tem conta?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/register/passenger')}
                className="btn-outline-dark flex items-center justify-center gap-2 flex-1"
              >
                <User size={18} />
                <span>Passageiro</span>
              </button>
              <button
                onClick={() => navigate('/register/driver')}
                className="btn-outline-dark flex items-center justify-center gap-2 flex-1"
              >
                <Truck size={18} />
                <span>Motorista</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}