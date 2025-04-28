'use client'

import { useRouter } from 'next/navigation'
import { Map, PlusCircle, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HomePage() {
  const router = useRouter()

  return (
    <AnimatePresence mode="wait">
    <motion.div
      key="homepage"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col min-h-screen bg-background text-foreground"
    >
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 p-4">
      <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Bem-vindo de volta!</h1>

      <section className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <div className="text-xl font-semibold">8</div>
          <div className="text-muted">Rotas Salvas</div>
        </div>
        <div className="card p-4">
          <div className="text-xl font-semibold">215 km</div>
          <div className="text-muted">Distância Total</div>
        </div>
        <div className="card p-4">
          <div className="text-xl font-semibold">12h 45min</div>
          <div className="text-muted">Tempo Estimado</div>
        </div>
        <div className="card p-4">
          <div className="text-xl font-semibold">Speed</div>
          <div className="text-muted">Modalidade Mais Usada</div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Últimas Rotas</h2>
        {/* Aqui você mapeia e mostra 3 ou 5 últimas rotas */}
      </section>

      <section className="flex gap-4">
        <button className="btn-primary">Nova Rota</button>
        <button className="btn-secondary">Minhas Rotas</button>
      </section>
    </div>

      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/9 backdrop-blur-md border-border text-muted shadow-md">
        <div className="flex justify-between items-center px-16 py-2 text-sm">
          <button onClick={() => router.push('/saved-routes')} className="flex flex-col items-center">
            <Map size={24} />
            Rotas
          </button>

          <button
            onClick={() => router.push('/calculate')}
            className="bg-accent text-white rounded-full p-3 -mt-8 shadow-lg"
          >
            <PlusCircle size={32} />
          </button>

          <button onClick={() => router.push('/profile')} className="flex flex-col items-center">
            <User size={24} />
            Perfil
          </button>
        </div>
      </footer>
    </div>
    </motion.div>
    </AnimatePresence>
  )
}
