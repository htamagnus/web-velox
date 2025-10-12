'use client';

import { ArrowLeft, LocateFixed, Plus, Route, Loader2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTexts } from '@/helpers/use-texts';
import SpeedOptions from '../speed-modal/speed-options';
import AutocompleteInput from '../route-input/route-input';

type Props = {
  originLabel: string | null;
  destinationLabel: string | null;
  onSetOrigin: (coords: [number, number], label: string) => void;
  onSetDestination: (coords: [number, number], label: string) => void;
  onStart: () => void;
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
  onSelectModality,
  speeds,
  isCalculatingRoute,
}: Props) {
  const { t } = useTexts('plannerPanel');
  const router = useRouter();

  const canCalculate = originLabel && destinationLabel

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a0e1a] via-[#111827] to-[#111827] px-4 pt-6 pb-6 rounded-t-3xl z-[9999] shadow-2xl border-t border-copy/10 space-y-5">
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => router.push('/home')}
          className="text-copy-lighter hover:text-copy flex items-center gap-2 transition-all duration-300 ease-out p-3 -m-2 rounded-xl hover:bg-white/10 hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-light/10 to-primary/10">
          <Route size={20} className="text-primary-light" />
          <h2 className="font-bold text-gray-100 text-xl tracking-tight">
            {t('title')}
          </h2>
        </div>

        <div className="w-20"></div>
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
              <Loader2 size={20} className="animate-spin" />
              {t('planning')}
            </>
          ) : (
            <>
              <Clock size={20} strokeWidth={2.5} />
              {t('plan')}
            </>
          )}
        </span>
      </button>
    </div>
  );
}
