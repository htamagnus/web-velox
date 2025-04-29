'use client'

import { motion } from 'framer-motion'
import LogoVelox from '@/components/ui/logo-velox/logo-velox'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-start px-6">
      {/* HERO */}
      <section className="flex flex-col items-center text-center mt-20 space-y-6 max-w-3xl">
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
          className="text-muted text-lg md:text-xl max-w-2xl mt-4"
        >
          O Velox calcula a previsão de percurso com base na sua velocidade real, no seu terreno e no seu esforço — não numa média genérica.
        </motion.p>

        <Link href="/register">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mt-8 px-8 py-4 bg-primary text-background rounded-full text-lg font-semibold shadow-md hover:brightness-110 active:scale-95"
          >
            Começar 🚴‍♂️
          </motion.button>
        </Link>
      </section>
      {/* PROBLEMA */}
      <section className="flex flex-col items-center text-center mt-32 space-y-6 max-w-2xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold"
        >
          A previsão estava errada...
        </motion.h2>

        <motion.div 
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="flex gap-6 items-center text-4xl md:text-5xl font-bold"
        >
          <span className="text-red-500">2h10</span>
          <span>➔</span>
          <span className="text-green-500">1h20</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-muted text-lg mt-4"
        >
          O Google estimou mais de 2 horas para 30km.<br />
          Na prática? 1 hora e 20 minutos.
        </motion.p>
      </section>

    {/* SOLUÇÃO */}
    <section className="flex flex-col items-center text-center mt-32 space-y-6 max-w-2xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold"
      >
        Com o Velox, a previsão é a sua realidade.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-muted text-lg mt-4"
      >
        Integre seu Strava, selecione sua modalidade (MTB, Speed) e receba estimativas de tempo baseadas nos seus dados reais de treino, não em médias genéricas.
      </motion.p>
    </section>
    {/* FEATURES */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-32 max-w-4xl">
      {[
        { title: "Previsão Real", desc: "Calcule o tempo com base na sua velocidade média, não em médias genéricas." },
        { title: "Modalidade Adaptada", desc: "Escolha entre MTB, Speed ou urbano para previsões ainda mais precisas." },
        { title: "Integração Strava", desc: "Importe automaticamente sua velocidade real do Strava." },
        { title: "Calorias e Altimetria", desc: "Veja calorias gastas e ganho de elevação em cada trajeto." },
      ].map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-muted/10 border border-muted/20 hover:shadow-lg transition-all"
        >
          <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
          <p className="text-muted">{feature.desc}</p>
        </motion.div>
      ))}
    </section>

    {/* CTA FINAL */}
    <section className="flex flex-col items-center text-center mt-40 mb-20 space-y-6 max-w-2xl">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold"
      >
        Pronto para pedalar com precisão?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-muted text-lg mt-4"
      >
        Comece agora e planeje seus treinos como nunca antes.
      </motion.p>

      <Link href="/register">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="mt-8 px-10 py-5 bg-primary text-background rounded-full text-lg font-semibold shadow-lg hover:brightness-110 active:scale-95"
        >
          Criar Conta 🚴‍♂️
        </motion.button>
      </Link>
    </section>

    </main>
  )
}
