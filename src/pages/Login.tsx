import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Car, User, Truck } from 'lucide-react';

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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-roxo-principal via-purple-800 to-purple-600 flex items-center justify-center p-4">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amarelo-oba/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amarelo-oba/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative z-10 w-full max-w-md backdrop-blur-md bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6"
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-400/20 backdrop-blur mb-4"
          >
            <Car className="w-10 h-10 text-amarelo-oba" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">OBALEVA</h1>
          <p className="text-white/70 text-sm mt-1">Sua mobilidade na palma da mão</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-white/80 text-sm font-medium mb-1">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amarelo-oba focus:border-transparent transition"
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
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-amarelo-oba focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-amarelo w-full py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </motion.button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-white/80 text-sm">Ainda não tem conta?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/register/passenger')}
              className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-2 text-white hover:bg-white/20 transition flex-1"
            >
              <User size={18} />
              <span>Passageiro</span>
            </button>
            <button
              onClick={() => navigate('/register/driver')}
              className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-xl px-4 py-2 text-white hover:bg-white/20 transition flex-1"
            >
              <Truck size={18} />
              <span>Motorista</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}