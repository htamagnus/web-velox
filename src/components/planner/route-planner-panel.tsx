'use client';

import { ArrowLeft, LocateFixed, Plus, Route } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTexts } from '@/helpers/use-texts';
import SpeedOptions from '../speed-modal/speed-options';
import AutocompleteInput from '../route-input/route-input';
import { useEffect, useState } from 'react';
import Button from '@/components/ui/button/button';

type Props = {
  originLabel: string | null;
  destinationLabel: string | null;
  onSetOrigin: (coords: [number, number], label: string) => void;
  onSetDestination: (coords: [number, number], label: string) => void;
  onClearOrigin?: () => void;
  onClearDestination?: () => void;
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
  onClearOrigin,
  onClearDestination,
  onStart,
  onSelectModality,
  speeds,
  isCalculatingRoute,
}: Props) {
  const { t } = useTexts('plannerPanel');
  const router = useRouter();

  const [modalitySelected, setModalitySelected] = useState(false);

  const canCalculate = Boolean(originLabel && destinationLabel && modalitySelected);

  useEffect(() => {
    if (!modalitySelected && speeds.general && speeds.general > 0) {
      setModalitySelected(true);
      onSelectModality('general', speeds.general);
    }
  }, [modalitySelected, speeds.general]);

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
          onClear={onClearOrigin}
        />

        <AutocompleteInput
          icon={<Plus size={20} stroke="#92a848"/>}
          placeholder={t('destinationPlaceholder')}
          initialValue={destinationLabel ?? undefined}
          onSelect={onSetDestination}
          onClear={onClearDestination}
        />
      </div>

      <SpeedOptions
        onSelect={(modality, speed) => {
          setModalitySelected(true);
          onSelectModality(modality, speed);
        }}
        speeds={speeds}
      />

      <Button
        variant="confirm"
        onClick={onStart}
        disabled={!canCalculate || isCalculatingRoute}
        loading={isCalculatingRoute}
        className="w-full"
      >
        {t('plan')}
      </Button>
    </div>
  );
}
