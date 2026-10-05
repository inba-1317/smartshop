import React, { useState } from 'react';
import { PriceChangePoint } from '../data/productCatalogData';
import { TrendingDown, TrendingUp, Calendar, AlertCircle, Info, Sparkles, ShieldCheck } from 'lucide-react';

interface PriceHistoryChartProps {
  priceHistory: PriceChangePoint[];
  currentPrice: number;
  productName: string;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  priceHistory,
  currentPrice,
  productName
}) => {
  const [activePointIndex, setActivePointIndex] = useState<number>(priceHistory.length - 1);

  if (!priceHistory || priceHistory.length === 0) {
    return <div className="text-xs text-neutral-500">No price history available.</div>;
  }

  // Calculate bounds
  const prices = priceHistory.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;
  const padding = priceRange * 0.15; // 15% top/bottom breathing room
  const effectiveMin = Math.max(0, Math.floor(minPrice - padding));
  const effectiveMax = Math.ceil(maxPrice + padding);
  const effectiveRange = effectiveMax - effectiveMin || 1;

  // Chart dimensions
  const svgWidth = 480;
  const svgHeight = 170;
  const margin = { top: 25, right: 35, bottom: 35, left: 45 };
  const innerWidth = svgWidth - margin.left - margin.right;
  const innerHeight = svgHeight - margin.top - margin.bottom;

  // Compute point coordinates
  const points = priceHistory.map((p, index) => {
    const x = margin.left + (index / (priceHistory.length - 1)) * innerWidth;
    const y = margin.top + innerHeight - ((p.price - effectiveMin) / effectiveRange) * innerHeight;
    return { x, y, point: p, index };
  });

  // SVG path generation
  const linePathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaPathD = `${linePathD} L ${points[points.length - 1].x} ${margin.top + innerHeight} L ${points[0].x} ${margin.top + innerHeight} Z`;

  const activePoint = priceHistory[activePointIndex] || priceHistory[priceHistory.length - 1];
  const peakPrice = maxPrice;
  const lowestPrice = minPrice;
  const savingsFromPeak = Math.max(0, peakPrice - currentPrice);
  const pctSavings = peakPrice > 0 ? Math.round((savingsFromPeak / peakPrice) * 100) : 0;

  return (
    <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-950 p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400">
            <TrendingDown className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              5-Period Price History & Volatility
            </h4>
            <span className="text-[11px] text-neutral-400">
              Historical retail tracking across seasonal restocks (₹ INR)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-lg border border-emerald-500/30">
            <span>Peak: ₹{peakPrice.toLocaleString('en-IN')}</span>
            <span className="text-neutral-500">→</span>
            <span className="font-bold">Now: ₹{currentPrice.toLocaleString('en-IN')}</span>
            {pctSavings > 0 && (
              <span className="text-[10px] bg-emerald-500/20 px-1 rounded text-emerald-300 font-bold">
                -{pctSavings}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative overflow-hidden w-full">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-44 select-none"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3b82f6" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Grid lines */}
          <line
            x1={margin.left}
            y1={margin.top}
            x2={svgWidth - margin.right}
            y2={margin.top}
            stroke="#262626"
            strokeDasharray="3 3"
          />
          <line
            x1={margin.left}
            y1={margin.top + innerHeight / 2}
            x2={svgWidth - margin.right}
            y2={margin.top + innerHeight / 2}
            stroke="#262626"
            strokeDasharray="3 3"
          />
          <line
            x1={margin.left}
            y1={margin.top + innerHeight}
            x2={svgWidth - margin.right}
            y2={margin.top + innerHeight}
            stroke="#262626"
          />

          {/* Y-Axis Value Labels */}
          <text x={margin.left - 8} y={margin.top + 4} textAnchor="end" className="text-[9px] fill-neutral-500 font-mono">
            ₹{effectiveMax.toLocaleString('en-IN')}
          </text>
          <text x={margin.left - 8} y={margin.top + innerHeight / 2 + 3} textAnchor="end" className="text-[9px] fill-neutral-500 font-mono">
            ₹{Math.round((effectiveMax + effectiveMin) / 2).toLocaleString('en-IN')}
          </text>
          <text x={margin.left - 8} y={margin.top + innerHeight} textAnchor="end" className="text-[9px] fill-neutral-500 font-mono">
            ₹{effectiveMin.toLocaleString('en-IN')}
          </text>

          {/* Area under curve */}
          <path d={areaPathD} fill="url(#priceGradient)" />

          {/* Price Line */}
          <path
            d={linePathD}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />

          {/* Data Points */}
          {points.map((pt) => {
            const isSelected = pt.index === activePointIndex;
            return (
              <g key={pt.index} className="cursor-pointer" onClick={() => setActivePointIndex(pt.index)}>
                {/* Vertical hover line indicator */}
                {isSelected && (
                  <line
                    x1={pt.x}
                    y1={margin.top}
                    x2={pt.x}
                    y2={margin.top + innerHeight}
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.7"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={pt.x}
                  y={pt.y}
                  r={isSelected ? 6 : 4}
                  fill={isSelected ? '#60a5fa' : '#1e3a8a'}
                  stroke={isSelected ? '#ffffff' : '#3b82f6'}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  className="transition-all duration-150"
                />

                {/* Price tag above point */}
                <text
                  x={pt.x}
                  y={pt.y - 9}
                  textAnchor="middle"
                  className={`text-[10px] font-mono font-bold transition-all ${
                    isSelected ? 'fill-blue-400 font-extrabold text-[11px]' : 'fill-neutral-400'
                  }`}
                >
                  ₹{pt.point.price.toLocaleString('en-IN')}
                </text>

                {/* X-Axis Period Label below */}
                <text
                  x={pt.x}
                  y={margin.top + innerHeight + 18}
                  textAnchor="middle"
                  className={`text-[9px] font-mono ${
                    isSelected ? 'fill-blue-300 font-bold' : 'fill-neutral-500'
                  }`}
                >
                  {pt.point.period.replace(' (Current)', '')}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Point Breakdown */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Calendar className="h-4 w-4 text-blue-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">{activePoint.period}: ₹{activePoint.price.toLocaleString('en-IN')}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-300 font-mono">
                {activePoint.label}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">{activePoint.note}</p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded border border-neutral-800 shrink-0">
          Recorded: {activePoint.date}
        </div>
      </div>

      {/* Consumer Protection Analysis */}
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-start gap-2.5">
        <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-white block">Price Trend Analysis:</span>
          <p className="text-[11px] text-neutral-300">
            {currentPrice <= lowestPrice 
              ? `Current price of ₹${currentPrice.toLocaleString('en-IN')} is at the absolute 5-period all-time low. Favorable timing to buy now or lock price via 30-day reservation.`
              : `Current price of ₹${currentPrice.toLocaleString('en-IN')} is ₹${savingsFromPeak.toLocaleString('en-IN')} (-${pctSavings}%) below peak seasonal pricing (₹${peakPrice.toLocaleString('en-IN')}). Consider reserving to lock this price.`}
          </p>
        </div>
      </div>
    </div>
  );
};
