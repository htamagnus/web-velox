'use client';

import { ArrowLeft, LocateFixed, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTexts } from '@/helpers/use-texts';
import Button from '../ui/button/button';
import Loader from '../ui/loader/loader';
import SpeedOptions from '../speed-modal/speed-options';
import RouteInput from '../route-input/route-input';

type Props = {
  origin: [number, number] | null;
  originLabel: string | null;
  destination: [number, number] | null;
  destinationLabel: string | null;
  onSetOrigin: (coords: [number, number], label: string) => void;
  onSetDestination: (coords: [number, number], label: string) => void;
  onStart: () => void;
  onCancel: () => void;
  showSpeedOptions: boolean;
  onCloseSpeedOptions: () => void;
  onSelectModality: (modality: Modality, speed: number) => void;
  speeds: {
    general: number;
    road: number;
    mtb: number;
  };
  isCalculatingRoute: boolean;
};

export default function RoutePlannerPanel({
  origin,
  originLabel,
  destination,
  destinationLabel,
  onSetOrigin,
  onSetDestination,
  onStart,
  onCancel,
  showSpeedOptions,
  onCloseSpeedOptions,
  onSelectModality,
  speeds,
  isCalculatingRoute,
}: Props) {
  const { t } = useTexts('plannerPanel');
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background px-4 pt-4 pb-6 rounded-t-2xl z-[9999] shadow-2xl space-y-4">
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push('/home')}
          className="text-gray-400 hover:text-white flex items-center gap-1"
        >
          <ArrowLeft size={18} />
          <span className="text-sm hidden sm:inline">{t('backButton')}</span>
        </button>

        <div className="mr-2 font-bold text-primary-light text-lg">{t('title')}</div>

        <button onClick={onCancel} className="text-gray-400 hover:text-white">
          <X size={18} />
        </button>
      </div>

      <RouteInput
        icon={<LocateFixed size={16} />}
        placeholder={t('originPlaceholder')}
        initialValue={originLabel ?? undefined}
        onSelect={onSetOrigin}
      />

      <RouteInput
        icon={<Plus size={16} />}
        placeholder={t('destinationPlaceholder')}
        initialValue={destinationLabel ?? undefined}
        onSelect={onSetDestination}
      />

        <SpeedOptions
          onClose={onCloseSpeedOptions}
          onSelect={onSelectModality}
          speeds={speeds}
        />

      <div className="flex justify-between pt-2">
        <button className="text-sm text-gray-300 underline">{t('save')}</button>
        <Button onClick={onStart} variant="confirm">
          {isCalculatingRoute ? <Loader size={18} /> : t('plan')}
        </Button>
      </div>
    </div>
  );
}
