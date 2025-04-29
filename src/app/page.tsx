'use client'

import LogoVelox from '@/components/ui/logo-velox/logo-velox'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay'
import { Bike, LineChart, Flame, MountainSnow, ArrowRight } from 'lucide-react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'


export default function LandingPage() {
  const [loading, setLoading] = useState(false)
  const [showTransition, setShowTransition] = useState(false)
  const router = useRouter()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = (e.clientX / window.innerWidth - 0.5) * 20
      const offsetY = (e.clientY / window.innerHeight - 0.5) * 20
      x.set(offsetX)
      y.set(offsetY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])
  
  const springX = useSpring(x, { stiffness: 50, damping: 10 })
  const springY = useSpring(y, { stiffness: 50, damping: 10 })

  const handleStart = () => {
    setShowTransition(true)
    setLoading(true)
    setTimeout(() => {
      router.push('/register')
    }, 600)
  }

  return (
    <>
    <PageTransitionOverlay visible={showTransition} />
        <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start">
          {/* HERO */}
          <section className="relative w-full min-h-[80vh] flex items-center justify-center text-center text-foreground">
      {/* BACKGROUND IMAGE */}
      {/* <div className="absolute inset-0 z-0">
      <motion.img
      src="/images/hero-bike.jpg"
      alt="Ciclista em movimento"
      initial={{ scale: 1 }}
      animate={{ scale: 1.00 }}
      transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
      className="w-full h-full object-cover opacity-60"
    />

        <div className="absolute inset-0 bg-background/80" />
      </div> */}
      <div className="absolute inset-0 z-0 overflow-hidden">
    <motion.img
      src="/images/hero-bike.jpg"
      alt="Ciclista em movimento"
      style={{
        x: springX,
        y: springY,
        scale: 1.05
      }}
      initial={{ scale: 1 }}
      animate={{ scale: 1.05 }}
      transition={{
        duration: 20,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror'
      }}
      className="w-full h-full object-cover opacity-60"
    />
    <div className="absolute inset-0 bg-background/80" />
  </div>

      {/* HERO CONTENT */}
      <div className="relative z-10 flex flex-col items-center space-y-6 max-w-3xl px-4">
        <LogoVelox className="mb-6" />

        <motion.h1 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          Pedale no seu ritmo.<br />
          Planeje com precisão.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-lg md:text-xl max-w-2xl"
        >
          O Velox calcula a previsão de percurso com base na sua velocidade real, no seu terreno e no seu esforço — não numa média genérica.
        </motion.p>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          disabled={loading}
          transition={{ duration: 0.2 }}
          className="mt-8 px-8 py-4 rounded-full text-lg font-bold text-black bg-lime-400 hover:brightness-110 active:scale-95 shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-t-transparent border-black rounded-full animate-spin" />
          ) : (
            <>Começar <ArrowRight className="w-5 h-5" /></>
          )}
        </motion.button>
      </div>
    </section>

    <section className="w-full py-32 px-6 bg-gradient-to-b from-red-900/20 via-background via-emerald-900/10 to-background backdrop-blur-md">
    <div className="max-w-2xl mx-auto flex flex-col items-center text-center space-y-24">
      
      {/* BLOCO PROBLEMA */}
      <div className="w-full flex flex-col items-center space-y-6">
        <motion.h2 className="text-3xl md:text-4xl font-bold">
          A previsão te <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 animate-pulse"> deixou na mão? </span>
        </motion.h2>
        <motion.div className="flex gap-6 items-center text-4xl md:text-5xl font-bold leading-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 animate-pulse align-middle">
            2h10
          </span>
          <ArrowRight className="w-7 h-7 text-foreground translate-y-[2px]" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-green-500 animate-pulse align-middle">
            1h20
          </span>
        </motion.div>
        <motion.p className="text-muted-foreground text-lg">
          O Google estimou mais de 2 horas para 30km.<br />
          Na prática? 1h20 — sem erro de cálculo.
        </motion.p>
      </div>

      {/* BLOCO SOLUÇÃO */}
      <div className="space-y-6">
        <Flame className="w-10 h-10 text-lime-400 mx-auto" />
        <motion.h2 className="text-3xl md:text-4xl font-bold">
          Com o Velox, a previsão é <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 to-green-500 animate-pulse">a sua realidade.</span>
        </motion.h2>
        <motion.p className="text-muted-foreground text-lg">
          Integre seu Strava, selecione sua modalidade (MTB, Speed) e receba estimativas baseadas nos seus dados reais de treino.
        </motion.p>
        <div className="text-sm text-muted-foreground">
          Precisão validada em treinos reais
        </div>
      </div>

    </div>
  </section>

    {/* FEATURES */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 max-w-4xl px-6 mx-auto">
    {[
        { icon: LineChart, title: "Previsão Real", desc: "Calcule o tempo com base na sua velocidade média, não em médias genéricas." },
        { icon: Bike, title: "Modalidade Adaptada", desc: "Escolha entre MTB, Speed ou urbano para previsões ainda mais precisas." },
        { icon: Flame, title: "Integração Strava", desc: "Importe automaticamente sua velocidade real do Strava." },
        { icon: MountainSnow, title: "Calorias e Altimetria", desc: "Veja calorias gastas e ganho de elevação em cada trajeto." },
      ].map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03, rotate: 0.2 }}
          transition={{ type: 'spring', stiffness: 120 }}
          viewport={{ once: true }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_4px_20px_rgba(0,255,150,0.05)] transition-all"
        >
          <div className="flex items-center gap-2 mb-2">
            <feature.icon className="w-6 h-6" stroke="var(--primary)"/>
            <h3 className="text-xl font-bold">{feature.title}</h3>
          </div>
          <p className="text-muted">{feature.desc}</p>
        </motion.div>
      ))}
    </section>

    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center text-center text-foreground overflow-hidden pt-23">
  {/* BACKGROUND IMAGE */}
  <div className="absolute inset-0 z-0 overflow-hidden pt-32">
    <motion.img
      src="/images/cta-bike.jpg"
      alt="Ciclista em movimento"
      initial={{ scale: 1 }}
      animate={{ scale: 1.05 }}
      transition={{
        duration: 20,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatType: 'mirror'
      }}
      className="w-full h-full object-cover object-[50%_30%] opacity-40 grayscale"


    />
    <div className="absolute inset-0 bg-background/80" />
  </div>

  {/* CTA CONTENT */}
  <div className="relative z-10 flex flex-col items-center space-y-6 max-w-2xl px-6">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-lime-300 to-green-500 text-transparent bg-clip-text"
    >
      Chegou a hora de pedalar com inteligência
    </motion.h2>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      className="text-lg md:text-xl text-muted-foreground"
    >
      Seu treino merece mais do que um palpite. Ganhe controle sobre cada percurso.
    </motion.p>

    <motion.button
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="mt-6 px-10 py-5 bg-lime-400 text-black rounded-full text-lg font-bold shadow-[0_8px_30px_rgba(163,230,53,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
    >
      Criar Conta Agora <ArrowRight className="w-5 h-5" />
    </motion.button>
    <LogoVelox className="mt-10 w-30" />
  </div>
</section>
    </main>
    </>
  )
}
