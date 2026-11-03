'use client';

import { useTexts } from '@/helpers/use-texts';

// enquanto os dados chegam: o desenho da tela piscando no lugar, com a barra de abas já de pé
export default function Skeleton({ rows = 3, hero = true }: { rows?: number; hero?: boolean }) {
  const { t } = useTexts('app');
  return (
    <div className="skel" role="status">
      <span className="visually-hidden">{t('loading')}</span>
      <span className="skel__block skel__block--title" />
      {hero && <span className="skel__block skel__block--hero" />}
      {Array.from({ length: rows }, (_, i) => (
        <span key={i} className="skel__block" style={{ animationDelay: `${i * 90}ms` }} />
      ))}
    </div>
  );
}
