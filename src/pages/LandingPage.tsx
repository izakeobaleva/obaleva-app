import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import { Car, Star, Shield, Clock, Smartphone, Users, ArrowRight, CheckCircle, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LandingContent {
  title: string
  subtitle: string
  ctaText: string
  appUrl: string
  logoUrl?: string
}

export default function LandingPage() {
  const [content, setContent] = useState<LandingContent>({
    title: 'Mobilidade premium para sua cidade',
    subtitle: 'Corridas rápidas, motoristas confiáveis e um app que se adapta a você.',
    ctaText: 'Baixar APK',
    appUrl: 'https://obaleva-oficial.vercel.app',
  })
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [])

  async function loadContent() {
    const { data: titleData } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'landing_title')
      .maybeSingle()
    
    const { data: subtitleData } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'landing_subtitle')
      .maybeSingle()
    
    const { data: ctaData } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'landing_cta_text')
      .maybeSingle()
    
    const { data: appUrlData } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'landing_app_url')
      .maybeSingle()
    
    const { data: logoData } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'app_logo')
      .maybeSingle()

    setContent({
      title: titleData?.value || content.title,
      subtitle: subtitleData?.value || content.subtitle,
      ctaText: ctaData?.value || content.ctaText,
      appUrl: appUrlData?.value || content.appUrl,
    })
    if (logoData?.value) setLogoUrl(logoData.value)
    setLoading(false)
  }

  const features = [
    { icon: Clock, title: 'Corridas Rápidas', desc: 'Motoristas próximos para te buscar em minutos' },
    { icon: Shield, title: 'Segurança Total', desc: 'Viagens monitoradas e motoristas verificados' },
    { icon: Star, title: 'Qualidade Premium', desc: 'Veículos confortáveis e bem avaliados' },
    { icon: Smartphone, title: 'App Completo', desc: 'Solicite, acompanhe e pague pelo celular' },
  ]

  const stats = [
    { value: '500+', label: 'Motoristas' },
    { value: '10k+', label: 'Corridas' },
    { value: '4.8', label: 'Avaliação' },
    { value: '50+', label: 'Cidades' },
  ]

  const howItWorks = [
    { step: '01', title: 'Baixe o App', desc: 'Disponível para Android e iOS' },
    { step: '02', title: 'Solicite sua Corrida', desc: 'Informe seu destino e escolha o veículo' },
    { step: '03', title: 'Viaje com Conforto', desc: 'Acompanhe o trajeto em tempo real' },
    { step: '04', title: 'Avalie e Pronto', desc: 'Pagamento fácil e avaliação rápida' },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0B1A]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="ObaLeve" className="h-8 w-auto" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-xl flex items-center justify-center">
                <Car size={22} className="text-[#1E1E2F]" />
              </div>
            )}
            <span className="text-white font-bold text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ObaLeve</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-[#A0A0B0] hover:text-white transition text-sm font-medium">
              Entrar
            </Link>
            <Link to="/register" className="btn-premium px-5 py-2 text-sm">
              Criar Conta
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#F4D03F]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-[-100px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#F4D03F]/10 border border-[#F4D03F]/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#F4D03F] rounded-full animate-pulse" />
              <span className="text-[#F4D03F] text-xs font-medium">Disponível na sua cidade</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
              {content.title}
            </h1>
            
            <p className="text-lg text-[#A0A0B0] max-w-2xl mx-auto mb-8">
              {content.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/apk/obaleve.apk"
                download
                className="btn-premium px-8 py-4 text-base font-bold flex items-center gap-2"
              >
                <Smartphone size={20} />
                {content.ctaText}
              </a>
              <Link
                to="/register"
                className="bg-[#1A1528] border border-white/20 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-white/5 transition-all flex items-center gap-2"
              >
                Criar Conta Grátis
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-[#F4D03F]">{stat.value}</p>
                <p className="text-sm text-[#A0A0B0] mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
              Por que escolher o ObaLeve?
            </h2>
            <p className="text-[#A0A0B0] max-w-xl mx-auto">
              Oferecemos a melhor experiência de mobilidade urbana com qualidade e segurança.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1A1528] rounded-2xl p-6 border border-white/10 hover:border-[#F4D03F]/30 transition-all"
              >
                <div className="w-12 h-12 bg-[#F4D03F]/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon size={24} className="text-[#F4D03F]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[#A0A0B0]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-[#1A1528]/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
              Como funciona
            </h2>
            <p className="text-[#A0A0B0] max-w-xl mx-auto">
              Em apenas 4 passos você já pode começar a usar.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-[#1A1528] rounded-2xl p-6 border border-white/10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-[#1E1E2F] font-bold text-lg">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#A0A0B0]">{item.desc}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3">
                    <ChevronRight size={20} className="text-[#F4D03F]/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
              O que nossos usuários dizem
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Ana Silva', text: 'O melhor app de mobilidade que já usei. Motoristas sempre pontuais e educados.', rating: 5 },
              { name: 'Carlos Oliveira', text: 'Segurança em primeiro lugar. Recomendo para toda a família.', rating: 5 },
              { name: 'Marina Costa', text: 'Preço justo e corridas rápidas. Uso todos os dias para ir ao trabalho.', rating: 5 },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1A1528] rounded-2xl p-6 border border-white/10"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="#F4D03F" stroke="#F4D03F" />
                  ))}
                </div>
                <p className="text-[#A0A0B0] text-sm mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-[#1E1E2F] font-bold text-sm">{testimonial.name.charAt(0)}</span>
                  </div>
                  <span className="text-white font-medium text-sm">{testimonial.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center bg-gradient-to-br from-[#1A1528] to-[#2A1A3E] rounded-3xl p-12 border border-white/10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Pronto para começar?
          </h2>
          <p className="text-[#A0A0B0] max-w-md mx-auto mb-8">
            Baixe o app agora e tenha mobilidade premium na palma da sua mão.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/apk/obaleve.apk"
              download
              className="btn-premium px-8 py-4 text-base font-bold flex items-center justify-center gap-2"
            >
              <Smartphone size={20} />
              {content.ctaText}
            </a>
            <Link
              to="/register"
              className="bg-[#1A1528] border border-white/20 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-white/5 transition-all"
            >
              Criar Conta Grátis
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img src={logoUrl} alt="ObaLeve" className="h-6 w-auto" />
            ) : (
              <Car size={20} className="text-[#F4D03F]" />
            )}
            <span className="text-white font-semibold">ObaLeve</span>
          </div>
          <p className="text-[#A0A0B0] text-sm">
            © 2025 ObaLeve. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}