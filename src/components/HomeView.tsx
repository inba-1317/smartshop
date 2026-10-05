import React, { useState } from 'react';
import { CustomerTransaction } from '../data/customerDatasetModel';
import { UserAccount } from '../types/auth';
import { 
  ArrowRight, Sparkles, Lock, Store
} from 'lucide-react';

interface HomeViewProps {
  dataset: CustomerTransaction[];
  onNavigate: (tab: string) => void;
  currentUser?: UserAccount | null;
  onLoginRequired: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  dataset, 
  onNavigate, 
  currentUser,
  onLoginRequired
}) => {
  const [imageError, setImageError] = useState(false);

  const handleModuleClick = (tabId: string) => {
    if (!currentUser) {
      onLoginRequired();
    } else {
      onNavigate(tabId);
    }
  };

  return (
    <div className="space-y-8 relative">
      
      {/* Ambient background glow from The Shop storefront */}
      <div 
        className="pointer-events-none fixed top-0 left-0 right-0 h-[500px] z-0 opacity-15 blur-3xl bg-cover bg-center"
        style={{ backgroundImage: `url('/src/assets/images/the_shop_dusk_facade_1791214933354.jpg')` }}
      />

      {/* HERO SECTION WITH "THE SHOP" IMAGE AS BACKGROUND */}
      <section className="relative z-10 overflow-hidden rounded-3xl border border-neutral-800/80 shadow-2xl min-h-[520px] flex flex-col justify-between">
        
        {/* Full-bleed background image of The Shop */}
        <div className="absolute inset-0 z-0">
          {!imageError ? (
            <img
              src="/src/assets/images/the_shop_dusk_facade_1791214933354.jpg"
              alt="The Shop boutique retail storefront background"
              className="h-full w-full object-cover object-center filter brightness-[0.95]"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="h-full w-full bg-neutral-900" />
          )}

          {/* Layered Cinematic Overlays for perfect readability & warm boutique feel */}
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        </div>

        {/* Hero Top Tagline & Active User Status */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 pb-0 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950/80 border border-neutral-700/80 backdrop-blur-md text-xs font-semibold tracking-wider text-amber-300 uppercase shadow-sm">
            <Store className="h-3.5 w-3.5 text-amber-400" />
            <span>The Shop · Boutique Retail & Customer Intelligence</span>
          </div>

          {currentUser ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-950/80 border border-neutral-700/80 backdrop-blur-md text-xs">
              <span className={`w-2 h-2 rounded-full ${
                currentUser.role === 'shopkeeper' ? 'bg-emerald-400' :
                currentUser.role === 'admin' ? 'bg-amber-400' : 'bg-blue-400'
              } animate-pulse`} />
              <span className="text-white font-medium">Logged in: {currentUser.name}</span>
              <span className="text-neutral-400 uppercase text-[10px] font-mono">({currentUser.role})</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>3,900 Verified Customer Transactions</span>
            </div>
          )}
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 space-y-6 max-w-3xl">
          <div className="space-y-3">
            <div className="inline-block">
              <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                Customer · Shopkeeper · Admin Portals
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
              SmartShop: Customer Shopping Behaviour & Intelligence
            </h1>

            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed drop-shadow">
              Analyze retail transactions from the <strong className="text-white font-semibold">Customer's Point of View</strong>. 
              Explore empirical purchasing trends across 3,900 benchmark records, evaluate personalized product recommendations, and empower merchants with real-time inventory and fulfillment intelligence.
            </p>
          </div>

          {/* Action CTAs: Prominent "Get Started" Button */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onLoginRequired}
              className="flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 px-6 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/30 transition-all cursor-pointer whitespace-nowrap transform hover:scale-105 active:scale-95"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => handleModuleClick('analytics')}
              className="flex items-center gap-2 rounded-xl border border-neutral-700/80 bg-neutral-950/70 backdrop-blur-md px-5 py-3 text-xs font-bold text-neutral-200 transition-colors hover:bg-neutral-900 hover:text-white cursor-pointer whitespace-nowrap"
            >
              {!currentUser && <Lock className="h-3.5 w-3.5 text-neutral-400" />}
              <span>Explore Analytics Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => handleModuleClick('predictions')}
              className="flex items-center gap-2 rounded-xl border border-neutral-700/80 bg-neutral-950/70 backdrop-blur-md px-5 py-3 text-xs font-semibold text-neutral-200 transition-colors hover:bg-neutral-900 hover:text-white cursor-pointer whitespace-nowrap"
            >
              {!currentUser && <Lock className="h-3.5 w-3.5 text-neutral-400" />}
              <span>Purchase Predictor</span>
            </button>
          </div>
        </div>

      </section>
    </div>
  );
};
