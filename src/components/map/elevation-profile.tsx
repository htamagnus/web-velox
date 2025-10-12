'use client';

import { useRef, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

type ElevationPoint = {
  distance: number;
  elevation: number;
};

type ElevationProfileProps = {
  elevationData: ElevationPoint[];
  elevationGain: number;
  elevationLoss: number;
  className?: string;
};

export default function ElevationProfile({
  elevationData,
  elevationGain,
  elevationLoss,
  className = '',
}: ElevationProfileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || elevationData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const minElevation = Math.min(...elevationData.map(p => p.elevation));
    const maxElevation = Math.max(...elevationData.map(p => p.elevation));
    const elevationRange = maxElevation - minElevation || 1;
    const maxDistance = elevationData[elevationData.length - 1]?.distance || 1;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(146, 168, 72, 0.1)';
    ctx.strokeStyle = '#92a848';
    ctx.lineWidth = 2;

    ctx.beginPath();
    
    for (const [index, point] of elevationData.entries()) {
      const x = padding.left + (point.distance / maxDistance) * chartWidth;
      const y = padding.top + chartHeight - ((point.elevation - minElevation) / elevationRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    for (const [index, point] of elevationData.entries()) {
      const x = padding.left + (point.distance / maxDistance) * chartWidth;
      const y = padding.top + chartHeight - ((point.elevation - minElevation) / elevationRange) * chartHeight;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(251, 252, 251, 0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(251, 252, 251, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.stroke();

    ctx.fillStyle = 'rgba(251, 252, 251, 0.7)';
    ctx.font = '11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'right';
    
    const yLabels = [minElevation, (minElevation + maxElevation) / 2, maxElevation];
    for (const label of yLabels) {
      const y = padding.top + chartHeight - ((label - minElevation) / elevationRange) * chartHeight;
      ctx.fillText(`${Math.round(label)}m`, padding.left - 8, y + 4);
    }

    ctx.textAlign = 'center';
    const xLabels = [0, maxDistance / 2, maxDistance];
    for (const label of xLabels) {
      const x = padding.left + (label / maxDistance) * chartWidth;
      ctx.fillText(`${(label / 1000).toFixed(1)}km`, x, padding.top + chartHeight + 18);
    }

  }, [elevationData]);

  if (elevationData.length === 0) return null;

  return (
    <div className={`bg-gradient-to-br from-[#1a2234] to-[#0f1419] p-4 rounded-lg border border-copy/10 shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-copy">perfil de elevação</h3>
        <div className="flex items-center gap-4 text-xs text-copy">
          <div className="flex items-center gap-1.5 bg-[#92a848]/10 px-2 py-1 rounded-md">
            <TrendingUp size={14} className="text-[#92a848]" />
            <span className="font-medium">{elevationGain}m</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#92a848]/10 px-2 py-1 rounded-md">
            <TrendingDown size={14} className="text-[#92a848]" />
            <span className="font-medium">{elevationLoss}m</span>
          </div>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full rounded"
        style={{ height: '150px' }}
      />
    </div>
  );
}

