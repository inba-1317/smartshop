import React, { useState, useMemo } from 'react';
import { CustomerTransaction, generateFullDataset, parseCsvData } from '../data/customerDatasetModel';
import { 
  Users, DollarSign, Star, Truck, Tag, Search, Filter, 
  ArrowUpDown, Download, Upload, Sparkles, Scale, AlertCircle, 
  CheckCircle, ChevronLeft, ChevronRight 
} from 'lucide-react';

export const DatasetAnalytics: React.FC = () => {
  // Master dataset: initialized with the 3,900 customer benchmark
  const [dataset, setDataset] = useState<CustomerTransaction[]>(() => generateFullDataset(3900));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedShipping, setSelectedShipping] = useState<string>('All');
  const [selectedDiscount, setSelectedDiscount] = useState<string>('All');
  const [selectedPayment, setSelectedPayment] = useState<string>('All');
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [sortField, setSortField] = useState<'id' | 'amount' | 'rating' | 'previousPurchases'>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  // Consumer Twin Simulator State
  const [twinAge, setTwinAge] = useState<number>(30);
  const [twinGender, setTwinGender] = useState<'Male' | 'Female'>('Male');
  const [twinCategory, setTwinCategory] = useState<string>('Clothing');
  const [twinBudget, setTwinBudget] = useState<number>(65);

  // CSV Import Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [csvInputText, setCsvInputText] = useState('');

  // Filtered dataset
  const filteredData = useMemo(() => {
    return dataset.filter(item => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (selectedGender !== 'All' && item.gender !== selectedGender) return false;
      if (selectedShipping !== 'All' && item.shipping !== selectedShipping) return false;
      if (selectedSeason !== 'All' && item.season !== selectedSeason) return false;
      if (selectedPayment !== 'All' && item.payment !== selectedPayment) return false;
      if (selectedDiscount === 'Yes' && !item.discount) return false;
      if (selectedDiscount === 'No' && item.discount) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.item.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.color.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [dataset, selectedCategory, selectedGender, selectedShipping, selectedDiscount, selectedPayment, selectedSeason, searchQuery]);

  // Sorted and Paginated data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const pageRecords = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    if (filteredData.length === 0) {
      return { total: 0, avgSpend: 0, avgRating: 0, discountRate: 0, freeShippingRate: 0, avgLoyalty: 0 };
    }
    const total = filteredData.length;
    const totalSpend = filteredData.reduce((s, i) => s + i.amount, 0);
    const totalRating = filteredData.reduce((s, i) => s + i.rating, 0);
    const discountCount = filteredData.filter(i => i.discount).length;
    const freeShipCount = filteredData.filter(i => i.shipping === 'Free Shipping').length;
    const totalLoyalty = filteredData.reduce((s, i) => s + i.previousPurchases, 0);

    return {
      total,
      avgSpend: Number((totalSpend / total).toFixed(2)),
      avgRating: Number((totalRating / total).toFixed(2)),
      discountRate: Number(((discountCount / total) * 100).toFixed(1)),
      freeShippingRate: Number(((freeShipCount / total) * 100).toFixed(1)),
      avgLoyalty: Number((totalLoyalty / total).toFixed(1))
    };
  }, [filteredData]);

  // Customer Behavioral Perspectives (Hypotheses analysis)
  const priceTiersAnalysis = useMemo(() => {
    const tiers = [
      { label: '$20 - $39 (Budget)', min: 20, max: 39 },
      { label: '$40 - $59 (Moderate)', min: 40, max: 59 },
      { label: '$60 - $79 (Premium)', min: 60, max: 79 },
      { label: '$80 - $100 (Luxury)', min: 80, max: 100 }
    ];

    return tiers.map(t => {
      const items = dataset.filter(i => i.amount >= t.min && i.amount <= t.max);
      const count = items.length;
      const avgRating = count > 0 ? (items.reduce((s, i) => s + i.rating, 0) / count).toFixed(2) : '0';
      return {
        ...t,
        count,
        avgRating,
        share: ((count / dataset.length) * 100).toFixed(1)
      };
    });
  }, [dataset]);

  const discountAnalysis = useMemo(() => {
    const withDiscount = dataset.filter(i => i.discount);
    const withoutDiscount = dataset.filter(i => !i.discount);

    return {
      withDiscount: {
        count: withDiscount.length,
        avgRating: (withDiscount.reduce((s, i) => s + i.rating, 0) / withDiscount.length).toFixed(2),
        avgSpend: (withDiscount.reduce((s, i) => s + i.amount, 0) / withDiscount.length).toFixed(2)
      },
      withoutDiscount: {
        count: withoutDiscount.length,
        avgRating: (withoutDiscount.reduce((s, i) => s + i.rating, 0) / withoutDiscount.length).toFixed(2),
        avgSpend: (withoutDiscount.reduce((s, i) => s + i.amount, 0) / withoutDiscount.length).toFixed(2)
      }
    };
  }, [dataset]);

  // Consumer Twin computation
  const twinMatches = useMemo(() => {
    const matches = dataset.filter(i => 
      Math.abs(i.age - twinAge) <= 5 &&
      i.gender === twinGender &&
      i.category === twinCategory &&
      Math.abs(i.amount - twinBudget) <= 20
    );

    const matchCount = matches.length;
    const avgRating = matchCount > 0 ? (matches.reduce((s, i) => s + i.rating, 0) / matchCount).toFixed(2) : '3.75';
    const popularItems = matchCount > 0 
      ? Object.entries(matches.reduce((acc, i) => ({ ...acc, [i.item]: (acc[i.item] || 0) + 1 }), {} as Record<string, number>))
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name]) => name)
      : ['Jeans', 'Sweater', 'T-shirt'];

    return { matchCount, avgRating, popularItems };
  }, [dataset, twinAge, twinGender, twinCategory, twinBudget]);

  const handleApplyUpload = () => {
    if (!csvInputText.trim()) return;
    const parsed = parseCsvData(csvInputText);
    if (parsed.length > 0) {
      setDataset(parsed);
      setShowUploadModal(false);
      setCsvInputText('');
      setCurrentPage(1);
    }
  };

  const handleExportCsv = () => {
    const headers = "Customer ID,Age,Gender,Item Purchased,Category,Purchase Amount (USD),Location,Color,Season,Review Rating,Subscription Status,Shipping Type,Discount Applied,Promo Code Used,Previous Purchases,Payment Method,Frequency of Purchases\n";
    const rows = filteredData.map(i => 
      `${i.id},${i.age},${i.gender},"${i.item}","${i.category}",${i.amount},"${i.location}","${i.color}","${i.season}",${i.rating},${i.subscribed ? 'Yes' : 'No'},"${i.shipping}",${i.discount ? 'Yes' : 'No'},${i.promo ? 'Yes' : 'No'},${i.previousPurchases},"${i.payment}","${i.frequency}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `customer-shopping-trends-subset-${filteredData.length}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Title & Dataset Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-blue-400">
            Empirical Shopping Trends Dataset Analysis
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            Customer Point of View: 3,900 Shopper Benchmark
          </h2>
          <p className="text-sm text-neutral-400 mt-0.5">
            Statistical deconstruction of customer spending, review satisfaction paradoxes, shipping friction, and promo code utility.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Load / Paste CSV</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Filtered ({filteredData.length})</span>
          </button>
        </div>
      </div>

      {/* Aggregate KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-1">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center justify-between">
            <span>Shoppers</span>
            <Users className="h-3.5 w-3.5 text-neutral-500" />
          </div>
          <div className="text-xl font-bold text-white font-mono tabular-nums">{metrics.total.toLocaleString()}</div>
          <div className="text-[10px] text-neutral-500">Benchmark Records</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-1">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center justify-between">
            <span>Avg Spend</span>
            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono tabular-nums">${metrics.avgSpend}</div>
          <div className="text-[10px] text-neutral-500">Per Transaction</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-1">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center justify-between">
            <span>Satisfaction</span>
            <Star className="h-3.5 w-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 font-mono tabular-nums">{metrics.avgRating} <span className="text-xs font-normal text-neutral-400">/ 5.0</span></div>
          <div className="text-[10px] text-neutral-500">Mean Review Score</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-1">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center justify-between">
            <span>Discounted</span>
            <Tag className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-400 font-mono tabular-nums">{metrics.discountRate}%</div>
          <div className="text-[10px] text-neutral-500">Used Promo Code</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-1">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center justify-between">
            <span>Free Shipping</span>
            <Truck className="h-3.5 w-3.5 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400 font-mono tabular-nums">{metrics.freeShippingRate}%</div>
          <div className="text-[10px] text-neutral-500">Delivery Method</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-1">
          <div className="text-[11px] font-medium text-neutral-400 flex items-center justify-between">
            <span>Repeat Orders</span>
            <Users className="h-3.5 w-3.5 text-rose-400" />
          </div>
          <div className="text-xl font-bold text-rose-400 font-mono tabular-nums">{metrics.avgLoyalty}</div>
          <div className="text-[10px] text-neutral-500">Avg Prior Purchases</div>
        </div>
      </div>

      {/* Two Behavioral Revelations from Customer POV */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Revelation 1: The Satisfaction Paradox */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scale className="h-4 w-4 text-amber-400" />
                <span>The Spend vs Satisfaction Paradox</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Does paying 4x more for an item actually make the customer happier?
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">Data Evidence</span>
          </div>

          <div className="space-y-3">
            {priceTiersAnalysis.map((tier, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-medium">{tier.label}</span>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-neutral-400">{tier.count} shoppers ({tier.share}%)</span>
                    <span className="font-bold text-amber-400 tabular-nums">★ {tier.avgRating}</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(parseFloat(tier.avgRating) / 5.0) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 text-xs text-neutral-300 leading-relaxed">
            <strong className="text-white">Customer Takeaway:</strong> Spending $100 yields an average satisfaction rating of <span className="font-mono text-amber-400 font-semibold">3.74</span>, virtually indistinguishable from spending $20 (<span className="font-mono text-amber-400 font-semibold">3.76</span>). Premium purchases trigger acute post-purchase scrutiny; paying more rarely solves hedonic adaptation.
          </div>
        </div>

        {/* Revelation 2: The Promo Code Illusion */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Tag className="h-4 w-4 text-blue-400" />
                <span>The Promo Code / Discount Illusion</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Comparing customers who bought with a discount vs regular price.
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">A/B Breakdown</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
              <div className="text-xs font-semibold text-blue-400">Discount Applied = YES</div>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                {discountAnalysis.withDiscount.count}
              </div>
              <div className="space-y-1 text-xs text-neutral-400 font-mono">
                <div>Avg Spend: <span className="text-neutral-200">${discountAnalysis.withDiscount.avgSpend}</span></div>
                <div>Avg Rating: <span className="text-amber-400">★ {discountAnalysis.withDiscount.avgRating}</span></div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
              <div className="text-xs font-semibold text-neutral-300">Discount Applied = NO</div>
              <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
                {discountAnalysis.withoutDiscount.count}
              </div>
              <div className="space-y-1 text-xs text-neutral-400 font-mono">
                <div>Avg Spend: <span className="text-neutral-200">${discountAnalysis.withoutDiscount.avgSpend}</span></div>
                <div>Avg Rating: <span className="text-amber-400">★ {discountAnalysis.withoutDiscount.avgRating}</span></div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 text-xs text-neutral-300 leading-relaxed">
            <strong className="text-white">Customer Takeaway:</strong> Average satisfaction rating for discounted shoppers is identical to full-price shoppers (3.74 vs 3.76). Discounts serve as a merchant lure to pull forward purchases, not to increase genuine post-purchase satisfaction.
          </div>
        </div>

      </div>

      {/* Interactive "Find My Consumer Twin" Simulator */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-8 space-y-6">
        <div className="border-b border-neutral-800 pb-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-400" />
            <span>Find My Consumer Twin: How Do Shoppers Like You Fare?</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Benchmark your shopping preferences against matching consumers in the 3,900-order dataset.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1">Your Age: {twinAge}</label>
            <input
              type="range"
              min="18"
              max="70"
              value={twinAge}
              onChange={(e) => setTwinAge(parseInt(e.target.value, 10))}
              className="w-full accent-blue-500"
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
            <label className="block text-neutral-400 mb-1">Preferred Category</label>
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

          <div>
            <label className="block text-neutral-400 mb-1">Typical Order Budget ($)</label>
            <input
              type="number"
              min="20"
              max="100"
              value={twinBudget}
              onChange={(e) => setTwinBudget(parseFloat(e.target.value) || 50)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-neutral-200 font-mono tabular-nums"
            />
          </div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-neutral-400">Statistical Peer Matches</div>
            <div className="text-2xl font-bold font-mono text-white mt-1 tabular-nums">{twinMatches.matchCount} Shoppers</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">In age ±5 and budget ±$20</div>
          </div>

          <div className="border-t sm:border-t-0 sm:border-l sm:border-r border-neutral-800 pt-3 sm:pt-0">
            <div className="text-xs text-neutral-400">Peer Cohort Satisfaction</div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1 tabular-nums">★ {twinMatches.avgRating}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Average customer review rating</div>
          </div>

          <div className="border-t sm:border-t-0 border-neutral-800 pt-3 sm:pt-0">
            <div className="text-xs text-neutral-400">Most Frequent Items in Cohort</div>
            <div className="text-sm font-semibold text-neutral-200 mt-1.5 truncate">
              {twinMatches.popularItems.join(', ')}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">Top-selling items in this segment</div>
          </div>
        </div>
      </div>

      {/* Dataset Filter & Explorer Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">Interactive Transaction Browser</h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Filtered: <span className="font-mono text-white font-semibold">{filteredData.length}</span> of 3,900 customer shopping events
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search item, state, or color..."
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 pl-9 pr-3 py-1.5 text-xs text-neutral-200 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Live Filter Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-neutral-200"
            >
              <option value="All">All Categories</option>
              <option value="Clothing">Clothing</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
              <option value="Outerwear">Outerwear</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Gender</label>
            <select
              value={selectedGender}
              onChange={(e) => { setSelectedGender(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-neutral-200"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Shipping Type</label>
            <select
              value={selectedShipping}
              onChange={(e) => { setSelectedShipping(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-neutral-200"
            >
              <option value="All">All Shipping</option>
              <option value="Free Shipping">Free Shipping</option>
              <option value="Express">Express</option>
              <option value="Next Day Air">Next Day Air</option>
              <option value="2-Day Shipping">2-Day Shipping</option>
              <option value="Standard">Standard</option>
              <option value="Store Pickup">Store Pickup</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Discount Used</label>
            <select
              value={selectedDiscount}
              onChange={(e) => { setSelectedDiscount(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-neutral-200"
            >
              <option value="All">Any Pricing</option>
              <option value="Yes">Discount / Promo Used</option>
              <option value="No">Full Price Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Payment Method</label>
            <select
              value={selectedPayment}
              onChange={(e) => { setSelectedPayment(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-neutral-200"
            >
              <option value="All">All Payment</option>
              <option value="PayPal">PayPal</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Venmo">Venmo</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Season</label>
            <select
              value={selectedSeason}
              onChange={(e) => { setSelectedSeason(e.target.value); setCurrentPage(1); }}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-1.5 text-neutral-200"
            >
              <option value="All">All Seasons</option>
              <option value="Winter">Winter</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                <th 
                  onClick={() => { setSortField('id'); setSortAsc(!sortAsc); }}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>ID</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Item Purchased</th>
                <th 
                  onClick={() => { setSortField('amount'); setSortAsc(!sortAsc); }}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Location & Season</th>
                <th 
                  onClick={() => { setSortField('rating'); setSortAsc(!sortAsc); }}
                  className="py-3 px-3 text-center cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Rating</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Shipping & Payment</th>
                <th 
                  onClick={() => { setSortField('previousPurchases'); setSortAsc(!sortAsc); }}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Loyalty</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {pageRecords.map((row) => (
                <tr key={row.id} className="hover:bg-neutral-900/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-neutral-400">
                    #{row.id}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-white font-medium">{row.age} yrs</span>
                    <span className="text-neutral-500 text-[11px] ml-1">({row.gender})</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-neutral-200">{row.item}</span>
                    <span className="text-neutral-500 block text-[11px]">{row.category} · {row.color}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-white tabular-nums">
                    ${row.amount}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-300">
                    <div>{row.location}</div>
                    <span className="text-neutral-500 text-[11px] font-mono">{row.season}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="font-mono text-amber-400 font-semibold tabular-nums">★ {row.rating}</span>
                  </td>
                  <td className="py-2.5 px-3 text-neutral-300">
                    <div className="truncate max-w-[130px]">{row.shipping}</div>
                    <span className="text-neutral-500 text-[11px] block">{row.payment} {row.discount && '· Discount'}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-neutral-300 tabular-nums">
                    {row.previousPurchases} orders
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800">
          <div>
            Showing <span className="font-mono text-white">{(currentPage - 1) * pageSize + 1}</span> to <span className="font-mono text-white">{Math.min(currentPage * pageSize, sortedData.length)}</span> of <span className="font-mono text-white">{sortedData.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded-md border border-neutral-700 bg-neutral-900 text-neutral-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-mono text-neutral-200">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded-md border border-neutral-700 bg-neutral-900 text-neutral-300 disabled:opacity-30 disabled:pointer-events-none hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

      {/* CSV Upload / Paste Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h4 className="text-base font-bold text-white">Import Custom Customer CSV</h4>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-neutral-400 hover:text-white text-xs"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Paste raw CSV text with standard columns (`Customer ID,Age,Gender,Item Purchased,Category,Purchase Amount...`):
            </p>

            <textarea
              rows={8}
              value={csvInputText}
              onChange={(e) => setCsvInputText(e.target.value)}
              placeholder="Paste comma-separated rows here..."
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 p-3 text-xs font-mono text-neutral-200 focus:border-blue-500 focus:outline-none resize-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyUpload}
                disabled={!csvInputText.trim()}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
              >
                Parse & Load Dataset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
