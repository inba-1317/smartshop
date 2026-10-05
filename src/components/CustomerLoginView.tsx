import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types/auth';
import { CustomerTransaction } from '../data/customerDatasetModel';
import { BrandLogo } from './BrandLogo';
import { 
  User, Store, Settings, Lock, Mail, Phone, Calendar, ArrowRight, ArrowLeft,
  CheckCircle2, AlertCircle, KeyRound, Eye, EyeOff, X, 
  Sparkles, ShieldCheck, ShoppingBag, Building2, Check
} from 'lucide-react';

interface CustomerLoginViewProps {
  onLoginSuccess: (user: UserAccount) => void;
  dataset: CustomerTransaction[];
  onClose?: () => void;
  initialMode?: 'signin' | 'signup';
}

export interface StoredShopkeeper {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  location: string;
  password?: string;
  createdAt: string;
}

export const CustomerLoginView: React.FC<CustomerLoginViewProps> = ({ 
  onLoginSuccess, 
  dataset,
  onClose,
  initialMode = 'signin'
}) => {
  // Mode: 'signin' (Log In) vs 'signup' (Customer Register Only)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  
  // Step for Sign In: 1 = Role Selection (Customer, Shopkeeper, Admin), 2 = Credentials
  const [signInStep, setSignInStep] = useState<1 | 2>(1);

  // Selected Role for Sign In
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  // Form Controls
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ==========================================
  // CUSTOMER SIGN UP FIELDS ONLY
  // (Name, Age, Gender, Gmail, Password Creation, Phone No)
  // ==========================================
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>(28);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [gmail, setGmail] = useState('');
  const [phone, setPhone] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // ==========================================
  // LOG IN FIELDS (Email & Password)
  // ==========================================
  const [loginEmail, setLoginEmail] = useState('shopper@theshop.com');
  const [loginPassword, setLoginPassword] = useState('customer123');

  // When a role is chosen in Sign In Step 1
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    
    // Set role-specific default credentials for quick testing
    if (role === 'customer') {
      setLoginEmail('shopper@theshop.com');
      setLoginPassword('customer123');
    } else if (role === 'shopkeeper') {
      setLoginEmail('merchant@theshop.com');
      setLoginPassword('shopkeeper123');
    } else {
      setLoginEmail('admin@theshop.internal');
      setLoginPassword('admin2026');
    }

    setSignInStep(2);
  };

  // Autofill sample data for Customer Sign Up
  const handleAutofillSignUp = () => {
    setName('xxxxxxx');
    setAge(28);
    setGender('Male');
    setGmail('xxxxxx@gmail.com');
    setPhone('9876543210');
    setCreatePassword('xxxxxxx123');
    setConfirmPassword('xxxxxxx123');
    setErrorMessage(null);
  };

  // Handle Sign In Submission (For Customer, Shopkeeper, or Admin)
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    let userAccount: UserAccount;

    if (selectedRole === 'shopkeeper') {
      // Check if this is an Admin-created shopkeeper
      let customShopkeeper: StoredShopkeeper | undefined;
      try {
        const stored = JSON.parse(localStorage.getItem('the_shop_shopkeepers') || '[]') as StoredShopkeeper[];
        customShopkeeper = stored.find(s => s.email.toLowerCase() === loginEmail.trim().toLowerCase());
      } catch {}

      if (customShopkeeper) {
        userAccount = {
          id: customShopkeeper.id,
          name: customShopkeeper.name,
          email: customShopkeeper.email,
          phone: customShopkeeper.phone,
          role: 'shopkeeper',
          storeName: customShopkeeper.storeName,
          joinedDate: customShopkeeper.createdAt
        };
      } else {
        userAccount = {
          id: 'shopkeeper-1',
          name: 'Marcus Vance (Shopkeeper)',
          email: loginEmail.trim(),
          role: 'shopkeeper',
          storeName: 'The Shop - Tamil Nadu Boutique',
          joinedDate: 'March 2024'
        };
      }
    } else if (selectedRole === 'admin') {
      userAccount = {
        id: 'admin-1',
        name: 'Chief Administrator',
        email: loginEmail.trim(),
        role: 'admin',
        joinedDate: 'January 2024'
      };
    } else {
      // Customer
      const formattedName = loginEmail.includes('@') 
        ? loginEmail.split('@')[0].replace('.', ' ').toUpperCase() 
        : 'Registered Customer';

      userAccount = {
        id: `customer-${Date.now()}`,
        name: formattedName,
        email: loginEmail.trim(),
        role: 'customer',
        customerId: 1,
        joinedDate: 'October 2026',
        membershipStatus: 'VIP',
        location: 'Tamil Nadu, India',
        gender: 'Female',
        age: 32
      };
    }

    onLoginSuccess(userAccount);
  };

  // Handle Customer Sign Up Submission (Customer Only)
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!age || Number(age) < 16 || Number(age) > 100) {
      setErrorMessage('Please enter a valid age between 16 and 100.');
      return;
    }
    if (!gmail.trim() || !gmail.includes('@')) {
      setErrorMessage('Please enter a valid Gmail / Email address.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please enter your contact phone number.');
      return;
    }
    if (!createPassword || createPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (createPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    const newCustomerAccount: UserAccount = {
      id: `customer-${Date.now()}`,
      name: name.trim(),
      email: gmail.trim(),
      phone: phone.trim(),
      age: Number(age),
      gender: gender,
      role: 'customer',
      customerId: Math.floor(Math.random() * 500) + 1,
      joinedDate: 'October 2026',
      membershipStatus: 'VIP',
      location: 'Tamil Nadu, India'
    };

    onLoginSuccess(newCustomerAccount);
  };

  return (
    <div className="py-2 sm:py-4 max-w-lg mx-auto space-y-6">
      
      {/* Header */}
      <div className="relative text-center space-y-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 p-2 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-white shadow-lg shadow-black/40">
          <BrandLogo className="h-7 w-7 text-white" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/40 text-xs font-semibold text-blue-300">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
          <span>The Shop · Secure Authentication Gateway</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {authMode === 'signin' ? 'Sign In / Log In' : 'Customer Account Registration'}
        </h1>

        <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto">
          {authMode === 'signin' 
            ? (signInStep === 1 
                ? 'Select your role (Customer, Shopkeeper, or Admin) to log in.' 
                : `Enter your credentials to access the ${selectedRole.toUpperCase()} portal.`)
            : 'Public sign up is exclusively for Customers. Create your personal profile below.'}
        </p>
      </div>

      {/* Mode Switcher Tabs (Sign In vs Customer Sign Up) */}
      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-neutral-900 border border-neutral-800">
        <button
          type="button"
          onClick={() => { 
            setAuthMode('signin'); 
            setErrorMessage(null); 
          }}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            authMode === 'signin'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <KeyRound className="h-4 w-4" />
          <span>Log In / Sign In</span>
        </button>

        <button
          type="button"
          onClick={() => { 
            setAuthMode('signup'); 
            setErrorMessage(null); 
          }}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            authMode === 'signup'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-300" />
          <span>Sign Up / Register</span>
        </button>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300 flex items-center gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. SIGN IN FLOW (ROLE SELECTION -> EMAIL & PASSWORD) */}
      {/* ========================================================= */}
      {authMode === 'signin' && (
        <div>
          {/* STEP 1: SELECT ROLE (CUSTOMER, SHOPKEEPER, ADMIN) */}
          {signInStep === 1 && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-7 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                <span className="text-[11px] font-mono text-purple-400 font-semibold uppercase tracking-wider">
                  Step 1 of 2 · Select Login Role
                </span>
                <span className="text-xs text-neutral-400">Choose your portal</span>
              </div>

              <div className="space-y-3">
                {/* Customer Role Card */}
                <div
                  onClick={() => handleSelectRole('customer')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 hover:border-blue-500 hover:bg-blue-950/30 ${
                    selectedRole === 'customer'
                      ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500/40'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Customer Portal</h3>
                      <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">Shopper</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      A–Z catalog in ₹, 30-day price locks, personal profiles & Tamil Nadu delivery ordering.
                    </p>
                  </div>
                </div>

                {/* Shopkeeper Role Card */}
                <div
                  onClick={() => handleSelectRole('shopkeeper')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 hover:border-emerald-500 hover:bg-emerald-950/30 ${
                    selectedRole === 'shopkeeper'
                      ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500/40'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <Store className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Shopkeeper Portal</h3>
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase">Merchant</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Manage live A–Z inventory, restock units, fulfill customer orders with TN addresses.
                    </p>
                  </div>
                </div>

                {/* Admin Role Card */}
                <div
                  onClick={() => handleSelectRole('admin')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 hover:border-amber-500 hover:bg-amber-950/30 ${
                    selectedRole === 'admin'
                      ? 'border-amber-500 bg-amber-950/40 ring-1 ring-amber-500/40'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white">Admin Console</h3>
                      <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">SuperAdmin</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      Master dataset CRUD, provision Shopkeeper accounts, catalog & delivery supervisor.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelectRole(selectedRole)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer"
              >
                <span>Continue as {selectedRole.toUpperCase()}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 2: EMAIL & PASSWORD FOR SELECTED ROLE */}
          {signInStep === 2 && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-7 space-y-5 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                <button
                  type="button"
                  onClick={() => setSignInStep(1)}
                  className="flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change Role</span>
                </button>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border uppercase ${
                  selectedRole === 'shopkeeper' ? 'bg-emerald-950 border-emerald-500/40 text-emerald-300' :
                  selectedRole === 'admin' ? 'bg-amber-950 border-amber-500/40 text-amber-300' :
                  'bg-blue-950 border-blue-500/40 text-blue-300'
                }`}>
                  {selectedRole} Portal Login
                </span>
              </div>

              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    {selectedRole === 'customer' ? 'Customer Email' : selectedRole === 'shopkeeper' ? 'Shopkeeper Email' : 'Admin Username / Email'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-9 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-lg transition-all cursor-pointer ${
                    selectedRole === 'shopkeeper'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                      : selectedRole === 'admin'
                      ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
                  }`}
                >
                  <KeyRound className="h-4 w-4" />
                  <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CUSTOMER SIGN UP (DIRECT CUSTOMER REGISTRATION ONLY) */}
      {/* ========================================================= */}
      {authMode === 'signup' && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 sm:p-7 space-y-5 shadow-xl">
          
          <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
            <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>Customer Registration</span>
            </span>
            <button
              type="button"
              onClick={handleAutofillSignUp}
              className="text-[11px] font-mono text-blue-400 hover:underline cursor-pointer"
            >
              Autofill Sample Details
            </button>
          </div>

          <div className="p-3 rounded-xl border border-blue-500/20 bg-blue-950/20 text-xs text-blue-300 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              Public registration creates your verified Customer account. Shopkeeper merchant accounts are provisioned directly by the Administrator.
            </span>
          </div>

          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. xxxxxxx"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* 2. Age & 3. Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Age <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="number"
                    min={16}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                    placeholder="Age"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Gender <span className="text-rose-400">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Non-binary</option>
                </select>
              </div>
            </div>

            {/* 4. Gmail / Email */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Gmail / Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <input
                  type="email"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  placeholder="e.g. xxxxxx@gmail.com"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* 5. Phone No */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            {/* 6. Password Creation & 7. Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Password Creation <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-9 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Confirm Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-9 pr-9 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-2.5 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Sign Up Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Create Customer Account & Enter Portal</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
