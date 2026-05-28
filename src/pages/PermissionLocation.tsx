"use client";

import { useNavigate } from 'react-router-dom';

export default function PermissionLocation() {
  const navigate = useNavigate();

  return (
    <div className="permission-container">
      <div className="permission-icon">📍</div>
      <h2>Acesso à localização</h2>
      <p>Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.</p>
      
      <button className="permit-btn" onClick={() => navigate('/permission-notification')}>SEMPRE PERMITIR</button>
      <button className="later-btn" onClick={() => navigate('/permission-notification')}>Agora não</button>
    </div>
  );
}