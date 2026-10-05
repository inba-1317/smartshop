import React, { useState } from 'react';
import { EMPIRICAL_RESEARCH_BENCHMARKS } from '../data/behaviorData';
import { BarChart3, Clock, ShoppingCart, AlertCircle, ArrowUpRight } from 'lucide-react';

export const ResearchInsights: React.FC = () => {
  const [activeView, setActiveView] = useState<'abandonment' | 'circadian' | 'categories'>('abandonment');

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-neutral-800 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Empirical Consumer Shopping Behavior Data
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Benchmarked consumer research on digital cart abandonment, circadian impulse patterns, and post-purchase remorse curves.
        </p>
      </div>

      {/* Segmented Filter Control (Buttons) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-xl w-fit">
        <button
          onClick={() => setActiveView('abandonment')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'abandonment'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Why 70% of Carts are Abandoned
        </button>
        <button
          onClick={() => setActiveView('circadian')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'circadian'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Circadian Impulse Curve (Time of Day)
        </button>
        <button
          onClick={() => setActiveView('categories')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
            activeView === 'categories'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Post-Purchase Regret by Category
        </button>
      </div>

      {/* View 1: Abandonment Reasons */}
      {activeView === 'abandonment' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Primary Drivers of Digital Cart Abandonment
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Source: Baymard Institute Aggregate Benchmark (49,000+ Consumer Responses)
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-neutral-400">Global Average Abandonment</div>
                <div className="text-2xl font-bold font-mono text-blue-400 tabular-nums">70.19%</div>
              </div>
            </div>

            <div className="space-y-4">
              {EMPIRICAL_RESEARCH_BENCHMARKS.abandonmentReasons.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-200">{item.reason}</span>
                    <span className="font-mono text-neutral-300 font-bold tabular-nums">{item.percentage}%</span>
                  </div>
                  
                  <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-neutral-500 italic">
                    Customer Insight: {item.customerInsight}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs text-neutral-300 leading-relaxed">
              <strong className="text-white">Customer Takeaway:</strong> Carts are not merely checkout points—they are mental buffers. Over 58% of abandoned carts represent healthy self-regulation where the shopper intentionally uses the cart as a cooling-off chamber or price monitor.
            </div>
          </div>
        </div>
      )}

      {/* View 2: Circadian Impulse Curve */}
      {activeView === 'circadian' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                The Circadian Impulse Curve: Willpower vs Time of Day
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Behavioral observation across 1.2M e-commerce sessions analyzing ratio of planned vs impulsive orders.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                    <th className="pb-3 font-medium">Time Window</th>
                    <th className="pb-3 font-medium">Impulse vs Intentional</th>
                    <th className="pb-3 font-medium text-right">Impulse Share</th>
                    <th className="pb-3 font-medium pl-6">Cognitive State & Vulnerability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {EMPIRICAL_RESEARCH_BENCHMARKS.timeOfDayImpulseShare.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3.5 font-mono text-white font-semibold">
                        {row.label}
                      </td>
                      <td className="py-3.5 w-48">
                        <div className="flex h-2 w-full rounded-full overflow-hidden bg-neutral-800">
                          <div 
                            className="bg-purple-500" 
                            style={{ width: `${row.impulseShare}%` }} 
                            title={`Impulse: ${row.impulseShare}%`}
                          />
                          <div 
                            className="bg-blue-600" 
                            style={{ width: `${row.intentionalShare}%` }} 
                            title={`Intentional: ${row.intentionalShare}%`}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold tabular-nums">
                        <span className={row.impulseShare > 50 ? 'text-rose-400' : 'text-neutral-300'}>
                          {row.impulseShare}%
                        </span>
                      </td>
                      <td className="py-3.5 pl-6 text-neutral-400">
                        {row.state}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="text-xs font-semibold text-blue-400">Peak Rational Review Hours (10 AM - 2 PM)</div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Shoppers compare specs on larger desktop screens, inspect review distribution, and calculate shipping fees accurately.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="text-xs font-semibold text-purple-400">Peak Vulnerability Hours (10 PM - 2 AM)</div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Glucose and prefrontal cognitive bandwidth are depleted. Dopamine-seeking via one-click checkout becomes an emotional anesthetic.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Category Regret Rates */}
      {activeView === 'categories' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-6">
            <div className="border-b border-neutral-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                Post-Purchase Regret & Return Inefficiency by Category
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Measuring consumer remorse frequency and unreturned clutter across major retail verticals.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                    <th className="pb-3 font-medium">Vertical Category</th>
                    <th className="pb-3 font-medium text-right">Regret Frequency</th>
                    <th className="pb-3 font-medium text-right">Actual Return Rate</th>
                    <th className="pb-3 font-medium pl-6">Remorse Horizon</th>
                    <th className="pb-3 font-medium pl-6">Core Psychological Driver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {EMPIRICAL_RESEARCH_BENCHMARKS.categoryRegretRates.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3.5 font-semibold text-white">
                        {row.category}
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold tabular-nums">
                        <span className={row.regretRate > 50 ? 'text-rose-400' : 'text-neutral-300'}>
                          {row.regretRate}%
                        </span>
                      </td>
                      <td className="py-3.5 text-right font-mono tabular-nums text-neutral-400">
                        {row.returnRate}%
                      </td>
                      <td className="py-3.5 pl-6 font-mono text-neutral-300">
                        {row.averageTimeToRegret}
                      </td>
                      <td className="py-3.5 pl-6 text-neutral-400">
                        {row.driver}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs text-neutral-300 leading-relaxed">
              <strong className="text-white">The Return Friction Gap:</strong> Notice that in Fast Fashion, 64% of purchases are regretted, yet only 24.4% are ever returned. The remaining 39.6% represents silent financial loss absorbed by the customer due to return shipping barriers and packaging hassle.
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
