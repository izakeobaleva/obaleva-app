import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Entrar from './pages/Entrar';
import CadastroPassageiro from './pages/CadastroPassageiro';
import CadastroMotorista from './pages/CadastroMotorista';
import EsqueciSenha from './pages/EsqueciSenha';
import AtualizarSenha from './pages/AtualizarSenha';
import PainelPassageiro from './pages/PainelPassageiro';
import PainelMotorista from './pages/PainelMotorista';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Viagens from './pages/Viagens';
import DetalhesViagem from './pages/DetalhesViagem';
import Ganhos from './pages/Ganhos';
import PainelAdmin from './pages/PainelAdmin';
import NaoEncontrada from './pages/NaoEncontrada';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Entrar />} />
          <Route path="/register" element={<CadastroPassageiro />} />
          <Route path="/register-driver" element={<CadastroMotorista />} />
          <Route path="/forgot-password" element={<EsqueciSenha />} />
          <Route path="/update-password" element={<AtualizarSenha />} />
          <Route path="/passenger" element={<PainelPassageiro />} />
          <Route path="/driver" element={<PainelMotorista />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/trips" element={<Viagens />} />
          <Route path="/trips/:id" element={<DetalhesViagem />} />
          <Route path="/earnings" element={<Ganhos />} />
          <Route path="/admin" element={<PainelAdmin />} />
          <Route path="*" element={<NaoEncontrada />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;