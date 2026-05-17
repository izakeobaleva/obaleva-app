import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Lock, UserPlus, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface SignUpScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function SignUpScreen({ onBack, onSuccess }: SignUpScreenProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState({ nome: false, email: false, telefone: false, password: false });

  const handleSignUp = async () => {
    if (!nome || !email || !password) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      const { data: auth, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome, tipo: 'passageiro' } }
      });
      
      if (signUpError) throw signUpError;
      
      if (auth.user) {
        await supabase.from('usuarios').insert({
          id: auth.user.id,
          nome_completo: nome,
          telefone: telefone || null,
          email: email,
          tipo: 'passageiro'
        });
        
        await supabase.from('passageiros').insert({ id: auth.user.id });
        
        alert('✅ Conta criada com sucesso! Faça login.');
        onSuccess();
      }
    } catch (error: any) {
      alert('❌ ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] via-[#120E1F] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-6 animate-fade-in-down">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#F4D03F]/20 rounded-full blur-lg"></div>
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50 shadow-xl">
              <UserPlus className="w-10 h-10 text-[#F4D03F]" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mt-3">Criar Conta</h2>
          <p className="text-[#A0A0B0] text-sm">Comece sua jornada com a ObaLeva</p>
        </div>

        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-6 border border-[#F4D03F]/20 shadow-2xl animate-fade-in-up">
          
          <div className="mb-6">
            <div className="flex justify-between text-xs text-[#A0A0B0] mb-2">
              <span className={step >= 1 ? 'text-[#F4D03F]' : ''}>📝 Dados</span>
              <span className={step >= 2 ? 'text-[#F4D03F]' : ''}>🔐 Conta</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#F4D03F] to-[#FFD966] rounded-full transition-all duration-500" style={{ width: step === 1 ? '50%' : '100%' }} />
            </div>
          </div>

          <div className="space-y-4">
            {step === 1 ? (
              <>
                <div className={`relative transition-all duration-300 ${isFocused.nome ? 'transform scale-[1.02]' : ''}`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User size={18} className={isFocused.nome ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Nome completo *"
                    className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/10 border-2 transition-all text-white placeholder:text-[#A0A0B0] focus:outline-none"
                    style={{ borderColor: isFocused.nome ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                    value={nome} 
                    onFocus={() => setIsFocused({ ...isFocused, nome: true })}
                    onBlur={() => setIsFocused({ ...isFocused, nome: false })}
                    onChange={(e) => setNome(e.target.value)} 
                  />
                </div>

                <div className={`relative transition-all duration-300 ${isFocused.telefone ? 'transform scale-[1.02]' : ''}`}>
                  <input 
                    type="tel" 
                    placeholder="Telefone (opcional)"
                    className="w-full py-3.5 px-4 rounded-xl bg-white/10 border-2 transition-all text-white placeholder:text-[#A0A0B0] focus:outline-none"
                    style={{ borderColor: isFocused.telefone ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                    value={telefone} 
                    onFocus={() => setIsFocused({ ...isFocused, telefone: true })}
                    onBlur={() => setIsFocused({ ...isFocused, telefone: false })}
                    onChange={(e) => setTelefone(e.target.value)} 
                  />
                </div>

                <button 
                  onClick={() => setStep(2)} 
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
                >
                  Continuar
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                </button>
              </>
            ) : (
              <>
                <div className={`relative transition-all duration-300 ${isFocused.email ? 'transform scale-[1.02]' : ''}`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Mail size={18} className={isFocused.email ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'} />
                  </div>
                  <input 
                    type="email" 
                    placeholder="E-mail *"
                    className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/10 border-2 transition-all text-white placeholder:text-[#A0A0B0] focus:outline-none"
                    style={{ borderColor: isFocused.email ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                    value={email} 
                    onFocus={() => setIsFocused({ ...isFocused, email: true })}
                    onBlur={() => setIsFocused({ ...isFocused, email: false })}
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>

                <div className={`relative transition-all duration-300 ${isFocused.password ? 'transform scale-[1.02]' : ''}`}>
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Lock size={18} className={isFocused.password ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Senha (mínimo 6 caracteres) *"
                    className="w-full py-3.5 pl-12 pr-12 rounded-xl bg-white/10 border-2 transition-all text-white placeholder:text-[#A0A0B0] focus:outline-none"
                    style={{ borderColor: isFocused.password ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                    value={password} 
                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                    onBlur={() => setIsFocused({ ...isFocused, password: false })}
                    onChange={(e) => setPassword(e.target.value)} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-[#F4D03F] transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button 
                  onClick={handleSignUp} 
                  disabled={loading} 
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      Criar minha conta
                    </>
                  )}
                </button>

                <button 
                  onClick={() => setStep(1)} 
                  className="w-full py-2 text-[#A0A0B0] text-sm hover:text-[#F4D03F] transition"
                >
                  ← Voltar
                </button>
              </>
            )}
          </div>

          <div className="text-center mt-4 pt-3 border-t border-white/10">
            <button onClick={onBack} className="text-[#A0A0B0] text-sm hover:text-[#F4D03F] transition">
              ← Já tenho conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}