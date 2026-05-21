import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import SejaMotorista from './pages/SejaMotorista';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/seja-motorista" element={<SejaMotorista />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;