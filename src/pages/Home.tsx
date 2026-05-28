"use client";

import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="map-container">
      <div className="map-placeholder">
        <span>🗺️</span>
        <p>Mapa indisponível</p>
        <p className="coordinates">📞 -23.5544, -46.6475</p>
      </div>
      
      <div className="bottom-sheet">
        <div className="location-field">
          <div className="field-label">ONDE VOCÊ ESTÁ?</div>
          <div className="field-value">
            R. Santo Antônio, 1091 - Bela Vista, São Paulo - SP, 01314-001, Brasil
            <span className="edit-link">Editar</span>
          </div>
        </div>
        
        <div className="location-field">
          <div className="field-label">PARA ONDE VOCÊ VAI?</div>
          <div className="field-value">
            Para onde vai?
            <span className="edit-link">Editar</span>
          </div>
        </div>
        
        <button className="ride-btn" onClick={() => navigate('/login')}>Chamar ObaLeva</button>
        <p className="promo">🎉 Base o app e ganhe R$ 10 na primeira corrida!</p>
      </div>
    </div>
  );
}