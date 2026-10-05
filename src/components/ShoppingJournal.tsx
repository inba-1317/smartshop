import React, { useState } from 'react';
import { INITIAL_PURCHASE_LOGS } from '../data/behaviorData';
import { PurchaseLogItem } from '../types/behavior';
import { Plus, Trash2, Filter, Download, Star, CheckCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

export const ShoppingJournal: React.FC = () => {
  const [logs, setLogs] = useState<PurchaseLogItem[]>(INITIAL_PURCHASE_LOGS);
  const [filterType, setFilterType] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  // New item form state
  const [newItem, setNewItem] = useState<{
    itemName: string;
    category: string;
    price: number;
    originalPrice: number;
    type: 'Impulse' | 'Planned' | 'Threshold Filler';
    emotionalStateAtPurchase: string;
    utilityRating: 1 | 2 | 3 | 4 | 5;
    stillUsed: boolean;
    notes: string;
  }>({
    itemName: '',
    category: 'Fashion',
    price: 0,
    originalPrice: 0,
    type: 'Planned',
    emotionalStateAtPurchase: 'Calm & Intentional',
    utilityRating: 4,
    stillUsed: true,
    notes: ''
  });

  const filteredLogs = logs.filter(item => {
    if (filterType === 'all') return true;
    return item.type.toLowerCase() === filterType.toLowerCase();
  });

  // Quantitative Metrics
  const totalSpent = logs.reduce((sum, item) => sum + item.price, 0);
  const impulseCount = logs.filter(i => i.type === 'Impulse').length;
  const thresholdCount = logs.filter(i => i.type === 'Threshold Filler').length;
  const plannedCount = logs.filter(i => i.type === 'Planned').length;
  const impulsePercentage = logs.length > 0 ? Math.round(((impulseCount + thresholdCount) / logs.length) * 100) : 0;
  
  const highRegretItems = logs.filter(i => i.utilityRating <= 2);
  const totalRegretSpent = highRegretItems.reduce((sum, i) => sum + i.price, 0);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.itemName.trim() || newItem.price <= 0) return;

    const created: PurchaseLogItem = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...newItem
    };

    setLogs([created, ...logs]);
    setIsAddingNew(false);
    setNewItem({
      itemName: '',
      category: 'Fashion',
      price: 0,
      originalPrice: 0,
      type: 'Planned',
      emotionalStateAtPurchase: 'Calm & Intentional',
      utilityRating: 4,
      stillUsed: true,
      notes: ''
    });
  };

  const handleDelete = (id: string) => {
    setLogs(logs.filter(i => i.id !== id));
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cartcognition-shopping-audit-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Customer Purchase & Regret Ledger
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            Audit your real-world online shopping history: analyze the utility ratio of planned vs impulse purchases and calculate your net financial drag.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Log a Purchase</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Quantitative Metric Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-1">
          <div className="text-xs text-neutral-400">Total Capital Audited</div>
          <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
            ${totalSpent.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-400">Across {logs.length} logged items</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-1">
          <div className="text-xs text-neutral-400">Impulse & Threshold Share</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono tabular-nums">
            {impulsePercentage}%
          </div>
          <div className="text-[11px] text-neutral-400">{impulseCount + thresholdCount} unplanned transactions</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-1">
          <div className="text-xs text-neutral-400">Capital Lost to Regret (Rating ≤ 2)</div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono tabular-nums">
            ${totalRegretSpent.toFixed(2)}
          </div>
          <div className="text-[11px] text-neutral-400">{highRegretItems.length} items now unused or discarded</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-1">
          <div className="text-xs text-neutral-400">High-Utility Ratio (Rating 4-5)</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
            {logs.length > 0 ? Math.round((logs.filter(i => i.utilityRating >= 4).length / logs.length) * 100) : 0}%
          </div>
          <div className="text-[11px] text-neutral-400">Satisfied, enduring purchases</div>
        </div>
      </div>

      {/* Add New Purchase Modal / Form */}
      {isAddingNew && (
        <form onSubmit={handleAddLog} className="rounded-2xl border border-blue-900/60 bg-neutral-900/70 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-sm font-bold text-white">Log Past or Recent Online Purchase</h3>
            <button
              type="button"
              onClick={() => setIsAddingNew(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-neutral-300 font-medium mb-1">Item Name</label>
              <input
                type="text"
                required
                value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Wireless Noise Cancelling Headphones"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option>Fashion</option>
                <option>Electronics</option>
                <option>Kitchen Gadgets</option>
                <option>Home & Decor</option>
                <option>Beauty & Skincare</option>
                <option>Books & Learning</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Price Paid ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={newItem.price || ''}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white font-mono tabular-nums focus:border-blue-500 focus:outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Purchase Type</label>
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value as any })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Planned">Planned / Researched Need</option>
                <option value="Impulse">Impulse / Emotional</option>
                <option value="Threshold Filler">Threshold Filler ($50 Free Shipping)</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Emotional State When Buying</label>
              <select
                value={newItem.emotionalStateAtPurchase}
                onChange={(e) => setNewItem({ ...newItem, emotionalStateAtPurchase: e.target.value })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option>Calm & Intentional</option>
                <option>Bored / Scrolling</option>
                <option>Late-Night Dopamine</option>
                <option>Stressed / Seeking Relief</option>
                <option>Discount FOMO</option>
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 font-medium mb-1">Utility & Joy Rating (1 to 5)</label>
              <select
                value={newItem.utilityRating}
                onChange={(e) => setNewItem({ ...newItem, utilityRating: parseInt(e.target.value) as any })}
                className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              >
                <option value={5}>5 - Essential / Used Daily / Loved</option>
                <option value={4}>4 - High Utility / Glad I Bought</option>
                <option value={3}>3 - Neutral / Occasional Use</option>
                <option value={2}>2 - Disappointing / Barely Touched</option>
                <option value={1}>1 - Instant Regret / Complete Waste</option>
              </select>
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-neutral-300 font-medium mb-1">Honest Retrospective Notes</label>
            <input
              type="text"
              value={newItem.notes}
              onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
              placeholder="e.g. Looked great online, but fabric was scratchy and return window passed."
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors cursor-pointer"
            >
              Save to Purchase Ledger
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-neutral-400 font-medium flex items-center gap-1">
          <Filter className="h-3 w-3" />
          Filter:
        </span>
        {['all', 'planned', 'impulse', 'threshold filler'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 rounded-md capitalize transition-colors cursor-pointer ${
              filterType === type
                ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* High Density Table / List */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-900/80 text-neutral-400 font-mono">
                <th className="py-3 px-4 font-medium">Date</th>
                <th className="py-3 px-4 font-medium">Item & Category</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium text-right">Price Paid</th>
                <th className="py-3 px-4 font-medium text-center">Utility Rating</th>
                <th className="py-3 px-4 font-medium">Emotional Trigger & Notes</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredLogs.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-neutral-400 whitespace-nowrap">
                    {item.date}
                  </td>
                  
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div>{item.itemName}</div>
                    <div className="text-[11px] text-neutral-400 font-normal">{item.category}</div>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`text-[11px] font-mono ${
                      item.type === 'Planned' ? 'text-emerald-400' :
                      item.type === 'Impulse' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {item.type}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums whitespace-nowrap">
                    ${item.price.toFixed(2)}
                  </td>

                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-3 w-3 ${
                            star <= item.utilityRating
                              ? item.utilityRating >= 4 ? 'text-emerald-400 fill-emerald-400' :
                                item.utilityRating === 3 ? 'text-amber-400 fill-amber-400' :
                                'text-rose-400 fill-rose-400'
                              : 'text-neutral-700'
                          }`}
                        />
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-neutral-300 max-w-xs">
                    <div className="text-[11px] text-neutral-400 italic">State: {item.emotionalStateAtPurchase}</div>
                    <div className="truncate">{item.notes}</div>
                  </td>

                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-neutral-500 hover:text-rose-400 transition-colors p-1"
                      title="Delete entry"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
