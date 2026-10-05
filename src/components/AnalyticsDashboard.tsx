import React, { useState, useMemo } from 'react';
import { CustomerTransaction } from '../data/customerDatasetModel';
import { 
  BarChart3, PieChart, TrendingUp, DollarSign, Star, 
  Truck, CreditCard, Calendar, Filter, Users, ArrowUpRight 
} from 'lucide-react';

interface AnalyticsDashboardProps {
  dataset: CustomerTransaction[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ dataset }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterSeason, setFilterSeason] = useState<string>('All');
  const [filterGender, setFilterGender] = useState<string>('All');

  // Filtered dataset for live slice-and-dice
  const data = useMemo(() => {
    return dataset.filter(item => {
      if (filterCategory !== 'All' && item.category !== filterCategory) return false;
      if (filterSeason !== 'All' && item.season !== filterSeason) return false;
      if (filterGender !== 'All' && item.gender !== filterGender) return false;
      return true;
    });
  }, [dataset, filterCategory, filterSeason, filterGender]);

  const totalOrders = data.length;
  const totalRevenue = data.reduce((s, i) => s + i.amount, 0);
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0';
  const avgReview = totalOrders > 0 ? (data.reduce((s, i) => s + i.rating, 0) / totalOrders).toFixed(2) : '0';

  // 1. Category Distribution
  const categoryStats = useMemo(() => {
    const cats = ['Clothing', 'Accessories', 'Footwear', 'Outerwear'];
    return cats.map(cat => {
      const items = data.filter(i => i.category === cat);
      const count = items.length;
      const rev = items.reduce((s, i) => s + i.amount, 0);
      const rating = count > 0 ? (items.reduce((s, i) => s + i.rating, 0) / count).toFixed(2) : '0';
      const share = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : '0';
      return { cat, count, rev, rating, share };
    });
  }, [data, totalOrders]);

  // 2. Age Demographics
  const ageCohorts = useMemo(() => {
    const cohorts = [
      { label: 'Young Adult (18-25)', min: 18, max: 25 },
      { label: 'Millennial (26-40)', min: 26, max: 40 },
      { label: 'Mid-Career (41-55)', min: 41, max: 55 },
      { label: 'Mature (56-70)', min: 56, max: 70 }
    ];

    return cohorts.map(c => {
      const items = data.filter(i => i.age >= c.min && i.age <= c.max);
      const count = items.length;
      const spend = count > 0 ? (items.reduce((s, i) => s + i.amount, 0) / count).toFixed(2) : '0';
      const rating = count > 0 ? (items.reduce((s, i) => s + i.rating, 0) / count).toFixed(2) : '0';
      const share = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : '0';
      return { ...c, count, spend, rating, share };
    });
  }, [data, totalOrders]);

  // 3. Shipping Type Analysis
  const shippingStats = useMemo(() => {
    const types = ['Free Shipping', 'Standard', 'Store Pickup', '2-Day Shipping', 'Next Day Air', 'Express'];
    return types.map(type => {
      const items = data.filter(i => i.shipping === type);
      const count = items.length;
      const spend = count > 0 ? (items.reduce((s, i) => s + i.amount, 0) / count).toFixed(2) : '0';
      const rating = count > 0 ? (items.reduce((s, i) => s + i.rating, 0) / count).toFixed(2) : '0';
      const share = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : '0';
      return { type, count, spend, rating, share };
    });
  }, [data, totalOrders]);

  // 4. Payment Method Analysis
  const paymentStats = useMemo(() => {
    const methods = ['Credit Card', 'PayPal', 'Venmo', 'Debit Card', 'Cash', 'Bank Transfer'];
    return methods.map(method => {
      const items = data.filter(i => i.payment === method);
      const count = items.length;
      const spend = count > 0 ? (items.reduce((s, i) => s + i.amount, 0) / count).toFixed(2) : '0';
      const share = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : '0';
      return { method, count, spend, share };
    });
  }, [data, totalOrders]);

  // 5. Seasonal Breakdown
  const seasonalStats = useMemo(() => {
    const seasons = ['Fall', 'Spring', 'Summer', 'Winter'];
    return seasons.map(s => {
      const items = data.filter(i => i.season === s);
      const count = items.length;
      const rev = items.reduce((sum, i) => sum + i.amount, 0);
      const avg = count > 0 ? (rev / count).toFixed(2) : '0';
      const share = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : '0';
      return { season: s, count, rev, avg, share };
    });
  }, [data, totalOrders]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-blue-400">
            SmartShop Analytics
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            E-Commerce Behavioral Trends & Revenue Dashboard
          </h2>
          <p className="text-sm text-neutral-400 mt-0.5">
            Empirical breakdown across 3,900 customer shopping events, volume distributions, and customer satisfaction metrics.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-neutral-200"
          >
            <option value="All">All Categories</option>
            <option value="Clothing">Clothing</option>
            <option value="Accessories">Accessories</option>
            <option value="Footwear">Footwear</option>
            <option value="Outerwear">Outerwear</option>
          </select>

          <select
            value={filterSeason}
            onChange={(e) => setFilterSeason(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-neutral-200"
          >
            <option value="All">All Seasons</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Winter">Winter</option>
          </select>

          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-neutral-200"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Top Aggregate Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-1">
          <div className="text-xs text-neutral-400">Total Analyzed Orders</div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">{totalOrders.toLocaleString()}</div>
          <div className="text-[11px] text-neutral-500">Filtered Transactions</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-1">
          <div className="text-xs text-neutral-400">Total Gross Spend</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">${totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-neutral-500">Gross Consumer Outflow</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-1">
          <div className="text-xs text-neutral-400">Avg Order Value (AOV)</div>
          <div className="text-2xl font-extrabold text-blue-400 font-mono tabular-nums">${avgOrderValue}</div>
          <div className="text-[11px] text-neutral-500">Per Transaction Mean</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 space-y-1">
          <div className="text-xs text-neutral-400">Average Customer Rating</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">★ {avgReview}</div>
          <div className="text-[11px] text-neutral-500">Out of 5.0 Rating Scale</div>
        </div>
      </div>

      {/* Section 1: Category Economics & Age Cohorts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Product Category Breakdown</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Order volume, revenue share, and review satisfaction</p>
            </div>
            <BarChart3 className="h-4 w-4 text-blue-400" />
          </div>

          <div className="space-y-4">
            {categoryStats.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-neutral-200">
                    {item.cat} <span className="font-normal text-neutral-400">({item.share}%)</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-neutral-300 font-bold">${item.rev.toLocaleString()}</span>
                    <span className="text-amber-400">★ {item.rating}</span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${item.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-400">
            <strong className="text-neutral-200">Key Finding:</strong> Clothing commands 44% of total order volume, followed by Accessories (32%). Outerwear maintains the highest ticket average ($61.20) despite being only 8% of transactions.
          </div>
        </div>

        {/* Age Demographics */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Customer Age Cohort Analysis</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Purchasing power and volume across life stages</p>
            </div>
            <Users className="h-4 w-4 text-purple-400" />
          </div>

          <div className="space-y-4">
            {ageCohorts.map((cohort, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-neutral-200">
                    {cohort.label} <span className="font-normal text-neutral-400">({cohort.count} orders)</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-neutral-300">Avg ${cohort.spend}</span>
                    <span className="text-amber-400">★ {cohort.rating}</span>
                  </div>
                </div>

                <div className="h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: `${cohort.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-400">
            <strong className="text-neutral-200">Key Finding:</strong> E-commerce penetration is balanced across age cohorts (18-70), with Millennial and Mid-Career groups generating consistent basket sizes ($59–$60).
          </div>
        </div>

      </div>

      {/* Section 2: Shipping Economics & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Shipping Type Analysis */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Shipping Type vs Spend & Satisfaction</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Consumer shipping behavior and delivery speed trade-offs</p>
            </div>
            <Truck className="h-4 w-4 text-cyan-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                  <th className="pb-2.5">Shipping Method</th>
                  <th className="pb-2.5 text-right">Orders</th>
                  <th className="pb-2.5 text-right">Avg Basket</th>
                  <th className="pb-2.5 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-sans">
                {shippingStats.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/30">
                    <td className="py-2.5 font-medium text-white">{row.type}</td>
                    <td className="py-2.5 text-right font-mono text-neutral-400">{row.count} ({row.share}%)</td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-400 tabular-nums">${row.spend}</td>
                    <td className="py-2.5 text-right font-mono text-amber-400 tabular-nums">★ {row.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Payment Method Adoption</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Frictionless digital wallets vs traditional bank/card rails</p>
            </div>
            <CreditCard className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono">
                  <th className="pb-2.5">Payment Method</th>
                  <th className="pb-2.5 text-right">Adoption</th>
                  <th className="pb-2.5 text-right">Share</th>
                  <th className="pb-2.5 text-right">Avg Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-sans">
                {paymentStats.map((row, idx) => (
                  <tr key={idx} className="hover:bg-neutral-800/30">
                    <td className="py-2.5 font-medium text-white">{row.method}</td>
                    <td className="py-2.5 text-right font-mono text-neutral-400">{row.count} orders</td>
                    <td className="py-2.5 text-right font-mono text-blue-400">{row.share}%</td>
                    <td className="py-2.5 text-right font-mono font-bold text-white tabular-nums">${row.spend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Section 3: Seasonal Trends */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Seasonal Consumer Purchasing Trends</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Quarterly volume, gross revenue, and seasonal basket sizes</p>
          </div>
          <Calendar className="h-4 w-4 text-amber-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {seasonalStats.map((season, idx) => (
            <div key={idx} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
              <div className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                <span>{season.season} Quarter</span>
                <span className="font-mono text-neutral-500 text-[10px]">{season.share}% of orders</span>
              </div>
              <div className="text-2xl font-bold font-mono text-white tabular-nums">
                ${season.rev.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                {season.count} orders · Avg <strong className="text-emerald-400">${season.avg}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
