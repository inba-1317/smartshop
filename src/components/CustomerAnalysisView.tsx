import React, { useState } from 'react';
import { CustomerTransaction } from '../data/customerDatasetModel';
import { UserAccount } from '../types/auth';
import { QuizDiagnostic } from './QuizDiagnostic';
import { BiasesExplorer } from './BiasesExplorer';
import { Search, User, Star, ShieldCheck, Sparkles, Scale, AlertTriangle, ArrowRight } from 'lucide-react';

interface CustomerAnalysisViewProps {
  dataset: CustomerTransaction[];
  currentUser?: UserAccount | null;
}

export const CustomerAnalysisView: React.FC<CustomerAnalysisViewProps> = ({ dataset, currentUser }) => {
  const [activeSubTab, setActiveSubTab] = useState<'inspector' | 'diagnostic' | 'biases'>('inspector');
  const [searchId, setSearchId] = useState<number>(currentUser?.customerId || 1);
  const [twinAge, setTwinAge] = useState<number>(currentUser?.age || 32);
  const [twinCategory, setTwinCategory] = useState<string>(currentUser?.preferredCategory || 'Clothing');
  const [twinGender, setTwinGender] = useState<'Male' | 'Female'>(
    currentUser?.gender === 'Female' ? 'Female' : 'Male'
  );

  const selectedCustomer = dataset.find(c => c.id === searchId) || dataset[0];

  // Consumer Twin matching
  const matchingPeers = dataset.filter(i => 
    Math.abs(i.age - twinAge) <= 4 &&
    i.gender === twinGender &&
    i.category === twinCategory
  );

  const peerAvgRating = matchingPeers.length > 0 
    ? (matchingPeers.reduce((s, i) => s + i.rating, 0) / matchingPeers.length).toFixed(2)
    : '3.75';

  const peerAvgSpend = matchingPeers.length > 0 
    ? (matchingPeers.reduce((s, i) => s + i.amount, 0) / matchingPeers.length).toFixed(2)
    : '59.00';

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            Customer Point of View Analysis
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Shopper Mindset, Profiles & Psychology
          </h2>
          <p className="text-sm text-neutral-400 mt-0.5">
            Individual customer transaction inspection (#1 to #3900), peer matching, and behavioral vulnerability assessments.
          </p>
        </div>

        {/* Sub-tab Pill/Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => setActiveSubTab('inspector')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'inspector' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Customer Lookup & Twin
          </button>
          <button
            onClick={() => setActiveSubTab('diagnostic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'diagnostic' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Shopper Diagnostic Quiz
          </button>
          <button
            onClick={() => setActiveSubTab('biases')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              activeSubTab === 'biases' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cognitive Biases Codex
          </button>
        </div>
      </div>

      {/* Customer Profile Banner */}
      {currentUser && (
        <div className="p-4 rounded-2xl border border-blue-500/40 bg-blue-950/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{currentUser.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-950 border border-blue-500/40 text-blue-300 font-mono text-[10px] font-bold">
                  {currentUser.membershipStatus || 'VIP Member'}
                </span>
              </div>
              <div className="text-xs text-neutral-400 flex flex-wrap items-center gap-2 mt-0.5">
                <span>{currentUser.email}</span>
                {currentUser.phone && <span>· {currentUser.phone}</span>}
                {currentUser.age && <span>· {currentUser.age} yrs</span>}
                {currentUser.gender && <span>· {currentUser.gender}</span>}
                <span>· Linked Benchmark #{currentUser.customerId || 1}</span>
              </div>
            </div>
          </div>

          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            Account Status: Active & Verified
          </div>
        </div>
      )}

      {activeSubTab === 'inspector' && (
        <div className="space-y-8">
          {/* Individual Customer Record Lookup */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Search ID Column */}
            <div className="lg:col-span-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-400" />
                  <span>Customer ID Lookup</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Inspect any historical shopper from #1 to #{dataset.length}:
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max={dataset.length}
                  value={searchId}
                  onChange={(e) => setSearchId(Math.max(1, Math.min(dataset.length, parseInt(e.target.value, 10) || 1)))}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs font-mono text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Customer ID (1 - 3900)"
                />
              </div>

              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="text-[11px] text-neutral-500 block w-full">Quick jump:</span>
                {[1, 42, 105, 500, 1055, 2653, 3899].map(id => (
                  <button
                    key={id}
                    onClick={() => setSearchId(id)}
                    className="px-2 py-1 rounded bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300 hover:text-white hover:border-neutral-700"
                  >
                    #{id}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2 text-xs text-neutral-400">
                <div className="text-neutral-200 font-semibold">Customer Perspective Context:</div>
                <p className="leading-relaxed">
                  Every transaction reveals how pricing, promos, and delivery channels affected the shopper's satisfaction. Notice if high-frequency repeat shoppers rate items higher or lower than first-time buyers.
                </p>
              </div>
            </div>

            {/* Profile Card Inspector */}
            <div className="lg:col-span-8 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase">
                    <span>Shopper ID #{selectedCustomer.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedCustomer.location}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {selectedCustomer.age}-Year-Old {selectedCustomer.gender} Shopper
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs text-neutral-400">Given Review Rating</div>
                  <div className="text-2xl font-extrabold font-mono text-amber-400 tabular-nums">
                    ★ {selectedCustomer.rating}
                  </div>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-1">
                  <div className="text-neutral-500">Item Purchased</div>
                  <div className="text-sm font-bold text-white">{selectedCustomer.item}</div>
                  <div className="text-[11px] text-neutral-400">{selectedCustomer.category}</div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-1">
                  <div className="text-neutral-500">Amount Paid</div>
                  <div className="text-sm font-bold text-emerald-400 tabular-nums">${selectedCustomer.amount.toFixed(2)}</div>
                  <div className="text-[11px] text-neutral-400">{selectedCustomer.discount ? 'Discount Applied' : 'Full Price'}</div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-1">
                  <div className="text-neutral-500">Shipping Choice</div>
                  <div className="text-sm font-bold text-neutral-200 truncate">{selectedCustomer.shipping}</div>
                  <div className="text-[11px] text-neutral-400">Season: {selectedCustomer.season}</div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 space-y-1">
                  <div className="text-neutral-500">Loyalty History</div>
                  <div className="text-sm font-bold text-purple-400 tabular-nums">{selectedCustomer.previousPurchases} Orders</div>
                  <div className="text-[11px] text-neutral-400">{selectedCustomer.frequency}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <span className="font-semibold text-neutral-200">Payment & Subscription State:</span>
                  <div className="space-y-1 text-neutral-400 font-mono">
                    <div>Payment Method: <span className="text-white">{selectedCustomer.payment}</span></div>
                    <div>Subscription Member: <span className={selectedCustomer.subscribed ? 'text-emerald-400' : 'text-neutral-400'}>{selectedCustomer.subscribed ? 'Active Subscriber' : 'Non-Subscriber'}</span></div>
                    <div>Promo Code Redeemed: <span className={selectedCustomer.promo ? 'text-blue-400' : 'text-neutral-400'}>{selectedCustomer.promo ? 'Yes' : 'No'}</span></div>
                  </div>
                </div>

                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <span className="font-semibold text-neutral-200">Behavioral Insight:</span>
                  <p className="text-neutral-400 leading-relaxed">
                    {selectedCustomer.rating <= 3.0 
                      ? "Customer expressed low satisfaction (≤ 3.0). Likely experienced expectation gap or product mismatch after checkout."
                      : selectedCustomer.rating >= 4.5 
                      ? "High satisfaction purchase (≥ 4.5). The product met or exceeded perceived utility with strong retention potential."
                      : "Moderate neutral experience (3.1 - 4.4). Functional purchase without standout enthusiasm."}
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Consumer Twin Segment Comparison */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-5">
            <div className="border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <span>Customer Demographic Twin Analyzer</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Benchmark your demographic group against empirical consumer behavior in the 3,900 dataset.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Target Age: {twinAge}</label>
                <input
                  type="range"
                  min="18"
                  max="70"
                  value={twinAge}
                  onChange={(e) => setTwinAge(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Gender</label>
                <select
                  value={twinGender}
                  onChange={(e) => setTwinGender(e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-neutral-200"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Product Category</label>
                <select
                  value={twinCategory}
                  onChange={(e) => setTwinCategory(e.target.value)}
                  className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-neutral-200"
                >
                  <option value="Clothing">Clothing</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Outerwear">Outerwear</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="text-xs text-neutral-400">Demographic Matches</div>
                <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">{matchingPeers.length} Shoppers</div>
                <div className="text-[11px] text-neutral-500">In 3,900 benchmark</div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="text-xs text-neutral-400">Cohort Average Rating</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">★ {peerAvgRating}</div>
                <div className="text-[11px] text-neutral-500">Satisfaction score</div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <div className="text-xs text-neutral-400">Cohort Average Spend</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">${peerAvgSpend}</div>
                <div className="text-[11px] text-neutral-500">Mean invoice amount</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'diagnostic' && (
        <QuizDiagnostic />
      )}

      {activeSubTab === 'biases' && (
        <BiasesExplorer />
      )}
    </div>
  );
};
