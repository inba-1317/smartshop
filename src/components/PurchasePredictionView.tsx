import React, { useState } from 'react';
import { CustomerTransaction } from '../data/customerDatasetModel';
import { CartAuditor } from './CartAuditor';
import { Cpu, Calculator, Sparkles, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface PurchasePredictionViewProps {
  dataset: CustomerTransaction[];
}

export const PurchasePredictionView: React.FC<PurchasePredictionViewProps> = ({ dataset }) => {
  const [activeTab, setActiveTab] = useState<'model' | 'cartAudit'>('model');

  // Prediction Inputs
  const [age, setAge] = useState<number>(34);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [previousPurchases, setPreviousPurchases] = useState<number>(18);
  const [paymentMethod, setPaymentMethod] = useState<string>('Credit Card');
  const [frequency, setFrequency] = useState<string>('Bi-Weekly');
  const [season, setSeason] = useState<string>('Fall');

  // Prediction Output computation based on dataset correlations
  const prediction = React.useMemo(() => {
    // 1. Predict Category based on Age & Gender in dataset
    const similar = dataset.filter(i => 
      Math.abs(i.age - age) <= 7 && 
      i.gender === gender &&
      (season === 'All' || i.season === season)
    );

    const pool = similar.length > 20 ? similar : dataset;

    // Category frequency
    const catCounts: Record<string, number> = {};
    const itemCounts: Record<string, number> = {};
    pool.forEach(i => {
      catCounts[i.category] = (catCounts[i.category] || 0) + 1;
      itemCounts[i.item] = (itemCounts[i.item] || 0) + 1;
    });

    const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Clothing';
    const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Jeans';

    // Estimated spend: average spend of demographic adjusted by loyalty
    const avgBase = pool.reduce((s, i) => s + i.amount, 0) / pool.length;
    const loyaltyBump = previousPurchases > 30 ? 4 : previousPurchases < 5 ? -3 : 0;
    const estimatedSpend = Math.round(avgBase + loyaltyBump);

    // Discount propensity: 43% baseline, higher for young digital users
    let discountPropensity = 43;
    if (age <= 30) discountPropensity += 12;
    if (paymentMethod === 'Venmo' || paymentMethod === 'PayPal') discountPropensity += 8;
    if (previousPurchases > 25) discountPropensity += 6;
    discountPropensity = Math.min(88, Math.max(15, discountPropensity));

    // Subscription conversion likelihood
    let subLikelihood = 27;
    if (frequency === 'Weekly' || frequency === 'Bi-Weekly') subLikelihood += 25;
    if (previousPurchases > 20) subLikelihood += 15;
    if (frequency === 'Annually') subLikelihood -= 18;
    subLikelihood = Math.min(85, Math.max(8, subLikelihood));

    // Expected review rating
    const avgRating = Number((pool.reduce((s, i) => s + i.rating, 0) / pool.length).toFixed(2));

    // Churn / Abandonment Risk
    let churnRisk: 'Low' | 'Moderate' | 'High' = 'Moderate';
    if (frequency === 'Annually' || previousPurchases <= 3) churnRisk = 'High';
    else if (frequency === 'Weekly' || previousPurchases >= 25) churnRisk = 'Low';

    return {
      topCategory,
      topItem,
      estimatedSpend,
      discountPropensity,
      subLikelihood,
      avgRating,
      churnRisk,
      confidence: Math.min(94, 65 + Math.min(25, pool.length / 50))
    };
  }, [dataset, age, gender, previousPurchases, paymentMethod, frequency, season]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400">
            Predictive AI & Behavioral Modeling
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Purchase Prediction & Cart Risk Simulator
          </h2>
          <p className="text-sm text-neutral-400 mt-0.5">
            Heuristic inference engine trained on 3,900 e-commerce consumer journeys to forecast next purchase, budget, and promo susceptibility.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => setActiveTab('model')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'model' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Predictive AI Model
          </button>
          <button
            onClick={() => setActiveTab('cartAudit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'cartAudit' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Live Cart Decision Auditor
          </button>
        </div>
      </div>

      {activeTab === 'model' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Column */}
          <div className="lg:col-span-5 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Cpu className="h-4 w-4 text-amber-400" />
                <span>Customer Attributes</span>
              </h3>
              <span className="text-[11px] font-mono text-neutral-400">Input Variables</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Customer Age: {age} years</label>
                <input
                  type="range"
                  min="18"
                  max="70"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Season</label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200"
                  >
                    <option value="Fall">Fall</option>
                    <option value="Winter">Winter</option>
                    <option value="Spring">Spring</option>
                    <option value="Summer">Summer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Prior Purchases: {previousPurchases} orders</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={previousPurchases}
                  onChange={(e) => setPreviousPurchases(parseInt(e.target.value, 10))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Payment Rail</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200"
                  >
                    <option>Credit Card</option>
                    <option>PayPal</option>
                    <option>Venmo</option>
                    <option>Debit Card</option>
                    <option>Cash</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-200"
                  >
                    <option>Weekly</option>
                    <option>Bi-Weekly</option>
                    <option>Fortnightly</option>
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Annually</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-[11px] text-neutral-400">
                Variables are correlated with 3,900 empirical e-commerce customer transaction histories.
              </div>
            </div>
          </div>

          {/* Predictions Output Column */}
          <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">Predictive Inference</span>
                <h3 className="text-2xl font-bold text-white mt-0.5">Forecasted Shopping Behavior</h3>
              </div>
              <div className="text-xs font-mono text-emerald-400 border border-emerald-900/50 bg-emerald-950/40 px-2.5 py-1 rounded">
                Confidence: {prediction.confidence}%
              </div>
            </div>

            {/* Key Predictions Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="text-neutral-500">Predicted Next Item</div>
                <div className="text-xl font-bold text-white">{prediction.topItem}</div>
                <div className="text-[11px] text-blue-400 font-semibold">{prediction.topCategory} Category</div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="text-neutral-500">Forecasted Spend</div>
                <div className="text-xl font-bold text-emerald-400 tabular-nums">~${prediction.estimatedSpend}</div>
                <div className="text-[11px] text-neutral-400 font-sans">Based on cohort AOV</div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="text-neutral-500">Promo Code Sensitivity</div>
                <div className="text-xl font-bold text-amber-400 tabular-nums">{prediction.discountPropensity}%</div>
                <div className="text-[11px] text-neutral-400 font-sans">Likelihood to search discount</div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="text-neutral-500">Subscription Propensity</div>
                <div className="text-xl font-bold text-purple-400 tabular-nums">{prediction.subLikelihood}%</div>
                <div className="text-[11px] text-neutral-400 font-sans">Recurring membership fit</div>
              </div>
            </div>

            {/* Secondary Risk and Satisfaction */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="text-neutral-400 font-medium">Expected Satisfaction Rating</div>
                <div className="text-lg font-bold font-mono text-amber-400">★ {prediction.avgRating} / 5.0</div>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  Historical average satisfaction for this demographic profile.
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                <div className="text-neutral-400 font-medium">Cart Abandonment / Churn Risk</div>
                <div className={`text-lg font-bold font-mono ${
                  prediction.churnRisk === 'High' ? 'text-rose-400' :
                  prediction.churnRisk === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {prediction.churnRisk} Risk
                </div>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  Frequency and prior loyalty indicate re-engagement probability.
                </p>
              </div>
            </div>

            {/* Consumer Defense Takeaway */}
            <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-4 space-y-1.5 text-xs">
              <div className="text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Customer Counter-Tactics</span>
              </div>
              <p className="text-neutral-200 leading-relaxed font-medium">
                Retailer algorithms predict you will be tempted by {prediction.topCategory} and responsive to a promo code discount. 
                Remember: a 20% discount on an unneeded {prediction.topItem} is still 100% wasted capital. Always impose a 24-hour hold before checking out.
              </p>
            </div>

          </div>

        </div>
      ) : (
        <CartAuditor />
      )}
    </div>
  );
};
