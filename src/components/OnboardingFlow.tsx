import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Bell, Chrome, Car, Eye, EyeOff, CheckCircle } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  isVisible: boolean;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, isVisible }) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [locationPermission, setLocationPermission] = useState<'exact' | 'approximate' | 'denied' | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null);

  if (!isVisible) return null;

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission('exact');
          setTimeout(() => setStep(2), 300);
        },
        () => {
          setLocationPermission('denied');
          setTimeout(() => setStep(2), 300);
        }
      );
    }
  };

  const requestApproximateLocation = () => {
    setLocationPermission('approximate');
    setTimeout(() => setStep(2), 300);
  };

  const denyLocation = () => {
    setLocationPermission('denied');
    setTimeout(() => setStep(2), 300);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission === 'granted');
    } else {
      setNotificationPermission(false);
    }
    setTimeout(() => setStep(3), 300);
  };

  const denyNotification = () => {
    setNotificationPermission(false);
    setTimeout(() => setStep(3), 300);
  };

  const handleCreateAccount = async () => {
    setError('');
    
    if (!phoneNumber || !password || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    if (!agreeTerms) {
      setError('Você precisa aceitar os termos de uso');
      return;
    }
    
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Digite um número de telefone válido');
      return;
    }
    
    setLoading(true);
    
    const tempEmail = `user_${phoneDigits}@obaleva.com`;
    
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: tempEmail,
        password: password,
        options: {
          data: {
            telefone: phoneNumber,
            nome_completo: 'Usuário ObaLeva'
          }
        }
      });
      
      if (signUpError && !signUpError.message.includes('already registered')) {
        throw signUpError;
      }
      
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: password
      });
      
      if (signInError) throw signInError;
      
      localStorage.setItem('obaleva_phone', phoneNumber);
      localStorage.setItem('obaleva_onboarding', 'true');
      localStorage.setItem('location_permission_asked', 'true');
      
      setTimeout(() => {
        onComplete();
      }, 500);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    setLoading(false);
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // PASSO 1: PERMISSÃO DE LOCALIZAÇÃO
  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
        <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 animate-slide-up">
          <div className="p-3 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
          <div className="px-6 pb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
              <MapPin size={32} className="text-[#F4D03F]" />
            </div>
            <h2 className="text-white text-xl font-bold text-center mb-2">Permitir acesso à localização?</h2>
            <p className="text-[#A0A0B0] text-sm text-center mb-6">Para assegurar que o aplicativo possa enviar corridas e planejar rotas.</p>
            <div className="space-y-3">
              <button onClick={requestLocationPermission} className="w-full py-4 px-4 rounded-xl bg-[#F4D03F] text-black font-bold text-left flex justify-between items-center">
                <div className="flex flex-col"><span className="text-base">📍 Permitir (Exata)</span><span className="text-xs text-black/70 font-normal">DURANTE O USO DO APP</span></div>
              </button>
              <button onClick={requestApproximateLocation} className="w-full py-4 px-4 rounded-xl border border-white/20 text-white font-bold text-left flex justify-between items-center hover:bg-white/5 transition">
                <div className="flex flex-col"><span className="text-base">📍 Permitir (Aproximada)</span><span className="text-xs text-[#A0A0B0] font-normal">APENAS ESTA VEZ</span></div>
              </button>
              <button onClick={denyLocation} className="w-full py-4 px-4 rounded-xl text-[#A0A0B0] text-left hover:bg-white/5 transition">NÃO PERMITIR</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PASSO 2: PERMISSÃO DE NOTIFICAÇÕES (COM JUSTIFICATIVA)
  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
        <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30">
          <div className="p-3 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
          <div className="px-6 pb-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
              <Bell size={32} className="text-[#F4D03F]" />
            </div>
            <h2 className="text-white text-xl font-bold text-center mb-2">Permitir notificações?</h2>
            <p className="text-[#A0A0B0] text-sm text-center mb-4">
              Para receber alertas importantes como:
            </p>
            <div className="bg-white/5 rounded-xl p-3 mb-6 space-y-2">
              <p className="text-white text-sm">• 🚗 "Motorista a caminho"</p>
              <p className="text-white text-sm">• 📍 "Estou chegando!"</p>
              <p className="text-white text-sm">• ✅ "Corrida confirmada"</p>
              <p className="text-white text-sm">• 💰 "Promoções e descontos"</p>
              <p className="text-white text-sm">• ⭐ "Avalie sua corrida"</p>
            </div>
            <div className="space-y-3">
              <button onClick={requestNotificationPermission} className="w-full py-4 rounded-xl bg-[#F4D03F] text-black font-bold">PERMITIR</button>
              <button onClick={denyNotification} className="w-full py-4 rounded-xl border border-white/20 text-white font-bold">NÃO PERMITIR</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PASSO 3: CRIAR CONTA (COM GOOGLE EM PRIMEIRO LUGAR)
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center">
      <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 max-h-[85vh] overflow-y-auto">
        <div className="p-3 flex justify-center">
          <div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" />
        </div>
        <div className="px-6 pb-8">
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
              <Car size={32} className="text-[#F4D03F]" />
            </div>
            <h2 className="text-white text-xl font-bold">Criar sua conta</h2>
            <p className="text-[#A0A0B0] text-sm">Comece a usar o ObaLeva</p>
          </div>

          {error && (
            <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {/* BOTÃO GOOGLE - PRIMEIRA OPÇÃO */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center gap-3 hover:bg-white/20 transition"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
                <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
                <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
                <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
              </svg>
              <span className="font-medium">Entrar com Google</span>
            </button>

            {/* DIVISOR */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#1A1528] px-3 text-xs text-gray-400">ou</span>
              </div>
            </div>

            {/* FORMULÁRIO DE TELEFONE/SENHA */}
            <div className="bg-white/5 rounded-xl border border-white/15">
              <div className="flex items-center px-3 py-3">
                <span className="text-white font-bold mr-2">+55</span>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="flex-1 bg-transparent text-white outline-none"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                  maxLength={15}
                />
              </div>
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Senha *"
                className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar senha *"
                className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* TERMOS */}
            <label className="flex items-center gap-2 py-2">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-[#A0A0B0] text-xs">
                Li e aceito os <span className="text-[#F4D03F]">Termos de Uso</span> e a{' '}
                <span className="text-[#F4D03F]">Política de Privacidade</span>
              </span>
            </label>

            {/* BOTÃO CRIAR CONTA */}
            <button
              onClick={handleCreateAccount}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold"
            >
              {loading ? 'Criando conta...' : '✅ CRIAR CONTA'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;