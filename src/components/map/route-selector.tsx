'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { 
  RouteIcon, 
  TimerIcon, 
  TrendingUp, 
  TrendingDown, 
  Flame,
  AlertTriangle,
} from 'lucide-react';

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

function getRouteLabel(index: number): string {
  if (index === 0) return 'recomendada';
  if (index === 1) return 'alternativa 1';
  return `alternativa ${index}`;
}

function getRouteColor(index: number): string {
  if (index === 0) return 'border-[#92a848]';
  if (index === 1) return 'border-[#a8b87a]';
  return 'border-[#8a9956]';
}

export default function RouteSelector({
  routes,
  selectedIndex,
  onSelect,
  className,
}: RouteSelectorProps) {
  if (routes.length === 0) return null;

  return (
    <div className={clsx('space-y-3', className)}>
      {routes.length > 1 && (
        <div className="text-sm text-copy/70 px-1">
          {routes.length} rotas disponíveis - clique para selecionar
        </div>
      )}
      
      <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto pr-1">
        {routes.map((route, index) => {
          const isSelected = index === selectedIndex;
          
          return (
            <motion.button
              key={index}
              onClick={() => onSelect(index)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={clsx(
                'relative w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
                'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
                isSelected
                  ? clsx('bg-[#92a848]/10', getRouteColor(index), 'shadow-md')
                  : 'bg-background border-copy/20 hover:border-copy/40'
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={clsx(
                      'text-xs font-semibold uppercase tracking-wider',
                      isSelected ? 'text-[#92a848]' : 'text-copy/60'
                    )}>
                      {getRouteLabel(index)}
                    </span>
                    {isSelected && (
                      <span className="text-xs bg-[#92a848] text-white px-2 py-0.5 rounded-full">
                        selecionada
                      </span>
                    )}
                  </div>
                  {route.summary && (
                    <div className="text-sm text-copy/70 line-clamp-1">
                      {route.summary}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <RouteIcon size={16} className="text-[#92a848] flex-shrink-0" />
                  <span className="font-medium">{route.distanceKm.toFixed(2)} km</span>
                </div>
                
                <div className="flex items-center gap-1.5">
                  <TimerIcon size={16} className="text-[#92a848] flex-shrink-0" />
                  <span className="font-medium">{formatTime(route.estimatedTimeMinutes)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <TrendingUp size={16} className="text-[#92a848] flex-shrink-0" />
                  <span className="font-medium">{route.elevationGain}m</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <TrendingDown size={16} className="text-[#92a848] flex-shrink-0" />
                  <span className="font-medium">{route.elevationLoss}m</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Flame size={16} className="text-[#92a848] flex-shrink-0" />
                  <span className="font-medium">{route.estimatedCalories} kcal</span>
                </div>
              </div>

              {route.warnings && route.warnings.length > 0 && (
                <div className="mt-3 pt-3 border-t border-copy/10">
                  <div className="flex items-start gap-2 text-amber-600">
                    <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                    <div className="text-xs space-y-1">
                      {route.warnings.map((warning, wIndex) => (
                        <div key={wIndex}>{warning}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

