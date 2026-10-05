import React, { useState } from 'react';
import { COGNITIVE_BIASES } from '../data/behaviorData';
import { CognitiveBias } from '../types/behavior';
import { Brain, Sparkles, Scale, AlertCircle, ShieldCheck, ArrowRight, DollarSign } from 'lucide-react';

export const BiasesExplorer: React.FC = () => {
  const [selectedBiasId, setSelectedBiasId] = useState<string>(COGNITIVE_BIASES[0].id);

  // Interactive Simulator States
  // 1. Free Shipping Mirage Simulator
  const [basketValue, setBasketValue] = useState<number>(36);
  const [shippingFee, setShippingFee] = useState<number>(6);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(50);
  const [fillerItemCost, setFillerItemCost] = useState<number>(18);

  // 2. Anchor Pricing Simulator
  const [anchorPrice, setAnchorPrice] = useState<number>(180);
  const [salePrice, setSalePrice] = useState<number>(65);

  const activeBias = COGNITIVE_BIASES.find(b => b.id === selectedBiasId) || COGNITIVE_BIASES[0];

  // Mathematical outputs for simulators
  const shippingGap = Math.max(0, freeShippingThreshold - basketValue);
  const costWithShipping = basketValue + shippingFee;
  const costWithFiller = basketValue + fillerItemCost;
  const netDifference = costWithFiller - costWithShipping; // positive means you paid more to save shipping!

  const fakeSavings = Math.max(0, anchorPrice - salePrice);
  const discountPercent = anchorPrice > 0 ? Math.round((fakeSavings / anchorPrice) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Title & Framing */}
      <div className="border-b border-neutral-800 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          The 8 Cognitive Biases in Online Shopping
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          How modern e-commerce interface design exploits predictable human psychological heuristics—and the customer countermeasures to neutralize them.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Bias Selector List (Left Column) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 px-2 mb-2">
            Catalog of Consumer Vulnerabilities
          </div>
          
          <div className="space-y-1.5">
            {COGNITIVE_BIASES.map((bias) => {
              const isSelected = bias.id === selectedBiasId;
              return (
                <button
                  key={bias.id}
                  onClick={() => setSelectedBiasId(bias.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/30 text-white'
                      : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-blue-400">{bias.category}</span>
                    <span className="text-neutral-500">Heuristic</span>
                  </div>
                  <div className="text-sm font-semibold leading-snug">
                    {bias.title}
                  </div>
                  <div className="text-xs text-neutral-400 mt-0.5 truncate">
                    {bias.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Breakdown & Interactive Simulators (Right Column) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Bias Overview Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
                <span>{activeBias.category} Heuristic</span>
                <span aria-hidden="true">·</span>
                <span>Customer Perspective</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white">
                {activeBias.title}
              </h3>
              <p className="text-sm font-medium text-neutral-400 mt-0.5">
                {activeBias.subtitle}
              </p>
            </div>

            {/* Scientific Principle */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
              <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Brain className="h-3.5 w-3.5 text-blue-400" />
                <span>Underlying Cognitive Mechanism</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {activeBias.scientificPrinciple}
              </p>
            </div>

            {/* Asymmetry Grid: Retailer vs Customer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>The Retailer's Objective</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {activeBias.retailerGoal}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5" />
                  <span>The Customer Vulnerability</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {activeBias.customerVulnerability}
                </p>
              </div>
            </div>

            {/* Real World Scenario */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-neutral-300">
                Everyday E-Commerce Reality
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed border-l-2 border-neutral-700 pl-3 italic">
                "{activeBias.realWorldExample}"
              </p>
            </div>

            {/* Counter Strategy */}
            <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4 space-y-1.5">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>The Conscious Shopper Counter-Move</span>
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed font-medium">
                {activeBias.counterStrategy}
              </p>
            </div>

          </div>

          {/* Dynamic Interactive Simulator Block */}
          {activeBias.id === 'free-shipping-mirage' && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span>Interactive Free Shipping Trap Calculator</span>
                </h4>
                <span className="text-xs font-mono text-neutral-400">Live Mathematical Audit</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Original Basket ($)</label>
                  <input
                    type="number"
                    value={basketValue}
                    onChange={(e) => setBasketValue(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-neutral-100 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Standard Shipping ($)</label>
                  <input
                    type="number"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-neutral-100 font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Free Ship Threshold ($)</label>
                  <input
                    type="number"
                    value={freeShippingThreshold}
                    onChange={(e) => setFreeShippingThreshold(parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-neutral-100 font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-4">
                <div className="text-xs text-neutral-400">
                  You are <strong className="text-white font-mono">${shippingGap.toFixed(2)}</strong> away from free shipping. 
                  Say you add a filler item worth:
                </div>
                
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={fillerItemCost}
                    onChange={(e) => setFillerItemCost(parseFloat(e.target.value) || 0)}
                    className="w-full accent-blue-500"
                  />
                  <span className="font-mono text-white text-sm font-bold tabular-nums min-w-[50px]">
                    ${fillerItemCost.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block">Option A: Pay Delivery Fee</span>
                    <span className="text-base font-bold font-mono text-neutral-200">${costWithShipping.toFixed(2)}</span>
                    <span className="block text-neutral-500 mt-0.5">Bought only what you actually need</span>
                  </div>

                  <div>
                    <span className="text-neutral-400 block">Option B: Add Filler Item</span>
                    <span className="text-base font-bold font-mono text-amber-400">${costWithFiller.toFixed(2)}</span>
                    <span className={`block mt-0.5 font-semibold ${netDifference > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {netDifference > 0 ? `Net Cash Loss: -$${netDifference.toFixed(2)}` : `Net Cash Saved: +$${Math.abs(netDifference).toFixed(2)}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeBias.id === 'anchor-pricing' && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Scale className="h-4 w-4 text-blue-400" />
                  <span>The Strikethrough Anchor Simulator</span>
                </h4>
                <span className="text-xs font-mono text-neutral-400">Psychological Perception vs Cash Reality</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Strikethrough "Was" Price: ${anchorPrice}</label>
                  <input
                    type="range"
                    min="50"
                    max="500"
                    step="5"
                    value={anchorPrice}
                    onChange={(e) => setAnchorPrice(parseFloat(e.target.value) || 0)}
                    className="w-full accent-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Actual Checkout "Now" Price: ${salePrice}</label>
                  <input
                    type="range"
                    min="10"
                    max="300"
                    step="5"
                    value={salePrice}
                    onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 grid grid-cols-2 gap-4 text-center">
                <div className="border-r border-neutral-800 pr-2">
                  <div className="text-xs text-neutral-400">What The Retailer Wants You To Feel</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                    "I Saved ${fakeSavings.toFixed(2)} ({discountPercent}% OFF!)"
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">Dopamine from phantom gain</div>
                </div>

                <div className="pl-2">
                  <div className="text-xs text-neutral-400">The Hard Mathematical Reality</div>
                  <div className="text-2xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
                    -$${salePrice.toFixed(2)} Cash Outflow
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">Actual dollars deducted from account</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
