import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Shield, Navigation } from 'lucide-react';

interface LocationPermissionScreenProps {
  onAllow: () => void;
  onSkip: () => void;
}

export function LocationPermissionScreen({ onAllow, onSkip }: LocationPermissionScreenProps) {
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handleRequestLocation = async () => {
    setLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => {
            setLoading(false);
            onAllow();
          },
          () => {
            setPermissionDenied(true);
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        setPermissionDenied(true);
        setLoading(false);
      }
    } catch {
      setPermissionDenied(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          {/* Icon */}
          <div className="w-28 h-28 mx-auto rounded-full bg-green-500/10 border-2 border-green-500/30 flex items-center justify-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <MapPin size={56} className="text-green-400" />
            </motion.div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-4">Permissão de Localização</h1>
          
          <p className="text-[#A0A0B0] text-sm leading-relaxed mb-6">
            O ObaLeva precisa da sua localização exata para:
          </p>

          <div className="space-y-3 text-left mb-8">
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
              <Navigation size={20} className="text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Motoristas próximos</p>
                <p className="text-[#A0A0B0] text-xs">Encontrar motoristas disponíveis perto de você</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
              <Navigation size={20} className="text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Rotas precisas</p>
                <p className="text-[#A0A0B0] text-xs">Calcular a melhor rota para seu destino</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/10">
              <Shield size={20} className="text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Sua segurança</p>
                <p className="text-[#A0A0B0] text-xs">Garantir sua segurança durante a corrida</p>
              </div>
            </div>
          </div>

          {/* Info card */}
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-3 mb-6 flex items-start gap-3">
            <Shield size={20} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-blue-300 text-xs leading-relaxed">
              Sua localização só é compartilhada durante as corridas. Seus dados estão protegidos conforme a LGPD.
            </p>
          </div>

          {permissionDenied && (
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-xl p-3 mb-4">
              <p className="text-yellow-300 text-xs">
                ⚠️ Permissão negada. Para usar o app, recomendamos permitir. Você pode ativar nas configurações do navegador.
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Buttons */}
      <div className="p-6 space-y-3 relative z-10">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleRequestLocation}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-base"
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Solicitando...
            </>
          ) : (
            <>
              <MapPin size={22} />
              Permitir Localização Exata
            </>
          )}
        </motion.button>
        
        <button
          onClick={onSkip}
          className="w-full py-3 rounded-2xl border border-white/20 text-[#A0A0B0] hover:text-white transition-all text-sm font-medium"
        >
          Pular por enquanto
        </button>
      </div>
    </div>
  );
}