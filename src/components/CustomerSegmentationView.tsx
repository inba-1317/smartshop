import React, { useState, useMemo } from 'react';
import { CustomerTransaction } from '../data/customerDatasetModel';
import { Users, Crown, Tag, Zap, Repeat, AlertTriangle, ArrowRight, Star } from 'lucide-react';

interface CustomerSegmentationViewProps {
  dataset: CustomerTransaction[];
}

export const CustomerSegmentationView: React.FC<CustomerSegmentationViewProps> = ({ dataset }) => {
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('vip');

  const segments = useMemo(() => {
    // 1. VIP Loyalists: previousPurchases >= 30, rating >= 4.0
    const vip = dataset.filter(i => i.previousPurchases >= 30 && i.rating >= 4.0);
    // 2. Promo Code Hunters: discount = true
    const promo = dataset.filter(i => i.discount);
    // 3. Fast Digital Shoppers: age <= 30, (payment === 'Venmo' || payment === 'PayPal')
    const digital = dataset.filter(i => i.age <= 30 && (i.payment === 'Venmo' || i.payment === 'PayPal'));
    // 4. Subscribed Regulars: subscribed = true
    const subscribed = dataset.filter(i => i.subscribed);
    // 5. At-Risk / Casual: frequency === 'Annually' || rating <= 3.0
    const atRisk = dataset.filter(i => i.frequency === 'Annually' || i.rating <= 3.0);

    const calcMetrics = (cohort: CustomerTransaction[]) => {
      const count = cohort.length;
      const avgSpend = count > 0 ? (cohort.reduce((s, i) => s + i.amount, 0) / count).toFixed(2) : '0';
      const avgRating = count > 0 ? (cohort.reduce((s, i) => s + i.rating, 0) / count).toFixed(2) : '0';
      const topCat = count > 0 ? 'Clothing' : 'None';
      return { count, avgSpend, avgRating, topCat };
    };

    return [
      {
        id: 'vip',
        name: 'VIP Loyalists',
        icon: Crown,
        color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
        badge: 'High Value',
        description: 'Frequent buyers with 30+ prior purchases and high sustained satisfaction. Low price resistance.',
        cohort: vip,
        ...calcMetrics(vip),
        behavioralTrait: 'Value reliability and speed over small promotional discounts.',
        retentionTactics: 'Early access to seasonal drops and friction-free returns.'
      },
      {
        id: 'promo',
        name: 'Promo Code Hunters',
        icon: Tag,
        color: 'text-blue-400 border-blue-500/40 bg-blue-950/20',
        badge: 'Price Sensitive',
        description: 'Shoppers who consistently apply discount codes and hold carts until sales occur.',
        cohort: promo,
        ...calcMetrics(promo),
        behavioralTrait: 'Highly susceptible to strikethrough anchor prices and flash sale countdowns.',
        retentionTactics: 'Targeted threshold incentives (e.g. Free shipping at $60).'
      },
      {
        id: 'digital',
        name: 'Fast-Paced Digital Shoppers',
        icon: Zap,
        color: 'text-purple-400 border-purple-500/40 bg-purple-950/20',
        badge: 'Gen-Z & Millennial',
        description: 'Aged 18-30 who transact predominantly through Venmo and PayPal with Express delivery.',
        cohort: digital,
        ...calcMetrics(digital),
        behavioralTrait: 'Zero tolerance for complex checkout forms or password creation.',
        retentionTactics: 'One-click wallet integrations and mobile-first micro-browsing.'
      },
      {
        id: 'subscribed',
        name: 'Subscribed Regulars',
        icon: Repeat,
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
        badge: 'Predictable',
        description: 'Customers enrolled in ongoing membership or auto-ship schedules with steady recurring cadence.',
        cohort: subscribed,
        ...calcMetrics(subscribed),
        behavioralTrait: 'Habitual consumers with lower churn risk but heightened sensitivity to surprise surcharges.',
        retentionTactics: 'Transparent auto-renew policies and exclusive bundled perks.'
      },
      {
        id: 'atrisk',
        name: 'At-Risk / Casual Browsers',
        icon: AlertTriangle,
        color: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
        badge: 'High Churn',
        description: 'Low-frequency annual buyers or customers who experienced disappointment (rating ≤ 3.0).',
        cohort: atRisk,
        ...calcMetrics(atRisk),
        behavioralTrait: 'Severe post-purchase cognitive dissonance or return friction burnout.',
        retentionTactics: 'Proactive quality checks and hassle-free return prepaid labels.'
      }
    ];
  }, [dataset]);

  const activeSegment = segments.find(s => s.id === selectedSegmentId) || segments[0];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-neutral-800 pb-5">
        <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
          Cohort Behavioral Analytics
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
          Customer Segmentation Matrix
        </h2>
        <p className="text-sm text-neutral-400 mt-0.5">
          Clustering 3,900 e-commerce consumer records into 5 behavioral archetypes based on loyalty, discount dependency, and delivery preferences.
        </p>
      </div>

      {/* Segment Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {segments.map((seg) => {
          const Icon = seg.icon;
          const isSelected = seg.id === selectedSegmentId;
          return (
            <div
              key={seg.id}
              onClick={() => setSelectedSegmentId(seg.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500/40'
                  : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800/50 hover:border-neutral-700'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg border ${seg.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400">{seg.badge}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{seg.name}</h4>
                  <div className="text-lg font-bold font-mono text-white mt-1 tabular-nums">
                    {seg.count} <span className="text-xs font-normal text-neutral-400">shoppers</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-800/80 pt-2 text-[11px] text-neutral-400 flex justify-between font-mono">
                <span>Avg: ${seg.avgSpend}</span>
                <span className="text-amber-400">★ {seg.avgRating}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Segment Deep Dive */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${activeSegment.color}`}>
              <activeSegment.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-blue-400 uppercase tracking-wider">Cohort Deep Dive</div>
              <h3 className="text-xl font-bold text-white mt-0.5">{activeSegment.name} ({activeSegment.count} Customers)</h3>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>Avg Spend: <span className="text-emerald-400 font-bold">${activeSegment.avgSpend}</span></div>
            <div>Satisfaction: <span className="text-amber-400 font-bold">★ {activeSegment.avgRating} / 5.0</span></div>
          </div>
        </div>

        <p className="text-sm text-neutral-300 leading-relaxed">
          {activeSegment.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
            <span className="font-semibold text-neutral-200">Customer Psychological Trait:</span>
            <p className="text-neutral-400 leading-relaxed">
              {activeSegment.behavioralTrait}
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
            <span className="font-semibold text-neutral-200">Consumer Advocate Perspective:</span>
            <p className="text-neutral-400 leading-relaxed">
              {activeSegment.retentionTactics}
            </p>
          </div>
        </div>

        {/* Sample Members Table */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-semibold text-neutral-200">Sample Cohort Members ({Math.min(10, activeSegment.cohort.length)})</span>
            <span className="font-mono">Showing first 10 matching records</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Demographics</th>
                  <th className="py-2.5 px-3">Item & Category</th>
                  <th className="py-2.5 px-3 text-right">Spend</th>
                  <th className="py-2.5 px-3 text-center">Rating</th>
                  <th className="py-2.5 px-3">Shipping & Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-sans">
                {activeSegment.cohort.slice(0, 10).map((row) => (
                  <tr key={row.id} className="hover:bg-neutral-900/40">
                    <td className="py-2.5 px-3 font-mono text-neutral-400">#{row.id}</td>
                    <td className="py-2.5 px-3 text-neutral-200">{row.age} yrs · {row.gender}</td>
                    <td className="py-2.5 px-3">
                      <span className="font-medium text-white">{row.item}</span>
                      <span className="text-[11px] text-neutral-500 block">{row.category}</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-white tabular-nums">${row.amount}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-amber-400 tabular-nums">★ {row.rating}</td>
                    <td className="py-2.5 px-3 text-neutral-400 text-[11px]">{row.shipping} · {row.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
