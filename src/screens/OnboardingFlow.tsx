import { useState } from 'react';
import { LocationPermissionScreen } from './LocationPermissionScreen';
import { AuthorizationScreen } from './AuthorizationScreen';
import { LoginScreen } from './LoginScreen';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type OnboardingStep = 'location' | 'authorization' | 'login';

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<OnboardingStep>('location');

  const handleLocationAllow = () => {
    setStep('authorization');
  };

  const handleLocationSkip = () => {
    setStep('authorization');
  };

  const handleAuthorizationAccept = () => {
    localStorage.setItem('obaleva_terms_accepted', 'true');
    setStep('login');
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('obaleva_onboarding_complete', 'true');
    onComplete();
  };

  const handleSignUp = () => {
    // Navegar para cadastro
    window.location.href = '/register';
  };

  switch (step) {
    case 'location':
      return (
        <LocationPermissionScreen
          onAllow={handleLocationAllow}
          onSkip={handleLocationSkip}
        />
      );
    case 'authorization':
      return (
        <AuthorizationScreen
          onAccept={handleAuthorizationAccept}
          onBack={() => setStep('location')}
        />
      );
    case 'login':
      return (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onSignUp={handleSignUp}
          onBack={() => setStep('authorization')}
        />
      );
    default:
      return null;
  }
}