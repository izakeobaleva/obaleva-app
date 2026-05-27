import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AvatarUpload } from '../components/AvatarUpload';
import { ChevronRight, SkipForward } from 'lucide-react';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => navigate('/'), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#F4D03F]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">📸</span>
            </div>
            <h1 className="text-xl font-bold text-white">Quase lá!</h1>
            <p className="text-sm text-[#A0A0B0] mt-1">
              Adicione uma foto para personalizar seu perfil
            </p>
          </div>

          <AvatarUpload onComplete={handleComplete} />

          <div className="mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-2xl font-medium text-[#A0A0B0] hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
            >
              Pular esta etapa <SkipForward size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}