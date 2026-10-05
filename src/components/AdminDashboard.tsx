import React, { useState, useMemo, useEffect } from 'react';
import { CustomerTransaction, parseCsvData } from '../data/customerDatasetModel';
import { 
  THE_SHOP_CATALOG, CatalogProduct, ReservedProduct, 
  getStoredReservations 
} from '../data/productCatalogData';
import { CustomerOrder } from './CheckoutOrderModal';
import { StoredShopkeeper } from './CustomerLoginView';
import { 
  Settings, Database, Plus, Search, Filter, Trash2, Edit3, 
  Download, Upload, RefreshCw, CheckCircle2, AlertTriangle, 
  FileSpreadsheet, ShieldCheck, ChevronLeft, ChevronRight, X,
  Package, Truck, MapPin, Layers, Clock, DollarSign, Sparkles,
  Store, User, Phone, Mail, Building2, KeyRound, Check
} from 'lucide-react';

interface AdminDashboardProps {
  dataset: CustomerTransaction[];
  onUpdateDataset: (newDataset: CustomerTransaction[]) => void;
  onResetDataset: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  dataset, 
  onUpdateDataset, 
  onResetDataset 
}) => {
  const [adminTab, setAdminTab] = useState<'dataset' | 'catalog' | 'orders' | 'reservations' | 'shopkeepers'>('dataset');
  
  // Dataset Management State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterGender, setFilterGender] = useState<string>('All');
  const [filterSubscribed, setFilterSubscribed] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 12;

  // Master Catalog State
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [catalogCategory, setCatalogCategory] = useState<string>('All');
  const [catalogList, setCatalogList] = useState<CatalogProduct[]>(() => THE_SHOP_CATALOG);

  // Live Orders State (from Customer Portal Checkout)
  const [liveOrders, setLiveOrders] = useState<CustomerOrder[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('the_shop_orders') || '[]');
      if (stored && stored.length > 0) return stored;
    } catch {}
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
          recipientName: 'xxxxxxx',
          phone: '9876543210',
          email: 'xxxxxx@gmail.com',
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
      }
    ];
  });

  // Customer Reservations State
  const [reservations, setReservations] = useState<ReservedProduct[]>(() => getStoredReservations());

  // Shopkeepers / Merchant Accounts State
  const [shopkeepersList, setShopkeepersList] = useState<StoredShopkeeper[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('the_shop_shopkeepers') || '[]');
      if (stored && stored.length > 0) return stored;
    } catch {}
    return [
      {
        id: 'sk-1',
        name: 'Marcus Vance',
        email: 'merchant@theshop.com',
        phone: '9876543210',
        storeName: 'The Shop - Chennai Flagship',
        location: 'Chennai, Tamil Nadu',
        createdAt: 'March 2024'
      },
      {
        id: 'sk-2',
        name: 'Karthik Raja',
        email: 'karthik.merchant@theshop.com',
        phone: '9840123456',
        storeName: 'The Shop - Coimbatore Central',
        location: 'Coimbatore, Tamil Nadu',
        createdAt: 'July 2024'
      }
    ];
  });

  // Add / Edit Record Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<CustomerTransaction | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add Shopkeeper Modal State
  const [isAddShopkeeperOpen, setIsAddShopkeeperOpen] = useState<boolean>(false);
  const [skName, setSkName] = useState('');
  const [skEmail, setSkEmail] = useState('');
  const [skPhone, setSkPhone] = useState('9876543210');
  const [skStoreName, setSkStoreName] = useState('');
  const [skLocation, setSkLocation] = useState('Chennai, Tamil Nadu');
  const [skPassword, setSkPassword] = useState('');

  // Form State in Indian Context (₹)
  const [formData, setFormData] = useState<Partial<CustomerTransaction>>({
    age: 30,
    gender: 'Male',
    item: 'Chanderi Saree',
    category: 'Clothing',
    amount: 1450,
    location: 'Tamil Nadu',
    color: 'Red',
    season: 'Fall',
    rating: 4.8,
    subscribed: true,
    shipping: 'Standard',
    discount: true,
    promo: true,
    previousPurchases: 6,
    payment: 'UPI',
    frequency: 'Monthly'
  });

  useEffect(() => {
    setReservations(getStoredReservations());
    try {
      const stored = JSON.parse(localStorage.getItem('the_shop_orders') || '[]');
      if (stored && stored.length > 0) setLiveOrders(stored);
    } catch {}
  }, []);

  const showNotification = (type: 'success' | 'error', text: string) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return dataset.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = item.id.toString() === q;
        const matchesItem = item.item.toLowerCase().includes(q);
        const matchesLoc = item.location.toLowerCase().includes(q);
        const matchesPay = item.payment.toLowerCase().includes(q);
        if (!matchesId && !matchesItem && !matchesLoc && !matchesPay) return false;
      }
      if (filterCategory !== 'All' && item.category !== filterCategory) return false;
      if (filterGender !== 'All' && item.gender !== filterGender) return false;
      if (filterSubscribed !== 'All') {
        const isSub = filterSubscribed === 'Yes';
        if (item.subscribed !== isSub) return false;
      }
      return true;
    });
  }, [dataset, searchQuery, filterCategory, filterGender, filterSubscribed]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingRecord(null);
    const nextId = dataset.length > 0 ? Math.max(...dataset.map(d => d.id)) + 1 : 1;
    setFormData({
      id: nextId,
      age: 28,
      gender: 'Female',
      item: 'Kurti',
      category: 'Clothing',
      amount: 850,
      location: 'Tamil Nadu',
      color: 'Maroon',
      season: 'Spring',
      rating: 4.5,
      subscribed: true,
      shipping: 'Express',
      discount: true,
      promo: true,
      previousPurchases: 3,
      payment: 'UPI',
      frequency: 'Monthly'
    });
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (record: CustomerTransaction) => {
    setEditingRecord(record);
    setFormData({ ...record });
    setIsModalOpen(true);
  };

  // Delete Record
  const handleDeleteRecord = (id: number) => {
    if (window.confirm(`Are you sure you want to delete Customer Record #${id}?`)) {
      const updated = dataset.filter(d => d.id !== id);
      onUpdateDataset(updated);
      showNotification('success', `Deleted customer transaction record #${id}.`);
    }
  };

  // Save Record (Add or Update)
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.item || !formData.category || !formData.amount || !formData.location) {
      showNotification('error', 'Please fill in all mandatory fields.');
      return;
    }

    if (editingRecord) {
      const updated = dataset.map(d => d.id === editingRecord.id ? { ...d, ...formData } as CustomerTransaction : d);
      onUpdateDataset(updated);
      showNotification('success', `Updated transaction record #${editingRecord.id}.`);
    } else {
      const newRec = {
        ...formData,
        id: formData.id || (dataset.length > 0 ? Math.max(...dataset.map(d => d.id)) + 1 : 1),
      } as CustomerTransaction;
      onUpdateDataset([newRec, ...dataset]);
      showNotification('success', `Created new customer transaction #${newRec.id}.`);
    }

    setIsModalOpen(false);
  };

  // Handle Add New Shopkeeper Account (Admin Function)
  const handleCreateShopkeeperAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skName.trim() || !skEmail.trim() || !skStoreName.trim()) {
      showNotification('error', 'Please fill in merchant name, email, and store name.');
      return;
    }

    const newShopkeeper: StoredShopkeeper = {
      id: `sk-${Date.now()}`,
      name: skName.trim(),
      email: skEmail.trim(),
      phone: skPhone.trim() || '9876543210',
      storeName: skStoreName.trim(),
      location: skLocation.trim() || 'Tamil Nadu',
      password: skPassword.trim() || 'shopkeeper123',
      createdAt: 'October 2026'
    };

    const updated = [newShopkeeper, ...shopkeepersList];
    setShopkeepersList(updated);
    try {
      localStorage.setItem('the_shop_shopkeepers', JSON.stringify(updated));
    } catch {}

    showNotification('success', `Created Shopkeeper Account for ${newShopkeeper.name} (${newShopkeeper.storeName}).`);
    setIsAddShopkeeperOpen(false);
    setSkName('');
    setSkEmail('');
    setSkStoreName('');
    setSkPassword('');
  };

  // Delete Shopkeeper Account
  const handleDeleteShopkeeper = (id: string) => {
    if (window.confirm('Are you sure you want to revoke this Shopkeeper account?')) {
      const updated = shopkeepersList.filter(s => s.id !== id);
      setShopkeepersList(updated);
      try {
        localStorage.setItem('the_shop_shopkeepers', JSON.stringify(updated));
      } catch {}
      showNotification('success', 'Shopkeeper account removed.');
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Customer ID', 'Age', 'Gender', 'Item Purchased', 'Category', 'Purchase Amount (INR)', 'Location', 'Color', 'Season', 'Review Rating', 'Subscription Status', 'Shipping Type', 'Discount Applied', 'Promo Code Used', 'Previous Purchases', 'Payment Method', 'Frequency of Purchases'];
    const rows = dataset.map(d => [
      d.id, d.age, d.gender, `"${d.item}"`, d.category, d.amount, `"${d.location}"`, d.color, d.season, d.rating, d.subscribed ? 'Yes' : 'No', d.shipping, d.discount ? 'Yes' : 'No', d.promo ? 'Yes' : 'No', d.previousPurchases, d.payment, d.frequency
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the_shop_customer_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('success', 'Exported full dataset to CSV file.');
  };

  // Import CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        const parsed = parseCsvData(text);
        if (parsed.length > 0) {
          onUpdateDataset(parsed);
          showNotification('success', `Successfully imported ${parsed.length} customer records from CSV.`);
        } else {
          showNotification('error', 'Could not parse customer records from this file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Title & Top Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-neutral-400">
            <Settings className="h-3.5 w-3.5 text-blue-400" />
            <span>Admin Data Operations · Unified Customer & Merchant Control</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            SmartShop Admin Console & Platform Manager
          </h2>
          <p className="text-sm text-neutral-400 mt-0.5">
            Provision Shopkeeper merchant accounts, maintain customer records, manage A–Z Master Catalog & Tamil Nadu logistics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {adminTab === 'shopkeepers' ? (
            <button
              onClick={() => setIsAddShopkeeperOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Shopkeeper Account</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5 text-blue-400" />
                <span>Export CSV</span>
              </button>

              <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer">
                <Upload className="h-3.5 w-3.5 text-emerald-400" />
                <span>Import CSV</span>
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload}
                  className="hidden" 
                />
              </label>

              <button
                onClick={() => {
                  if (window.confirm('Reset dataset to original benchmark records?')) {
                    onResetDataset();
                    showNotification('success', 'Reset dataset to benchmark records.');
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Record</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Admin Sub-Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setAdminTab('dataset')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'dataset'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Customer Transactions ({dataset.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('shopkeepers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'shopkeepers'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Store className="h-4 w-4" />
          <span>Shopkeeper Accounts ({shopkeepersList.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'catalog'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>A–Z Master Catalog ({catalogList.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'orders'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>TN Doorstep Orders ({liveOrders.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('reservations')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'reservations'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Clock className="h-4 w-4 text-purple-400" />
          <span>Price Lock Reservations ({reservations.length})</span>
        </button>
      </div>

      {/* Notification Toast */}
      {feedbackMessage && (
        <div className={`p-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
          feedbackMessage.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            <span>{feedbackMessage.text}</span>
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="text-neutral-400 hover:text-white cursor-pointer">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB: SHOPKEEPER & MERCHANT ACCOUNTS (ADMIN ONLY PROVISIONING) */}
      {/* ========================================================= */}
      {adminTab === 'shopkeepers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30">
            <div>
              <h3 className="text-sm font-bold text-white">Merchant & Shopkeeper Accounts</h3>
              <p className="text-xs text-neutral-400">Administrators provision and manage store merchant logins for Tamil Nadu branches</p>
            </div>

            <button
              onClick={() => setIsAddShopkeeperOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Shopkeeper Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shopkeepersList.map((sk) => (
              <div
                key={sk.id}
                className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:border-emerald-500/40 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Store className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{sk.name}</h4>
                      <span className="text-xs text-emerald-400 font-medium">{sk.storeName}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                    Active Merchant
                  </span>
                </div>

                <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-xs space-y-2 text-neutral-300 font-sans">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-neutral-500" />
                    <span className="font-mono text-white">{sk.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-neutral-500" />
                    <span className="font-mono text-neutral-300">{sk.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-neutral-500" />
                    <span className="text-neutral-300">{sk.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80 text-[11px] text-neutral-500">
                  <span>Enrolled: {sk.createdAt}</span>
                  <button
                    onClick={() => handleDeleteShopkeeper(sk.id)}
                    className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
                  >
                    Revoke Access
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 1: DATASET TRANSACTIONS (INR ₹) */}
      {/* ========================================================= */}
      {adminTab === 'dataset' && (
        <div className="space-y-6">
          {/* High-Level Dataset Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="text-xs text-neutral-400">Total Live Records</div>
              <div className="text-2xl font-extrabold text-white font-mono mt-1 tabular-nums">
                {dataset.length.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Active in memory</div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="text-xs text-neutral-400">Filtered Records</div>
              <div className="text-2xl font-extrabold text-blue-400 font-mono mt-1 tabular-nums">
                {filteredData.length.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Matching current view</div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="text-xs text-neutral-400">Subscribed Accounts</div>
              <div className="text-2xl font-extrabold text-purple-400 font-mono mt-1 tabular-nums">
                {dataset.filter(d => d.subscribed).length.toLocaleString()}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                {((dataset.filter(d => d.subscribed).length / (dataset.length || 1)) * 100).toFixed(1)}% enrollment
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="text-xs text-neutral-400">Data Integrity</div>
              <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 tabular-nums">
                100%
              </div>
              <div className="text-[11px] text-emerald-400/80 mt-0.5">Valid schemas & types</div>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by ID, item, location, payment..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Clothing">Clothing</option>
                <option value="Accessories">Accessories</option>
                <option value="Footwear">Footwear</option>
                <option value="Outerwear">Outerwear</option>
              </select>

              <select
                value={filterGender}
                onChange={(e) => {
                  setFilterGender(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>

              <select
                value={filterSubscribed}
                onChange={(e) => {
                  setFilterSubscribed(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="All">All Subscriptions</option>
                <option value="Yes">Subscribed Only</option>
                <option value="No">Non-Subscribers</option>
              </select>
            </div>
          </div>

          {/* Main Records Table */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="border-b border-neutral-800 bg-neutral-950 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  <tr>
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Item & Category</th>
                    <th className="py-3 px-4">Amount (₹)</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Shipping</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-sans">
                  {paginatedData.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-neutral-400">#{item.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white">{item.age} yrs</span>
                        <span className="text-neutral-500 ml-1.5">({item.gender.charAt(0)})</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-white">{item.item}</div>
                        <div className="text-[10px] text-neutral-500">{item.category} · {item.color}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4 text-neutral-300">
                        {item.location}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-amber-400 font-semibold">{item.rating.toFixed(1)}</span>
                        <span className="text-neutral-500 ml-0.5">★</span>
                      </td>
                      <td className="py-3 px-4">
                        {item.discount ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-950 border border-blue-500/40 text-blue-300">
                            Applied
                          </span>
                        ) : (
                          <span className="text-neutral-600 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px]">
                        {item.shipping}
                      </td>
                      <td className="py-3 px-4 text-neutral-400 text-[11px]">
                        {item.payment}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-blue-400 transition-colors cursor-pointer"
                            title="Edit Customer Record"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRecord(item.id)}
                            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete Customer Record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Toolbar */}
            <div className="border-t border-neutral-800 bg-neutral-950 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
              <div>
                Showing <span className="font-semibold text-white">{Math.min(filteredData.length, (currentPage - 1) * pageSize + 1)}</span> to{' '}
                <span className="font-semibold text-white">{Math.min(filteredData.length, currentPage * pageSize)}</span> of{' '}
                <span className="font-semibold text-white">{filteredData.length}</span> records
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="font-mono text-neutral-300">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: MASTER A-Z CATALOG MANAGER */}
      {/* ========================================================= */}
      {adminTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                placeholder="Search A-Z products, letters, materials..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-neutral-400">Category:</span>
              <select
                value={catalogCategory}
                onChange={(e) => setCatalogCategory(e.target.value)}
                className="rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
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
                    <th className="py-3 px-4">Letter & Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">MRP (₹)</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">5-Period History</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 font-sans">
                  {catalogList
                    .filter(p => {
                      if (catalogCategory !== 'All' && p.category !== catalogCategory) return false;
                      if (catalogSearch && !p.name.toLowerCase().includes(catalogSearch.toLowerCase())) return false;
                      return true;
                    })
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-neutral-800/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.imageUrl}
                              alt={prod.name}
                              className="h-10 w-10 rounded-lg object-cover border border-neutral-800 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5 font-semibold text-white">
                                <span className="w-4 h-4 rounded bg-blue-900 text-blue-200 text-[10px] font-bold flex items-center justify-center font-mono">
                                  {prod.letter}
                                </span>
                                <span>{prod.name}</span>
                              </div>
                              <span className="text-[10px] text-neutral-500">{prod.material}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neutral-400">{prod.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-400">₹{prod.currentPrice.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 font-mono text-neutral-500 line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4 font-mono text-blue-400 font-semibold">
                          ₹{(prod.originalPrice - prod.currentPrice).toLocaleString('en-IN')} OFF
                        </td>
                        <td className="py-3 px-4 font-mono text-amber-400">{prod.rating} ★</td>
                        <td className="py-3 px-4 font-mono font-bold text-white">{prod.inStock} units</td>
                        <td className="py-3 px-4 text-right font-mono text-neutral-400 text-[11px]">
                          {prod.priceHistory?.length || 5} Points Tracked
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: TAMIL NADU CUSTOMER ORDERS & LOGISTICS */}
      {/* ========================================================= */}
      {adminTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30">
            <div>
              <h3 className="text-sm font-bold text-white">Tamil Nadu Doorstep Order Registry</h3>
              <p className="text-xs text-neutral-400">Central logistics monitor for all customer orders & deliveries</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-xl">
              {liveOrders.length} Shipments Active
            </span>
          </div>

          <div className="space-y-3">
            {liveOrders.map((order) => (
              <div
                key={order.orderId}
                className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/40 space-y-3"
              >
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

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border font-mono ${
                    order.status === 'Delivered' ? 'bg-emerald-950 border-emerald-500/50 text-emerald-300' :
                    order.status === 'In Transit' || order.status === 'Out for Delivery' ? 'bg-blue-950 border-blue-500/50 text-blue-300' :
                    'bg-amber-950 border-amber-500/50 text-amber-300'
                  }`}>
                    ● {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-5 flex items-center gap-3">
                    <img
                      src={order.imageUrl}
                      alt={order.productName}
                      className="h-12 w-12 rounded-xl object-cover border border-neutral-800 shrink-0"
                    />
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-purple-400">{order.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">{order.productName}</h4>
                      <div className="text-xs font-mono text-emerald-400 font-bold">
                        ₹{order.totalPrice.toLocaleString('en-IN')} ({order.paymentMethod})
                      </div>
                    </div>
                  </div>

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
      {/* TAB 4: CUSTOMER PRICE LOCK RESERVATIONS */}
      {/* ========================================================= */}
      {adminTab === 'reservations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-2xl border border-neutral-800 bg-neutral-900/30">
            <div>
              <h3 className="text-sm font-bold text-white">Central Price Lock Reservations</h3>
              <p className="text-xs text-neutral-400">All customer reservations active for 30-day price locks</p>
            </div>
            <span className="text-xs font-mono text-purple-400 font-bold bg-purple-950/80 border border-purple-500/30 px-3 py-1 rounded-xl">
              {reservations.length} Active Reservations
            </span>
          </div>

          {reservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservations.map((res) => (
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-800 text-neutral-400 text-xs space-y-2">
              <Clock className="h-8 w-8 text-neutral-600 mx-auto" />
              <p>No customer reservations found.</p>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD SHOPKEEPER ACCOUNT (ADMIN FUNCTION) */}
      {/* ========================================================= */}
      {isAddShopkeeperOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-neutral-900 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Provision New Shopkeeper Account</h3>
              </div>
              <button 
                onClick={() => setIsAddShopkeeperOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShopkeeperAccount} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Merchant Full Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={skName}
                  onChange={(e) => setSkName(e.target.value)}
                  placeholder="e.g. xxxxxxx"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-neutral-300 font-medium mb-1">
                  Store / Branch Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={skStoreName}
                  onChange={(e) => setSkStoreName(e.target.value)}
                  placeholder="e.g. The Shop - Madurai Central"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Login Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={skEmail}
                    onChange={(e) => setSkEmail(e.target.value)}
                    placeholder="e.g. xxxxxx@gmail.com"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Contact Phone <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    value={skPhone}
                    onChange={(e) => setSkPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Store City / Location
                  </label>
                  <input
                    type="text"
                    value={skLocation}
                    onChange={(e) => setSkLocation(e.target.value)}
                    placeholder="e.g. Chennai, Tamil Nadu"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-medium mb-1">
                    Temporary Password
                  </label>
                  <input
                    type="text"
                    value={skPassword}
                    onChange={(e) => setSkPassword(e.target.value)}
                    placeholder="e.g. shopkeeper123"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsAddShopkeeperOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow-md"
                >
                  Provision & Activate Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Dataset Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingRecord ? `Edit Customer Record #${editingRecord.id}` : 'Create New Customer Record'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRecord} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Age</label>
                  <input
                    type="number"
                    min={18}
                    max={100}
                    value={formData.age || 30}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Gender</label>
                  <select
                    value={formData.gender || 'Male'}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Item Purchased</label>
                  <input
                    type="text"
                    value={formData.item || ''}
                    onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Saree, Kurti, Shoes"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Category</label>
                  <select
                    value={formData.category || 'Clothing'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Purchase Amount (INR ₹)</label>
                  <input
                    type="number"
                    min={1}
                    max={100000}
                    value={formData.amount || 850}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Location (State)</label>
                  <input
                    type="text"
                    value={formData.location || 'Tamil Nadu'}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. Tamil Nadu, Kerala, Karnataka"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Review Rating (1.0 to 5.0)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="5.0"
                    value={formData.rating || 4.5}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 4.5 })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Payment Method</label>
                  <select
                    value={formData.payment || 'UPI'}
                    onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="Cash on Delivery">Cash on Delivery (COD)</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold cursor-pointer shadow-sm"
                >
                  {editingRecord ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
