import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MapBackground from '../components/MapBackground';

export default function PermissionNotification() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="permission-screen">
      <div className="absolute inset-0 z-0">
        <MapBackground />
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20"
      >
        <div className="permission-icon" style={{ background: 'linear-gradient(135deg, #A855F7, #7C3AED)' }}>
          🔔
        </div>
        <h2>Permitir notificações?</h2>
        <p>Para receber alertas importantes como:</p>
        
        <ul>
          <li>"Motorista a caminho"</li>
          <li>"Estou chegando!"</li>
          <li>"Corrida confirmada"</li>
          <li>"Promoções e descontos"</li>
          <li>"Avalie sua corrida"</li>
        </ul>
        
        <button className="permit-btn" onClick={handleAllow} style={{ background: 'linear-gradient(to right, #A855F7, #7C3AED)' }}>
          PERMITIR
        </button>
        <button className="later-btn" onClick={() => navigate('/login')}>
          Agora não
        </button>

        <p style={{ position: 'fixed', bottom: 24, left: 0, right: 0, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          ObaLeva © 2025
        </p>
      </motion.div>
    </div>
  );
}