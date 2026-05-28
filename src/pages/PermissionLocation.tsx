import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MapBackground from '../components/MapBackground';

export default function PermissionLocation() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => navigate('/permission-notification'),
        () => navigate('/permission-notification'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      navigate('/permission-notification');
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
        <div className="permission-icon" style={{ background: 'linear-gradient(135deg, #F4D03F, #FFD966)' }}>
          📍
        </div>
        <h2>Acesso à localização</h2>
        <p>Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.</p>
        
        <button className="permit-btn" onClick={handleAllow}>
          PERMITIR
        </button>
        <button className="later-btn" onClick={() => navigate('/permission-notification')}>
          Agora não
        </button>

        <p style={{ position: 'fixed', bottom: 24, left: 0, right: 0, fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          ObaLeva © 2025
        </p>
      </motion.div>
    </div>
  );
}