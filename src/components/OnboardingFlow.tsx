import React, { useState, useEffect } from 'react';
import { 
  MapPin, Bell, FileText, Chrome, Facebook, 
  Shield, Check, ArrowRight, X, Eye, EyeOff, Car
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'exact' | 'approximate' | 'denied' | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Verificar se já está logado
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        localStorage.setItem('obaleva_onboarding', 'true');
        onComplete();
      }
    };
    checkAuth();
  }, []);

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission('exact'),
        () => setLocationPermission('denied')
      );
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission === 'granted');
    } else {
      setNotificationPermission(false);
    }
  };

  const handleNext = () => {
    if (step === 1 && locationPermission) {
      setStep(2);
    } else if (step === 2 && notificationPermission !== null) {
      setStep(3);
    } else if (step === 3 && agreeTerms) {
      setStep(4);
    }
  };

  // Login com Google
  const handleGoogleLogin = async () => {
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    });
    if (error) {
      alert('Erro ao fazer login com Google: ' + error.message);
      setLoginLoading(false);
    }
  };

  // Login com telefone (criação de conta)
  const handlePhoneLogin = async () => {
    if (!agreeTerms) {
      alert('Aceite os termos para continuar');
      return;
    }
    if (phoneNumber.replace(/\D/g, '').length < 10) {
      alert('Digite um número de telefone válido');
      return;
    }

    setLoginLoading(true);
    
    const tempEmail = `user_${phoneNumber.replace(/\D/g, '')}@obaleva.com`;
    const tempPassword = phoneNumber.replace(/\D/g, '') + '@ObaLeva';
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: tempEmail,
        password: tempPassword,
        options: {
          data: {
            telefone: phoneNumber,
            nome_completo: 'Usuário ObaLeva'
          }
        }
      });
      
      if (error && error.message.includes('already registered')) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: tempEmail,
          password: tempPassword
        });
        if (signInError) {
          alert('Erro ao fazer login. Tente com Google.');
          setLoginLoading(false);
          return;
        }
      } else if (error) {
        alert('Erro: ' + error.message);
        setLoginLoading(false);
        return;
      }
      
      localStorage.setItem('obaleva_phone', phoneNumber);
      localStorage.setItem('obaleva_onboarding', 'true');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (err) {
      console.error(err);
      alert('Erro ao processar login');
      setLoginLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // TELA 1: LOCALIZAÇÃO
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4 animate-pulse">
            <MapPin size={40} className="text-[#F4D03F]" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Permitir acesso à localização?</h2>
          <p className="text-[#A0A0B0] text-sm mb-6">
            Para assegurar que o aplicativo possa enviar corridas e planejar rotas.
          </p>
          <div className="space-y-3">
            <button onClick={() => { requestLocationPermission(); setLocationPermission('exact'); setTimeout(handleNext, 500); }} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">Permitir (Exata)</button>
            <button onClick={() => { requestLocationPermission(); setLocationPermission('approximate'); setTimeout(handleNext, 500); }} className="w-full py-3 rounded-xl border border-white/20 text-white font-bold">Permitir (Aproximada)</button>
            <button onClick={() => { setLocationPermission('denied'); handleNext(); }} className="w-full py-3 rounded-xl text-[#A0A0B0]">Não permitir</button>
          </div>
        </div>
      </div>
    );
  }

  // TELA 2: NOTIFICAÇÕES
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Bell size={40} className="text-[#F4D03F]" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-6">Permitir notificações?</h2>
          <div className="space-y-3">
            <button onClick={() => { requestNotificationPermission(); setTimeout(handleNext, 500); }} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">PERMITIR</button>
            <button onClick={() => { setNotificationPermission(false); handleNext(); }} className="w-full py-3 rounded-xl border border-white/20 text-white font-bold">NÃO PERMITIR</button>
          </div>
        </div>
      </div>
    );
  }

  // TELA 3: TERMOS
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <div className="text-center mb-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
              <FileText size={40} className="text-[#F4D03F]" />
            </div>
            <h2 className="text-white text-xl font-bold">Política de privacidade</h2>
          </div>
          <p className="text-[#A0A0B0] text-sm mb-4">
            Ao usar o ObaLeva, você concorda com nossos Termos de Uso e Política de Privacidade.
          </p>
          <button className="text-[#F4D03F] text-sm mb-6 flex items-center gap-1">Ler mais <ArrowRight size={14} /></button>
          <div className="space-y-3">
            <button onClick={() => { setAgreeTerms(true); handleNext(); }} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">Concordo</button>
            <button className="w-full py-3 rounded-xl border border-white/20 text-white font-bold">Sair</button>
          </div>
        </div>
      </div>
    );
  }

  // TELA 4: LOGIN COM TELEFONE
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-gray-400 text-sm">Sua corrida de confiança</p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <h2 className="text-white text-lg font-bold mb-4">Insira o número de telefone</h2>

          <div className="bg-white/5 rounded-xl border border-white/15 mb-4">
            <div className="flex items-center px-3 py-3">
              <span className="text-white font-bold mr-2">+55</span>
              <input
                type="tel"
                placeholder="123 4567 8901"
                className="flex-1 bg-transparent text-white outline-none"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                maxLength={15}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 mb-6">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-4 h-4" />
            <span className="text-[#A0A0B0] text-xs">Li e aceito os <span className="text-[#F4D03F]">Termos de Uso</span></span>
          </label>

          <button 
            onClick={handlePhoneLogin}
            disabled={!agreeTerms || phoneNumber.replace(/\D/g, '').length < 10 || loginLoading}
            className={`w-full py-3 rounded-xl font-bold mb-4 ${agreeTerms && phoneNumber.replace(/\D/g, '').length >= 10 ? 'bg-[#F4D03F] text-black' : 'bg-white/10 text-[#A0A0B0]'}`}
          >
            {loginLoading ? 'Entrando...' : 'Próximo'}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            <div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-gray-400">ou</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin} 
            disabled={loginLoading}
            className="w-full py-3 rounded-xl border border-white/20 text-white flex items-center justify-center gap-2"
          >
            <Chrome size={20} /> {loginLoading ? 'Aguarde...' : 'Entrar com Google'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;