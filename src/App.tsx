import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Perfil from './pages/Perfil';
import Home from './pages/Home';
import MotoristaCadastro from './pages/MotoristaCadastro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/motorista-cadastro" element={<MotoristaCadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;