import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { CustomerAnalysisView } from './components/CustomerAnalysisView';
import { ProductRecommendationView } from './components/ProductRecommendationView';
import { PurchasePredictionView } from './components/PurchasePredictionView';
import { CustomerSegmentationView } from './components/CustomerSegmentationView';
import { OffersView } from './components/OffersView';
import { AdminDashboard } from './components/AdminDashboard';
import { ShopkeeperPortalView } from './components/ShopkeeperPortalView';
import { CustomerLoginView } from './components/CustomerLoginView';
import { generateFullDataset, CustomerTransaction } from './data/customerDatasetModel';
import { UserAccount } from './types/auth';
import { ShieldAlert, ArrowLeft, ArrowRightLeft, Lock, X } from 'lucide-react';

export default function App() {
  // Authentication State: restored from localStorage or null (stays on Dashboard by default)
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('smartshop_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Navigation tab: Defaults to 'home' (Dashboard)
  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('smartshop_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === 'shopkeeper') return 'shopkeeper';
        if (u.role === 'admin') return 'admin';
      }
    } catch {
      // ignore
    }
    return 'home';
  });

  // Login Modal State: opens when attempting to navigate without login
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Shared 3,900 customer records benchmark dataset
  const [dataset, setDataset] = useState<CustomerTransaction[]>(() => generateFullDataset(3900));

  // ENFORCE: Without login, user CANNOT go anywhere in the website, stays on Dashboard!
  useEffect(() => {
    if (!currentUser && activeTab !== 'home') {
      setActiveTab('home');
      setIsLoginModalOpen(true);
    }
  }, [currentUser, activeTab]);

  const handleUpdateDataset = (newDataset: CustomerTransaction[]) => {
    setDataset(newDataset);
  };

  const handleResetDataset = () => {
    setDataset(generateFullDataset(3900));
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('smartshop_user', JSON.stringify(user));
    } catch {
      // ignore
    }
    setIsLoginModalOpen(false);

    // Route to appropriate view on login
    if (user.role === 'shopkeeper') {
      setActiveTab('shopkeeper');
    } else if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('recommendations');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('smartshop_user');
    } catch {
      // ignore
    }
    // "without login dont go to anywhere in the website stay on dashboard"
    setActiveTab('home');
    setIsLoginModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe navigation handler
  const handleNavigate = (tab: string) => {
    if (!currentUser && tab !== 'home') {
      setIsLoginModalOpen(true);
      setActiveTab('home');
      return;
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
      {/* 3-Zone Top Bar Contract adhering to SmartShop Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onQuickAudit={() => {
          if (!currentUser) {
            setIsLoginModalOpen(true);
          } else {
            setActiveTab('predictions');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* 1. 🏠 Home / Storefront Dashboard (Always accessible, public showcase) */}
        {activeTab === 'home' && (
          <HomeView
            dataset={dataset}
            onNavigate={handleNavigate}
            currentUser={currentUser}
            onLoginRequired={() => setIsLoginModalOpen(true)}
          />
        )}

        {/* PROTECTED ROUTES: Only rendered if user is logged in */}
        {currentUser && (
          <>
            {/* 2. 🏪 Shopkeeper Portal (Dedicated Merchant View) */}
            {activeTab === 'shopkeeper' && (
              currentUser.role === 'shopkeeper' || currentUser.role === 'admin' ? (
                <ShopkeeperPortalView
                  dataset={dataset}
                  currentUser={currentUser}
                />
              ) : (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-950/20 p-8 sm:p-12 text-center space-y-5 max-w-xl mx-auto my-12">
                  <div className="w-16 h-16 rounded-full bg-rose-900/40 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
                    <ShieldAlert className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Access Denied: Customer Account</h2>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      You are signed in as a <strong className="text-white">Customer ({currentUser.name})</strong>. 
                      Storekeeper inventory, order fulfillment boards, and merchant management are strictly locked from customer accounts.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('home')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Return to Customer Home</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                      <span>Switch to Shopkeeper Login</span>
                    </button>
                  </div>
                </div>
              )
            )}

            {/* 3. 📊 Analytics Dashboard */}
            {activeTab === 'analytics' && (
              <AnalyticsDashboard dataset={dataset} />
            )}

            {/* 4. 👤 Customer Analysis */}
            {activeTab === 'customers' && (
              <CustomerAnalysisView dataset={dataset} currentUser={currentUser} />
            )}

            {/* 5. 🛍️ Product Recommendation */}
            {activeTab === 'recommendations' && (
              <ProductRecommendationView dataset={dataset} currentUser={currentUser} />
            )}

            {/* 6. 🤖 Purchase Prediction */}
            {activeTab === 'predictions' && (
              <PurchasePredictionView dataset={dataset} />
            )}

            {/* 7. 👥 Customer Segmentation */}
            {activeTab === 'segmentation' && (
              <CustomerSegmentationView dataset={dataset} />
            )}

            {/* 8. 🎁 Offers */}
            {activeTab === 'offers' && (
              <OffersView />
            )}

            {/* 9. ⚙️ Admin Dashboard */}
            {activeTab === 'admin' && (
              currentUser.role === 'admin' ? (
                <AdminDashboard
                  dataset={dataset}
                  onUpdateDataset={handleUpdateDataset}
                  onResetDataset={handleResetDataset}
                />
              ) : (
                <div className="rounded-2xl border border-rose-500/40 bg-rose-950/20 p-8 sm:p-12 text-center space-y-5 max-w-xl mx-auto my-12">
                  <div className="w-16 h-16 rounded-full bg-rose-900/40 border border-rose-500/40 flex items-center justify-center mx-auto text-rose-400">
                    <ShieldAlert className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Access Denied: Administrative Area</h2>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      You are signed in with a <strong className="text-white">{currentUser.role === 'shopkeeper' ? 'Shopkeeper Account' : 'Customer Account'}</strong>. 
                      Master dataset CRUD, CSV imports, and platform reset tools require verified SuperAdmin credentials.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveTab(currentUser.role === 'shopkeeper' ? 'shopkeeper' : 'home')}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Return to Authorized Portal</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                      <span>Switch to Admin Login</span>
                    </button>
                  </div>
                </div>
              )
            )}
          </>
        )}
      </main>

      {/* LOGIN MODAL OVERLAY: Opens when user attempts to navigate anywhere without login */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            <CustomerLoginView
              onLoginSuccess={handleLoginSuccess}
              dataset={dataset}
              onClose={() => setIsLoginModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
