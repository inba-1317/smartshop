import React, { useState } from 'react';
import { UserAccount } from '../types/auth';
import { CatalogProduct } from '../data/productCatalogData';
import { 
  MapPin, Truck, CreditCard, ShieldCheck, CheckCircle2, 
  X, ArrowRight, ArrowLeft, Building2, Phone, Mail, User, 
  Sparkles, PackageCheck, AlertCircle, Clock
} from 'lucide-react';

export interface CustomerOrder {
  orderId: string;
  productId: string;
  productName: string;
  imageUrl: string;
  category: string;
  unitPrice: number;
  shippingFee: number;
  tax: number;
  totalPrice: number;
  orderDate: string;
  estimatedDelivery: string;
  shippingAddress: {
    recipientName: string;
    phone: string;
    email: string;
    street: string;
    landmark?: string;
    city: string;
    state: string;
    zipCode: string;
    addressType: 'Home' | 'Office' | 'Other';
  };
  deliverySpeed: 'Standard' | 'Express';
  paymentMethod: 'COD' | 'Card' | 'UPI' | 'DigitalWallet';
  status: 'Order Placed' | 'In Transit' | 'Out for Delivery' | 'Delivered';
}

interface CheckoutOrderModalProps {
  product: CatalogProduct;
  currentUser?: UserAccount | null;
  onClose: () => void;
  onOrderSuccess: (order: CustomerOrder) => void;
}

export const CheckoutOrderModal: React.FC<CheckoutOrderModalProps> = ({
  product,
  currentUser,
  onClose,
  onOrderSuccess
}) => {
  // Steps: 1 = Delivery Address & Contact, 2 = Payment & Shipping Speed, 3 = Confirmation Receipt
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Clean Address State (No prefilled sample address, defaults to Tamil Nadu)
  const [recipientName, setRecipientName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Tamil Nadu');
  const [zipCode, setZipCode] = useState('');
  const [addressType, setAddressType] = useState<'Home' | 'Office' | 'Other'>('Home');

  // Step 2: Shipping & Payment State
  const [deliverySpeed, setDeliverySpeed] = useState<'Standard' | 'Express'>('Standard');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card' | 'UPI' | 'DigitalWallet'>('COD');

  // Step 3: Confirmed Order Object
  const [confirmedOrder, setConfirmedOrder] = useState<CustomerOrder | null>(null);

  // Price calculations in Indian Rupees (₹)
  const shippingFee = deliverySpeed === 'Express' ? 99 : 0;
  const tax = Math.round(product.currentPrice * 0.05);
  const orderTotal = product.currentPrice + shippingFee + tax;

  // Quick Tamil Nadu Address Autofill for testing
  const handleAutofillTNAddress = () => {
    setRecipientName(currentUser?.name || 'xxxxxxx');
    setPhone(currentUser?.phone || '9876543210');
    setEmail(currentUser?.email || 'xxxxxx@gmail.com');
    setStreet('No. 42, G.N. Chetty Road, T. Nagar');
    setLandmark('Near Panagal Park');
    setCity('Chennai');
    setState('Tamil Nadu');
    setZipCode('600017');
    setAddressType('Home');
    setErrorMessage(null);
  };

  // Validate Step 1 Address
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!recipientName.trim()) {
      setErrorMessage('Please enter the recipient full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter a valid delivery contact phone number.');
      return;
    }
    if (!street.trim()) {
      setErrorMessage('Please enter your complete street address / building details.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your city / town.');
      return;
    }
    if (!state.trim()) {
      setErrorMessage('Please enter your state (e.g. Tamil Nadu).');
      return;
    }
    if (!zipCode.trim()) {
      setErrorMessage('Please enter your 6-digit PIN / Postal code.');
      return;
    }

    setStep(2);
  };

  // Complete Order & Place Shipment
  const handlePlaceOrder = () => {
    const today = new Date();
    const deliveryDays = deliverySpeed === 'Express' ? 1 : 3;
    const estDeliveryDate = new Date(today.getTime() + deliveryDays * 24 * 60 * 60 * 1000);
    
    const formattedEstDate = estDeliveryDate.toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const newOrder: CustomerOrder = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}-TN`,
      productId: product.id,
      productName: product.name,
      imageUrl: product.imageUrl,
      category: product.category,
      unitPrice: product.currentPrice,
      shippingFee,
      tax,
      totalPrice: orderTotal,
      orderDate: today.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      estimatedDelivery: formattedEstDate,
      shippingAddress: {
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        street: street.trim(),
        landmark: landmark.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        zipCode: zipCode.trim(),
        addressType
      },
      deliverySpeed,
      paymentMethod,
      status: 'Order Placed'
    };

    // Save to persistent storage
    try {
      const existing = JSON.parse(localStorage.getItem('the_shop_orders') || '[]');
      localStorage.setItem('the_shop_orders', JSON.stringify([newOrder, ...existing]));
    } catch {
      // ignore
    }

    setConfirmedOrder(newOrder);
    setStep(3);
    onOrderSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
              {step === 3 ? <PackageCheck className="h-5 w-5 text-emerald-400" /> : <Truck className="h-5 w-5" />}
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold">
                {step === 1 ? 'Step 1 of 2 · Delivery Shipping Address (Tamil Nadu)' : step === 2 ? 'Step 2 of 2 · Payment & Shipping' : 'Order Placed Successfully'}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                {step === 1 ? 'Enter Delivery Address' : step === 2 ? 'Confirm Order & Payment Method' : 'Delivery Confirmed & Dispatched'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Product Summary Card */}
        <div className="p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-12 w-12 rounded-xl object-cover border border-neutral-800 shrink-0"
            />
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-purple-400 uppercase">{product.category}</span>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate">{product.name}</h4>
              <span className="text-xs text-emerald-400 font-mono font-bold">₹{product.currentPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] text-neutral-400 block">Unit Price</span>
            <span className="text-sm font-bold text-white font-mono">₹{product.currentPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-950/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 1: DELIVERY SHIPPING ADDRESS FORM (CLEAN TN DEFAULT) */}
        {/* ========================================================= */}
        {step === 1 && (
          <form onSubmit={handleProceedToPayment} className="space-y-4">
            
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-semibold">
                <MapPin className="h-4 w-4 text-rose-400" />
                <span>Shipping Destination Details (Tamil Nadu)</span>
              </div>
              <button
                type="button"
                onClick={handleAutofillTNAddress}
                className="text-[11px] font-mono text-blue-400 hover:text-blue-300 underline cursor-pointer"
              >
                Autofill TN Address
              </button>
            </div>

            {/* Recipient Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Recipient Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. xxxxxxx"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Contact Phone Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Flat / House No., Building, Street Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Door No. 12, Anna Nagar Main Road"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Landmark & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Near Bus Stand / Temple"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  City / Town <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Chennai, Coimbatore, Madurai"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* State, ZIP & Address Type */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  State / Province <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Tamil Nadu"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  PIN / Postal Code <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="e.g. 600001"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Address Type
                </label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value as any)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Home">Home (7am-9pm)</option>
                  <option value="Office">Office (9am-6pm)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Proceed to Step 2 Button */}
            <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-300 hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>Continue to Payment & Delivery</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </form>
        )}

        {/* ========================================================= */}
        {/* STEP 2: SHIPPING SPEED & PAYMENT SELECTION */}
        {/* ========================================================= */}
        {step === 2 && (
          <div className="space-y-5">
            
            {/* Delivery Speed Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-200">
                Choose Delivery Speed:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div
                  onClick={() => setDeliverySpeed('Standard')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    deliverySpeed === 'Standard'
                      ? 'border-blue-500 bg-blue-950/40 text-white ring-1 ring-blue-500'
                      : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Truck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Standard TN Delivery</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-bold">FREE</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Delivered in 2 to 3 business days</p>
                  </div>
                </div>

                <div
                  onClick={() => setDeliverySpeed('Express')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    deliverySpeed === 'Express'
                      ? 'border-purple-500 bg-purple-950/40 text-white ring-1 ring-purple-500'
                      : 'border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Clock className="h-5 w-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Express Priority Courier</span>
                      <span className="text-purple-300 text-[10px] font-mono font-bold">+₹99</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">Guaranteed Next-Day Delivery across TN</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-200">
                Choose Payment Method:
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'COD'
                      ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300 ring-1 ring-emerald-500'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-base font-bold text-emerald-400">₹</span>
                  <span className="text-xs font-bold text-white">Cash on Delivery</span>
                  <span className="text-[10px] text-neutral-400">Pay at doorstep</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'UPI'
                      ? 'border-purple-500 bg-purple-950/50 text-purple-300 ring-1 ring-purple-500'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <span className="text-xs font-bold text-white">Instant UPI</span>
                  <span className="text-[10px] text-neutral-400">GPay, PhonePe, Paytm</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'Card'
                      ? 'border-blue-500 bg-blue-950/50 text-blue-300 ring-1 ring-blue-500'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <CreditCard className="h-5 w-5 text-blue-400" />
                  <span className="text-xs font-bold text-white">Debit / Credit</span>
                  <span className="text-[10px] text-neutral-400">RuPay, Visa, MC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('DigitalWallet')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                    paymentMethod === 'DigitalWallet'
                      ? 'border-amber-500 bg-amber-950/50 text-amber-300 ring-1 ring-amber-500'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <Building2 className="h-5 w-5 text-amber-400" />
                  <span className="text-xs font-bold text-white">Net Banking</span>
                  <span className="text-[10px] text-neutral-400">SBI, HDFC, ICICI, IOB</span>
                </button>

              </div>
            </div>

            {/* Delivery Address Review Pill */}
            <div className="p-3.5 rounded-2xl border border-neutral-800 bg-neutral-950 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>Delivering to: {recipientName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">{addressType}</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] mt-0.5">
                    {street}{landmark ? `, ${landmark}` : ''}, {city}, {state} - {zipCode} (Phone: {phone})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[11px] text-blue-400 hover:underline font-mono shrink-0 cursor-pointer"
              >
                Change Address
              </button>
            </div>

            {/* Price Breakdown Bill in Rupees */}
            <div className="p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Item Subtotal ({product.name}):</span>
                <span className="font-mono text-white">₹{product.currentPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Delivery & Handling:</span>
                <span className="font-mono text-white">
                  {shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Estimated Taxes (GST 5%):</span>
                <span className="font-mono text-white">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between font-bold text-sm">
                <span className="text-white">Total Amount:</span>
                <span className="font-mono text-emerald-400 text-base">₹{orderTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Step 2 Action Buttons */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-xs font-medium text-neutral-300 hover:text-white cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Address</span>
              </button>

              <button
                type="button"
                onClick={handlePlaceOrder}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all cursor-pointer transform hover:scale-[1.01]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Place Order (₹{orderTotal.toLocaleString('en-IN')})</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 3: ORDER CONFIRMED RECEIPT */}
        {/* ========================================================= */}
        {step === 3 && confirmedOrder && (
          <div className="space-y-5 text-center py-2">
            
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-xl shadow-emerald-950/80">
              <PackageCheck className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-extrabold text-white">Order Placed Successfully!</h4>
              <p className="text-xs text-neutral-400">
                Thank you! Your shipment has been registered with The Shop Tamil Nadu Logistics Network.
              </p>
            </div>

            {/* Tracking & Address Summary Box */}
            <div className="p-4 rounded-2xl border border-neutral-800 bg-neutral-900/60 text-left space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Tracking Reference:</span>
                <span className="font-mono text-emerald-400 font-bold">{confirmedOrder.orderId}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Estimated Delivery:</span>
                <span className="font-semibold text-white">{confirmedOrder.estimatedDelivery}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Payment Status:</span>
                <span className="font-semibold text-white">
                  {confirmedOrder.paymentMethod === 'COD' 
                    ? `Cash on Delivery (₹${confirmedOrder.totalPrice.toLocaleString('en-IN')})` 
                    : `Paid Online (₹${confirmedOrder.totalPrice.toLocaleString('en-IN')})`}
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-800">
                <span className="text-neutral-400 block mb-1">Delivering to Address:</span>
                <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-neutral-200">
                  <div className="font-bold text-white">{confirmedOrder.shippingAddress.recipientName} ({confirmedOrder.shippingAddress.phone})</div>
                  <div>{confirmedOrder.shippingAddress.street}</div>
                  {confirmedOrder.shippingAddress.landmark && <div>Landmark: {confirmedOrder.shippingAddress.landmark}</div>}
                  <div>{confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state} - {confirmedOrder.shippingAddress.zipCode}</div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md cursor-pointer transition-colors"
            >
              Continue Browsing Products
            </button>

          </div>
        )}

      </div>
    </div>
  );
};
