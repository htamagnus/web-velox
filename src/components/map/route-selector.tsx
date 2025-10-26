'use client';

import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { 
  RouteIcon, 
  TimerIcon, 
  TrendingUp, 
  TrendingDown, 
  Flame,
  AlertTriangle,
} from 'lucide-react';
import { useTexts } from '@/helpers/use-texts';

type RouteOption = {
  polyline: [number, number][];
  distanceKm: number;
  estimatedTimeMinutes: number;
  elevationGain: number;
  elevationLoss: number;
  estimatedCalories: number;
  summary?: string;
  warnings?: string[];
};

type RouteSelectorProps = {
  routes: RouteOption[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
};

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
}

function getRouteLabel(index: number, t: (key: string) => string): string {
  if (index === 0) return t('labels.recommended');
  if (index === 1) return `${t('labels.alternative')} 1`;
  return `${t('labels.alternative')} ${index}`;
}

function getRouteLabelShort(index: number, t: (key: string) => string): string {
  if (index === 0) return t('labels.main');
  return `${t('labels.alt')} ${index}`;
}

function getRouteColor(index: number): string {
  const colors = [
    '#92a848', // verde principal
    '#4a9eff', // azul
    '#ff8c42', // laranja
  ];
  return colors[index] || colors[0];
}

export default function RouteSelector({
  routes,
  selectedIndex,
  onSelect,
  className,
}: RouteSelectorProps) {
  const { t } = useTexts('routeSelector');
  if (routes.length === 0) return null;

  const selectedRoute = routes[selectedIndex];

  return (
    <div className={clsx('space-y-3', className)}>
      {routes.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:grid sm:grid-cols-3 sm:gap-3 sm:overflow-visible">
          {routes.map((route, index) => {
            const isSelected = index === selectedIndex;
            const timeDiff = route.estimatedTimeMinutes - routes[0].estimatedTimeMinutes;
            const routeColor = getRouteColor(index);
            
            return (
              <button
                key={index}
                onClick={() => onSelect(index)}
                style={{
                  backgroundColor: isSelected ? routeColor : 'transparent',
                  borderColor: isSelected ? routeColor : 'rgba(251, 252, 251, 0.2)',
                }}
                className={clsx(
                  'relative flex-shrink-0 px-4 py-2.5 rounded-lg border-2 transition-all duration-200 sm:flex-shrink',
                  'hover:scale-[1.02] active:scale-[0.98]',
                  isSelected ? 'text-white shadow-md' : 'text-copy hover:border-copy/40'
                )}
              >
                <div className="flex flex-col items-center gap-1 min-w-[80px]">
                  <span className={clsx(
                    'text-xs font-semibold uppercase tracking-wide',
                    isSelected ? 'text-white' : 'text-copy/60'
                  )}>
                    {getRouteLabelShort(index, t)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <TimerIcon size={14} className={isSelected ? 'text-white' : ''} style={{ color: isSelected ? 'white' : routeColor }} />
                    <span className="text-sm font-medium">
                      {formatTime(route.estimatedTimeMinutes)}
                    </span>
                  </div>
                  {index > 0 && timeDiff > 0 && (
                    <span className={clsx(
                      'text-xs',
                      isSelected ? 'text-white/70' : 'text-copy/50'
                    )}>
                      +{formatTime(timeDiff)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          style={{
            borderColor: getRouteColor(selectedIndex),
            backgroundColor: `${getRouteColor(selectedIndex)}10`,
          }}
          className="p-4 rounded-lg border-2"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: getRouteColor(selectedIndex) }} />
            <span 
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: getRouteColor(selectedIndex) }}
            >
              {getRouteLabel(selectedIndex, t)}
            </span>
          </div>

          {selectedRoute.summary && (
            <div className="text-sm text-copy/70 mb-3">
              {selectedRoute.summary}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
            <div className="flex items-center gap-1.5">
              <RouteIcon size={16} className="flex-shrink-0" style={{ color: getRouteColor(selectedIndex) }} />
              <span className="font-medium">{selectedRoute.distanceKm.toFixed(2)} km</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <TimerIcon size={16} className="flex-shrink-0" style={{ color: getRouteColor(selectedIndex) }} />
              <span className="font-medium">{formatTime(selectedRoute.estimatedTimeMinutes)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <TrendingUp size={16} className="flex-shrink-0" style={{ color: getRouteColor(selectedIndex) }} />
              <span className="font-medium">{selectedRoute.elevationGain}m</span>
            </div>

            <div className="flex items-center gap-1.5">
              <TrendingDown size={16} className="flex-shrink-0" style={{ color: getRouteColor(selectedIndex) }} />
              <span className="font-medium">{selectedRoute.elevationLoss}m</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Flame size={16} className="flex-shrink-0" style={{ color: getRouteColor(selectedIndex) }} />
              <span className="font-medium">{selectedRoute.estimatedCalories} kcal</span>
            </div>
          </div>

          {selectedRoute.warnings && selectedRoute.warnings.length > 0 && (
            <div className="mt-3 pt-3 border-t border-copy/10">
              <div className="flex items-start gap-2 text-amber-600">
                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                <div className="text-xs space-y-1">
                  {selectedRoute.warnings.map((warning, wIndex) => (
                    <div key={wIndex}>{warning}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

