import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Car, Smartphone, Shield, Star, ChevronRight, MapPin, Clock, Wallet } from 'lucide-react'

export const Index = () => {
  const navigate = useNavigate()

  const beneficios = [
    { icone: Shield, titulo: "Segurança", desc: "Motoristas verificados e corridas monitoradas em tempo real" },
    { icone: Clock, titulo: "Rapidez", desc: "Carro chegando em minutos. Sem filas, sem espera." },
    { icone: Wallet, titulo: "Preço Justo", desc: "Valor estimado antes da corrida. Sem surpresas." },
    { icone: Star, titulo: "Qualidade", desc: "Veículos confortáveis e motoristas profissionais" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
      {/* Header */}
      <header className="bg-[#1A1528]/80 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Car className="text-[#F4D03F] w-8 h-8" />
            <h1 className="text-2xl font-bold text-white">OBALEVA</h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/login')} 
              className="text-white hover:text-[#F4D03F] transition px-4 py-2"
            >
              Entrar
            </button>
            <button 
              onClick={() => navigate('/register')} 
              className="btn-amarelo px-6 py-2 rounded-2xl"
            >
              Cadastrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Sua mobilidade{' '}
              <span className="text-[#F4D03F]">premium</span>
            </h2>
            <p className="text-[#A0A0B0] text-lg mt-6 leading-relaxed">
              O OBALEVA conecta você a motoristas profissionais para viagens seguras, 
              confortáveis e com preço justo. Baixe o app e comece a usar.
            </p>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => navigate('/register')} 
                className="btn-amarelo px-8 py-4 rounded-2xl text-lg flex items-center gap-2"
              >
                Criar Conta <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => navigate('/register-driver')} 
                className="border border-white/20 text-white px-8 py-4 rounded-2xl text-lg hover:bg-white/5 transition"
              >
                Seja Motorista
              </button>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="bg-[#1A1528]/60 backdrop-blur-lg rounded-3xl border border-white/10 p-8 w-full max-w-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center">
                  <MapPin className="text-[#F4D03F]" size={24} />
                </div>
                <div>
                  <p className="text-white font-medium">Local atual</p>
                  <p className="text-sm text-[#A0A0B0]">Buscando motoristas...</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-[#0F0B1A] rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Car className="text-green-400" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-medium">Motorista próximo</p>
                      <p className="text-sm text-[#A0A0B0]">A 2 minutos de distância</p>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-[#F4D03F] text-sm">R$ 15,00 • Corrida estimada</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
          Por que escolher o <span className="text-[#F4D03F]">OBALEVA</span>?
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          {beneficios.map((beneficio, index) => (
            <div 
              key={index} 
              className="bg-[#1A1528]/60 backdrop-blur-lg rounded-3xl border border-white/10 p-6 hover:border-[#F4D03F]/50 transition group"
            >
              <div className="w-12 h-12 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#F4D03F]/30 transition">
                <beneficio.icone className="text-[#F4D03F]" size={24} />
              </div>
              <h4 className="text-white font-bold text-lg mb-2">{beneficio.titulo}</h4>
              <p className="text-[#A0A0B0] text-sm leading-relaxed">{beneficio.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-[#1A1528] to-[#F4D03F]/10 rounded-3xl border border-white/10 p-12">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Pronto para começar?
          </h3>
          <p className="text-[#A0A0B0] mb-8 max-w-md mx-auto">
            Cadastre-se agora e tenha mobilidade premium na palma da sua mão.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={() => navigate('/register')} 
              className="btn-amarelo px-8 py-4 rounded-2xl text-lg"
            >
              Cadastrar Passageiro
            </button>
            <button 
              onClick={() => navigate('/register-driver')} 
              className="border border-white/20 text-white px-8 py-4 rounded-2xl text-lg hover:bg-white/5 transition"
            >
              Cadastrar Motorista
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 p-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Car className="text-[#F4D03F] w-6 h-6" />
            <span className="text-white font-bold text-lg">OBALEVA</span>
          </div>
          <p className="text-[#A0A0B0] text-sm">
            © 2025 OBALEVA. Todos os direitos reservados. Mobilidade premium para você.
          </p>
        </div>
      </footer>
    </div>
  )
}