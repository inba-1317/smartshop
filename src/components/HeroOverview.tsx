import React, { useState } from 'react';
import { ArrowRight, ShoppingCart, Clock, DollarSign, ShieldCheck, HelpCircle } from 'lucide-react';

interface HeroOverviewProps {
  onStartQuiz: () => void;
  onOpenAuditor: () => void;
  onExploreBiases: () => void;
  onExploreDataset: () => void;
}

export const HeroOverview: React.FC<HeroOverviewProps> = ({
  onStartQuiz,
  onOpenAuditor,
  onExploreBiases,
  onExploreDataset
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-12">
      {/* Editorial Headline & Mission */}
      <section className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase">
              Consumer Behavioral Economics & UX Analysis
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
              The Digital Cart as an Arena of Psychological Warfare
            </h1>
            
            <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
              Every year, e-commerce giants invest billions into conversion rate optimization: 
              artificial countdown timers, pre-checked add-ons, dopamine-tuned push notifications, and 
              one-click checkout flows engineered to bypass your prefrontal cortex.
            </p>
            
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              This platform examines online shopping purely from the <strong className="text-neutral-200">Customer’s Point of View</strong>: 
              deconstructing how cognitive biases dictate your basket decisions, why 70% of carts are parked, 
              and how to transform impulsive spending into conscious consumer agency.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onStartQuiz}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 whitespace-nowrap"
              >
                <span>Take 2-Min Shopper Diagnostic</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={onExploreDataset}
                className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800/90 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 whitespace-nowrap"
              >
                <span>Explore 3.9K Dataset Intel</span>
              </button>
              
              <button
                onClick={onOpenAuditor}
                className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/80 px-4 py-2.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white whitespace-nowrap"
              >
                <span>Audit a Current Cart</span>
              </button>
            </div>

            {/* Unboxed Metadata / Research Source */}
            <div className="flex flex-wrap items-center gap-2 pt-4 text-xs text-neutral-400">
              <span>Baymard Institute E-Commerce Audits</span>
              <span aria-hidden="true">·</span>
              <span>Behavioral Economics Lab (Tversky & Kahneman)</span>
              <span aria-hidden="true">·</span>
              <span>Customer First Perspective</span>
            </div>
          </div>

          {/* Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
              {!imageError ? (
                <img
                  src="/src/assets/images/hero_cart_psychology_1791205528621.jpg"
                  alt="Customer digital shopping cart behavioral neural pathways"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 text-center">
                  <ShoppingCart className="h-12 w-12 text-blue-500 mb-3" />
                  <span className="text-sm font-medium text-neutral-200">Cart Cognitive Bias Architecture</span>
                  <span className="text-xs text-neutral-400 mt-1">Analyzing customer decision friction</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-xs text-neutral-300 font-medium">
                Analysis Matrix: Impulse Propensity vs Rational Utility
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Quantitative Empirical Research Benchmarks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white">
            The Hard Numbers Behind Online Shopping Behavior
          </h2>
          <div className="text-xs text-neutral-400">Verified Consumer Research Studies</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
            <div className="text-xs text-neutral-400 font-medium">Global Cart Abandonment</div>
            <div className="text-3xl font-extrabold text-blue-400 font-mono tabular-nums">70.19%</div>
            <p className="text-xs text-neutral-400 leading-normal">
              7 in 10 carts are intentionally left behind. Consumers use carts as temporary wishlists, price monitors, or abandonment shields against unexpected fees.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
            <div className="text-xs text-neutral-400 font-medium">Free Shipping Trap Average</div>
            <div className="text-3xl font-extrabold text-amber-400 font-mono tabular-nums">+$21.40</div>
            <p className="text-xs text-neutral-400 leading-normal">
              Average extra dollar amount a shopper spends on unneeded filler items solely to avoid a visible $4.99 to $6.99 delivery charge.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
            <div className="text-xs text-neutral-400 font-medium">Late-Night Ego Depletion</div>
            <div className="text-3xl font-extrabold text-purple-400 font-mono tabular-nums">48%</div>
            <p className="text-xs text-neutral-400 leading-normal">
              Nearly half of unplanned impulse checkouts occur between 10 PM and 2 AM, when circadian willpower is depleted and dopamine-seeking peaks.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-2">
            <div className="text-xs text-neutral-400 font-medium">Return Inertia ("Hassle Tax")</div>
            <div className="text-3xl font-extrabold text-rose-400 font-mono tabular-nums">64%</div>
            <p className="text-xs text-neutral-400 leading-normal">
              Of items bought with the reassuring thought "I can always return it", 64% are never returned due to repackaging and drop-off friction.
            </p>
          </div>
        </div>
      </section>

      {/* The 3-Step Customer Defense Framework */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white">The Consumer Counter-Framework</h3>
          <p className="text-sm text-neutral-400 mt-1">
            How conscious shoppers defend their finances and mental clarity against engineered conversion funnels:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3 border-l-2 border-blue-500 pl-4">
            <div className="text-xs font-mono text-blue-400">PILLAR 01</div>
            <h4 className="text-base font-semibold text-neutral-100">Audit the Anchor Price</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Discounts are mental anchors. If an item was artificially listed at $180 and discounted to $60, 
              you didn't "save $120"—you transferred $60 of real after-tax cash to the seller. Always ask: 
              "Would I buy this if there was no sale badge?"
            </p>
          </div>

          <div className="space-y-3 border-l-2 border-emerald-500 pl-4">
            <div className="text-xs font-mono text-emerald-400">PILLAR 02</div>
            <h4 className="text-base font-semibold text-neutral-100">Enforce the 24-Hour Cart Hold</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dopamine spikes in the anticipation of checkout, not the ownership. Parking your cart for 24-48 hours 
              lets adrenaline dissipate. Over 65% of items left in a cart for 24 hours lose their emotional appeal.
            </p>
          </div>

          <div className="space-y-3 border-l-2 border-amber-500 pl-4">
            <div className="text-xs font-mono text-amber-400">PILLAR 03</div>
            <h4 className="text-base font-semibold text-neutral-100">Calculate True Cost-Per-Use</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              A $120 pair of boots worn 200 times costs $0.60 per use. A $25 fast-fashion top worn twice costs $12.50 per use 
              plus closet clutter. True value is measured across lifetime utility, never invoice price.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-4">
          <button
            onClick={onExploreBiases}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5"
          >
            <span>Explore all 8 Cognitive Biases in detail</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
