import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

interface NotificationPermissionOverlayProps {
  onAllow: () => void;
  onDeny: () => void;
}

export function NotificationPermissionOverlay({ onAllow, onDeny }: NotificationPermissionOverlayProps) {
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

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      {/* CARD DE NOTIFICAÇÕES */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-8">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.1 }}
          className="bg-[#1A1528] rounded-3xl p-6 border border-white/10 shadow-2xl max-w-md mx-auto"
        >
          <div className="text-center mb-5">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center mb-3 border-2 border-purple-500/30">
              <Bell size={32} className="text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-white">🔔 Permitir notificações?</h2>
          </div>

          <p className="text-[#A0A0B0] text-xs text-center mb-4">
            Para receber alertas importantes como:
          </p>

          <div className="bg-[#0F0B1A] rounded-xl p-4 mb-5 space-y-2 border border-white/10">
            <p className="text-white text-sm">🚗 "Motorista a caminho"</p>
            <p className="text-white text-sm">📍 "Estou chegando!"</p>
            <p className="text-white text-sm">✅ "Corrida confirmada"</p>
            <p className="text-white text-sm">💰 "Promoções e descontos"</p>
            <p className="text-white text-sm">⭐ "Avalie sua corrida"</p>
          </div>

          {/* Botão PERMITIR */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onAllow}
            className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white hover:shadow-lg transition-all text-sm mb-3"
          >
            PERMITIR
          </motion.button>

          {/* Botão NÃO PERMITIR */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onDeny}
            className="w-full py-3 rounded-2xl font-bold bg-white/10 text-white hover:bg-white/20 transition-all text-sm"
          >
            NÃO PERMITIR
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}