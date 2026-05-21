import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Shield, LogOut, ArrowLeft, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Perfil() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userType = user?.user_metadata?.tipo || 'passageiro';
  const isMotorista = profile?.tipo === 'motorista';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] pb-24">
      <header className="glass-header sticky top-0 z-20 px-6 py-4 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="btn-outline-dark p-2" aria-label="Voltar">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
      </header>
      
      <main className="p-4 max-w-lg mx-auto space-y-4 mt-4">
        {/* Card do usuário */}
        <div className="bg-[#1A1528] rounded-2xl p-6 border border-white/10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={36} className="text-[#1E1E2F]" />
          </div>
          <h2 className="text-xl font-bold text-white">{user?.email?.split('@')[0] || 'Usuário'}</h2>
          <span className={`inline-block mt-2 px-4 py-1.5 rounded-full text-xs font-semibold ${
            isMotorista ? 'bg-green-900/40 text-green-400' : 'bg-blue-900/40 text-blue-400'
          }`}>
            {isMotorista ? '🚗 Motorista' : '🚶 Passageiro'}
          </span>
        </div>

        {/* Informações da conta */}
        <div className="bg-[#1A1528] rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-[#F4D03F]" />
            <div>
              <p className="text-xs text-[#A0A0B0]">E-mail</p>
              <p className="text-sm font-medium text-white">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-white/10">
            <Shield size={18} className="text-[#F4D03F]" />
            <div>
              <p className="text-xs text-[#A0A0B0]">Conta</p>
              <p className="text-sm font-medium text-white">Verificada</p>
            </div>
          </div>
        </div>

        {/* Botão Tornar-se Parceiro - aparece apenas se NÃO for motorista */}
        {!isMotorista && (
          <button
            onClick={() => navigate('/tornar-parceiro')}
            className="w-full bg-[#1A1528] rounded-2xl p-4 border border-[#F4D03F]/30 flex items-center justify-center gap-2 text-[#F4D03F] hover:bg-[#F4D03F]/10 transition-all font-medium"
          >
            <Truck size={18} />
            Tornar-se Parceiro
          </button>
        )}

        {/* Botão Sair */}
        <button
          onClick={handleSignOut}
          className="w-full bg-[#1A1528] rounded-2xl p-4 border border-white/10 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 transition-all font-medium"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </main>

      {userType && <BottomNav role={userType as 'passageiro' | 'motorista'} />}
    </div>
  );
}

function BottomNav({ role }: { role: 'passageiro' | 'motorista' }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-3 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/30 rounded-2xl max-w-md w-full mx-4">
        <div className="flex justify-between px-5 py-3">
          {[{ id: 'home', label: 'Início' }, { id: 'perfil', label: 'Perfil' }].map(tab => (
            <div key={tab.id} className={`flex flex-col items-center gap-1 ${tab.id === 'perfil' ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
              <span className="text-[10px]">{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}