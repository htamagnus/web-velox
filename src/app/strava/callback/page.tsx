'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ApiVeloxService from '@/providers/api-velox.provider';
import { toast } from 'sonner';
import PageTransitionOverlay from '@/components/ui/page-transition/page-transition-overlay';
import { ApiError } from '@/errors/api-errors';

export default function StravaCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchSpeed = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) return;

      if (sessionStorage.getItem('velox_strava_used') === 'true') return; // resolve bug de redirecionar mais de uma vez (chamava a api 2 vezes)

      sessionStorage.setItem('velox_strava_used', 'true');
      window.history.replaceState({}, document.title, window.location.pathname);

      try {
        const api = new ApiVeloxService();
        const result = await api.getStravaAverageSpeed(code);

        const avg = Math.round(result.averageSpeedGeneral);

        // salva no sessionStorage para manter o dado mesmo com SPA routing
        sessionStorage.setItem('velox_avg_speed', avg.toString());

        // garantir que voltará pro step certo (índice 3)
        sessionStorage.setItem('velox_current_step', '3');

        toast.success(`Velocidade média importada: ${avg} km/h`);
        router.push('/onboarding');
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.code === 'STRAVA_ID_ALREADY_EXISTS') {
            toast.warning('Este Strava já foi vinculado a outra conta.');
          } else {
            toast.error('Erro ao conectar com o Strava. Tente novamente mais tarde.');
          }
        } else {
          toast.error('Erro desconhecido. Tente novamente.');
        }
        router.push('/onboarding');
      }
    };

    fetchSpeed();
  }, [router]);

  return (
    <PageTransitionOverlay
      visible={true}
      message="Conectando com o Strava e buscando sua velocidade média...segura firme!"
    />
  );
}
