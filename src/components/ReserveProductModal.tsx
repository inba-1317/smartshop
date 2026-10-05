import React, { useState } from 'react';
import { CatalogProduct, ReservedProduct, saveReservation } from '../data/productCatalogData';
import { Calendar, ShieldCheck, Clock, CheckCircle2, X, AlertCircle, Sparkles, Tag } from 'lucide-react';

interface ReserveProductModalProps {
  product: CatalogProduct;
  onClose: () => void;
  onReservationComplete: (reserved: ReservedProduct) => void;
}

export const ReserveProductModal: React.FC<ReserveProductModalProps> = ({
  product,
  onClose,
  onReservationComplete
}) => {
  const [targetDateOption, setTargetDateOption] = useState<string>('2weeks');
  const [customDate, setCustomDate] = useState<string>('2026-10-31');
  const [notes, setNotes] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const calculateTargetDateString = () => {
    if (targetDateOption === '2weeks') return 'Oct 19, 2026 (In 2 Weeks / Next Payday)';
    if (targetDateOption === 'month') return 'Nov 04, 2026 (In 30 Days)';
    if (targetDateOption === 'holiday') return 'Nov 27, 2026 (Festive Season)';
    return `${customDate} (Custom Selected Date)`;
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();

    const newReservation: ReservedProduct = {
      reservationId: `res-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      category: product.category,
      lockedPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      reservedAt: 'Oct 05, 2026',
      targetBuyDate: calculateTargetDateString(),
      notes: notes.trim() || 'Reserved at guaranteed price lock.',
      status: 'active'
    };

    saveReservation(newReservation);
    setIsSuccess(true);
    setTimeout(() => {
      onReservationComplete(newReservation);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-7 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-purple-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Reserve Product for Future Buy
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Lock the current price today with zero advance payment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Item Successfully Reserved!</h4>
            <p className="text-xs text-neutral-300 max-w-sm mx-auto">
              Your price of <strong className="text-emerald-400 font-mono">₹{product.currentPrice.toLocaleString('en-IN')}</strong> has been locked for {calculateTargetDateString()}. We added it to your "My Reserved Items" drawer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleConfirmReservation} className="space-y-5">
            
            {/* Product Summary Card */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-16 w-16 rounded-xl object-cover border border-neutral-800 shrink-0"
              />
              <div className="space-y-0.5 flex-1 min-w-0">
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider">{product.category}</span>
                <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-emerald-400 font-bold">₹{product.currentPrice.toLocaleString('en-IN')}</span>
                  <span className="text-neutral-500 line-through text-[11px]">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-emerald-300 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Save ₹{(product.originalPrice - product.currentPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Target Purchase Date Options */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Select Your Target Purchase Timeframe:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTargetDateOption('2weeks')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    targetDateOption === '2weeks'
                      ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500/40'
                      : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="font-bold">Next Paycheck (2 Weeks)</span>
                  <span className="text-[10px] text-neutral-400 mt-1">Oct 19, 2026</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetDateOption('month')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    targetDateOption === 'month'
                      ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500/40'
                      : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="font-bold">Next Month (30 Days)</span>
                  <span className="text-[10px] text-neutral-400 mt-1">Nov 04, 2026</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetDateOption('holiday')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    targetDateOption === 'holiday'
                      ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500/40'
                      : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="font-bold">Festive Season (Deepavali)</span>
                  <span className="text-[10px] text-neutral-400 mt-1">November 2026</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetDateOption('custom')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    targetDateOption === 'custom'
                      ? 'bg-purple-950/40 border-purple-500 text-white ring-1 ring-purple-500/40'
                      : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="font-bold">Pick Specific Date</span>
                  <span className="text-[10px] text-neutral-400 mt-1">Custom date picker</span>
                </button>
              </div>

              {targetDateOption === 'custom' && (
                <div className="pt-2">
                  <input
                    type="date"
                    min="2026-10-06"
                    max="2026-12-31"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white focus:border-purple-500 focus:outline-none font-mono"
                  />
                </div>
              )}
            </div>

            {/* Optional Notes */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Personal Note / Purchase Goal (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Birthday gift, festive planning..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Price Protection Guarantee Box */}
            <div className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 text-xs text-emerald-300 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>SmartShop Price Protection Guarantee:</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                We lock your price at <strong className="text-white">₹{product.currentPrice.toLocaleString('en-IN')}</strong> until {calculateTargetDateString()}. If retail prices climb, you keep this low price. If prices drop even further, you automatically receive the lower price. Zero advance payment required.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Clock className="h-4 w-4" />
                <span>Confirm & Lock Price</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
