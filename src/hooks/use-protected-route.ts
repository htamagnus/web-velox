'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

type UseProtectedRouteOptions = {
  requireOnboarding?: boolean; // padrão: true
};

/**
 * redireciona automaticamente usuários não autenticados ou que não completaram o onboarding
 */
export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const { requireOnboarding = true } = options;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (requireOnboarding && !user?.hasCompletedOnboarding) {
      router.replace('/onboarding');
    }
  }, [isAuthenticated, user, requireOnboarding, router]);
}
