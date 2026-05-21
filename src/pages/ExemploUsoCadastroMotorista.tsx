import React, { useState } from 'react';
import CadastroMotorista from './CadastroMotorista';

export function ExemploUso() {
  const [mostrarCadastro, setMostrarCadastro] = useState(false);

  return (
    <div>
      <button 
        onClick={() => setMostrarCadastro(true)}
        style={{
          padding: '12px 24px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        🚛 Quero ser Motorista
      </button>

      {mostrarCadastro && (
        <CadastroMotorista 
          onFechar={() => setMostrarCadastro(false)} 
        />
      )}
    </div>
  );
}