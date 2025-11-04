import { ArrowDown, ArrowUp, ArrowLeft } from 'lucide-react';
import Button from '../ui/button/button';
import { useState } from 'react';

interface StepNumericSelectorProps {
  title: string;
  subtitle: string;
  value: number;
  unit?: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack?: () => void;
  iconUp?: React.ReactNode;
  iconDown?: React.ReactNode;
  displayMode?: 'list' | 'scroll';
  note?: string;
  extraActions?: React.ReactNode;
  iconTitle?: React.ReactNode;
  disabled?: boolean;
}

export default function StepNumericSelector({
  title,
  subtitle,
  value,
  unit,
  min,
  max,
  step = 1,
  onChange,
  onNext,
  onBack,
  iconUp,
  iconDown,
  displayMode = 'list',
  note,
  extraActions,
  iconTitle,
  disabled = false,
}: StepNumericSelectorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartValue, setDragStartValue] = useState(value);

  const normalizeValue = (val: number) => Number(val.toFixed(step < 1 ? 2 : 0));

  const getDisplayValues = () => {
    return [
      normalizeValue(value - 2 * step),
      normalizeValue(value - step),
      value,
      normalizeValue(value + step),
      normalizeValue(value + 2 * step)
    ].filter((v) => v >= min && v <= max);
  };

  const range = Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => normalizeValue(min + i * step));
  const visibleTicks = 11;
  const itemHeight = 24;
  const centerIndex = range.findIndex((v) => v === value);
  const offset = (centerIndex - Math.floor(visibleTicks / 2)) * itemHeight;

  const isSkippable = (value === 0 || value === min) && unit === 'km/h';
  const showSkipLabel = isSkippable && (displayMode === 'list' || displayMode === 'scroll');
  const primaryButtonLabel = showSkipLabel ? 'Pular' : 'Continuar';

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled) return;
    setIsDragging(true);
    setDragStartY(e.touches[0].clientY);
    setDragStartValue(value);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || disabled) return;

    e.preventDefault();

    const currentY = e.touches[0].clientY;
    const totalDiff = dragStartY - currentY;

    const threshold = 8;
    const draggedSteps = Math.floor(Math.abs(totalDiff) / threshold);

    let newValue = dragStartValue;
    if (totalDiff > 0) {
      newValue = Math.min(normalizeValue(dragStartValue + draggedSteps * step), max);
    } else {
      newValue = Math.max(normalizeValue(dragStartValue - draggedSteps * step), min);
    }
    onChange(newValue);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

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
        <h2 className="step-heading flex items-center gap-2 justify-center text-2xl md:text-2xl lg:text-2xl whitespace-nowrap">
          <span>{iconTitle}</span>
          {title}
        </h2>

        <p className="step-paragraph mt-4 mb-8 max-w-lg mx-auto text-sm md:text-base lg:text-lg px-4 md:px-8">
          {subtitle}
        </p>

        {displayMode === 'list' ? (
          <div
            className="relative max-h-96 flex flex-col items-center justify-center overflow-y-auto touch-none select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
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
          <div className="relative h-[264px] w-20 mx-auto rounded-xl bg-primary overflow-hidden touch-none select-none">
            <div
              className="absolute w-full transition-transform duration-200"
              style={{ transform: `translateY(-${offset}px)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
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
          <Button 
            variant="round" 
            onClick={() => onChange(Math.max(normalizeValue(value - step), min))}
            disabled={disabled}
          >
            {iconDown ?? <ArrowDown className="w-5 h-5" color="black" />}
          </Button>
          <Button 
            variant="round" 
            onClick={() => onChange(Math.min(normalizeValue(value + step), max))}
            disabled={disabled}
          >
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
          <div className="w-full flex justify-center mt-8 px-2">
            <p className="text-sm text-copy-lighter text-center max-w-md italic">{note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
