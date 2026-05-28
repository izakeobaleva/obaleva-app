"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();

  const loginGratis = () => {
    navigate('/permission-location');
  };

  return (
    <div className="login-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="login-inner"
      >
        <div className="text-center mb-8">
          <div className="logo-icon" style={{ margin: '0 auto 32px', width: 120, height: 120 }}>
            <img src="/icon-192x192.png" alt="ObaLeva" style={{ width: '100%', height: '100%', borderRadius: 24 }} />
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 'bold', marginBottom: 8, color: '#F4D03F' }}>ObaLeva</h1>
          <p style={{ fontSize: 18, color: '#A0A0B0' }}>Sua corrida, do seu jeito</p>
        </div>

        <input type="email" placeholder="E-mail" />
        <input type="password" placeholder="Senha" />

        <button onClick={loginGratis}>🔐 Entrar</button>
        <button className="google-btn">🔗 Entrar com Google</button>

        <p className="signup-link" onClick={() => navigate('/register')}>Não tem conta? Cadastre-se</p>
        <p className="forgot-link">Esqueci minha senha</p>
      </motion.div>

      <p className="footer">ObaLeva © 2025</p>
    </div>
  );
}