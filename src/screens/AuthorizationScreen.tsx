import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, MapPin, CheckCircle } from 'lucide-react';

interface AuthorizationScreenProps {
  onAccept: () => void;
  onBack: () => void;
}

export function AuthorizationScreen({ onAccept, onBack }: AuthorizationScreenProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [acceptedLocation, setAcceptedLocation] = useState(false);

  const allAccepted = acceptedTerms && acceptedPrivacy && acceptedLocation;

  const handleAccept = () => {
    if (allAccepted) {
      onAccept();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex-shrink-0 p-6 text-center relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 mx-auto rounded-full bg-green-500/20 border-2 border-green-500/30 flex items-center justify-center mb-4"
        >
          <CheckCircle size={36} className="text-green-400" />
        </motion.div>
        <h1 className="text-2xl font-bold text-white mb-2">Autorização</h1>
        <p className="text-sm text-[#A0A0B0]">Leia e aceite nossos termos para continuar</p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4 relative z-10">
        <div className="space-y-3 max-w-sm mx-auto">
          {/* Termos de Uso */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-white/5 rounded-2xl p-4 border transition-all ${
              acceptedTerms ? 'border-green-500/40' : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl ${acceptedTerms ? 'bg-green-500/20' : 'bg-[#F4D03F]/20'}`}>
                <FileText size={20} className={acceptedTerms ? 'text-green-400' : 'text-[#F4D03F]'} />
              </div>
              <h3 className="text-white font-bold text-sm flex-1">Termos de Uso</h3>
              <button
                onClick={() => setAcceptedTerms(!acceptedTerms)}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  acceptedTerms ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                  acceptedTerms ? 'right-0.5' : 'left-0.5'
                }`} />
              </button>
            </div>
            <p className="text-xs text-[#A0A0B0] leading-relaxed">
              Ao usar o ObaLeva, você concorda com nossos Termos de Uso que incluem: 
              responsabilidades do usuário, política de cancelamento, valores das corridas 
              e condições de uso do aplicativo.
            </p>
            <button className="text-green-400 text-xs font-medium mt-2 hover:underline">
              Ler termos completos →
            </button>
          </motion.div>

          {/* Política de Privacidade */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white/5 rounded-2xl p-4 border transition-all ${
              acceptedPrivacy ? 'border-green-500/40' : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl ${acceptedPrivacy ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                <Shield size={20} className={acceptedPrivacy ? 'text-green-400' : 'text-blue-400'} />
              </div>
              <h3 className="text-white font-bold text-sm flex-1">Política de Privacidade</h3>
              <button
                onClick={() => setAcceptedPrivacy(!acceptedPrivacy)}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  acceptedPrivacy ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                  acceptedPrivacy ? 'right-0.5' : 'left-0.5'
                }`} />
              </button>
            </div>
            <p className="text-xs text-[#A0A0B0] leading-relaxed">
              Seus dados são protegidos conforme a LGPD. Coletamos informações necessárias 
              para o funcionamento do app, como nome, email, localização e dados de pagamento.
            </p>
            <button className="text-green-400 text-xs font-medium mt-2 hover:underline">
              Ler política completa →
            </button>
          </motion.div>

          {/* Compartilhamento de Localização */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white/5 rounded-2xl p-4 border transition-all ${
              acceptedLocation ? 'border-green-500/40' : 'border-white/10'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl ${acceptedLocation ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                <MapPin size={20} className={acceptedLocation ? 'text-green-400' : 'text-red-400'} />
              </div>
              <h3 className="text-white font-bold text-sm flex-1">Compartilhamento de Localização</h3>
              <button
                onClick={() => setAcceptedLocation(!acceptedLocation)}
                className={`w-12 h-6 rounded-full transition-all relative ${
                  acceptedLocation ? 'bg-green-500' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                  acceptedLocation ? 'right-0.5' : 'left-0.5'
                }`} />
              </button>
            </div>
            <p className="text-xs text-[#A0A0B0] leading-relaxed">
              Autorizo o ObaLeva a acessar minha localização em tempo real durante as corridas 
              para garantir segurança e eficiência no serviço.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom button */}
      <div className="flex-shrink-0 p-6 relative z-10">
        <button
          onClick={handleAccept}
          disabled={!allAccepted}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
            allAccepted
              ? 'bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg'
              : 'bg-white/10 text-[#A0A0B0] cursor-not-allowed'
          }`}
        >
          {allAccepted ? (
            <><CheckCircle size={22} /> Continuar</>
          ) : (
            'Aceite todos os termos para continuar'
          )}
        </button>
      </div>
    </div>
  );
}