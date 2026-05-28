"use client";

import { useNavigate } from 'react-router-dom';

export default function PermissionNotification() {
  const navigate = useNavigate();

  return (
    <div className="notification-container">
      <div className="permission-icon">🔔</div>
      <h2>Permitir notificações?</h2>
      <p>Para receber alertas importantes como:</p>
      
      <ul>
        <li>"Motorista a caminho"</li>
        <li>"Estou chegando!"</li>
        <li>"Corrida confirmada"</li>
        <li>"Promoções e descontos"</li>
        <li>"Avalie sua corrida"</li>
      </ul>
      
      <button className="permit-btn" onClick={() => navigate('/login')}>PERMITIR</button>
      <button className="later-btn" onClick={() => navigate('/login')}>Agora não</button>
    </div>
  );
}