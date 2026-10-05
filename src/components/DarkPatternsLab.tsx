import React, { useState } from 'react';
import { DARK_PATTERNS } from '../data/behaviorData';
import { DarkPattern } from '../types/behavior';
import { ShieldAlert, AlertTriangle, Check, X, RefreshCw, EyeOff, ShieldCheck } from 'lucide-react';

export const DarkPatternsLab: React.FC = () => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(DARK_PATTERNS[0].id);
  const [sneakyChecked, setSneakyChecked] = useState<boolean>(true);
  const [timerSeconds, setTimerSeconds] = useState<number>(482);
  const [timerResetCount, setTimerResetCount] = useState<number>(0);
  const [confirmshameClicked, setConfirmshameClicked] = useState<string | null>(null);

  const activePattern = DARK_PATTERNS.find(p => p.id === selectedPatternId) || DARK_PATTERNS[0];

  const handleResetTimer = () => {
    setTimerSeconds(900); // 15 mins
    setTimerResetCount(prev => prev + 1);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-neutral-800 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Deceptive Pattern Defense Lab
        </h2>
        <p className="text-sm text-neutral-400 mt-1">
          Interactive forensic deconstruction of predatory e-commerce UX tactics engineered to coerce consent and extract unauthorized revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pattern Selector List (Left Column) */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 px-2 mb-2">
            Deceptive Pattern Codex
          </div>

          <div className="space-y-1.5">
            {DARK_PATTERNS.map((pattern) => {
              const isSelected = pattern.id === selectedPatternId;
              return (
                <button
                  key={pattern.id}
                  onClick={() => {
                    setSelectedPatternId(pattern.id);
                    setConfirmshameClicked(null);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/30 text-white'
                      : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-neutral-200">{pattern.name}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      pattern.severity === 'Severe' ? 'text-rose-400 bg-rose-950/50 border border-rose-900/40' :
                      pattern.severity === 'High' ? 'text-amber-400 bg-amber-950/50 border border-amber-900/40' :
                      'text-blue-400 bg-blue-950/50 border border-blue-900/40'
                    }`}>
                      {pattern.severity}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 truncate">
                    {pattern.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pattern Deconstruction & Interactive Simulator (Right Column) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Detailed Explainer */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono text-rose-400 uppercase tracking-wider mb-1">
                  Tactical Pattern Breakdown
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  {activePattern.name}
                </h3>
              </div>
              <div className="text-xs font-mono text-neutral-400 border border-neutral-800 px-2 py-1 rounded">
                Severity: {activePattern.severity}
              </div>
            </div>

            <p className="text-sm text-neutral-300 leading-relaxed">
              {activePattern.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                  <span>The Mechanism</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {activePattern.howItWorks}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                  <span>Customer Harm</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {activePattern.customerHarm}
                </p>
              </div>
            </div>

            {/* Practical Detection Tip */}
            <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-4 space-y-1.5">
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Detection & Countermeasure Protocol</span>
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed">
                {activePattern.detectionTip}
              </p>
            </div>
          </div>

          {/* Interactive Pattern Simulator Box */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="text-xs font-semibold text-white">
                Live Interactive Simulation
              </div>
              <span className="text-[11px] font-mono text-neutral-400">Experience the Manipulation</span>
            </div>

            {/* Confirmshaming Interactive Demo */}
            {activePattern.id === 'confirmshaming' && (
              <div className="rounded-xl border border-neutral-700 bg-neutral-950 p-6 text-center space-y-4 max-w-md mx-auto">
                <div className="text-lg font-bold text-white">
                  Unlock 15% Off Your Entire Cart!
                </div>
                <p className="text-xs text-neutral-400">
                  Join 100,000+ smart insiders and receive our secret weekly VIP promotions.
                </p>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setConfirmshameClicked('accepted')}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors cursor-pointer"
                  >
                    YES! SEND MY 15% VIP DISCOUNT
                  </button>

                  <button
                    onClick={() => setConfirmshameClicked('shamed')}
                    className="w-full text-[11px] text-neutral-500 hover:text-neutral-400 underline transition-colors cursor-pointer py-1"
                  >
                    No thanks, I prefer paying full price and wasting money
                  </button>
                </div>

                {confirmshameClicked && (
                  <div className="text-xs font-mono p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                    {confirmshameClicked === 'accepted' 
                      ? 'Simulated Result: You succumbed to the reward framing. Your inbox now receives daily marketing nudges.'
                      : 'Simulated Result: You recognized the emotional shaming tactic and preserved your privacy.'}
                  </div>
                )}
              </div>
            )}

            {/* Sneak into Basket Interactive Demo */}
            {activePattern.id === 'sneak-into-basket' && (
              <div className="rounded-xl border border-neutral-700 bg-neutral-950 p-6 space-y-4 max-w-md mx-auto text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                  <span className="font-semibold text-neutral-200">Checkout Step 2: Shipping & Add-ons</span>
                  <span className="font-mono text-neutral-400">Subtotal: $45.00</span>
                </div>

                <div 
                  onClick={() => setSneakyChecked(!sneakyChecked)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                    sneakyChecked ? 'border-amber-500/60 bg-amber-950/20' : 'border-neutral-800 bg-neutral-900/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={sneakyChecked}
                    onChange={() => {}}
                    className="mt-0.5 accent-blue-500 cursor-pointer"
                  />
                  <div>
                    <div className="font-semibold text-neutral-100 flex items-center justify-between">
                      <span>Package Protection & Transit Warranty</span>
                      <span className="font-mono text-amber-400">+$3.98</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Pre-selected by default. Replaces items damaged or stolen in transit (which the courier is already legally obligated to deliver).
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-neutral-800 font-mono">
                  <span className="text-neutral-300">Final Order Charge:</span>
                  <span className={`text-sm font-bold ${sneakyChecked ? 'text-amber-400' : 'text-emerald-400'}`}>
                    ${sneakyChecked ? '48.98' : '45.00'}
                  </span>
                </div>

                <div className="text-[11px] text-neutral-400 text-center italic">
                  {sneakyChecked ? 'Notice how the box was pre-checked without asking your affirmative consent.' : 'Well done! You un-checked the stealth fee.'}
                </div>
              </div>
            )}

            {/* Phantom Countdown Clock Interactive Demo */}
            {activePattern.id === 'urgency-resets' && (
              <div className="rounded-xl border border-neutral-700 bg-neutral-950 p-6 space-y-4 max-w-md mx-auto text-center">
                <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                  ⚠️ Emergency Flash Markdown Ending Soon
                </div>

                <div className="text-4xl font-extrabold font-mono text-white tracking-widest tabular-nums">
                  {formatTimer(timerSeconds)}
                </div>

                <p className="text-xs text-neutral-400">
                  The merchant hopes you panic-buy before the clock reaches zero.
                </p>

                <div className="pt-2">
                  <button
                    onClick={handleResetTimer}
                    className="flex items-center justify-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-lg mx-auto cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Simulate Refreshing Browser Window</span>
                  </button>
                </div>

                {timerResetCount > 0 && (
                  <div className="text-xs font-mono text-emerald-400 p-2 rounded bg-neutral-900 border border-neutral-800">
                    Busted! Timer reset back to 15:00 ({timerResetCount} time{timerResetCount > 1 ? 's' : ''}). The scarcity is 100% fabricated.
                  </div>
                )}
              </div>
            )}

            {/* Phantom Social Proof Demo */}
            {activePattern.id === 'phantom-social-proof' && (
              <div className="rounded-xl border border-neutral-700 bg-neutral-950 p-6 space-y-4 max-w-md mx-auto text-center">
                <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900 flex items-center gap-3 text-left">
                  <div className="h-8 w-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                    🔥
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-200">
                      High Demand: 24 people looking right now
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      "Liam from Dallas" purchased 4 minutes ago
                    </div>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  These widgets are frequently generated by client-side Javascript scripts using randomized names and time intervals to manufacture artificial peer validation.
                </p>
              </div>
            )}

            {/* Disguised Continuity Demo */}
            {activePattern.id === 'roosting-subscription' && (
              <div className="rounded-xl border border-neutral-700 bg-neutral-950 p-6 space-y-3 max-w-md mx-auto text-xs">
                <div className="font-semibold text-neutral-200">Choose Purchase Option:</div>

                <div className="p-3 rounded-lg border border-blue-500/80 bg-blue-950/20 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span className="text-blue-400">●</span>
                      <span>Subscribe & Save 20% (Default)</span>
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      Auto-renews every 30 days at $28.00 until cancelled
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">$28.00</span>
                </div>

                <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-900/40 flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-1.5 text-neutral-300">
                    <span>○</span>
                    <span>One-time purchase only</span>
                  </div>
                  <span className="font-mono text-neutral-300">$35.00</span>
                </div>

                <p className="text-[11px] text-neutral-400 italic text-center">
                  Notice how the one-time purchase is visually suppressed while the recurring billing commitment is prominently highlighted.
                </p>
              </div>
            )}

            {/* Drip Pricing Demo */}
            {activePattern.id === 'hidden-costs-drip' && (
              <div className="rounded-xl border border-neutral-700 bg-neutral-950 p-6 space-y-3 max-w-md mx-auto text-xs">
                <div className="text-neutral-400">Stage 1 Advertised Catalog Price: <strong className="text-white font-mono">$40.00</strong></div>
                <div className="space-y-1.5 border-t border-b border-neutral-800 py-2.5 font-mono">
                  <div className="flex justify-between text-neutral-400">
                    <span>Base Ticket Price:</span>
                    <span>$40.00</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>+ Mandatory Convenience Fee:</span>
                    <span>$6.50</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>+ Facility & Surcharge:</span>
                    <span>$4.25</span>
                  </div>
                  <div className="flex justify-between text-amber-400">
                    <span>+ Delivery Fee:</span>
                    <span>$3.99</span>
                  </div>
                </div>
                <div className="flex justify-between items-center font-bold text-sm">
                  <span className="text-neutral-200">True Out-of-Pocket:</span>
                  <span className="font-mono text-rose-400">$54.74 (+36.8%)</span>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
