import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Eye, EyeOff, ArrowRight, Loader } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface RegisterOverlayProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function RegisterOverlay({ onBack, onSuccess }: RegisterOverlayProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nome || !email) {
      setError('Preencha os campos obrigatórios');
      return;
    }
    if (password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }
    if (!acceptedTerms) {
      setError('Aceite os Termos de Uso e Política de Privacidade');
      return;
    }

    setLoading(true);
    try {
      const { data: auth, error: signUpError } = await supabase.auth.signUp({
        email, password,
        options: { data: { nome_completo: nome, telefone } }
      });
      if (signUpError) throw signUpError;
      if (auth.user) {
        await supabase.from('usuarios').insert({
          id: auth.user.id, nome_completo: nome, email,
          telefone: telefone || null, tipo: 'passageiro'
        });
        await supabase.from('passageiros').insert({ id: auth.user.id });

        // Login automático
        await supabase.auth.signInWithPassword({ email, password });
        onSuccess();
      }
    } catch (err: any) {
      if (err.message?.includes('already registered')) {
        setError('Este e-mail já está cadastrado. Faça login.');
      } else {
        setError(err.message || 'Erro ao cadastrar');
      }
    }
    finally { setLoading(false); }
  };

  // Sugestões de localização
  const sugestoes = ['Frei Caneca', 'Arapuá', 'R. São Paulo', 'Rua João Passa'];

  return (
    <div className="min-h-screen relative">
      {/* MAPA DE FUNDO */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14625.123!2d-46.6333!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjgiUyA0NsKwMzgnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1"
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ border: 0, filter: 'brightness(0.5)' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

      {/* CARD DE CADASTRO */}
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-[#1A1528] rounded-t-3xl p-5 border-t border-white/10 shadow-2xl max-w-md mx-auto"
        >
          {/* Sugestões */}
          <div className="mb-4">
            <p className="text-[#A0A0B0] text-xs mb-2">Próximo a você:</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {sugestoes.map((s, i) => (
                <button key={i} className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs whitespace-nowrap hover:bg-white/20 transition">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <h2 className="text-white text-xl font-bold mb-1">Criar sua conta</h2>
          <p className="text-[#A0A0B0] text-xs mb-4">Preencha seus dados para começar</p>

          {error && (
            <div className={`rounded-xl p-3 mb-3 text-xs ${
              error.includes('já cadastrado')
                ? 'bg-yellow-900/20 border border-yellow-500/30 text-yellow-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <InputField icon={User} placeholder="Nome completo" value={nome} onChange={setNome} />
            <InputField icon={Mail} placeholder="E-mail" type="email" value={email} onChange={setEmail} />
            <InputField icon={Phone} placeholder="Telefone" value={telefone} onChange={setTelefone} />

            <div className="flex gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                  <Lock size={14} className="text-[#F4D03F] shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required minLength={6}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white shrink-0">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                  <Lock size={14} className="text-[#F4D03F] shrink-0" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirmar"
                    className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required minLength={6}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#A0A0B0] hover:text-white shrink-0">
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Termos */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#F4D03F] rounded"
              />
              <span className="text-xs text-[#A0A0B0]">
                Leia o seu <span className="text-[#F4D03F] font-medium">Termo de Uso</span> e a{' '}
                <span className="text-[#F4D03F] font-medium">Política de Privacidade</span>
              </span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <><Loader size={16} className="animate-spin" /> Criando...</> : <><ArrowRight size={16} /> CRIAR CONTA</>}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-[10px] text-[#A0A0B0]">ou</span></div>
          </div>

          <button className="w-full py-2.5 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-xs mb-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
              <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
              <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
              <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
            </svg>
            Entrar com Google
          </button>

          <p className="text-center text-xs text-[#A0A0B0]">
            Já tem conta?{' '}
            <button onClick={onBack} className="text-[#F4D03F] font-medium hover:underline">Faça login</button>
          </p>

          <div className="h-4" />
        </motion.div>
      </div>
    </div>
  );
}

function InputField({ icon: Icon, placeholder, type = 'text', value, onChange }: any) {
  return (
    <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
      <Icon size={14} className="text-[#F4D03F] shrink-0" />
      <input
        type={type}
        placeholder={placeholder}
        className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}