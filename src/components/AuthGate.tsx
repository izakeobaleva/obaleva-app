import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FFD966] to-[#F4D03F] rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-3xl">🚕</span>
          </div>
          <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}