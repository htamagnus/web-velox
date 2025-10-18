'use client';

import { useTexts } from '@/helpers/use-texts';

export type FooterButtonConfig = {
  id: string;
  icon: React.ReactNode;
  labelKey: string;
  action: () => void;
  isCenter?: boolean;
  showGlow?: boolean;
};

type HomeFooterProps = {
  buttons: FooterButtonConfig[];
};

export default function HomeFooter({ buttons }: HomeFooterProps) {
  const { t } = useTexts('home');

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0e1a] via-[#111827] to-[#111827]/95 backdrop-blur-xl border-t border-white/10 shadow-2xl">
      <div className="flex justify-around items-end px-6 py-3 pb-4 max-w-2xl mx-auto relative">
        {buttons.map((btn) => (
          btn.isCenter ? (
            <button
              key={btn.id}
              onClick={btn.action}
              className="flex flex-col items-center gap-1.5 cursor-pointer -mt-10 transition-all duration-300 ease-out hover:scale-110 active:scale-95 group relative"
            >
              {btn.showGlow && (
                <>
                  <div className="absolute inset-0 bg-primary-light/30 blur-3xl rounded-full group-hover:bg-primary-light/50 transition-all animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary-light via-primary to-primary-dark p-1 rounded-[40px] shadow-2xl shadow-primary/50 group-hover:shadow-[0_0_40px_rgba(191,213,114,0.6)] transition-all border-primary-light/30 group-hover:border-primary-light/60">
                    {btn.icon}
                  </div>
                </>
              )}
              <span className="text-s font-bold text-white mt-1 drop-shadow-sm">{t(btn.labelKey)}</span>
            </button>
          ) : (
            <button
              key={btn.id}
              onClick={btn.action}
              className="flex flex-col items-center gap-1.5 cursor-pointer text-gray-400 transition-all duration-300 ease-out hover:text-primary-light active:scale-95 rounded-xl p-3 hover:bg-primary-light/10 group"
            >
              <span className="group-hover:scale-110 transition-transform flex items-center">
                {btn.icon}
              </span>
              <span className="text-xs font-semibold">{t(btn.labelKey)}</span>
            </button>
          )
        ))}
      </div>
    </footer>
  );
}
