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
          <main className="flex-1 p-4 pb-24">
            <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 pt-4"
              >
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
                  <p className="text-copy-light text-sm mt-1">{t('subtitle') || 'planeje suas rotas de bike com precisão'}</p>
                </div>
              </motion.div>

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                <button
                  onClick={() => router.push('/calculate')}
                  className="group bg-gradient-to-br from-primary-light/20 via-primary/10 to-primary-dark/20 hover:from-primary-light/30 hover:via-primary/20 hover:to-primary-dark/30 border border-primary-light/30 hover:border-primary-light/50 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-primary-light/20 rounded-xl group-hover:scale-110 transition-transform">
                      <PlusCircle size={32} className="text-primary-light" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">{t('newRoute') || 'nova rota'}</h3>
                      <p className="text-copy-light text-xs mt-1">{t('newRouteDesc') || 'planeje seu percurso'}</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/saved-routes')}
                  className="group bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-blue-700/10 hover:from-blue-500/20 hover:via-blue-600/10 hover:to-blue-700/20 border border-blue-400/30 hover:border-blue-400/50 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-blue-400/20 rounded-xl group-hover:scale-110 transition-transform">
                      <Map size={32} className="text-blue-400" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">{t('myRoutes') || 'minhas rotas'}</h3>
                      <p className="text-copy-light text-xs mt-1">{t('myRoutesDesc') || 'veja rotas salvas'}</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/profile')}
                  className="group bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-purple-700/10 hover:from-purple-500/20 hover:via-purple-600/10 hover:to-purple-700/20 border border-purple-400/30 hover:border-purple-400/50 p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 bg-purple-400/20 rounded-xl group-hover:scale-110 transition-transform">
                      <User size={32} className="text-purple-400" strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base">{t('profile') || 'perfil'}</h3>
                      <p className="text-copy-light text-xs mt-1">{t('profileDesc') || 'edite suas informações'}</p>
                    </div>
                  </div>
                </button>

                <div className="bg-gradient-to-br from-[#1a2234] to-[#0f1419] border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                  <div className="text-3xl font-bold text-primary-light">
                    {t('comingSoon') || 'em breve'}
                  </div>
                  <p className="text-copy-light text-xs">{t('comingSoonDesc') || 'novidades chegando'}</p>
                </div>
              </motion.section>
            </div>
          </main>

          <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0e1a] via-[#111827] to-[#111827]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
            <div className="flex justify-around items-end px-6 py-3 pb-4 max-w-2xl mx-auto relative">
              <button
                onClick={() => router.push('/saved-routes')}
                className="flex flex-col items-center gap-1.5 cursor-pointer text-gray-400 transition-all duration-300 ease-out hover:text-primary-light active:scale-95 rounded-xl p-3 hover:bg-primary-light/10 group"
              >
                <Map size={26} className="group-hover:scale-110 transition-transform" strokeWidth={2} />
                <span className="text-xs font-semibold">{t('footer.routes')}</span>
              </button>

              <button
                onClick={() => router.push('/calculate')}
                className="flex flex-col items-center gap-1.5 cursor-pointer -mt-10 transition-all duration-300 ease-out hover:scale-110 active:scale-95 group relative"
              >
                <div className="absolute inset-0 bg-primary-light/30 blur-3xl rounded-full group-hover:bg-primary-light/50 transition-all animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-primary-light via-primary to-primary-dark p-5 rounded-[20px] shadow-2xl shadow-primary/50 group-hover:shadow-[0_0_40px_rgba(191,213,114,0.6)] transition-all border-primary-light/30 group-hover:border-primary-light/60">
                  <PlusCircle size={56} className="text-primary-content " strokeWidth={2.5} />
                </div>
                <span className="text-s font-bold text-white mt-1 drop-shadow-sm">{t('footer.createRoute')}</span>
              </button>

              <button
                onClick={() => router.push('/profile')}
                className="flex flex-col items-center gap-1.5 cursor-pointer text-gray-400 transition-all duration-300 ease-out hover:text-primary-light active:scale-95 rounded-xl p-3 hover:bg-primary-light/10 group"
              >
                <User size={26} className="group-hover:scale-110 transition-transform" strokeWidth={2} />
                <span className="text-xs font-semibold">{t('footer.profile')}</span>
              </button>
            </div>
          </footer>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
