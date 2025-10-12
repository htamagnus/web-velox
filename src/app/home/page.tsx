'use client';

import { useRouter } from 'next/navigation';
import { Map, PlusCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useTexts } from '@/helpers/use-texts';

export default function HomePage() {
  useProtectedRoute()
  const router = useRouter();
  const { t } = useTexts('home');

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="homepage"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col min-h-screen bg-background"
      >
        <div className="flex flex-col min-h-screen bg-background">
          <main className="flex-1 p-4">
            <div className="space-y-6 p-6 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold">{t('title')}</h1>

              {/* <section className="grid grid-cols-2 gap-4">
                <div className="card p-4">
                  <div className="text-xl font-semibold">8</div>
                  <div>Rotas Salvas</div>
                </div>
                <div className="card p-4">
                  <div className="text-xl font-semibold">215 km</div>
                  <div>Distância Total</div>
                </div>
                <div className="card p-4">
                  <div className="text-xl font-semibold">12h 45min</div>
                  <div>Tempo Estimado</div>
                </div>
                <div className="card p-4">
                  <div className="text-xl font-semibold">Speed</div>
                  <div>Modalidade Mais Usada</div>
                </div>
              </section> */}

              <section className="space-y-4">
                <h2 className="text-2xl font-bold">{t('lastRoutes')}</h2>
                {/* Aqui você mapeia e mostra 3 ou 5 últimas rotas */}
              </section>

              <section className="flex gap-4">
                <button className="btn-primary">{t('newRoute')}</button>
                <button className="btn-secondary">{t('myRoutes')}</button>
              </section>
            </div>
          </main>

          <footer className="fixed bottom-0 left-0 right-0 bg-white/9 backdrop-blur-md border-border shadow-md">
            <div className="flex justify-between items-center px-16 py-2 text-sm">
              <button
                onClick={() => router.push('/saved-routes')}
                className="flex flex-col items-center cursor-pointer text-copy-light"
              >
                <Map size={28} stroke="#bfd572" />
                {t('footer.routes')}
              </button>

              <button
                onClick={() => router.push('/calculate')}
                className="flex flex-col items-center cursor-pointer text-copy-light p-1 -mt-6"
              >
                <PlusCircle size={40} stroke="#bfd572" />
                {t('footer.createRoute')}
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="flex flex-col items-center cursor-pointer text-copy-light"
              >
                <User size={28} stroke="#bfd572" />
                {t('footer.profile')}
              </button>
            </div>
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
