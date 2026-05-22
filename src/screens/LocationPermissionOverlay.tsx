import { motion } from 'framer-motion';
import { MapPin, Navigation, Shield } from 'lucide-react';

interface LocationPermissionOverlayProps {
  onAllow: () => void;
  onSkip: () => void;
}

export function LocationPermissionOverlay({ onAllow, onSkip }: LocationPermissionOverlayProps) {
  return (
    <div className="min-h-screen relative">
      {/* MAPA DE FUNDO */}
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14625.123!2d-46.6333!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjgiUyA0NsKwMzgnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1"
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ border: 0, filter: 'brightness(0.6) saturate(1.1)' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Mapa"
      />

      {/* OVERLAY SEMI-TRANSPARENTE */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* CARD DE PERMISSÃO */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-[#1A1528] rounded-3xl p-6 border border-white/10 shadow-2xl max-w-md mx-auto"
        >
          {/* Logo + Título */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center mb-3 border-2 border-[#F4D03F]/40">
              <MapPin size={32} className="text-[#F4D03F]" />
            </div>
            <h1 className="text-2xl font-bold text-white">ObaLeva</h1>
            <p className="text-[#A0A0B0] text-sm mt-1">Acesso à localização</p>
          </div>

          <p className="text-[#A0A0B0] text-xs text-center mb-5 leading-relaxed">
            Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
          </p>

          {/* Botão SEMPRE PERMITIR */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onAllow}
            className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-1 text-sm"
          >
            <MapPin size={18} />
            SEMPRE PERMITIR
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full">Recomendado</span>
          </motion.button>
          <p className="text-[10px] text-[#A0A0B0] text-center mb-4">
            O app pode usar sua localização a qualquer momento
          </p>

          {/* Botão SÓ DESTA VEZ */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onAllow}
            className="w-full py-3 rounded-2xl font-bold bg-white/10 text-white hover:bg-white/20 transition-all text-sm mb-1"
          >
            SÓ DESTA VEZ
          </motion.button>
          <p className="text-[10px] text-[#A0A0B0] text-center mb-5">
            O app usa sua localização apenas agora
          </p>

          {/* Botão NÃO PERMITIR */}
          <button
            onClick={onSkip}
            className="w-full text-center text-sm text-[#A0A0B0] hover:text-red-400 transition font-medium"
          >
            NÃO PERMITIR
          </button>
        </motion.div>
      </div>
    </div>
  );
}