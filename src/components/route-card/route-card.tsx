'use client';

import { motion } from 'framer-motion';
import polyline from '@mapbox/polyline';
import {
  ArrowDown,
  TrendingUp,
  TrendingDown,
  TimerIcon,
  RouteIcon,
  GaugeIcon,
  MapPin,
  Flame,
} from 'lucide-react';
import GoogleMiniMap from '@/components/mini-map/google-mini-map';
import { getModalityLabel } from '@/helpers/modality.helper';
import { SaveRouteDto } from '@/interfaces/routes.interface';

type RouteCardProps = {
  route: SaveRouteDto;
  index: number;
};

export default function RouteCard({ route, index }: RouteCardProps) {
  const decoded = polyline.decode(route.polyline) as [number, number][];

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gradient-to-br from-[#1a2234] to-[#0f1419] rounded-2xl border border-copy/10 shadow-xl hover:shadow-2xl hover:border-primary-light/20 transition-all duration-300 overflow-hidden group"
    >
      <div className="relative overflow-hidden rounded-t-2xl">
        <GoogleMiniMap polyline={decoded} />
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10">
          <span className="text-xs font-semibold text-primary-light">
            {getModalityLabel(route.modality)}: {route.averageSpeedUsed} km/h
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-base leading-tight flex items-center gap-2">
              <MapPin size={20} className="text-primary-light flex-shrink-0 mt-0.5" />
              {route.origin}
            </p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <div className="h-px flex-1 bg-gradient-to-r from-primary-light/50 to-transparent"></div>
              <ArrowDown size={20} className="text-copy" />
              <div className="h-px flex-1 bg-gradient-to-l from-primary-light/50 to-transparent"></div>
            </div>
            <p className="text-white font-semibold text-base leading-tight mt-1 flex items-center gap-2">
              <MapPin size={20} className="text-primary-light flex-shrink-0 mt-0.5" />
              {route.destination}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 bg-primary-light/5 border border-primary-light/10 rounded-lg p-2.5 group-hover:border-primary-light/20 transition-colors">
            <RouteIcon size={16} className="text-primary-light" />
            <span className="text-sm font-semibold text-white">{route.distanceKm.toFixed(1)} km</span>
          </div>

          <div className="flex items-center gap-2 bg-primary-light/5 border border-primary-light/10 rounded-lg p-2.5 group-hover:border-primary-light/20 transition-colors">
            <TimerIcon size={16} className="text-primary-light" />
            <span className="text-sm font-semibold text-white">
              {Math.floor(route.estimatedTimeMinutes / 60)}h {route.estimatedTimeMinutes % 60}min
            </span>
          </div>

          <div className="flex items-center gap-2 bg-green-500/5 border border-green-500/10 rounded-lg p-2.5">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-sm font-semibold text-gray-200">+{route.elevationGain}m</span>
          </div>

          <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/10 rounded-lg p-2.5">
            <TrendingDown size={16} className="text-red-400" />
            <span className="text-sm font-semibold text-gray-200">-{route.elevationLoss}m</span>
          </div>

          <div className="flex items-center gap-2 bg-blue-500/5 border border-blue-500/10 rounded-lg p-2.5">
            <GaugeIcon size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-gray-200">{route.averageSpeedUsed} km/h</span>
          </div>

          <div className="flex items-center gap-2 bg-orange-500/5 border border-orange-500/10 rounded-lg p-2.5">
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm font-semibold text-gray-200">{route.estimatedCalories} kcal</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
