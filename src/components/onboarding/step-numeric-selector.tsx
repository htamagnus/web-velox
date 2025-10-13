import { ArrowDown, ArrowUp, ArrowLeft } from 'lucide-react';
import Button from '../ui/button/button';

interface StepNumericSelectorProps {
  title: string;
  subtitle: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack?: () => void;
  iconUp?: React.ReactNode;
  iconDown?: React.ReactNode;
  displayMode?: 'list' | 'scroll';
  note?: string;
  extraActions?: React.ReactNode;
  iconTitle?: React.ReactNode;
}

export default function StepNumericSelector({
  title,
  subtitle,
  value,
  unit,
  min,
  max,
  onChange,
  onNext,
  onBack,
  iconUp,
  iconDown,
  displayMode = 'list',
  note,
  extraActions,
  iconTitle,
}: StepNumericSelectorProps) {
  const getDisplayValues = () => {
    return [value - 2, value - 1, value, value + 1, value + 2].filter((v) => v >= min && v <= max);
  };

  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const visibleTicks = 11;
  const itemHeight = 24;
  const centerIndex = range.findIndex((v) => v === value);
  const offset = (centerIndex - Math.floor(visibleTicks / 2)) * itemHeight;

  const isSkippable = (value === 0 || value === min) && unit === 'km/h';
  const showSkipLabel = isSkippable && (displayMode === 'list' || displayMode === 'scroll');
  const primaryButtonLabel = showSkipLabel ? 'Pular' : 'Continuar';

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative px-4 py-10 lg:py-20">
      {onBack && (
        <div className="absolute top-6 left-6 z-50">
          <Button onClick={onBack} variant="back" aria-label="Voltar">
            <ArrowLeft />
          </Button>
        </div>
      )}

      <div className="w-full max-w-xl mx-auto text-center">
        <h2 className="step-heading flex items-center gap-2 justify-center text-2xl md:text-2xl lg:text-3xl">
          <span>{iconTitle}</span>
          {title}
        </h2>

        <p className="step-paragraph mt-4 mb-8 max-w-md mx-auto text-sm md:text-base lg:text-lg px-8">
          {subtitle}
        </p>

        {displayMode === 'list' ? (
          <div className="relative h-40 flex flex-col items-center justify-center">
            <div className="absolute top-[calc(50%+1.5rem)] w-20 h-[1px] bg-gray-400 opacity-60 z-10" />
            <div className="space-y-2 z-20">
              {getDisplayValues().map((v) => (
                <div
                  key={v}
                  className={`transition-all flex items-center justify-center ${
                    v === value
                      ? 'text-4xl md:text-5xl font-extrabold text-white'
                      : 'text-lg md:text-xl text-gray-400 opacity-80'
                  }`}
                >
                  {v}
                  {v === value && unit && (
                    <span className="ml-1 text-base font-medium text-gray-300">{unit}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative h-[264px] w-20 mx-auto rounded-xl bg-primary overflow-hidden">
            <div
              className="absolute w-full transition-transform duration-200"
              style={{ transform: `translateY(-${offset}px)` }}
            >
              {range.map((v) => (
                <div
                  key={v}
                  className={`h-6 flex items-center justify-center bg-primary-content ${
                    v === value ? 'text-xl font-extrabold' : 'text-sm opacity-50'
                  }`}
                >
                  {v === value ? (
                    <div className="flex items-baseline gap-1">
                      <span>{v}</span>
                      {unit && <span className="text-xs">{unit}</span>}
                    </div>
                  ) : (
                    v
                  )}
                </div>
              ))}
            </div>

            <div
              className="absolute left-1/2 w-15 h-0.5 bg-black opacity-80 pointer-events-none"
              style={{
                top: `calc(50% + ${itemHeight / 2}px)`,
                transform: 'translateX(-50%)',
              }}
            />
          </div>
        )}

        <div className="flex justify-center gap-6 my-6">
          <Button variant="round" onClick={() => onChange(Math.max(value - 1, min))}>
            {iconDown ?? <ArrowDown className="w-5 h-5" color="black" />}
          </Button>
          <Button variant="round" onClick={() => onChange(Math.min(value + 1, max))}>
            {iconUp ?? <ArrowUp className="w-5 h-5" color="black" />}
          </Button>
        </div>

        <div className="flex justify-center">
          <Button onClick={onNext} variant="confirm">
            {primaryButtonLabel}
          </Button>
        </div>

        {extraActions && (
          <div className="flex flex-col gap-3 items-center w-full mt-2">{extraActions}</div>
        )}

        {note && (
          <div className="w-full flex justify-center mt-8 px-8">
            <p className="text-sm text-copy-lighter text-center max-w-md italic">{note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
