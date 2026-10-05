import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, BarChart3, User, ShoppingBag, Cpu, Users, Gift, Settings, 
  Store, Menu, X, LogOut, ShieldCheck, ArrowRightLeft, Lock, KeyRound, Sparkles,
  ChevronDown, CheckCircle2, MapPin, Tag, Layers
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { UserAccount } from '../types/auth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onQuickAudit: () => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onQuickAudit,
  currentUser,
  onLogout,
  onLoginClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [iconMenuOpen, setIconMenuOpen] = useState(false);
  const iconMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (iconMenuRef.current && !iconMenuRef.current.contains(event.target as Node)) {
        setIconMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic Navigation customized for each individual portal
  let navLinks: { id: string; label: string; icon: React.FC<{ className?: string }>; desc?: string }[] = [];

  if (currentUser?.role === 'customer') {
    navLinks = [
      { id: 'recommendations', label: 'Products & Price History', icon: ShoppingBag, desc: 'A–Z Master Products & 5-Period Graphs' },
      { id: 'customers', label: 'My Customer Profile', icon: User, desc: 'Orders, preferences & shopping history' },
      { id: 'predictions', label: 'Purchase Prediction', icon: Cpu, desc: 'AI shopper behavior simulator' },
      { id: 'offers', label: 'Offers & Truth Checker', icon: Gift, desc: 'Verified promotions & coupon validation' },
      { id: 'analytics', label: 'Market Analytics', icon: BarChart3, desc: '3,900 customer benchmark metrics' },
      { id: 'home', label: 'Storefront', icon: Home, desc: 'The Shop facade & home overview' },
    ];
  } else if (currentUser?.role === 'shopkeeper') {
    navLinks = [
      { id: 'shopkeeper', label: 'Store & Inventory Management', icon: Store, desc: 'A–Z live stock, restock & fulfillment' },
      { id: 'recommendations', label: 'Catalog & Price Graphs', icon: ShoppingBag, desc: 'Full retail product list' },
      { id: 'analytics', label: 'Demand & Revenue Analytics', icon: BarChart3, desc: 'Sales trends in Indian Rupees (₹)' },
      { id: 'offers', label: 'Store Promotions', icon: Gift, desc: 'Coupons & festive boosts' },
      { id: 'segmentation', label: 'Shopper Cohorts', icon: Users, desc: 'Customer clusters & behaviors' },
      { id: 'home', label: 'Storefront', icon: Home, desc: 'Public boutique entrance' },
    ];
  } else if (currentUser?.role === 'admin') {
    navLinks = [
      { id: 'admin', label: 'Admin Console & Database', icon: Settings, desc: 'Master dataset, catalog & TN orders' },
      { id: 'shopkeeper', label: 'Shopkeeper Portal', icon: Store, desc: 'Merchant fulfillment board' },
      { id: 'recommendations', label: 'Catalog Products (₹)', icon: ShoppingBag, desc: 'A–Z master items & pricing' },
      { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3, desc: 'System-wide analytics' },
      { id: 'customers', label: 'Customer DB & Profiles', icon: User, desc: 'User records & segmentations' },
      { id: 'predictions', label: 'Purchase Predictions', icon: Cpu, desc: 'Behavioral forecasting engine' },
      { id: 'offers', label: 'Discounts & Offers', icon: Gift, desc: 'Store-wide promotions' },
      { id: 'home', label: 'Storefront', icon: Home, desc: 'Home gateway' },
    ];
  } else {
    // Unauthenticated Public View
    navLinks = [
      { id: 'home', label: 'Storefront', icon: Home, desc: 'The Shop boutique welcome' },
      { id: 'recommendations', label: 'Products & Price History', icon: ShoppingBag, desc: 'A–Z catalog preview' },
      { id: 'customers', label: 'Customer POV', icon: User, desc: 'Customer view preview' },
      { id: 'predictions', label: 'Purchase Prediction', icon: Cpu, desc: 'Prediction engine' },
      { id: 'analytics', label: 'Market Analytics', icon: BarChart3, desc: 'Benchmarked dataset' },
      { id: 'offers', label: 'Offers & Truth Checker', icon: Gift, desc: 'Discounts explorer' },
    ];
  }

  const handleNavClick = (id: string) => {
    // WITHOUT LOGIN: Stay on dashboard!
    if (!currentUser) {
      if (id === 'home') {
        setActiveTab('home');
      } else {
        onLoginClick();
      }
      setMobileMenuOpen(false);
      setIconMenuOpen(false);
      return;
    }

    // Role boundary checks
    if (currentUser?.role === 'customer' && (id === 'admin' || id === 'shopkeeper')) {
      return;
    }
    if (currentUser?.role === 'shopkeeper' && id === 'admin') {
      return;
    }

    setActiveTab(id);
    setMobileMenuOpen(false);
    setIconMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeaderIconClick = () => {
    if (currentUser) {
      setIconMenuOpen(!iconMenuOpen);
    } else {
      setActiveTab('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Top-Left Icon Button */}
        <div className="relative" ref={iconMenuRef}>
          <button 
            type="button"
            onClick={handleHeaderIconClick}
            className="text-left group cursor-pointer focus-visible:outline-none flex items-center gap-2.5 p-1 rounded-xl hover:bg-neutral-900/80 transition-all"
            aria-label={currentUser ? "Open portal navigation menu" : "SmartShop Storefront"}
          >
            {/* Top-Left Avatar / Brand Icon */}
            <div className={`relative h-9 w-9 rounded-xl flex items-center justify-center font-bold text-white shadow-md transition-all group-hover:scale-105 ${
              !currentUser ? 'bg-neutral-900 text-white ring-1 border border-neutral-700' :
              currentUser?.role === 'shopkeeper' ? 'bg-emerald-600 shadow-emerald-500/20 ring-2 ring-emerald-400/40' :
              currentUser?.role === 'admin' ? 'bg-amber-600 text-neutral-950 shadow-amber-500/20 ring-2 ring-amber-400/40' :
              'bg-blue-600 shadow-blue-500/20 ring-2 ring-blue-400/40'
            }`}>
              {!currentUser ? (
                <BrandLogo className="h-5 w-5 text-white" />
              ) : currentUser?.role === 'shopkeeper' ? (
                <Store className="h-4 w-4" />
              ) : currentUser?.role === 'admin' ? (
                <Settings className="h-4 w-4" />
              ) : (
                <BrandLogo className="h-5 w-5 text-white" />
              )}

              {/* Dropdown Indicator only shown AFTER login */}
              {currentUser && (
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center">
                  <ChevronDown className="h-2.5 w-2.5 text-neutral-300" />
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight flex items-center gap-1.5">
                <span>SmartShop</span>
              </span>
              <span className={`text-[10px] font-mono leading-none tracking-wide ${
                !currentUser ? 'text-neutral-400 font-medium' :
                currentUser?.role === 'shopkeeper' ? 'text-emerald-400 font-semibold' :
                currentUser?.role === 'admin' ? 'text-amber-400 font-semibold' :
                'text-blue-400 font-semibold'
              }`}>
                {!currentUser ? '🔒 Public Store' :
                 currentUser?.role === 'shopkeeper' ? '🏪 Shopkeeper Portal' :
                 currentUser?.role === 'admin' ? '⚙️ Admin Portal' :
                 '👤 Customer Portal'}
              </span>
            </div>
          </button>

          {/* ========================================================= */}
          {/* TOP-LEFT ICON DROPDOWN MENU - ONLY SHOWN AFTER LOGIN */}
          {/* ========================================================= */}
          {currentUser && iconMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-80 sm:w-88 rounded-2xl border border-neutral-800 bg-neutral-950 p-3 shadow-2xl shadow-black/80 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-3">
              
              {/* Profile Card Header inside Dropdown */}
              <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 font-bold ${
                    currentUser.role === 'shopkeeper' ? 'bg-emerald-600' :
                    currentUser.role === 'admin' ? 'bg-amber-600 text-neutral-950' : 'bg-blue-600'
                  }`}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {currentUser.name}
                    </h4>
                    <span className="text-[10px] font-mono text-neutral-400 block truncate">
                      {currentUser.email}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono uppercase font-bold border shrink-0 ${
                  currentUser.role === 'shopkeeper' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' :
                  currentUser.role === 'admin' ? 'bg-amber-950 text-amber-300 border-amber-500/40' :
                  'bg-blue-950 text-blue-300 border-blue-500/40'
                }`}>
                  {currentUser.role}
                </span>
              </div>

              {/* Navigation Options List */}
              <div className="space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                  Quick Portal Navigation
                </div>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = activeTab === link.id;
                  return (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() => handleNavClick(link.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/15 border border-blue-500/40 text-white'
                          : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-neutral-900 text-neutral-400'
                      }`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold leading-tight flex items-center justify-between">
                          <span className="truncate">{link.label}</span>
                          {isActive && <span className="text-[10px] text-blue-400 font-mono font-bold">Active</span>}
                        </div>
                        {link.desc && (
                          <div className="text-[10px] text-neutral-500 truncate mt-0.5">{link.desc}</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer Account Actions */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIconMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-rose-950/40 border border-neutral-800 hover:border-rose-500/40 text-neutral-300 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log Out / Switch Account</span>
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Zone 3: Portal Action Controls */}
        <div className="flex items-center gap-3">
          {!currentUser && (
            <button
              type="button"
              onClick={onLoginClick}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90 whitespace-nowrap cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Get Started</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-neutral-800 text-neutral-300 hover:bg-neutral-900 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
          <div className="px-3 py-1.5 mb-2 rounded-lg bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
            Active: {!currentUser ? '🔒 Public Store Dashboard' : currentUser?.role === 'shopkeeper' ? '🏪 Shopkeeper Portal' : currentUser?.role === 'admin' ? '⚙️ Admin Portal' : '👤 Customer Portal'}
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </div>
                {!currentUser && link.id !== 'home' && (
                  <Lock className="h-3.5 w-3.5 text-neutral-500" />
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-neutral-800">
            {currentUser ? (
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out ({currentUser.name})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onLoginClick}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-blue-600 text-white text-xs font-semibold cursor-pointer"
              >
                <KeyRound className="h-4 w-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
