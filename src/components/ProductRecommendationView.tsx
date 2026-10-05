import React, { useState, useMemo, useEffect } from 'react';
import { CustomerTransaction } from '../data/customerDatasetModel';
import { UserAccount } from '../types/auth';
import { 
  THE_SHOP_CATALOG, CatalogProduct, ReservedProduct, 
  getStoredReservations, cancelReservation 
} from '../data/productCatalogData';
import { PriceHistoryChart } from './PriceHistoryChart';
import { ReserveProductModal } from './ReserveProductModal';
import { CheckoutOrderModal, CustomerOrder } from './CheckoutOrderModal';
import { 
  Search, ShoppingBag, Star, Sparkles, Filter, CheckCircle2, 
  AlertCircle, ArrowRight, ShieldCheck, Clock, Tag, DollarSign, 
  Trash2, X, Eye, TrendingDown, Layers, Check, MapPin, Truck
} from 'lucide-react';

interface ProductRecommendationViewProps {
  dataset: CustomerTransaction[];
  currentUser?: UserAccount | null;
}

export const ProductRecommendationView: React.FC<ProductRecommendationViewProps> = ({ dataset, currentUser }) => {
  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<'match' | 'priceAsc' | 'priceDesc' | 'rating'>('match');

  // Modal & Drawer State
  const [activeProductModal, setActiveProductModal] = useState<CatalogProduct | null>(null);
  const [reservingProduct, setReservingProduct] = useState<CatalogProduct | null>(null);
  const [checkoutProduct, setCheckoutProduct] = useState<CatalogProduct | null>(null);
  const [showReservationsDrawer, setShowReservationsDrawer] = useState<boolean>(false);
  const [reservations, setReservations] = useState<ReservedProduct[]>(() => getStoredReservations());

  // Purchase Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setReservations(getStoredReservations());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter products based on search query, category, and price
  const filteredProducts = useMemo(() => {
    return THE_SHOP_CATALOG.filter(product => {
      // Search Query filter (matches name, description, category, or letter)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery = 
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.material.toLowerCase().includes(q) ||
          (product.letter && product.letter.toLowerCase() === q);
        if (!matchesQuery) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (product.currentPrice > maxPrice) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.currentPrice - b.currentPrice;
      if (sortBy === 'priceDesc') return b.currentPrice - a.currentPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.originalPrice - b.currentPrice) - (a.originalPrice - a.currentPrice); // Best Deal
    });
  }, [searchQuery, selectedCategory, maxPrice, sortBy]);

  // Handle Reservation Confirmation
  const handleReservationSuccess = (newRes: ReservedProduct) => {
    setReservations(getStoredReservations());
    setReservingProduct(null);
    showToast(`Locked price at ₹${newRes.lockedPrice.toLocaleString('en-IN')} for "${newRes.productName}"!`);
  };

  // Handle Cancel Reservation
  const handleCancelReservation = (id: string, name: string) => {
    const updated = cancelReservation(id);
    setReservations(updated);
    showToast(`Cancelled reservation for "${name}".`);
  };

  // Trigger Checkout Modal (Asks for Delivery Street Address, City, State, ZIP, Phone & Payment)
  const handleInitiateCheckout = (product: CatalogProduct) => {
    if (activeProductModal) setActiveProductModal(null);
    setCheckoutProduct(product);
  };

  // Convert ReservedProduct to CatalogProduct for checkout
  const handleCheckoutReservation = (item: ReservedProduct) => {
    const existing = THE_SHOP_CATALOG.find(p => p.id === item.productId);
    const prod: CatalogProduct = existing || {
      id: item.productId,
      letter: item.productName.charAt(0).toUpperCase(),
      name: item.productName,
      category: item.category,
      currentPrice: item.lockedPrice,
      originalPrice: item.originalPrice,
      rating: 4.8,
      reviewCount: 300,
      imageUrl: item.imageUrl,
      description: 'Reserved product from The Shop Customer Catalog.',
      material: 'Standard High Grade Quality',
      colors: ['Default'],
      inStock: 10,
      genderFocus: 'Unisex',
      season: 'All',
      priceHistory: [],
      volatility: 'Low',
      bestTimeToBuyVerdict: 'Price Locked Deal'
    };

    setCheckoutProduct(prod);
    setShowReservationsDrawer(false);
  };

  // On Successful Order Placement with Address
  const handleOrderConfirmed = (order: CustomerOrder) => {
    showToast(`🎉 Order Placed! Tracking #${order.orderId} dispatched to ${order.shippingAddress.city}, ${order.shippingAddress.state}.`);
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-neutral-900 border border-emerald-500/40 text-emerald-300 shadow-2xl animate-in slide-in-from-bottom duration-200 text-xs font-semibold">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-purple-400" />
            <span>Customer Portal · Comprehensive A–Z Product Catalog</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
            A–Z Master Products, Images & 5-Period Price Graphs
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
            Search products from A (Air Conditioners, iPhones, Air Fryers) to Z (Zebronics, Zippers, Zucchini) with doorstep address delivery and price lock reservations.
          </p>
        </div>

        {/* My Reserved Items Header Button */}
        <button
          type="button"
          onClick={() => setShowReservationsDrawer(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-950/70 text-purple-300 hover:text-white transition-all text-xs font-semibold cursor-pointer shadow-sm shrink-0"
        >
          <Clock className="h-4 w-4 text-purple-400" />
          <span>My Reserved Items</span>
          <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white font-mono text-[10px] font-bold">
            {reservations.length}
          </span>
        </button>
      </div>

      {/* Search Bar & Comprehensive Filters */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 space-y-4 shadow-sm">
        
        {/* Main Live Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all A-Z items (e.g. Air conditioners, iPhone, Chanderi saree, Fitbit, Samsung, Xbox, Zucchini...)"
            style={{ height: '81px', width: '200px' }}
            className="rounded-xl border border-neutral-800 bg-neutral-950 pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-purple-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          
          {/* Category */}
          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics & Gadgets</option>
              <option value="Fashion">Fashion & Apparel</option>
              <option value="Home & Kitchen">Home & Kitchen Appliances</option>
              <option value="Beauty & Health">Beauty, Grooming & Health</option>
              <option value="Grocery & Pantry">Grocery & Pantry Essentials</option>
              <option value="Sports & Toys">Sports, Fitness & Toys</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between text-neutral-400 mb-1 font-medium">
              <span>Max Budget: <strong className="text-white">₹{maxPrice.toLocaleString('en-IN')}</strong></span>
              <span className="font-mono text-purple-400 font-bold">₹50 to ₹1,200</span>
            </div>
            <input
              type="range"
              min="10"
              max="1200"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              className="w-full accent-purple-500 mt-2"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-neutral-400 mb-1 font-medium">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="match">Best Deal (Highest Discount)</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </div>

        </div>

      </div>

      {/* Product Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">
              Catalog Items ({filteredProducts.length})
            </h3>
            {searchQuery && (
              <span className="text-xs text-neutral-400 font-mono">
                Keyword: "{searchQuery}"
              </span>
            )}
          </div>
          <span className="text-xs text-neutral-400">
            Click any item for 5-period price graph & delivery ordering
          </span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/40"
              >
                {/* Product Image Section */}
                <div 
                  onClick={() => setActiveProductModal(product)}
                  className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950 cursor-pointer"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono">
                    <span className="h-6 w-6 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center shadow-md">
                      {product.letter}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-bold backdrop-blur-md">
                      Save ₹{(product.originalPrice - product.currentPrice).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Bottom Image Overlay: Price Tag & Stock */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-xl font-extrabold text-white drop-shadow">
                        ₹{product.currentPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-neutral-400 line-through text-xs drop-shadow">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-300 bg-neutral-950/80 px-2 py-0.5 rounded-lg border border-neutral-800 text-[11px] font-mono">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-neutral-500">({product.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-mono uppercase text-purple-400 tracking-wider">
                      {product.category}
                    </div>

                    <h4 
                      onClick={() => setActiveProductModal(product)}
                      className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h4>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* 5-Period Price Teaser */}
                  <div 
                    onClick={() => setActiveProductModal(product)}
                    className="p-2 rounded-xl border border-neutral-800 bg-neutral-950 text-[10px] text-neutral-300 flex items-center justify-between cursor-pointer hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-1 text-blue-400">
                      <TrendingDown className="h-3 w-3" />
                      <span className="font-semibold">5-Change Price Graph</span>
                    </div>
                    <span className="text-neutral-500 font-mono flex items-center gap-0.5">
                      <span>View</span>
                      <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                  </div>

                  {/* Action Buttons: Order with Address vs Reserve */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleInitiateCheckout(product)}
                      className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all text-[11px] font-bold cursor-pointer whitespace-nowrap shadow-md"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      <span>Buy Now</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReservingProduct(product)}
                      className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl border border-purple-500/40 bg-purple-950/30 hover:bg-purple-950/60 text-purple-300 hover:text-white transition-all text-[11px] font-semibold cursor-pointer whitespace-nowrap"
                    >
                      <Clock className="h-3 w-3" />
                      <span>Reserve</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center space-y-3">
            <Search className="h-8 w-8 text-neutral-500 mx-auto" />
            <h4 className="text-sm font-bold text-white">No products found for this selection</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Try clearing search or widening your price budget.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setMaxPrice(1200);
              }}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>

      {/* FULL PRODUCT DETAILS & 5-PERIOD PRICE GRAPH MODAL */}
      {activeProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="h-8 w-8 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                  {activeProductModal.letter}
                </span>
                <div>
                  <span className="text-xs font-mono text-purple-400 uppercase font-semibold">
                    {activeProductModal.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                    {activeProductModal.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveProductModal(null)}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Product Overview: Image + Attributes */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              <div className="sm:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950">
                <img
                  src={activeProductModal.imageUrl}
                  alt={activeProductModal.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="sm:col-span-7 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                    ₹{activeProductModal.currentPrice.toLocaleString('en-IN')}
                  </div>
                  <span className="text-neutral-500 line-through text-sm font-mono">
                    ₹{activeProductModal.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono font-semibold">
                    Save ₹{(activeProductModal.originalPrice - activeProductModal.currentPrice).toLocaleString('en-IN')}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeProductModal.description}
                </p>

                <div className="text-xs space-y-1 text-neutral-400">
                  <div><strong className="text-neutral-200">Specification & Materials:</strong> {activeProductModal.material}</div>
                  <div><strong className="text-neutral-200">In Stock:</strong> {activeProductModal.inStock} units at The Shop Boutique</div>
                </div>
              </div>
            </div>

            {/* 5-PERIOD PRICE HISTORY GRAPH COMPONENT */}
            <PriceHistoryChart
              priceHistory={activeProductModal.priceHistory}
              currentPrice={activeProductModal.currentPrice}
              productName={activeProductModal.name}
            />

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  setReservingProduct(activeProductModal);
                  setActiveProductModal(null);
                }}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-purple-500/50 bg-purple-950/40 hover:bg-purple-950/70 text-purple-200 hover:text-white transition-all text-xs font-bold cursor-pointer shadow-md"
              >
                <Clock className="h-4 w-4" />
                <span>Reserve Product for Future Buy</span>
              </button>

              <button
                type="button"
                onClick={() => handleInitiateCheckout(activeProductModal)}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all text-xs font-bold cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Order Now with Address (₹{activeProductModal.currentPrice.toLocaleString('en-IN')})</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DELIVERY ADDRESS & CHECKOUT MODAL */}
      {checkoutProduct && (
        <CheckoutOrderModal
          product={checkoutProduct}
          currentUser={currentUser}
          onClose={() => setCheckoutProduct(null)}
          onOrderSuccess={handleOrderConfirmed}
        />
      )}

      {/* RESERVE MODAL */}
      {reservingProduct && (
        <ReserveProductModal
          product={reservingProduct}
          onClose={() => setReservingProduct(null)}
          onReservationComplete={handleReservationSuccess}
        />
      )}

      {/* MY RESERVED ITEMS DRAWER / MODAL */}
      {showReservationsDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  My Reserved Items ({reservations.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowReservationsDrawer(false)}
                className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {reservations.length > 0 ? (
              <div className="space-y-3">
                {reservations.map((item) => (
                  <div
                    key={item.reservationId}
                    className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-14 w-14 rounded-xl object-cover border border-neutral-800 shrink-0"
                      />
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <span className="text-[10px] font-mono text-purple-400 uppercase">{item.category}</span>
                        <h4 className="text-sm font-bold text-white truncate">{item.productName}</h4>
                        <div className="text-xs font-mono text-emerald-400 font-bold">
                          Locked Price: ₹{item.lockedPrice.toLocaleString('en-IN')} <span className="text-neutral-500 line-through text-[11px] font-normal">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-neutral-300 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400">Target Purchase Date:</span>
                        <span className="font-semibold text-purple-300">{item.targetBuyDate}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400">Reserved On:</span>
                        <span className="font-mono text-neutral-400">{item.reservedAt}</span>
                      </div>
                      {item.notes && (
                        <p className="text-[11px] text-neutral-400 italic pt-0.5">"{item.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => handleCancelReservation(item.reservationId, item.productName)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-rose-500/40 text-neutral-400 hover:text-rose-400 text-xs transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Cancel Reservation</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          handleCheckoutReservation(item);
                          handleCancelReservation(item.reservationId, item.productName);
                        }}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        <span>Order with Address (₹{item.lockedPrice.toLocaleString('en-IN')})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center space-y-2 text-neutral-400 text-xs">
                <Clock className="h-8 w-8 text-neutral-600 mx-auto" />
                <p>No active reservations yet.</p>
                <p className="text-[11px] text-neutral-500">
                  Browse products from A to Z and click "Reserve" to lock prices for 30 days!
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
