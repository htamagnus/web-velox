'use client'

import { useRouter } from 'next/navigation'
import { Map, PlusCircle, User } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-4">Bem-vindo de volta! 👋</h1>
        <p className="text-muted">Aqui é onde vai o conteúdo principal da home.</p>
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
  )
}
