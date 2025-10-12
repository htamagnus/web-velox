'use client';

import { ArrowLeft, LocateFixed, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTexts } from '@/helpers/use-texts';
import Button from '../ui/button/button';
import Loader from '../ui/loader/loader';
import SpeedOptions from '../speed-modal/speed-options';
import AutocompleteInput from '../route-input/route-input';

type Props = {
  originLabel: string | null;
  destinationLabel: string | null;
  onSetOrigin: (coords: [number, number], label: string) => void;
  onSetDestination: (coords: [number, number], label: string) => void;
  onStart: () => void;
  onCancel: () => void;
  onSelectModality: (modality: Modality, speed: number) => void;
  speeds: {
    general: number;
    road: number;
    mtb: number;
  };
  isCalculatingRoute: boolean;
};

export default function RoutePlannerPanel({
  originLabel,
  destinationLabel,
  onSetOrigin,
  onSetDestination,
  onStart,
  onCancel,
  onSelectModality,
  speeds,
  isCalculatingRoute,
}: Props) {
  const { t } = useTexts('plannerPanel');
  const router = useRouter();

  const canCalculate = originLabel && destinationLabel

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0e1a] via-[#111827] to-[#111827] px-4 pt-6 pb-6 rounded-t-3xl z-[9999] shadow-2xl border-t border-copy/10 space-y-5">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => router.push('/home')}
          className="text-copy/60 hover:text-copy flex items-center gap-2 transition-colors p-2 -m-2 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium hidden sm:inline">{t('backButton')}</span>
        </button>

        <div className="font-bold text-primary-light text-xl tracking-tight">{t('title')}</div>

        <button 
          onClick={onCancel} 
          className="text-copy/60 hover:text-copy transition-colors p-2 -m-2 rounded-lg hover:bg-white/5"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-3">
        <AutocompleteInput
          icon={<LocateFixed size={20} stroke="#92a848"/>}
          placeholder={t('originPlaceholder')}
          initialValue={originLabel ?? undefined}
          onSelect={onSetOrigin}
        />

        <AutocompleteInput
          icon={<Plus size={20} stroke="#92a848"/>}
          placeholder={t('destinationPlaceholder')}
          initialValue={destinationLabel ?? undefined}
          onSelect={onSetDestination}
        />
      </div>

      <SpeedOptions
        onSelect={onSelectModality}
        speeds={speeds}
      />

      <button
        onClick={onStart}
        disabled={!canCalculate || isCalculatingRoute}
        className="w-full group relative overflow-hidden bg-gradient-to-r from-[#92a848] to-[#a8b87a] hover:from-[#a8b87a] hover:to-[#92a848] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span className="relative z-10 flex items-center justify-center gap-2 text-base">
          {isCalculatingRoute ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              calculando rota...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {t('plan')}
            </>
          )}
        </span>
      </button>
    </div>
  );
}
