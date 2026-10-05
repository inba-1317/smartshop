import React, { useState } from 'react';
import { CartAuditInput, CartAuditResult, QuizResult } from '../types/behavior';
import { ShieldAlert, AlertTriangle, CheckCircle, Calculator, Sparkles, Clock, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface CartAuditorProps {
  userProfile?: QuizResult | null;
}

export const CartAuditor: React.FC<CartAuditorProps> = ({ userProfile }) => {
  const [input, setInput] = useState<CartAuditInput>({
    itemName: 'Corduroy Overshirt Jacket',
    category: 'Fashion & Apparel',
    price: 68.00,
    originalPrice: 120.00,
    shippingFee: 6.99,
    freeShippingMin: 75.00,
    urgencySignals: 'Only 3 left in your size! 18 others looking at this.',
    emotionalState: 'Bored / Scrolling',
    expectedUsesPerYear: 8,
    reason: 'Saw a 43% discount on social feed and thought it looked stylish'
  });

  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [auditResult, setAuditResult] = useState<CartAuditResult | null>(null);
  const [pledgeActive, setPledgeActive] = useState(false);
  const [pledgeExpiry, setPledgeExpiry] = useState<string | null>(null);

  // Preset scenarios to make testing instantaneous and delightfully concrete
  const handleLoadScenario = (type: 'jacket' | 'gadget' | 'threshold' | 'nightscroll') => {
    if (type === 'jacket') {
      setInput({
        itemName: 'Japanese Denim Trucker Jacket',
        category: 'Fashion & Apparel',
        price: 145.00,
        originalPrice: 220.00,
        shippingFee: 0,
        freeShippingMin: 100.00,
        urgencySignals: 'Low stock: Only 1 remaining in Medium',
        emotionalState: 'Calm & Intentional',
        expectedUsesPerYear: 80,
        reason: 'Replacing my everyday denim jacket that has worn through elbows after 5 years.'
      });
    } else if (type === 'gadget') {
      setInput({
        itemName: 'Multi-Angle Desk Phone Stand & Wireless Charger',
        category: 'Tech & Gadgets',
        price: 34.00,
        originalPrice: 65.00,
        shippingFee: 4.99,
        freeShippingMin: 50.00,
        urgencySignals: 'Flash Deal ends in 00:32:14',
        emotionalState: 'Bored / Scrolling',
        expectedUsesPerYear: 12,
        reason: 'Saw an Instagram video of clean desk aesthetic and wanted a tidier setup.'
      });
    } else if (type === 'threshold') {
      setInput({
        itemName: 'Organic Cotton Crewneck T-Shirt',
        category: 'Fashion & Apparel',
        price: 38.00,
        originalPrice: 45.00,
        shippingFee: 7.50,
        freeShippingMin: 50.00,
        urgencySignals: '',
        emotionalState: 'Calm & Intentional',
        expectedUsesPerYear: 30,
        reason: 'Need basic work-from-home basics, but $12 short of the free shipping minimum.'
      });
    } else {
      setInput({
        itemName: 'Aromatherapy Cloud Humidifier & Flame Lamp',
        category: 'Home Goods',
        price: 49.00,
        originalPrice: 99.00,
        shippingFee: 5.99,
        freeShippingMin: 60.00,
        urgencySignals: '🔥 84 sold in the last 2 hours',
        emotionalState: 'Stressed / Seeking Relief',
        expectedUsesPerYear: 4,
        reason: 'Browsing in bed at 11:45 PM after a high-stress workday.'
      });
    }
    setAuditResult(null);
  };

  const runAudit = async () => {
    setIsLoadingAi(true);

    const price = Number(input.price) || 0;
    const original = Number(input.originalPrice) || price;
    const shipping = Number(input.shippingFee) || 0;
    const threshold = Number(input.freeShippingMin) || 0;
    const uses = Math.max(1, Number(input.expectedUsesPerYear) || 1);

    const costPerUse = Number((price / uses).toFixed(2));
    const nominalSavings = Math.max(0, original - price);
    const hasUrgency = Boolean(input.urgencySignals && input.urgencySignals.trim().length > 0);
    const isLateNightOrStressed = input.emotionalState.includes('Bored') || input.emotionalState.includes('Stressed');
    const thresholdGap = threshold > price ? Number((threshold - price).toFixed(2)) : 0;

    let baseDeception = 20;
    if (hasUrgency) baseDeception += 35;
    if (nominalSavings > 30) baseDeception += 25;
    if (thresholdGap > 0 && thresholdGap <= 15) baseDeception += 15;
    baseDeception = Math.min(95, baseDeception);

    // Free shipping trap calculations
    let shippingTrapAdvice = "No threshold trap detected.";
    if (thresholdGap > 0 && shipping > 0) {
      if (thresholdGap > shipping) {
        shippingTrapAdvice = `WARNING: You are $${thresholdGap.toFixed(2)} short of free shipping. Adding a $${thresholdGap.toFixed(2)} filler item to save $${shipping.toFixed(2)} shipping results in a net cash loss of $${(thresholdGap - shipping).toFixed(2)}. Pay the $${shipping.toFixed(2)} fee instead.`;
      } else {
        shippingTrapAdvice = `You are only $${thresholdGap.toFixed(2)} away from free shipping (fee is $${shipping.toFixed(2)}). If you can add a routine staple you will 100% consume anyway, it is mathematically neutral.`;
      }
    }

    try {
      // Call server backend advisor
      const response = await fetch('/api/behavior-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: input.itemName,
          price: input.price,
          originalPrice: input.originalPrice,
          shippingFee: input.shippingFee,
          freeShippingMin: input.freeShippingMin,
          urgencyText: input.urgencySignals,
          category: input.category,
          reason: input.reason,
          shoppingHour: new Date().getHours(),
          emotionalState: input.emotionalState
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.analysis) {
          setAuditResult({
            deceptionScore: data.analysis.deceptionScore || baseDeception,
            urgencyReality: data.analysis.urgencyReality,
            regretProbability: data.analysis.regretProbability,
            costPerUse,
            shippingTrapAdvice,
            psychologicalTriggers: data.analysis.psychologicalTriggers || [],
            customerAdvocateRecommendation: data.analysis.customerAdvocateRecommendation,
            counterActionQuestions: data.analysis.counterActionQuestions || []
          });
          setIsLoadingAi(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend advisor fallback triggered:', e);
    }

    // Heuristic fallbacks with deep psychological rigor
    const regretRisk = isLateNightOrStressed ? 'High (68-80%)' : (uses <= 5 ? 'Moderate (45-60%)' : 'Low (15-25%)');
    
    setAuditResult({
      deceptionScore: baseDeception,
      urgencyReality: hasUrgency 
        ? "The timer or stock warning is an algorithmic urgency nudge designed to induce sympathetic nervous system arousal and suppress price comparison."
        : "Standard catalog presentation without aggressive countdown timers.",
      regretProbability: regretRisk,
      costPerUse,
      shippingTrapAdvice,
      psychologicalTriggers: [
        nominalSavings > 0 ? `Anchor Price Effect: Your brain is evaluating the $${nominalSavings.toFixed(2)} 'discount' rather than the $${price.toFixed(2)} direct outflow.` : "Utility-based pricing without artificial markdowns.",
        isLateNightOrStressed ? "Ego Depletion & Dopamine Seeking: Purchasing while bored or fatigued impairs self-regulatory boundaries." : "Deliberate cognitive state.",
        thresholdGap > 0 ? `Threshold Escalation: Spending an extra $${thresholdGap.toFixed(2)} to avoid a $${shipping.toFixed(2)} fee.` : "Direct shipping clarity."
      ],
      customerAdvocateRecommendation: isLateNightOrStressed 
        ? "MANDATORY 24-HOUR COOLING-OFF PERIOD. Close the tab immediately. If you wake up tomorrow at 11:00 AM and still remember this item without checking your browser history, revisit it with a clear prefrontal cortex."
        : "This purchase appears intentional, but ensure the calculated cost-per-use fits your real lifestyle habits before entering card details.",
      counterActionQuestions: [
        "If this exact item were sold at a physical store 15 minutes away for this exact price in cash, would you get up and go buy it right now?",
        "If you could not return it, does it solve a recurring daily problem?",
        "Are you buying the item, or are you buying the short-term dopamine surge of the confirmation screen?"
      ]
    });

    setIsLoadingAi(false);
  };

  const handleStartPledge = () => {
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleTimeString([], {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    setPledgeExpiry(expiry);
    setPledgeActive(true);
  };

  return (
    <div className="space-y-8">
      {/* Title & Context */}
      <div className="border-b border-neutral-800 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Real-Time Cart & Purchase Decision Auditor
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Input any item you are currently contemplating to uncover hidden psychological traps, calculate true cost-per-use, and get an objective consumer advocate evaluation.
        </p>
      </div>

      {/* Preset Scenarios for Quick Testing */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-neutral-400 font-medium">Quick Test Scenarios:</span>
        <button
          onClick={() => handleLoadScenario('nightscroll')}
          className="rounded-md border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800 transition-colors whitespace-nowrap"
        >
          Midnight Dopamine Scroll ($49)
        </button>
        <button
          onClick={() => handleLoadScenario('threshold')}
          className="rounded-md border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800 transition-colors whitespace-nowrap"
        >
          Free Shipping Threshold Trap ($38)
        </button>
        <button
          onClick={() => handleLoadScenario('gadget')}
          className="rounded-md border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800 transition-colors whitespace-nowrap"
        >
          Flash Deal Tech Accessory ($34)
        </button>
        <button
          onClick={() => handleLoadScenario('jacket')}
          className="rounded-md border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-neutral-300 hover:bg-neutral-800 transition-colors whitespace-nowrap"
        >
          High-Utility Wardrobe Staple ($145)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (Left Column) */}
        <div className="lg:col-span-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Purchase Specifications</h3>
            <span className="text-xs font-mono text-neutral-400">Cart Parameters</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Item Title or Description</label>
              <input
                type="text"
                value={input.itemName}
                onChange={(e) => setInput({ ...input, itemName: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Ergonomic Office Chair"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Product Category</label>
                <select
                  value={input.category}
                  onChange={(e) => setInput({ ...input, category: e.target.value })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-blue-500 focus:outline-none"
                >
                  <option>Fashion & Apparel</option>
                  <option>Tech & Gadgets</option>
                  <option>Home Goods</option>
                  <option>Beauty & Skincare</option>
                  <option>Kitchen Gadgets</option>
                  <option>Books & Learning</option>
                  <option>Fitness & Outdoor</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Current Checkout Price ($)</label>
                <input
                  type="number"
                  value={input.price}
                  onChange={(e) => setInput({ ...input, price: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 font-mono tabular-nums focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Anchor / Stated MSRP ($)</label>
                <input
                  type="number"
                  value={input.originalPrice}
                  onChange={(e) => setInput({ ...input, originalPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 font-mono tabular-nums focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Shipping Fee ($)</label>
                <input
                  type="number"
                  value={input.shippingFee}
                  onChange={(e) => setInput({ ...input, shippingFee: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 font-mono tabular-nums focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Free Ship Min ($)</label>
                <input
                  type="number"
                  value={input.freeShippingMin}
                  onChange={(e) => setInput({ ...input, freeShippingMin: parseFloat(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 font-mono tabular-nums focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Urgency Banners / Countdown Present</label>
              <input
                type="text"
                value={input.urgencySignals}
                onChange={(e) => setInput({ ...input, urgencySignals: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. 'Only 2 left', 'Sale ends in 12m', or leave blank if none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">Your State of Mind Right Now</label>
                <select
                  value={input.emotionalState}
                  onChange={(e) => setInput({ ...input, emotionalState: e.target.value as any })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-blue-500 focus:outline-none"
                >
                  <option>Calm & Intentional</option>
                  <option>Bored / Scrolling</option>
                  <option>Stressed / Seeking Relief</option>
                  <option>Excited / FOMO</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">Realistic Uses (First Year)</label>
                <input
                  type="number"
                  value={input.expectedUsesPerYear}
                  onChange={(e) => setInput({ ...input, expectedUsesPerYear: parseInt(e.target.value) || 1 })}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 font-mono tabular-nums focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Why do you want this?</label>
              <textarea
                rows={2}
                value={input.reason}
                onChange={(e) => setInput({ ...input, reason: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-blue-500 focus:outline-none resize-none"
                placeholder="Describe why you clicked add to cart..."
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={runAudit}
              disabled={isLoadingAi}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-500 disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {isLoadingAi ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Auditing Psychological Signals...</span>
                </>
              ) : (
                <>
                  <Calculator className="h-3.5 w-3.5" />
                  <span>Execute Consumer Behavioral Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Results (Right Column) */}
        <div className="lg:col-span-6 space-y-4">
          {auditResult ? (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
              
              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                    Deception & Urgency Pressure
                  </div>
                  <div className="text-2xl font-bold text-white mt-0.5">
                    {auditResult.deceptionScore}% <span className="text-xs font-normal text-neutral-400">Manufactured Urgency</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-xs font-medium text-neutral-400">Post-Purchase Regret Risk</div>
                  <div className={`text-sm font-bold font-mono ${
                    auditResult.regretProbability.includes('High') ? 'text-rose-400' :
                    auditResult.regretProbability.includes('Moderate') ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {auditResult.regretProbability}
                  </div>
                </div>
              </div>

              {/* Economic Reality Check: Cost Per Use */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                  <div className="text-xs text-neutral-400">Effective Cost Per Use</div>
                  <div className="text-2xl font-extrabold text-blue-400 font-mono tabular-nums mt-1">
                    ${auditResult.costPerUse.toFixed(2)}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Based on {input.expectedUsesPerYear} expected uses
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                  <div className="text-xs text-neutral-400">Stated Markdown Gap</div>
                  <div className="text-2xl font-extrabold text-neutral-200 font-mono tabular-nums mt-1">
                    {input.originalPrice > input.price ? `$${(input.originalPrice - input.price).toFixed(2)}` : '$0.00'}
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Anchor price perception
                  </div>
                </div>
              </div>

              {/* Free Shipping Trap Analysis */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Free Shipping Threshold Analysis</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed font-mono">
                  {auditResult.shippingTrapAdvice}
                </p>
              </div>

              {/* Active Psychological Triggers Detected */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-neutral-300">
                  Detected Psychological Triggers
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-400">
                  {auditResult.psychologicalTriggers.map((trig, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 font-mono shrink-0">→</span>
                      <span>{trig}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Consumer Advocate Recommendation */}
              <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-4 space-y-2">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Consumer Defense Directive</span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-medium">
                  {auditResult.customerAdvocateRecommendation}
                </p>
              </div>

              {/* Self-Reflection Prompts */}
              <div className="space-y-2 border-t border-neutral-800 pt-4">
                <div className="text-xs font-semibold text-neutral-400">
                  Three Pre-Checkout Questions to Ask Yourself:
                </div>
                <div className="space-y-1 text-xs text-neutral-300 italic">
                  {auditResult.counterActionQuestions.map((q, idx) => (
                    <div key={idx} className="pl-3 border-l border-neutral-700 py-0.5">
                      "{q}"
                    </div>
                  ))}
                </div>
              </div>

              {/* The 24-Hour Cooling Off Pledge Button */}
              <div className="pt-2 border-t border-neutral-800">
                {!pledgeActive ? (
                  <button
                    onClick={handleStartPledge}
                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/80 px-4 py-2.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
                  >
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>Activate 24-Hour Cart Hold Challenge</span>
                  </button>
                ) : (
                  <div className="rounded-lg border border-emerald-900/60 bg-emerald-950/30 p-3 text-center space-y-1">
                    <div className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>24-Hour Cooling-Off Active</span>
                    </div>
                    <p className="text-xs text-neutral-300">
                      Do not open this cart tab until <strong className="text-white">{pledgeExpiry}</strong>. If your desire disappears, you saved <span className="font-mono text-emerald-400 font-bold">${input.price.toFixed(2)}</span>.
                    </p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* Empty State */
            <div className="h-full rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                <Calculator className="h-6 w-6 text-neutral-400" />
              </div>
              <div className="space-y-1 max-w-sm">
                <div className="text-sm font-semibold text-white">No Active Audit Performed</div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Enter your cart parameters on the left or select a quick test scenario above to dissect urgency algorithms, dark patterns, and true net utility.
                </p>
              </div>
              <button
                onClick={runAudit}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                <span>Run audit with default inputs</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
