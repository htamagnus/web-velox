'use client';

import { motion } from 'framer-motion';
import { useTexts } from '@/helpers/use-texts';

export type CardConfig = {
  id: string;
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  colorClass: string;
  action: () => void;
  show?: boolean;
};

type HomeCardsProps = {
  cards: CardConfig[];
  loadingStrava: boolean;
};

export default function HomeCards({ cards, loadingStrava }: HomeCardsProps) {
  const { t } = useTexts('home');
  const visibleCards = cards.filter(card => card.show);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 gap-4"
    >
      {visibleCards.map((card) => (
        card.id === 'coming-soon' ? (
          <div key={card.id} className="bg-gradient-to-br from-[#1a2234] to-[#0f1419] border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
            <div className="text-3xl font-bold text-primary-light">
              {t(card.titleKey)}
            </div>
            <p className="text-copy-light text-xs">{t(card.descKey)}</p>
          </div>
        ) : (
          <button
            key={card.id}
            onClick={card.action}
            disabled={card.id === 'strava' && loadingStrava}
            className={`group bg-gradient-to-br ${card.colorClass} p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border`}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform ${
                card.id === 'new-route' ? 'bg-primary-light/20' :
                card.id === 'saved-routes' ? 'bg-blue-400/20' :
                card.id === 'profile' ? 'bg-purple-400/20' :
                'bg-orange-500/20'
              }`}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-white font-bold text-base">{t(card.titleKey)}</h3>
                <p className="text-copy-light text-xs mt-1">{t(card.descKey)}</p>
              </div>
            </div>
          </button>
        )
      ))}
    </motion.section>
  );
}
