import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Bell, Car, Eye, EyeOff, Loader } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import { toast } from 'sonner';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import { RegisterPassenger } from './pages/RegisterPassenger';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import Divulgacao from './pages/Divulgacao';
import Trips from './pages/Trips';
import TripDetails from './pages/TripDetails';
import Earnings from './pages/Earnings';
import TestLogin from './pages/TestLogin';
import BulkCreateUsers from './pages/BulkCreateUsers';
import Profile from './pages/Profile';
import CadastroMotorista from './pages/CadastroMotorista';
import Home from './pages/Home';
import CompleteProfile from './pages/CompleteProfile';

// ============================================
// TELA DE PERMISSÃO DE LOCALIZAÇÃO
// ============================================
function PermissionLocation({ onAllow, onSkip }: { onAllow: () => void; onSkip: () => void }) {
  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => { onAllow(); },
        () => { onAllow(); },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      onAllow();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1A1528]/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full border border-white/10 shadow-2xl z-10">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Crosshair size={36} className="text-[#1E1E2F]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            ObaLeva
          </h1>
          <p className="text-[#A0A0B0] text-sm mb-2">Acesso à localização</p>
          <p className="text-[#A0A0B0] text-xs leading-relaxed mb-6">
            Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
          </p>
          <button onClick={handleAllow} className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Crosshair size={18} /> SEMPRE PERMITIR
          </button>
          <button onClick={onSkip} className="w-full mt-3 py-3 rounded-2xl font-medium text-[#A0A0B0] hover:text-white transition-all">
            Agora não
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// TELA DE PERMISSÃO DE NOTIFICAÇÃO
// ============================================
function PermissionNotification({ onAllow, onSkip }: { onAllow: () => void; onSkip: () => void }) {
  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => onAllow());
    } else {
      onAllow();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#A855F7]/5 rounded-full blur-[150px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1A1528]/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full border border-white/10 shadow-2xl z-10">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#A855F7] to-[#7C3AED] rounded-2xl flex items-center justify-center shadow-lg">
            <Bell size={36} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Permitir notificações?
          </h1>
          <p className="text-[#A0A0B0] text-xs mb-6">Para receber alertas importantes como:</p>
          <ul className="text-left text-sm text-[#A0A0B0] space-y-2 mb-6">
            {['"Motorista a caminho"', '"Estou chegando!"', '"Corrida confirmada"', '"Promoções e descontos"'].map((item, i) => (
              <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#A855F7] rounded-full" />{item}</li>
            ))}
          </ul>
          <button onClick={handleAllow} className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Bell size={18} /> PERMITIR
          </button>
          <button onClick={onSkip} className="w-full mt-3 py-3 rounded-2xl font-medium text-[#A0A0B0] hover:text-white transition-all">
            Agora não
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// TELA DE LOGIN (TELA CHEIA)
// ============================================
function LoginScreen() {
  const navigate = () => {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Preencha todos os campos'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login realizado!');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm"
      >
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-12 h-12 text-[#1E1E2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>ObaLeva</h1>
            <p className="text-[#A0A0B0] text-sm mt-1">Sua corrida, do seu jeito</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <span className="text-lg">📧</span>
              <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm" required />
            </div>

            <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <span className="text-lg mr-2">🔒</span>
              <input type={showPassword ? 'text' : 'password'} placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="flex-1 py-3 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader size={16} className="animate-spin" /> : '🔐'} {loading ? 'Entrando...' : 'Entrar'}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-[#A0A0B0] space-y-2">
            <p>Não tem conta? <a href="/register" className="text-[#F4D03F] hover:underline font-medium">Cadastre-se</a></p>
            <p><a href="/forgot-password" className="text-[#A0A0B0] hover:text-white">Esqueci minha senha</a></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// COMPONENTE DE ROTA PROTEGIDA
// ============================================
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// ============================================
// COMPONENTE PRINCIPAL COM FLUXO DE ONBOARDING
// ============================================
function AppContent() {
  const { user, loading } = useAuth();
  const [onboardingStep, setOnboardingStep] = useState<'location' | 'notification' | 'done'>(() => {
    const locationDone = localStorage.getItem('onboarding_location') === 'done';
    const notificationDone = localStorage.getItem('onboarding_notification') === 'done';
    if (!locationDone) return 'location';
    if (!notificationDone) return 'notification';
    return 'done';
  });

  const handleLocationAllow = () => {
    localStorage.setItem('onboarding_location', 'done');
    setOnboardingStep('notification');
  };

  const handleLocationSkip = () => {
    localStorage.setItem('onboarding_location', 'done');
    setOnboardingStep('notification');
  };

  const handleNotificationAllow = () => {
    localStorage.setItem('onboarding_notification', 'done');
    setOnboardingStep('done');
  };

  const handleNotificationSkip = () => {
    localStorage.setItem('onboarding_notification', 'done');
    setOnboardingStep('done');
  };

  // Se ainda está no onboarding (não logado)
  if (!user && !loading && onboardingStep !== 'done') {
    if (onboardingStep === 'location') {
      return <PermissionLocation onAllow={handleLocationAllow} onSkip={handleLocationSkip} />;
    }
    if (onboardingStep === 'notification') {
      return <PermissionNotification onAllow={handleNotificationAllow} onSkip={handleNotificationSkip} />;
    }
  }

  return (
    <Routes>
      {/* ROTAS PÚBLICAS */}
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterPassenger />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/divulgar" element={<Divulgacao />} />
      <Route path="/test-login" element={<TestLogin />} />
      <Route path="/bulk-create" element={<BulkCreateUsers />} />
      
      {/* ROTAS ADMIN */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* ROTAS PROTEGIDAS */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />
      <Route path="/trips" element={<ProtectedRoute><Trips /></ProtectedRoute>} />
      <Route path="/trips/:id" element={<ProtectedRoute><TripDetails /></ProtectedRoute>} />
      <Route path="/earnings" element={<ProtectedRoute><Earnings /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/cadastro-motorista" element={<ProtectedRoute><CadastroMotorista /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;