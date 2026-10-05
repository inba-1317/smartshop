import React, { useState, useMemo, useEffect } from 'react';
import { CustomerTransaction } from '../data/customerDatasetModel';
import { UserAccount } from '../types/auth';
import { 
  THE_SHOP_CATALOG, CatalogProduct, ReservedProduct, 
  getStoredReservations 
} from '../data/productCatalogData';
import { CustomerOrder } from './CheckoutOrderModal';
import { 
  Store, Package, ShoppingBag, Truck, Tag, TrendingUp, 
  CheckCircle2, Clock, AlertTriangle, Search, 
  Plus, Edit, RefreshCw, ArrowUpRight, Filter, ChevronRight, X,
  MapPin, Phone, User, DollarSign, Sparkles, Layers, Box, Check
} from 'lucide-react';

interface ShopkeeperPortalViewProps {
  dataset: CustomerTransaction[];
  currentUser: UserAccount | null;
}

export const ShopkeeperPortalView: React.FC<ShopkeeperPortalViewProps> = ({ 
  dataset, 
  currentUser 
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'reservations' | 'promos' | 'analytics'>('inventory');
  const [searchItem, setSearchItem] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [notification, setNotification] = useState<string | null>(null);

  // Live Inventory State linked to A-Z catalog
  const [catalogInventory, setCatalogInventory] = useState<CatalogProduct[]>(() => THE_SHOP_CATALOG);

  // Live Customer Orders loaded from localStorage
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('the_shop_orders') || '[]');
      if (stored && stored.length > 0) return stored;
    } catch {}
    
    // Default seed orders with Tamil Nadu addresses
    return [
      {
        orderId: 'ORD-782194-TN',
        productId: 'prod-g-1',
        productName: 'Gaming Laptops (RTX 4060 144Hz IPS)',
        imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80',
        category: 'Electronics',
        unitPrice: 899,
        shippingFee: 0,
        tax: 45,
        totalPrice: 944,
        orderDate: 'Oct 05, 2026',
        estimatedDelivery: 'Thu, Oct 8, 2026',
        shippingAddress: {
          recipientName: 'Sabari Nathan',
          phone: '9688283942',
          email: 'sabari.nathan@gmail.com',
          street: 'No. 42, G.N. Chetty Road, T. Nagar',
          landmark: 'Near Panagal Park',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zipCode: '600017',
          addressType: 'Home'
        },
        deliverySpeed: 'Standard',
        paymentMethod: 'COD',
        status: 'Order Placed'
      },
      {
        orderId: 'ORD-451290-TN',
        productId: 'prod-a-2',
        productName: 'Apple iPhone 15 Pro Max',
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80',
        category: 'Electronics',
        unitPrice: 1199,
        shippingFee: 99,
        tax: 60,
        totalPrice: 1358,
        orderDate: 'Oct 04, 2026',
        estimatedDelivery: 'Tue, Oct 6, 2026',
        shippingAddress: {
          recipientName: 'Priya Sundaram',
          phone: '9840123456',
          email: 'priya.sundaram@outlook.com',
          street: '15/4 Cross Cut Road, Gandhipuram',
          landmark: 'Opposite Town Hall',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          zipCode: '641012',
          addressType: 'Office'
        },
        deliverySpeed: 'Express',
        paymentMethod: 'UPI',
        status: 'In Transit'
      },
      {
        orderId: 'ORD-332910-TN',
        productId: 'prod-c-1',
        productName: 'Chanderi Silk Sarees with Zari Border',
        imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
        category: 'Fashion',
        unitPrice: 145,
        shippingFee: 0,
        tax: 7,
        totalPrice: 152,
        orderDate: 'Oct 03, 2026',
        estimatedDelivery: 'Wed, Oct 7, 2026',
        shippingAddress: {
          recipientName: 'Kavitha Raman',
          phone: '9443210987',
          email: 'kavitha.raman@gmail.com',
          street: 'Plot 88, K.K. Nagar West',
          landmark: 'Near Meenakshi Mission',
          city: 'Madurai',
          state: 'Tamil Nadu',
          zipCode: '625020',
          addressType: 'Home'
        },
        deliverySpeed: 'Standard',
        paymentMethod: 'Card',
        status: 'Delivered'
      }
    ];
  });

  // Customer Price Lock Reservations State
  const [customerReservations, setCustomerReservations] = useState<ReservedProduct[]>(() => getStoredReservations());

  // Store Promotions State in Indian Rupees (₹)
  const [promotions, setPromotions] = useState([
    { id: 'p1', code: 'TAMILNADU10', name: 'Tamil Nadu Festive Boost', discount: '10% OFF', active: true, usageCount: 248 },
    { id: 'p2', code: 'FREESHIP', name: 'Free Standard TN Delivery', discount: 'Free Shipping', active: true, usageCount: 812 },
    { id: 'p3', code: 'DEEPAVALI500', name: 'Festive Season Special (₹500 OFF ₹2,000+)', discount: '₹500 OFF', active: true, usageCount: 395 },
    { id: 'p4', code: 'CHENNAIVIP', name: 'Metro Subscriber Loyalty Bonus', discount: '₹150 OFF', active: false, usageCount: 114 },
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Sync orders and reservations periodically
  useEffect(() => {
    setCustomerReservations(getStoredReservations());
    try {
      const stored = JSON.parse(localStorage.getItem('the_shop_orders') || '[]');
      if (stored && stored.length > 0) {
        setCustomerOrders(stored);
      }
    } catch {}
  }, []);

  // Restock inventory item
  const handleRestockProduct = (productId: string, addCount: number = 20) => {
    setCatalogInventory(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, inStock: p.inStock + addCount };
      }
      return p;
    }));
    showToast(`Restocked +${addCount} units for product!`);
  };

  // Advance Order Fulfillment Status
  const handleAdvanceOrderStatus = (orderId: string) => {
    setCustomerOrders(prev => {
      const updated = prev.map(order => {
        if (order.orderId === orderId) {
          const nextStatus: CustomerOrder['status'] = 
            order.status === 'Order Placed' ? 'In Transit' :
            order.status === 'In Transit' ? 'Out for Delivery' :
            order.status === 'Out for Delivery' ? 'Delivered' : 'Order Placed';
          return { ...order, status: nextStatus };
        }
        return order;
      });

      try {
        localStorage.setItem('the_shop_orders', JSON.stringify(updated));
      } catch {}

      return updated;
    });
    showToast(`Updated shipment status for Order #${orderId}`);
  };

  // Toggle Promotion
  const handleTogglePromo = (id: string) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, active: !p.active } : p));
    showToast('Promotion status updated.');
  };

  // Metrics in Indian Rupees (₹)
  const totalStoreRevenue = useMemo(() => {
    const directOrderRev = customerOrders.reduce((sum, ord) => sum + ord.totalPrice, 0);
    const benchmarkRev = dataset.reduce((s, i) => s + (i.amount * 80), 0); // Convert baseline dataset to INR
    return directOrderRev + benchmarkRev;
  }, [customerOrders, dataset]);

  const lowStockProducts = catalogInventory.filter(p => p.inStock <= 5);
  const activeOrdersCount = customerOrders.filter(o => o.status !== 'Delivered').length;

  return (
    <div className="space-y-8">
      
      {/* Shopkeeper Portal Header Banner */}
      <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-neutral-900/60 to-neutral-900/40 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-[11px] font-semibold text-emerald-400">
              <Store className="h-3.5 w-3.5" />
              <span>Merchant & Shopkeeper Portal · The Shop Tamil Nadu</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentUser?.storeName || 'The Shop · Merchant Management Center'}
            </h1>
            <p className="text-xs text-neutral-400">
              Logged in as <span className="text-white font-medium">{currentUser?.name || 'Store Merchant'}</span> · Real-time A–Z Catalog Stock, TN Doorstep Orders & Reservations
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3.5 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-right">
              <div className="text-[10px] text-neutral-400 font-medium uppercase">A–Z Catalog</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">
                {catalogInventory.length} Items
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 text-right">
              <div className="text-[10px] text-neutral-400 font-medium uppercase">Active Shipments</div>
              <div className="text-lg font-bold text-amber-400 font-mono">
                {activeOrdersCount} Orders
              </div>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800/80">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'inventory' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Package className="h-4 w-4" />
            <span>A–Z Master Inventory ({catalogInventory.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Truck className="h-4 w-4" />
            <span>Customer Orders & TN Delivery ({customerOrders.length})</span>
            {activeOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[10px] font-bold font-mono">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'reservations' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Clock className="h-4 w-4 text-purple-400" />
            <span>Customer Price Locks ({customerReservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('promos')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'promos' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Tag className="h-4 w-4" />
            <span>Store Coupons (₹)</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'analytics' 
                ? 'bg-emerald-600 text-white shadow-sm' 
                : 'bg-neutral-950/60 text-neutral-400 hover:text-white border border-neutral-800'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Sales & Revenue (₹)</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-neutral-400 hover:text-white cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* KPI Ribbon in Indian Rupees (₹) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
          <div className="text-xs text-neutral-400">Total Store Sales (INR)</div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 tabular-nums">
            ₹{(totalStoreRevenue / 100000).toFixed(2)} Lakh
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Across Tamil Nadu & All Portals</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
          <div className="text-xs text-neutral-400">Low Stock Warnings</div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1 tabular-nums">
            {lowStockProducts.length} Items
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Need immediate restock</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
          <div className="text-xs text-neutral-400">Pending Deliveries</div>
          <div className="text-2xl font-extrabold text-blue-400 font-mono mt-1 tabular-nums">
            {activeOrdersCount} Shipments
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">Doorstep dispatch active</div>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
          <div className="text-xs text-neutral-400">Customer Price Locks</div>
          <div className="text-2xl font-extrabold text-purple-400 font-mono mt-1 tabular-nums">
            {customerReservations.length} Active
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">30-day price reservations</div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MASTER A-Z INVENTORY & STOCK MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                placeholder="Search across all A-Z catalog products..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-neutral-400">Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Beauty & Health">Beauty & Health</option>
                <option value="Grocery & Pantry">Grocery & Pantry</option>
                <option value="Sports & Toys">Sports & Toys</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="border-b border-neutral-800 bg-neutral-950 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  <tr>
                    <th className="py-3 px-4">Item & Photo</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Selling Price (₹)</th>
                    <th className="py-3 px-4">MRP Benchmark (₹)</th>
                    <th className="py-3 px-4">Customer Margin</th>
                    <th className="py-3 px-4">Stock Level</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Quick Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-sans">
                  {catalogInventory
                    .filter(i => {
                      if (filterCategory !== 'All' && i.category !== filterCategory) return false;
                      if (searchItem && !i.name.toLowerCase().includes(searchItem.toLowerCase())) return false;
                      return true;
                    })
                    .map((item) => {
                      const savings = item.originalPrice - item.currentPrice;
                      const discountPct = Math.round((savings / item.originalPrice) * 100);
                      const isLowStock = item.inStock <= 5;
                      
                      return (
                        <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-10 w-10 rounded-lg object-cover border border-neutral-800 shrink-0"
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded bg-purple-900 text-purple-200 text-[10px] font-bold flex items-center justify-center font-mono">
                                    {item.letter}
                                  </span>
                                  <span className="truncate max-w-xs">{item.name}</span>
                                </div>
                                <span className="block text-[10px] font-normal text-neutral-500 truncate max-w-xs">{item.material}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-neutral-400">{item.category}</td>
                          <td className="py-3 px-4 font-mono font-bold text-emerald-400">₹{item.currentPrice.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 font-mono text-neutral-500 line-through">₹{item.originalPrice.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 font-mono text-blue-400 font-semibold">{discountPct}% OFF</td>
                          <td className="py-3 px-4 font-mono font-bold text-white">
                            {item.inStock} units
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                              !isLowStock
                                ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300' 
                                : 'bg-rose-950 border-rose-500/40 text-rose-300'
                            }`}>
                              {!isLowStock ? 'In Stock' : 'Low Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => handleRestockProduct(item.id, 25)}
                              className="px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-950/80 text-emerald-300 text-[11px] font-bold cursor-pointer transition-colors shadow-sm"
                            >
                              +25 Units
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CUSTOMER ORDERS & TAMIL NADU DELIVERY BOARD */}
      {/* ========================================================= */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30">
            <div>
              <h3 className="text-sm font-bold text-white">Doorstep Customer Orders</h3>
              <p className="text-xs text-neutral-400">All recent orders placed with Tamil Nadu delivery addresses</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-xl">
              {customerOrders.length} Shipments Registered
            </span>
          </div>

          <div className="space-y-3">
            {customerOrders.map((order) => (
              <div
                key={order.orderId}
                className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-neutral-700 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-500/40 text-blue-400">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">{order.orderId}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
                          {order.orderDate}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-400">
                        Estimated Delivery: <strong className="text-white">{order.estimatedDelivery}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border font-mono ${
                      order.status === 'Delivered' ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300' :
                      order.status === 'In Transit' || order.status === 'Out for Delivery' ? 'bg-blue-950 border-blue-500/50 text-blue-300' :
                      'bg-amber-950 border-amber-500/50 text-amber-300'
                    }`}>
                      ● {order.status}
                    </span>

                    <button
                      onClick={() => handleAdvanceOrderStatus(order.orderId)}
                      className="px-3 py-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Advance Status →
                    </button>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  
                  {/* Product Info */}
                  <div className="md:col-span-5 flex items-center gap-3">
                    <img
                      src={order.imageUrl}
                      alt={order.productName}
                      className="h-14 w-14 rounded-xl object-cover border border-neutral-800 shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-purple-400">{order.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{order.productName}</h4>
                      <div className="text-xs font-mono text-emerald-400 font-bold">
                        Total Amount: ₹{order.totalPrice.toLocaleString('en-IN')}
                        <span className="text-neutral-500 font-normal ml-1">({order.paymentMethod})</span>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address Details */}
                  <div className="md:col-span-7 p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-neutral-300 space-y-1">
                    <div className="flex items-center justify-between font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-rose-400" />
                        <span>{order.shippingAddress.recipientName} ({order.shippingAddress.phone})</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                        {order.shippingAddress.addressType} Delivery
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px]">
                      {order.shippingAddress.street}
                      {order.shippingAddress.landmark ? `, Landmark: ${order.shippingAddress.landmark}` : ''}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                    </p>
                  </div>

                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CUSTOMER PRICE LOCK RESERVATIONS */}
      {/* ========================================================= */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30">
            <div>
              <h3 className="text-sm font-bold text-white">Customer Price Lock Reservations</h3>
              <p className="text-xs text-neutral-400">Customers who reserved items from the A–Z catalog for 30 days</p>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold bg-purple-950/80 border border-purple-500/30 px-3 py-1 rounded-xl">
              {customerReservations.length} Active Reservations
            </span>
          </div>

          {customerReservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customerReservations.map((res) => (
                <div
                  key={res.reservationId}
                  className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={res.imageUrl}
                      alt={res.productName}
                      className="h-14 w-14 rounded-xl object-cover border border-neutral-800 shrink-0"
                    />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-purple-400 uppercase">{res.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{res.productName}</h4>
                      <div className="text-xs font-mono text-emerald-400 font-bold">
                        Locked: ₹{res.lockedPrice.toLocaleString('en-IN')} <span className="text-neutral-500 line-through text-[11px]">₹{res.originalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs space-y-1 text-neutral-300">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Target Purchase Date:</span>
                      <span className="font-semibold text-purple-300">{res.targetBuyDate}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Reserved On:</span>
                      <span className="font-mono text-neutral-400">{res.reservedAt}</span>
                    </div>
                    {res.notes && (
                      <p className="text-[11px] text-neutral-400 italic pt-0.5">"{res.notes}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-800 text-neutral-400 text-xs space-y-2">
              <Clock className="h-8 w-8 text-neutral-600 mx-auto" />
              <p>No customer reservations registered yet.</p>
              <p className="text-[11px] text-neutral-500">Customers can lock prices directly from the customer catalog.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: STORE PROMOTIONS & OFFERS */}
      {/* ========================================================= */}
      {activeTab === 'promos' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30">
            <div>
              <h3 className="text-sm font-bold text-white">Merchant Discount Codes & Coupons</h3>
              <p className="text-xs text-neutral-400">Manage promotional codes active for Tamil Nadu shoppers</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {promotions.map((promo) => (
              <div 
                key={promo.id}
                className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                      {promo.code}
                    </span>
                    <span className="text-xs font-bold text-white">{promo.discount}</span>
                  </div>
                  <h4 className="text-xs text-neutral-300 font-medium">{promo.name}</h4>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    Redeemed {promo.usageCount} times this season
                  </div>
                </div>

                <button
                  onClick={() => handleTogglePromo(promo.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    promo.active 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {promo.active ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: SALES & REVENUE ANALYTICS */}
      {/* ========================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-2">
              <span className="text-xs text-neutral-400">Total Tamil Nadu Orders</span>
              <div className="text-2xl font-extrabold text-white font-mono">{customerOrders.length + 3900}</div>
              <p className="text-[11px] text-emerald-400">↑ 18.4% month-over-month growth</p>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-2">
              <span className="text-xs text-neutral-400">Average Order Value (AOV)</span>
              <div className="text-2xl font-extrabold text-blue-400 font-mono">₹4,850</div>
              <p className="text-[11px] text-neutral-400">Across Electronics & Apparel</p>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-2">
              <span className="text-xs text-neutral-400">Doorstep Delivery Success Rate</span>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">99.2%</div>
              <p className="text-[11px] text-neutral-400">0 transit cancellations</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
