import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/behaviorData';
import { QuizResult, ShoppingArchetype } from '../types/behavior';
import { CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, AlertTriangle, Sparkles } from 'lucide-react';

interface QuizDiagnosticProps {
  onAuditWithProfile?: (profile: QuizResult) => void;
}

export const QuizDiagnostic: React.FC<QuizDiagnosticProps> = ({ onAuditWithProfile }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const handleSelectOption = (optionIndex: number) => {
    const updatedAnswers = { ...answers, [currentStep]: optionIndex };
    setAnswers(updatedAnswers);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(updatedAnswers);
    }
  };

  const calculateResult = (finalAnswers: Record<number, number>) => {
    let totalImpulse = 0;
    let totalThreshold = 0;
    let totalResearch = 0;
    let totalReturnFriction = 0;
    let totalScarcity = 0;

    QUIZ_QUESTIONS.forEach((q, idx) => {
      const selectedOptionIdx = finalAnswers[idx] ?? 0;
      const scores = q.options[selectedOptionIdx].scores;
      totalImpulse += scores.impulse;
      totalThreshold += scores.threshold;
      totalResearch += scores.research;
      totalReturnFriction += scores.returnFriction;
      totalScarcity += scores.scarcity;
    });

    const count = QUIZ_QUESTIONS.length;
    const avgScores = {
      impulse: Math.round(totalImpulse / count),
      threshold: Math.round(totalThreshold / count),
      research: Math.round(totalResearch / count),
      returnFriction: Math.round(totalReturnFriction / count),
      scarcity: Math.round(totalScarcity / count)
    };

    // Determine Archetype
    let archetype: ShoppingArchetype = 'The Strategic Cart Parker';
    let description = '';
    let coreVulnerability = '';
    let superpower = '';
    let recommendedRules: string[] = [];

    if (avgScores.impulse > 70 && avgScores.scarcity > 60) {
      archetype = 'The Dopamine Bargain Hunter';
      description = 'You experience online shopping as high-stimulation emotional entertainment. The rush of discovery, countdown timers, and sudden price slashes trigger strong reward anticipation, often overriding pre-purchase utility checks.';
      coreVulnerability = 'Urgency manipulation (countdown clocks, low-stock warnings) and late-night scrolling fatigue.';
      superpower = 'High speed and enthusiasm; you know how to find obscure products quickly.';
      recommendedRules = [
        'Enforce a strict "No Purchases After 10:00 PM" digital firewall.',
        'Delete saved credit card details from auto-fill to introduce physical payment friction.',
        'Implement the 48-Hour Cart Hold: keep items parked for 2 days before completing payment.'
      ];
    } else if (avgScores.research > 75) {
      archetype = 'The Analysis Paralysis Researcher';
      description = 'You never buy on a whim. Instead, you fall into extensive review rabbit holes, cross-referencing specifications, alternative brands, and customer complaints until decision fatigue sets in.';
      coreVulnerability = 'The Paradox of Choice. You over-invest hours of cognitive energy into low-stakes items ($15-$40) and suffer post-purchase doubt.';
      superpower = 'Immune to fake urgency and superficial marketing hype; you rarely buy defective junk.';
      recommendedRules = [
        'Adopt the "Satisficing Rule": set 3 non-negotiable specs; buy the first item meeting all three within 15 minutes.',
        'Cap review reading at 5 negative reviews and 5 recent verified reviews maximum.',
        'Value your personal time: spending 2 hours researching a $20 item represents an implicit wage deficit.'
      ];
    } else if (avgScores.threshold > 65) {
      archetype = 'The Threshold Vulnerable Saver';
      description = 'You have a severe psychological aversion to paying for shipping, delivery, or processing fees. You frequently spend an extra $20-$35 on unneeded accessories just to get "free" $5 shipping.';
      coreVulnerability = 'The Zero-Price Effect. You treat shipping fees as wasted capital while treating basket fillers as free assets.',
      superpower = 'Financially conscious and disciplined when comparing baseline catalog prices.',
      recommendedRules = [
        'The Absolute Threshold Rule: Never add more in filler items than the cost of shipping itself.',
        'If shipping is $5.99 and you are $15 short, pay the $5.99 shipping fee or abandon the entire cart.',
        'Only hit thresholds with staple consumable goods (e.g. coffee, paper, toiletries) you currently need.'
      ];
    } else if (avgScores.impulse > 60 && avgScores.returnFriction > 60) {
      archetype = 'The Frictionless One-Clicker';
      description = 'You prioritize speed and friction elimination above all else. Apple Pay, 1-Click checkout, and stored credentials make transactions seamless, while returns are dreaded and frequently neglected.',
      coreVulnerability = 'Return Inertia. Sub-optimal items remain in your closet or drawers because the return friction is too high.',
      superpower = 'Extremely efficient decision-maker who values convenience and modern UX.',
      recommendedRules = [
        'Assume all online shopping is 100% Final Sale. If you wouldn\'t buy it with zero return policy, skip it.',
        'Disable 1-Click checkout and Biometric auto-pay on shopping apps.',
        'Immediately place any item to be returned directly inside your daily backpack or by the front door.'
      ];
    } else {
      archetype = 'The Strategic Cart Parker';
      description = 'You have naturally developed healthy consumer shields. You use shopping carts as temporary wishlists, deliberately letting items sit to test desire, and actively wait for retargeting discounts.',
      coreVulnerability = 'Occasional cart accumulation and digital tab clutter across dozens of retailers.',
      superpower = 'High cognitive self-regulation; you master e-commerce algorithms rather than letting them master you.',
      recommendedRules = [
        'Review parked carts once a week and systematically purge items that no longer spark practical interest.',
        'Keep relying on the 48-hour incubation window as your primary psychological buffer.',
        'Watch out for subscription traps disguised as one-time discounts on trusted stores.'
      ];
    }

    setResult({
      archetype,
      archetypeDescription: description,
      coreVulnerability,
      superpower,
      recommendedRules,
      scores: avgScores
    });
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="space-y-8">
      {/* Header & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Customer Behavioral Psychology Diagnostic
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Discover your e-commerce cognitive profile, key manipulation vulnerabilities, and custom defense rules.
          </p>
        </div>
        
        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-700 whitespace-nowrap self-start"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Diagnostic</span>
          </button>
        )}
      </div>

      {!result ? (
        /* Quiz Questions Flow */
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-8">
          
          {/* Progress Tracker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400 font-medium">
              <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
              <span className="font-mono tabular-nums">{Math.round(((currentStep + 1) / QUIZ_QUESTIONS.length) * 100)}% Completed</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                style={{ width: `${((currentStep + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Question */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Scenario {currentStep + 1}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {QUIZ_QUESTIONS[currentStep].question}
            </h3>
            <p className="text-sm text-neutral-400">
              {QUIZ_QUESTIONS[currentStep].context}
            </p>
          </div>

          {/* 4 Interactive Options */}
          <div className="grid grid-cols-1 gap-3.5">
            {QUIZ_QUESTIONS[currentStep].options.map((option, idx) => {
              const isSelected = answers[currentStep] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`text-left p-4 sm:p-5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500/50'
                      : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-semibold text-white">
                        {option.label}
                      </div>
                      <div className="text-xs text-neutral-400 leading-relaxed">
                        {option.description}
                      </div>
                    </div>
                    <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-blue-400 bg-blue-500' : 'border-neutral-600'
                    }`}>
                      {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="text-xs font-medium text-neutral-400 hover:text-neutral-200 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Previous Question
            </button>
            <div className="text-xs text-neutral-500">
              Click an option to proceed
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-8">
          {/* Archetype Hero Card */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="text-xs font-mono uppercase tracking-wider text-blue-400">
                  Your Behavioral Archetype
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {result.archetype}
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  {result.archetypeDescription}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Primary Vulnerability</span>
                    </div>
                    <div className="text-xs text-neutral-300 leading-relaxed">
                      {result.coreVulnerability}
                    </div>
                  </div>

                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Natural Superpower</span>
                    </div>
                    <div className="text-xs text-neutral-300 leading-relaxed">
                      {result.superpower}
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Avatar / Badge */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl border border-neutral-800 bg-neutral-950 text-center">
                <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-blue-500/40 mb-3 bg-neutral-900">
                  <img
                    src="/src/assets/images/customer_advocate_avatar_1791205573188.jpg"
                    alt="Customer psychology profile avatar"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="text-xs font-semibold text-neutral-200">Customer POV Profile</div>
                <div className="text-xs text-neutral-400 mt-0.5">Empirically Assessed</div>
                <div className="mt-3 text-xs font-mono text-blue-400 border-t border-neutral-800 pt-2 w-full">
                  Profile Verified
                </div>
              </div>

            </div>
          </div>

          {/* 5 Behavioral Indices (Tabular numbers) */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-6">
            <h4 className="text-base font-bold text-white">
              Vulnerability Vectors Breakdown (0 - 100%)
            </h4>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-neutral-300">Impulse Susceptibility (Emotional Checkout)</span>
                  <span className="font-mono tabular-nums text-neutral-200 font-semibold">{result.scores.impulse}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 rounded-full" 
                    style={{ width: `${result.scores.impulse}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-neutral-300">Threshold Vulnerability (Free Shipping Trap)</span>
                  <span className="font-mono tabular-nums text-neutral-200 font-semibold">{result.scores.threshold}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${result.scores.threshold}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-neutral-300">Review & Choice Paralysis</span>
                  <span className="font-mono tabular-nums text-neutral-200 font-semibold">{result.scores.research}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${result.scores.research}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-neutral-300">Return Inertia ("Hassle Tax" Avoidance)</span>
                  <span className="font-mono tabular-nums text-neutral-200 font-semibold">{result.scores.returnFriction}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${result.scores.returnFriction}%` }} 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-neutral-300">Scarcity Sensitivity (Stock & Countdown Pressure)</span>
                  <span className="font-mono tabular-nums text-neutral-200 font-semibold">{result.scores.scarcity}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full" 
                    style={{ width: `${result.scores.scarcity}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Rules of Engagement */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 space-y-4">
            <h4 className="text-base font-bold text-white">
              Your Tailored Rules of Engagement (Consumer Firewalls)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.recommendedRules.map((rule, idx) => (
                <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
                    <span>DEFENSE RULE 0{idx + 1}</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                    {rule}
                  </p>
                </div>
              ))}
            </div>

            {onAuditWithProfile && (
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => onAuditWithProfile(result)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors whitespace-nowrap"
                >
                  <span>Apply Profile to Cart Auditor</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
