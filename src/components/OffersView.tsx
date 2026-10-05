import React, { useState } from 'react';
import { Gift, Copy, Check, Tag, AlertTriangle, ShieldCheck, DollarSign, Calculator, Sparkles } from 'lucide-react';

export const OffersView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Truth Checker State
  const [itemPrice, setItemPrice] = useState<number>(45);
  const [anchorPrice, setAnchorPrice] = useState<number>(75);
  const [shippingFee, setShippingFee] = useState<number>(6.99);
  const [thresholdNeeded, setThresholdNeeded] = useState<number>(50);
  const [promoPercent, setPromoPercent] = useState<number>(15);

  const activeOffers = [
    {
      code: 'FREESHIP50',
      discount: 'Free Shipping on $50+',
      condition: 'Orders over $50',
      description: 'Waives the standard $6.99 shipping fee at checkout.',
      expiry: 'Ongoing',
      type: 'Shipping'
    },
    {
      code: 'WELCOME15',
      discount: '15% Off Any Item',
      condition: 'New customers only',
      description: 'Instant 15% reduction across Clothing and Accessories.',
      expiry: '3 days remaining',
      type: 'Percentage'
    },
    {
      code: 'SEASONAL25',
      discount: '25% Off Outerwear',
      condition: 'Coats & Jackets only',
      description: 'Seasonal promotion for winter & fall outerwear items.',
      expiry: 'Limited drop',
      type: 'Category'
    },
    {
      code: 'VIPLOYALTY',
      discount: '$20 Off $80+',
      condition: 'Previous orders ≥ 10',
      description: 'Flat $20 markdown for repeat loyal customer accounts.',
      expiry: 'Members only',
      type: 'Loyalty'
    }
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Truth Checker Calculations
  const discountAmount = Number(((itemPrice * promoPercent) / 100).toFixed(2));
  const priceAfterDiscount = Math.max(0, itemPrice - discountAmount);
  const totalWithShipping = priceAfterDiscount + shippingFee;
  const thresholdGap = Math.max(0, thresholdNeeded - itemPrice);
  const phantomSavings = Math.max(0, anchorPrice - itemPrice);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-neutral-800 pb-5">
        <div className="text-xs font-mono uppercase tracking-wider text-rose-400">
          Promotions & Ethical Value Analysis
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
          Active Store Offers & Deal Truth Checker
        </h2>
        <p className="text-sm text-neutral-400 mt-0.5">
          Evaluate promotional codes from the customer's point of view: separate authentic financial utility from manufactured urgency.
        </p>
      </div>

      {/* Active Offers Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Gift className="h-4 w-4 text-rose-400" />
          <span>Verified Active Promotional Codes</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeOffers.map((offer, idx) => (
            <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-neutral-400 text-[10px] uppercase">{offer.type}</span>
                  <span className="text-[10px] text-amber-400">{offer.expiry}</span>
                </div>
                <div className="text-base font-bold text-white">{offer.discount}</div>
                <p className="text-xs text-neutral-400 leading-relaxed">{offer.description}</p>
                <div className="text-[11px] text-neutral-500 font-mono">Condition: {offer.condition}</div>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-400 tracking-wider bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                  {offer.code}
                </span>

                <button
                  onClick={() => handleCopy(offer.code)}
                  className="flex items-center gap-1 text-xs text-neutral-300 hover:text-white bg-neutral-800 px-2.5 py-1 rounded transition-colors cursor-pointer"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The Deal Truth Checker (Customer POV) */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calculator className="h-4 w-4 text-emerald-400" />
            <span>The Deal Truth Checker: Is This Promo Code Real or a Trap?</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Audit the mathematical reality of any promotional discount before completing payment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1">Item Listed Price ($)</label>
            <input
              type="number"
              value={itemPrice}
              onChange={(e) => setItemPrice(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-white font-mono tabular-nums"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Anchor / Crossed-Out MSRP ($)</label>
            <input
              type="number"
              value={anchorPrice}
              onChange={(e) => setAnchorPrice(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-white font-mono tabular-nums"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Promo Discount (%)</label>
            <input
              type="number"
              value={promoPercent}
              onChange={(e) => setPromoPercent(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-white font-mono tabular-nums"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1">Shipping Fee ($)</label>
            <input
              type="number"
              value={shippingFee}
              onChange={(e) => setShippingFee(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-white font-mono tabular-nums"
            />
          </div>
        </div>

        {/* Audit Output Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
            <div className="text-xs text-neutral-400">Phantom Markdown Feeling</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              "Saved ${phantomSavings.toFixed(2)}"
            </div>
            <div className="text-[11px] text-neutral-500">From fabricated anchor price</div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
            <div className="text-xs text-neutral-400">Real Coupon Deduction</div>
            <div className="text-2xl font-bold font-mono text-blue-400 tabular-nums">
              -${discountAmount.toFixed(2)}
            </div>
            <div className="text-[11px] text-neutral-500">{promoPercent}% applied to invoice</div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
            <div className="text-xs text-neutral-400">Actual Out-of-Pocket Cash</div>
            <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
              ${totalWithShipping.toFixed(2)}
            </div>
            <div className="text-[11px] text-neutral-500">Including shipping fee</div>
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5 text-xs text-neutral-300">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>Consumer Defense Verdict:</span>
          </div>
          <p className="leading-relaxed">
            {discountAmount < shippingFee ? (
              <span className="text-amber-400">
                Notice: The ${discountAmount.toFixed(2)} coupon discount is less than the ${shippingFee.toFixed(2)} shipping fee. The shipping fee wipes out all your savings.
              </span>
            ) : (
              <span className="text-emerald-400">
                Legitimate savings: You save ${discountAmount.toFixed(2)} off the catalog price. However, make sure you need the item before completing checkout.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
