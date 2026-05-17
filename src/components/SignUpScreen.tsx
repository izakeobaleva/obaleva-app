import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, Eye, EyeOff } from 'lucide-react';

interface SignUpScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const handleSignUp = async () => {
    if (!nome || !email || !password) {
      setMensagem('Preencha todos os campos');
      return;
    }
    if (password.length < 6) {
      setMensagem('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    setMensagem('');
    
    try {
      const { data: auth, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: { nome_completo: nome, tipo: 'passageiro' } } 
      });
      
      if (error) throw error;
      
      if (auth.user) {
        await supabase.from('usuarios').insert({ 
          id: auth.user.id, 
          nome_completo: nome, 
          email: email, 
          tipo: 'passageiro' 
        });
        await supabase.from('passageiros').insert({ id: auth.user.id });
        setMensagem('✅ Conta criada! Faça login.');
        setTimeout(() => onSuccess(), 2000);
      }
    } catch (error: any) {
      if (error.message?.includes('already registered') || error.message?.includes('already exists')) {
        setMensagem('⚠️ Este e-mail já está cadastrado! Faça login.');
        setTimeout(() => onBack(), 2000);
      } else {
        setMensagem('❌ Erro: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4 border border-[#F4D03F]/30">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h2 className="text-2xl font-bold text-white">Criar Conta</h2>
          <p className="text-gray-400 mt-1">Cadastre-se para começar</p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-6 border border-white/10">
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Nome completo" 
              className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-500 focus:border-[#F4D03F] outline-none transition" 
              value={nome} 
              onChange={e => setNome(e.target.value)} 
            />
            <input 
              type="email" 
              placeholder="E-mail" 
              className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-500 focus:border-[#F4D03F] outline-none transition" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
            
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Senha (mínimo 6 caracteres)" 
                className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-500 focus:border-[#F4D03F] outline-none transition pr-12" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-white transition">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {mensagem && (
              <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm text-center">
                {mensagem}
              </div>
            )}

            <button 
              onClick={handleSignUp} 
              disabled={loading} 
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1A1528] font-bold transition-all hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Criando...' : 'Criar conta'}
            </button>

            <div className="text-center">
              <button onClick={onBack} className="text-gray-400 text-sm hover:text-[#F4D03F] transition font-medium">
                ← Já tenho conta
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};