'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import { motion, MotionConfig } from 'framer-motion';
import { Bookmark, House, Route, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import ApiVeloxService from '@/providers/api-velox.provider';
import { Athlete } from '@/interfaces/athlete.interface';
import { SavedRoute } from '@/interfaces/routes.interface';
import { useProtectedRoute } from '@/hooks/use-protected-route';
import { useTexts } from '@/helpers/use-texts';
import { archivo } from '@/app/fonts';
import { SPRING } from './motion';

type AppData = {
  api: ApiVeloxService;
  athlete: Athlete | null;
  routes: SavedRoute[] | null;
  setAthlete: Dispatch<SetStateAction<Athlete | null>>;
  setRoutes: Dispatch<SetStateAction<SavedRoute[] | null>>;
  refreshRoutes: () => Promise<void>;
};

const AppDataContext = createContext<AppData | null>(null);

export function useAppData() {
  const data = useContext(AppDataContext);
  if (!data) throw new Error('useAppData fora do AppShell');
  return data;
}

const TABS = [
  { href: '/home', key: 'home', Icon: House },
  { href: '/calculate', key: 'plan', Icon: Route },
  { href: '/saved-routes', key: 'routes', Icon: Bookmark },
  { href: '/profile', key: 'profile', Icon: UserRound },
] as const;

// o shell fica montado entre as abas: a barra não pisca, a pílula desliza e o perfil e as rotas chegam uma vez só
export default function AppShell({ children }: { children: ReactNode }) {
  useProtectedRoute();
  const { t } = useTexts('app');
  const { t: tApp } = useTexts();
  const pathname = usePathname();
  const api = useMemo(() => new ApiVeloxService(), []);
  const [athlete, setAthlete] = useState<Athlete | null>(null);
  const [routes, setRoutes] = useState<SavedRoute[] | null>(null);
  // o texto do erro segue o idioma sem refazer a busca quando o idioma muda
  const tRef = useRef(tApp);
  tRef.current = tApp;

  const refreshRoutes = useCallback(() => api.getSavedRoutes().then(setRoutes), [api]);

  useEffect(() => {
    api.getProfile().then(setAthlete, () => toast.error(tRef.current('profile.errors.loadError')));
    api.getSavedRoutes().then(setRoutes, () => {
      setRoutes([]);
      toast.error(tRef.current('savedRoutes.error'));
    });
  }, [api]);

  return (
    <AppDataContext.Provider value={{ api, athlete, routes, setAthlete, setRoutes, refreshRoutes }}>
      <MotionConfig reducedMotion="user">
        <div className={`landing app ${archivo.variable}`}>
          <nav className="tabs" aria-label={t('nav')}>
            <Link href="/home" className="tabs__brand" aria-label="Velox">
              <Image src="/svg/velox-logo.svg" alt="" width={52} height={36} />
            </Link>
            {TABS.map(({ href, key, Icon }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href} className="tabs__item" aria-current={active ? 'page' : undefined}>
                  {active && <motion.span layoutId="tabs-pill" className="tabs__pill" transition={SPRING} />}
                  <motion.span className="tabs__icon" whileTap={{ scale: 0.82 }} transition={SPRING}>
                    <Icon size={22} strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />
                  </motion.span>
                  <span className="tabs__label">{t(`tabs.${key}`)}</span>
                </Link>
              );
            })}
          </nav>
          <div className="app__view">{children}</div>
        </div>
      </MotionConfig>
    </AppDataContext.Provider>
  );
}
