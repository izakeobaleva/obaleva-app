import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, User, Truck, ArrowRight, Check, Shield, Star, Zap, Eye, EyeOff, Loader } from 'lucide-react';
import { toast } from 'sonner';

interface WelcomeWizardProps {
  user: any;
  onComplete: () => void;
}

const WelcomeWizard: React.FC<WelcomeWizardProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [tipo, setTipo] = useState<'passageiro' | 'motorista' | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nome: user?.user_metadata?.nome_completo || '',
    telefone: '',
    email: user?.email || '',
    password: 'ObaLeva@123',
    cpf: '',
    veiculo: { placa: '', modelo: '', cor: '', ano: '2024' }
  });

  const handleComplete = async () => {
    if (!formData.nome.trim()) {
      toast.error('Digite seu nome completo');
      return;
    }
    
    setLoading(true);

    try {
      // 1. Criar no Auth
      const { data: auth, error: authError } = await supabase.auth.signUp({
        email: formData.email || user.email,
        password: formData.password,
        options: { data: { nome_completo: formData.nome, tipo } }
      });
      
      if (authError) throw authError;
      if (!auth.user) throw new Error('Erro ao criar usuário');
      
      // 2. Inserir na tabela usuarios
      const { error: userError } = await supabase.from('usuarios').insert({
        id: auth.user.id,
        nome_completo: formData.nome,
        telefone: formData.telefone || null,
        email: formData.email || user.email,
        cpf: formData.cpf || null,
        tipo
      });
      
      if (userError) throw userError;
      
      // 3. Criar perfil específico
      if (tipo === 'passageiro') {
        await supabase.from('passageiros').insert({ id: auth.user.id });
      } else {
        await supabase.from('motoristas').insert({
          id: auth.user.id,
          status: 'aprovado',
          online: true,
          dados_veiculo: formData.veiculo
        });
      }
      
      // Se não tem sessão ativa, tenta fazer login automático
      if (user?.id && user.id !== auth.user.id) {
        await supabase.auth.signOut();
      }

      if (!auth.session) {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email || user.email,
          password: formData.password
        });
        if (loginError) throw loginError;
      }

      toast.success(`✅ Cadastro de ${tipo} realizado!`);
      onComplete();
    } catch (err: any) {
      console.error('❌ Erro no cadastro:', err);
      toast.error(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        
        {/* Progresso */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center mb-4 border-2 border-[#F4D03F]/40 shadow-xl animate-float">
            {step === 1 ? <Car size={40} className="text-[#F4D03F]" /> : <User size={40} className="text-[#F4D03F]" />}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {step === 1 ? 'Bem-vindo ao ObaLeva!' : 'Complete seu cadastro'}
          </h2>
          <p className="text-[#A0A0B0] mt-2">
            {step === 1 ? 'Escolha como você quer usar o app' : 'Preencha seus dados para começar'}
          </p>
          
          <div className="flex justify-center gap-2 mt-4">
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 1 ? 'w-8 bg-[#F4D03F]' : 'w-3 bg-white/20'}`} />
            <div className={`h-2 rounded-full transition-all duration-300 ${step === 2 ? 'w-8 bg-[#F4D03F]' : 'w-3 bg-white/20'}`} />
          </div>
        </div>

        {/* PASSO 1 - Escolher tipo */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in-up">
            <button
              onClick={() => { setTipo('passageiro'); setStep(2); }}
              className="w-full p-5 rounded-2xl bg-gradient-to-r from-[#1A1528] to-[#2D2342] border-2 border-[#F4D03F]/30 hover:scale-[1.02] hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#F4D03F]/20 flex items-center justify-center group-hover:scale-110 transition">
                  <User size={28} className="text-[#F4D03F]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-white">Sou Passageiro</h3>
                  <p className="text-[#A0A0B0] text-sm">Quero solicitar corridas</p>
                </div>
                <ArrowRight size={20} className="text-[#F4D03F] group-hover:translate-x-1 transition" />
              </div>
            </button>

            <button
              onClick={() => { setTipo('motorista'); setStep(2); }}
              className="w-full p-5 rounded-2xl bg-gradient-to-r from-[#1A1528] to-[#2D2342] border-2 border-white/10 hover:border-[#F4D03F]/30 hover:scale-[1.02] hover:shadow-xl transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition">
                  <Truck size={28} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-white">Sou Motorista</h3>
                  <p className="text-[#A0A0B0] text-sm">Quero ganhar dinheiro dirigindo</p>
                </div>
                <ArrowRight size={20} className="text-white/50 group-hover:text-[#F4D03F] group-hover:translate-x-1 transition" />
              </div>
            </button>

            {/* Benefícios */}
            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <p className="text-[#A0A0B0] text-sm mb-4">Vantagens exclusivas ObaLeva</p>
              <div className="flex justify-center gap-8">
                <div className="text-center">
                  <Shield className="text-[#F4D03F] mx-auto mb-1" size={22} />
                  <span className="text-[10px] text-[#A0A0B0] font-medium">Seguro total</span>
                </div>
                <div className="text-center">
                  <Star className="text-[#F4D03F] mx-auto mb-1" size={22} />
                  <span className="text-[10px] text-[#A0A0B0] font-medium">Qualidade</span>
                </div>
                <div className="text-center">
                  <Zap className="text-[#F4D03F] mx-auto mb-1" size={22} />
                  <span className="text-[10px] text-[#A0A0B0] font-medium">Rapidez</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PASSO 2 - Formulário de cadastro */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
                  {tipo === 'passageiro' ? <User size={16} className="text-[#F4D03F]" /> : <Truck size={16} className="text-[#F4D03F]" />}
                </div>
                <span className="text-white font-bold text-sm">
                  {tipo === 'passageiro' ? 'Dados do Passageiro' : 'Dados do Motorista'}
                </span>
              </div>

              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Nome completo *" 
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-[#A0A0B0] focus:border-[#F4D03F] transition outline-none"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
                
                <input 
                  type="tel" 
                  placeholder="Telefone / WhatsApp *" 
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-[#A0A0B0] focus:border-[#F4D03F] transition outline-none"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                />

                <input 
                  type="email" 
                  placeholder="E-mail *" 
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-[#A0A0B0] focus:border-[#F4D03F] transition outline-none"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />

                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Senha * (mín. 6 caracteres)" 
                    className="w-full p-3 pr-10 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-[#A0A0B0] focus:border-[#F4D03F] transition outline-none"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-[#F4D03F] transition">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                
                {tipo === 'motorista' && (
                  <>
                    <div className="text-[#F4D03F] text-sm font-bold mt-3 mb-1">Dados do veículo</div>
                    <input 
                      type="text" 
                      placeholder="Placa do veículo *" 
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-[#A0A0B0] focus:border-[#F4D03F] transition outline-none"
                      value={formData.veiculo.placa}
                      onChange={(e) => setFormData({...formData, veiculo: {...formData.veiculo, placa: e.target.value.toUpperCase()}})}
                    />
                    <input 
                      type="text" 
                      placeholder="Modelo (ex: Toyota Corolla)" 
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-[#A0A0B0] focus:border-[#F4D03F] transition outline-none"
                      value={formData.veiculo.modelo}
                      onChange={(e) => setFormData({...formData, veiculo: {...formData.veiculo, modelo: e.target.value}})}
                    />
                    <input 
                      type="text" 
                      placeholder="Cor do veículo" 
                      className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-[#A0A0B0] focus:border-[#F4D03F] transition outline-none"
                      value={formData.veiculo.cor}
                      onChange={(e) => setFormData({...formData, veiculo: {...formData.veiculo, cor: e.target.value}})}
                    />
                  </>
                )}
              </div>
            </div>

            <button
              onClick={handleComplete}
              disabled={loading || !formData.nome}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? (
                <><Loader size={20} className="animate-spin" /> Cadastrando...</>
              ) : (
                <><Check size={20} /> Finalizar Cadastro</>
              )}
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full py-2 text-center text-sm text-[#A0A0B0] hover:text-[#F4D03F] transition"
            >
              ← Voltar e escolher outro tipo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeWizard;