"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Car, Mail, UserPlus, Smartphone, ArrowRight } from 'lucide-react';

export default function HomePublic() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] via-[#1A1528] to-[#0F0B1A] flex flex-col">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#F4D03F]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[250px] h-[250px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#F4D03F]/20">
            <Car size={40} className="text-[#1E1E2F]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold text-white text-center"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
        >
          ObaLeve
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#A0A0B0] text-center mt-2 mb-10 max-w-xs text-sm"
        >
          Mobilidade premium para sua cidade
        </motion.p>

        {/* Options de entrada */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-sm space-y-3"
        >
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#1A1528] border border-white/10 rounded-2xl px-5 py-4 text-white font-medium flex items-center gap-3 hover:border-[#F4D03F]/30 transition-all group"
          >
            <div className="p-2 bg-[#F4D03F]/10 rounded-xl group-hover:bg-[#F4D03F]/20 transition-all">
              <Mail size={20} className="text-[#F4D03F]" />
            </div>
            <span>Entrar com e-mail</span>
            <ArrowRight size={18} className="ml-auto text-[#A0A0B0] group-hover:text-[#F4D03F] transition-all" />
          </button>

          <button
            onClick={() => navigate('/passenger')}
            className="w-full bg-[#1A1528] border border-white/10 rounded-2xl px-5 py-4 text-white font-medium flex items-center gap-3 hover:border-[#F4D03F]/30 transition-all group"
          >
            <div className="p-2 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-all">
              <Smartphone size={20} className="text-blue-400" />
            </div>
            <span>Entrar como convidado</span>
            <ArrowRight size={18} className="ml-auto text-[#A0A0B0] group-hover:text-[#F4D03F] transition-all" />
          </button>

          <button
            className="w-full bg-[#1A1528] border border-white/10 rounded-2xl px-5 py-4 text-white font-medium flex items-center gap-3 transition-all opacity-50 cursor-not-allowed"
            disabled
          >
            <div className="p-2 bg-white/10 rounded-xl">
              <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <span>Entrar com Google</span>
            <span className="ml-auto text-[10px] text-[#A0A0B0] bg-white/10 px-2 py-0.5 rounded-full">Em breve</span>
          </button>

          <div className="pt-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full btn-premium py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Criar conta
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-[#A0A0B0] text-xs">
            Quer dirigir?{' '}
            <button
              onClick={() => navigate('/register-driver')}
              className="text-[#F4D03F] font-semibold hover:underline"
            >
              Cadastro Motorista
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}