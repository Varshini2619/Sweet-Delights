import React, { useState, useEffect } from 'react';
import { User, Order, Product } from '../types';
import { User as UserIcon, LogIn, UserPlus, MapPin, Package, Heart, Edit3, Key, Plus, Check, Trash2, LogOut } from 'lucide-react';
import { registerUser, loginUser, logoutUser, getUserProfile, type UserProfile } from '../services/authService';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

interface DashboardProps {
  user: User | null;
  authToken: string | null;
  onLogin: (credentials: any) => Promise<boolean>;
  onRegister: (fields: any) => Promise<boolean>;
  onLogout: () => void;
  orders: Order[];
  pProducts: Product[]; // catalog to reference wishlist items
  onToggleWishlist: (productId: string) => void;
  wishlistProductIds: string[];
  onAddToCart: (product: any, weight: string, quantity: number) => void;
}

export default function Dashboard({
  user,
  authToken,
  onLogin,
  onRegister,
  onLogout,
  orders,
  pProducts,
  onToggleWishlist,
  wishlistProductIds,
  onAddToCart,
}: DashboardProps) {
  // Auth Form parameters
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Address Form parameters
  const [addressStreet, setAddressStreet] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressPostal, setAddressPostal] = useState('');
  const [addressPhone, setAddressPhone] = useState('');
  const [addressSuccess, setAddressSuccess] = useState<string | null>(null);

  // Sub Tab inside customer dashboard: 'orders' | 'address' | 'wishlist' | 'profile'
  const [dashboardSubTab, setDashboardSubTab] = useState<'orders' | 'address' | 'wishlist'>('orders');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (forgotPasswordMode) {
      // Simulate verification/forgot password flows
      if (!email) {
        setAuthError("Please fill out your verified email container.");
        return;
      }
      setAuthSuccessMsg(`A secure reset token has been dispatched to ${email}. Check mailbox for instructions!`);
      setForgotPasswordMode(false);
      return;
    }

    try {
      if (isRegister) {
        if (!name || !email || !password) {
          setAuthError("All registration fields are required.");
          return;
        }
        await registerUser(email, password, name);
        setAuthSuccessMsg("Account successfully registered! Logged in automatically.");
        // Trigger parent to update user state
        if (onRegister) {
          await onRegister({ name, email, password });
        }
      } else {
        if (!email || !password) {
          setAuthError("Email and Password are required.");
          return;
        }
        await loginUser(email, password);
        setAuthSuccessMsg("Successfully logged in!");
        // Trigger parent to update user state
        if (onLogin) {
          await onLogin({ email, password });
        }
      }
    } catch (error: any) {
      setAuthError(error.message || "Authentication failed. Please try again.");
    }
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSuccess(null);
    if (!addressStreet || !addressCity || !addressPostal || !addressPhone) {
      alert("Please complete all address entries.");
      return;
    }
    if (!user) {
      alert("You must be logged in to add an address.");
      return;
    }
    try {
      const newAddress = {
        id: `addr-${Date.now()}`,
        street: addressStreet,
        city: addressCity,
        postalCode: addressPostal,
        phone: addressPhone,
        isDefault: user.addresses.length === 0
      };

      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        addresses: arrayUnion(newAddress)
      });

      setAddressSuccess("Shipping address registered successfully in cloud index.");
      // Clear forms
      setAddressStreet('');
      setAddressCity('');
      setAddressPostal('');
      setAddressPhone('');
      // Update local user state
      user.addresses.push(newAddress);
    } catch (err) {
      console.error("Error adding address:", err);
      alert("Failed to register address. Please try again.");
    }
  };

  // Filter wishlist products
  const wishlistProducts = pProducts.filter((p) => wishlistProductIds.includes(p.id));

  // RENDER: NOT LOGGED IN AUTH FORMS
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 px-4 font-sans" id="sweet-delights-unauthenticated-portal">
        <div className="bg-white dark:bg-stone-900 border border-amber-500/15 p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
          
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserIcon className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-2xl font-serif font-black dark:text-stone-100">
              {forgotPasswordMode ? 'Reset Credentials' : isRegister ? 'Register Account' : 'Sign in to Portal'}
            </h2>
            <p className="text-xs text-stone-500">
              {forgotPasswordMode
                ? "Enter your verified email, and we'll send a password recovery link."
                : isRegister
                ? "Join our Sweet Delights rewards club and save planner estimates!"
                : "Enter credentials to access shipping logs and saved favorites."}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isRegister && !forgotPasswordMode && (
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                  Full Name Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-stone-200 dark:border-stone-850 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 focus:outline-none focus:border-amber-500 dark:text-stone-100 placeholder:text-stone-400"
                  placeholder="e.g. Varshini Gold"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs sm:text-sm border border-stone-200 dark:border-stone-850 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 focus:outline-none focus:border-amber-500 dark:text-stone-100 placeholder:text-stone-400"
                placeholder="vip-shopper@email.com"
              />
            </div>

            {!forgotPasswordMode && (
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5 font-mono">
                  Secret Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-stone-200 dark:border-stone-850 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900 focus:outline-none focus:border-amber-500 dark:text-stone-100 placeholder:text-stone-400"
                  placeholder="••••••••"
                />
              </div>
            )}

            {authError && (
              <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-mono font-bold">
                 ⚠️ {authError}
              </div>
            )}

            {authSuccessMsg && (
              <div className="p-3 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs leading-normal font-sans">
                 ✨ {authSuccessMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-gradient-to-tr from-stone-950 to-stone-850 text-amber-400 font-bold hover:scale-[1.01] active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              {forgotPasswordMode ? <Key className="w-4 h-4" /> : isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {forgotPasswordMode ? 'Send Reset Token' : isRegister ? 'Register & Sign In' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Assist */}
          {!forgotPasswordMode && (
            <div className="bg-amber-50/20 dark:bg-stone-950/40 p-3.5 rounded-xl border border-amber-500/10 text-[10px] space-y-1 font-mono text-stone-605 text-stone-600 dark:text-stone-400 leading-normal">
              <span className="font-bold text-amber-700 dark:text-amber-400 uppercase block mb-1">🔑 Sandbox VIP Portals:</span>
              <p>• <strong>Administrator Portal:</strong> admin@sweetdelights.com | admin123</p>
              <p>• <strong>Demonstration Client:</strong> user@sweetdelights.com | user123</p>
            </div>
          )}

          <div className="flex flex-col gap-2 items-center text-xs text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-850 pt-4">
            {!forgotPasswordMode && (
              <button
                type="button"
                onClick={() => setForgotPasswordMode(true)}
                className="hover:text-amber-500 font-bold transition-all text-[11px] cursor-pointer"
              >
                Forgot your Secret Password? Reset here
              </button>
            )}

            {forgotPasswordMode ? (
              <button
                type="button"
                onClick={() => setForgotPasswordMode(false)}
                className="hover:text-amber-550 font-bold cursor-pointer text-amber-700"
              >
                Back to Sign In
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setAuthError(null); }}
                className="hover:text-amber-550 font-bold underline cursor-pointer"
              >
                {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register free"}
              </button>
            )}
          </div>

        </div>
      </div>
    );
  }

  // RENDER: LOGGED IN PORTAL VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans" id="sweet-delights-authenticated-portal">
      
      {/* Greetings Portal Header */}
      <div className="bg-white dark:bg-stone-900 border border-amber-500/11 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-stone-950 font-black font-serif text-xl flex items-center justify-center border-2 border-white shadow-xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-black dark:text-stone-100 flex items-center gap-1.5 leading-tight">
              Bonjour, {user.name}! 🌟
            </h1>
            <p className="text-xs text-stone-500 font-mono mt-1">
              Loyalty Tier: <span className="text-amber-600 dark:text-amber-400 font-bold uppercase">Prestige Connoisseur</span> | {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.isAdmin && (
            <span className="text-[10px] bg-red-600 text-white font-black uppercase px-2.5 py-1 rounded-full animate-bounce">
              System Admin
            </span>
          )}
          <button
            onClick={async () => {
              try {
                await logoutUser();
                onLogout();
              } catch (error: any) {
                console.error("Logout error:", error);
                alert("Failed to logout. Please try again.");
              }
            }}
            className="px-4 py-2 border border-stone-200 dark:border-stone-800 rounded-full text-xs font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-850 hover:text-rose-600 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Grid: Navigation Tabs on left, Content on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar Drawer */}
        <div className="lg:col-span-1 bg-white dark:bg-stone-900 border border-amber-500/10 p-5 rounded-2xl shadow-sm h-fit space-y-1.5">
          <h3 className="text-xs font-bold font-mono uppercase tracking-widest text-stone-400 mb-3 block px-3">
            Portal Navigation
          </h3>

          <button
            onClick={() => setDashboardSubTab('orders')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all text-stone-705 ${
              dashboardSubTab === 'orders' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-black' : 'hover:bg-stone-50 dark:hover:bg-stone-950 dark:text-stone-300'
            }`}
          >
            <Package className="w-4 h-4 text-amber-500" />
            My Orders History
          </button>

          <button
            onClick={() => setDashboardSubTab('address')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all text-stone-705 ${
              dashboardSubTab === 'address' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-black' : 'hover:bg-stone-50 dark:hover:bg-stone-950 dark:text-stone-300'
            }`}
          >
            <MapPin className="w-4 h-4 text-amber-500" />
            Address Registry
          </button>

          <button
            onClick={() => setDashboardSubTab('wishlist')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all text-stone-705 ${
              dashboardSubTab === 'wishlist' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-black' : 'hover:bg-stone-50 dark:hover:bg-stone-950 dark:text-stone-300'
            }`}
          >
            <Heart className="w-4 h-4 text-amber-500" />
            Saved Wishlist ({wishlistProductIds.length})
          </button>
        </div>

        {/* Content Box */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* TAB 1: ORDER HISTORIES */}
          {dashboardSubTab === 'orders' && (
            <div className="bg-white dark:bg-stone-900 border border-amber-500/10 rounded-2xl shadow-sm p-6">
              <h3 className="font-serif text-lg font-black text-stone-900 dark:text-amber-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-3 mb-6">
                <Package className="w-5 h-5 text-amber-500" />
                Durable Order Histories
              </h3>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-stone-450 dark:text-stone-550 text-xs italic">
                  You haven't placed any artisanal bookings yet. Discover our lovely Collections!
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((o) => (
                    <div key={o.id} className="p-4 sm:p-5 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-200/40 dark:border-stone-850 shadow-sm space-y-4">
                      
                      {/* Top bar info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-200/20 pb-3 gap-2">
                        <div>
                          <span className="text-stone-400 font-mono text-[10px] block uppercase">Ref ID</span>
                          <span className="font-mono font-black text-xs text-stone-900 dark:text-stone-100">{o.id}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 font-mono text-[10px] block uppercase">Date Booked</span>
                          <span className="font-mono text-stone-705 dark:text-stone-300 text-xs">{o.createdAt.split('T')[0]}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 font-mono text-[10px] block uppercase">Shipping dispatch Status</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black uppercase inline-block mt-0.5 ${
                            o.orderStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600' :
                            o.orderStatus === 'Cancelled' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 animate-pulse'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="space-y-2">
                        {o.items.map((it: any, itIdx: number) => (
                          <div key={itIdx} className="flex justify-between items-center text-xs">
                            <span className="font-bold text-stone-800 dark:text-stone-300">
                              {it.productName} <span className="text-[10px] font-mono text-stone-450">({it.weight})</span>
                            </span>
                            <span className="font-mono text-stone-500">
                              Qty: {it.quantity} | Total: ${it.price * it.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Financial billing details */}
                      <div className="border-t border-stone-200/10 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="text-stone-500 font-mono">
                          Payment Method: <span className="font-bold text-stone-800 dark:text-stone-300">{o.paymentMethod}</span> | Payment status: <span className="text-amber-700 dark:text-amber-400 font-bold">{o.paymentStatus}</span>
                        </div>
                        <div className="text-right sm:text-right font-serif text-sm">
                          Amount Paid: <span className="font-black text-amber-700 dark:text-amber-300 text-base">${o.total}</span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ADDRESS REGISTRIES */}
          {dashboardSubTab === 'address' && (
            <div className="bg-white dark:bg-stone-900 border border-amber-500/10 rounded-2xl shadow-sm p-6">
              <h3 className="font-serif text-lg font-black text-stone-900 dark:text-amber-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-3 mb-6">
                <MapPin className="w-5 h-5 text-amber-500" />
                Manage Delivery Locations
              </h3>

              {/* Saved Address cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {user.addresses.length === 0 ? (
                  <div className="sm:col-span-2 text-center py-6 text-stone-400 dark:text-stone-500 text-xs italic">
                     No saved shipping locations found. Submit a new address below.
                  </div>
                ) : (
                  user.addresses.map((addr) => (
                    <div key={addr.id} className={`p-4 rounded-xl border transition-all ${addr.isDefault ? 'border-amber-500/40 bg-amber-500/[0.02]' : 'border-stone-100 dark:border-stone-850 bg-stone-50 dark:bg-stone-950'} relative`}>
                      {addr.isDefault && (
                        <span className="absolute top-3 right-3 text-[9px] uppercase font-mono font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Check className="w-2.5 h-2.5" /> default
                        </span>
                      )}
                      <h4 className="font-bold text-xs text-stone-850 dark:text-stone-200">Shipping Location</h4>
                      <p className="text-[11.5px] text-stone-605 text-stone-600 dark:text-stone-400 mt-1.5 leading-relaxed">
                        {addr.street}, {addr.city} - {addr.postalCode}
                      </p>
                      <p className="text-[10px] text-stone-450 mt-1 font-mono">📞 Phone: {addr.phone}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Address Form */}
              <form onSubmit={handleAddAddressSubmit} className="space-y-4 border-t border-stone-100 dark:border-stone-850 pt-5 text-xs sm:text-sm">
                <h4 className="font-serif font-black text-stone-900 dark:text-amber-300">Register New Address</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                      Street Location details
                    </label>
                    <input
                      type="text"
                      required
                      value={addressStreet}
                      onChange={(e) => setAddressStreet(e.target.value)}
                      placeholder="e.g. 15 Butter Street, Ghee Avenue"
                      className="w-full border border-stone-200 dark:border-stone-800 p-2 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200 placeholder:text-stone-450"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={addressCity}
                      onChange={(e) => setAddressCity(e.target.value)}
                      placeholder="e.g. Bengaluru"
                      className="w-full border border-stone-200 dark:border-stone-800 p-2 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200 placeholder:text-stone-450"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                      Postal Zip Index
                    </label>
                    <input
                      type="text"
                      required
                      value={addressPostal}
                      onChange={(e) => setAddressPostal(e.target.value)}
                      placeholder="e.g. 560001"
                      className="w-full border border-stone-200 dark:border-stone-800 p-2 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200 placeholder:text-stone-450"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={addressPhone}
                      onChange={(e) => setAddressPhone(e.target.value)}
                      placeholder="+91 90000 12345"
                      className="w-full border border-stone-200 dark:border-stone-800 p-2 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200 placeholder:text-stone-450"
                    />
                  </div>
                </div>

                {addressSuccess && (
                  <div className="p-3 bg-emerald-500/10 text-emerald-800 dark:text-emerald-350 rounded-lg text-xs font-mono font-bold">
                     ✨ {addressSuccess}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 rounded-full bg-stone-950 text-amber-400 dark:bg-amber-500 dark:text-stone-950 text-xs font-bold tracking-wide hover:scale-105 active:scale-95 transition-all text-center cursor-pointer"
                >
                  Save Shipping Address
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: WISHLIST BOOKMARKS */}
          {dashboardSubTab === 'wishlist' && (
            <div className="bg-white dark:bg-stone-900 border border-amber-500/10 rounded-2xl shadow-sm p-6">
              <h3 className="font-serif text-lg font-black text-stone-900 dark:text-amber-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-850 pb-3 mb-6">
                <Heart className="w-5 h-5 text-amber-500 fill-amber-500" />
                My Saved Confectionery
              </h3>

              {wishlistProducts.length === 0 ? (
                <div className="text-center py-12 text-stone-405 text-xs italic text-stone-400 dark:text-stone-500">
                  You haven't bookmarked any sweet delights yet. Browse our Menu Collection to save items!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200/40 dark:border-stone-850 rounded-xl flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 object-cover rounded-lg border border-amber-500/10"
                        />
                        <div>
                          <h4 className="font-black text-stone-900 dark:text-stone-200 text-xs sm:text-sm">{p.name}</h4>
                          <span className="text-[10px] text-amber-605 text-amber-500 font-mono font-bold">${p.price} Base</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => onAddToCart(p, p.weightOptions[0], 1)}
                          className="px-2.5 py-1.5 bg-amber-500 hover:scale-105 transition-all text-stone-950 font-bold text-[10px] rounded-lg cursor-pointer"
                          title="Add first size unit to basket"
                        >
                          Toss to Cart
                        </button>
                        <button
                          onClick={() => onToggleWishlist(p.id)}
                          className="p-1.5 bg-rose-50 dark:bg-red-950/40 hover:bg-rose-100 dark:text-red-400 text-rose-500 rounded-lg cursor-pointer"
                          title="Remove bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
