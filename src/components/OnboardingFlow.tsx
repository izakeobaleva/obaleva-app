import React, { useState, useEffect } from 'react';
import { 
  MapPin, Bell, FileText, Chrome, Facebook, 
  Shield, Check, ArrowRight, X, Eye, EyeOff
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (phoneNumber: string) => void;
  onGoogleLogin: () => void;
  onFacebookLogin?: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onGoogleLogin, onFacebookLogin }) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'exact' | 'approximate' | 'denied' | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<boolean | null>(null);

  // Verificar se já passou pelo onboarding
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('obaleva_onboarding');
    if (onboardingCompleted === 'true') {
      return;
    }
  }, []);

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => { console.log('Localização permitida'); setLocationPermission('exact'); },
        () => { console.log('Localização negada'); setLocationPermission('denied'); }
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
    } else if (step === 4 && phoneNumber.length >= 10 && agreeTerms) {
      localStorage.setItem('obaleva_onboarding', 'true');
      localStorage.setItem('obaleva_phone', phoneNumber);
      onComplete(phoneNumber);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // TELA 1: PERMISSÃO DE LOCALIZAÇÃO
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <MapPin size={40} className="text-[#F4D03F]" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Permitir acesso à localização?</h2>
          <p className="text-[#A0A0B0] text-sm mb-6">
            Para assegurar que o aplicativo possa enviar corridas e planejar rotas de entrega, 
            coletaremos informações de localização do seu dispositivo.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={() => { requestLocationPermission(); setLocationPermission('exact'); handleNext(); }}
              className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold"
            >
              Permitir (Exata)
            </button>
            <button 
              onClick={() => { requestLocationPermission(); setLocationPermission('approximate'); handleNext(); }}
              className="w-full py-3 rounded-xl border border-white/20 text-white font-bold"
            >
              Permitir (Aproximada)
            </button>
            <button 
              onClick={() => { setLocationPermission('denied'); handleNext(); }}
              className="w-full py-3 rounded-xl text-[#A0A0B0]"
            >
              Não permitir
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TELA 2: PERMISSÃO DE NOTIFICAÇÕES
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Bell size={40} className="text-[#F4D03F]" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-6">Permitir notificações?</h2>
          
          <div className="space-y-3">
            <button 
              onClick={() => { requestNotificationPermission(); handleNext(); }}
              className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold"
            >
              PERMITIR
            </button>
            <button 
              onClick={() => { setNotificationPermission(false); handleNext(); }}
              className="w-full py-3 rounded-xl border border-white/20 text-white font-bold"
            >
              NÃO PERMITIR
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TELA 3: TERMOS E PRIVACIDADE
  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <div className="text-center mb-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
              <FileText size={40} className="text-[#F4D03F]" />
            </div>
            <h2 className="text-white text-xl font-bold">Política de privacidade e uso</h2>
          </div>
          
          <p className="text-[#A0A0B0] text-sm mb-4">
            Antes de usar os produtos ou serviços ObaLeva, leia atentamente os Termos de Uso, 
            as regras da plataforma e a Política de Privacidade. Ao tocar em "Concordo" e usar 
            nossos produtos e serviços, você confirma que leu, entendeu e concorda com os termos.
          </p>
          
          <button className="text-[#F4D03F] text-sm mb-6 flex items-center gap-1">
            Privacidade e uso da ObaLeva <ArrowRight size={14} />
          </button>
          
          <div className="space-y-3">
            <button 
              onClick={() => { setAgreeTerms(true); handleNext(); }}
              className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold"
            >
              Concordo
            </button>
            <button className="w-full py-3 rounded-xl border border-white/20 text-white font-bold">
              Sair
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TELA 4: LOGIN COM TELEFONE
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
        <div className="text-center mb-6">
          <h2 className="text-white text-2xl font-bold">Insira o número de telefone</h2>
        </div>

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
          <input 
            type="checkbox" 
            checked={agreeTerms} 
            onChange={(e) => setAgreeTerms(e.target.checked)} 
            className="w-4 h-4"
          />
          <span className="text-[#A0A0B0] text-xs">
            Li e aceito os <span className="text-[#F4D03F]">Termos de Uso</span> e a 
            <span className="text-[#F4D03F]"> Política de Privacidade</span>
          </span>
        </label>

        <button 
          onClick={handleNext}
          disabled={!agreeTerms || phoneNumber.length < 10}
          className={`w-full py-3 rounded-xl font-bold mb-4 ${agreeTerms && phoneNumber.length >= 10 ? 'bg-[#F4D03F] text-black' : 'bg-white/10 text-[#A0A0B0]'}`}
        >
          Próximo
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-gray-400">ou</span></div>
        </div>

        <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-white/20 text-white flex items-center justify-center gap-2 mb-3">
          <Chrome size={20} /> Entrar com Google
        </button>

        {onFacebookLogin && (
          <button onClick={onFacebookLogin} className="w-full py-3 rounded-xl border border-white/20 text-white flex items-center justify-center gap-2">
            <Facebook size={20} /> Entrar com Facebook
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;