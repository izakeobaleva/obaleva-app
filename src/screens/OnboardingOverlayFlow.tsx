import { useState } from 'react';
import { LocationPermissionOverlay } from './LocationPermissionOverlay';
import { NotificationPermissionOverlay } from './NotificationPermissionOverlay';
import { RegisterOverlay } from './RegisterOverlay';
import { LoginOverlay } from './LoginOverlay';

interface OnboardingOverlayFlowProps {
  onComplete: () => void;
}

type Step = 'location' | 'notification' | 'register' | 'login';

export function OnboardingOverlayFlow({ onComplete }: OnboardingOverlayFlowProps) {
  const [step, setStep] = useState<Step>('location');
  const [loginData, setLoginData] = useState<any>(null);

  const handleLocationAllow = () => {
    setStep('notification');
  };

  const handleNotificationAllow = () => {
    // Marca no localStorage
    localStorage.setItem('obaleva_onboarding_progress', 'notifications_done');
    setStep('login');
  };

  const handleNotificationDeny = () => {
    localStorage.setItem('obaleva_onboarding_progress', 'notifications_done');
    setStep('login');
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('obaleva_onboarding_progress', 'complete');
    onComplete();
  };

  const handleGoToRegister = () => {
    setStep('register');
  };

  const handleGoToLogin = () => {
    setStep('login');
  };

  switch (step) {
    case 'location':
      return (
        <LocationPermissionOverlay
          onAllow={handleLocationAllow}
          onSkip={() => setStep('notification')}
        />
      );
    case 'notification':
      return (
        <NotificationPermissionOverlay
          onAllow={handleNotificationAllow}
          onDeny={handleNotificationDeny}
        />
      );
    case 'register':
      return (
        <RegisterOverlay
          onBack={handleGoToLogin}
          onSuccess={handleLoginSuccess}
        />
      );
    case 'login':
      return (
        <LoginOverlay
          onSuccess={handleLoginSuccess}
          onSignUp={handleGoToRegister}
        />
      );
    default:
      return null;
  }
}