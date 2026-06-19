import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, ShoppingCart, Users, CalendarDays, Plus, Edit2, Trash2, Check, X, RefreshCw, Layers } from 'lucide-react';
import { Order, PlannerRequest, Product, User } from '../types';

interface AdminPanelProps {
  user: User | null;
  authToken: string | null;
  products: Product[];
  orders: Order[];
  pRequests: PlannerRequest[];
  onUpdateOrderStatus: (orderId: string, status: string) => void;
  onUpdatePlannerStatus: (planId: string, status: string) => void;
  onAddOrUpdateProduct: (product: any) => void;
  onDeleteProduct: (productId: string) => void;
}

export default function AdminPanel({
  user,
  authToken,
  products,
  orders,
  pRequests,
  onUpdateOrderStatus,
  onUpdatePlannerStatus,
  onAddOrUpdateProduct,
  onDeleteProduct,
}: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<'orders' | 'planners' | 'products' | 'blogs' | 'coupons'>('orders');

  // Blogs and Coupons management state
  const [blogs, setBlogs] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [couponsLoading, setCouponsLoading] = useState(false);

  // Blog Form State
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [isAddingNewBlog, setIsAddingNewBlog] = useState(false);
  const [blogFormData, setBlogFormData] = useState({
    title: '',
    category: 'Baking Secrets',
    image: '',
    content: ''
  });

  // Coupons Form State
  const [isAddingNewCoupon, setIsAddingNewCoupon] = useState(false);
  const [couponFormData, setCouponFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    value: 10,
    expiryDate: '2026-12-31',
    minOrderValue: 20
  });

  // Load backend content
  useEffect(() => {
    if (authToken) {
      fetchAdminBlogs();
      fetchAdminCoupons();
    }
  }, [authToken, activeSection]);

  const fetchAdminBlogs = async () => {
    try {
      setBlogsLoading(true);
      const res = await fetch('/api/blog');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.posts || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBlogsLoading(false);
    }
  };

  const fetchAdminCoupons = async () => {
    try {
      setCouponsLoading(true);
      const res = await fetch('/api/coupons');
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCouponsLoading(false);
    }
  };

  // Product Form helper state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Cakes' as 'Cakes' | 'Sweets' | 'Savouries',
    description: '',
    price: 30,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    ingredients: 'Flour, organic sugar, fresh vanilla bean, sweet milk cream',
    shelfLife: '3 Days',
    weightOptions: '500g, 1Kg, 2Kg',
  });

  // Calculate high-level bento metrics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.total, 0);

  const pendingPlannerBookings = pRequests.filter((p) => p.status === 'Pending').length;

  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setIsAddingNew(false);
    setFormData({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      rating: prod.rating,
      image: prod.image,
      ingredients: prod.ingredients.join(', '),
      shelfLife: prod.shelfLife,
      weightOptions: prod.weightOptions.join(', '),
    });
  };

  const handleAddNewClick = () => {
    setIsAddingNew(true);
    setEditingProduct(null);
    setFormData({
      id: 'cake-' + Math.random().toString(36).substr(2, 5),
      name: '',
      category: 'Cakes',
      description: '',
      price: 45,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=600&auto=format&fit=crop&q=80',
      ingredients: 'Organic fresh raw dairy, wheat premium flour, sugar crystals',
      shelfLife: '3 Days',
      weightOptions: '500g, 1Kg, 2Kg',
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      id: formData.id || 'prod-' + Math.random().toString(36).substr(2, 5),
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      rating: formData.rating,
      image: formData.image,
      ingredients: formData.ingredients.split(',').map((x) => x.trim()),
      shelfLife: formData.shelfLife,
      weightOptions: formData.weightOptions.split(',').map((x) => x.trim()),
      priceMultipliers: { [formData.weightOptions.split(',')[0].trim()]: 1, '1Kg': 1.8, '2Kg': 3.2 },
      reviews: [],
    };
    onAddOrUpdateProduct(formattedData);
    setIsAddingNew(false);
    setEditingProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans" id="sweet-delights-admin-panel">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-amber-500/10 pb-6 mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center border border-red-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-red-500 bg-red-500/5 px-2.5 py-0.5 rounded-full">
              Administrator Access
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black dark:text-stone-100 italic mt-0.5">
              Chef Portal & Analytics
            </h1>
          </div>
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-450 md:text-right max-w-sm font-sans">
          Welcome back, **{user?.name || 'Grand Baker'}**. You can override catalog pricing, track custom order dispatches, and check pending AI suggestions.
        </p>
      </div>

      {/* Bento telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Total Revenues */}
        <div className="bg-gradient-to-tr from-stone-900 to-stone-800 text-stone-100 p-5 rounded-2xl border border-amber-500/10 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-500 font-mono uppercase tracking-wider font-bold">Total Income</span>
            <h3 className="text-2xl sm:text-3.5xl font-serif font-black mt-1 text-amber-400">${totalRevenue}</h3>
            <span className="text-[9px] text-stone-400 mt-0.5 block flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> +14% since yesterday
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Orders Box */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-amber-500/10 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-450 dark:text-stone-400 font-mono uppercase tracking-wider font-bold">Total Orders</span>
            <h3 className="text-2xl sm:text-3.5xl font-serif font-black mt-1 text-stone-900 dark:text-amber-100">{orders.length}</h3>
            <span className="text-[9px] text-stone-400 mt-1 block">Includes guest checkouts</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-600 dark:text-stone-300">
            <ShoppingCart className="w-5 h-5" />
          </div>
        </div>

        {/* Planner requests */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-amber-500/10 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-450 dark:text-stone-400 font-mono uppercase tracking-wider font-bold">Planner Requests</span>
            <h3 className="text-2xl sm:text-3.5xl font-serif font-black mt-1 text-stone-900 dark:text-amber-100">{pRequests.length}</h3>
            <span className="text-[9px] text-amber-600 font-bold font-mono animate-pulse">{pendingPlannerBookings} requests awaiting review</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        {/* Total Catalog count */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-amber-500/10 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-450 dark:text-stone-400 font-mono uppercase tracking-wider font-bold">Active Menu items</span>
            <h3 className="text-2xl sm:text-3.5xl font-serif font-black mt-1 text-stone-900 dark:text-amber-100">{products.length}</h3>
            <span className="text-[9px] text-stone-400 mt-1 block">Across 3 categories</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-650 dark:text-stone-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Admin Tab Switching */}
      <div className="flex flex-wrap border-b border-stone-200 dark:border-stone-800 gap-2 mb-6">
        <button
          onClick={() => { setActiveSection('orders'); setIsAddingNew(false); setEditingProduct(null); setIsAddingNewBlog(false); setEditingBlog(null); setIsAddingNewCoupon(false); }}
          className={`pb-3 text-xs sm:text-sm font-bold tracking-wider relative uppercase px-2 sm:px-4 ${
            activeSection === 'orders' ? 'text-amber-600 dark:text-amber-400 font-black' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Orders
          {activeSection === 'orders' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
        </button>
        <button
          onClick={() => { setActiveSection('planners'); setIsAddingNew(false); setEditingProduct(null); setIsAddingNewBlog(false); setEditingBlog(null); setIsAddingNewCoupon(false); }}
          className={`pb-3 text-xs sm:text-sm font-bold tracking-wider relative uppercase px-2 sm:px-4 ${
            activeSection === 'planners' ? 'text-amber-600 dark:text-amber-400 font-black' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Bookings ({pendingPlannerBookings})
          {activeSection === 'planners' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
        </button>
        <button
          onClick={() => { setActiveSection('products'); setIsAddingNewBlog(false); setEditingBlog(null); setIsAddingNewCoupon(false); }}
          className={`pb-3 text-xs sm:text-sm font-bold tracking-wider relative uppercase px-2 sm:px-4 ${
            activeSection === 'products' ? 'text-amber-600 dark:text-amber-400 font-black' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Products
          {activeSection === 'products' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
        </button>
        <button
          onClick={() => { setActiveSection('blogs'); setIsAddingNew(false); setEditingProduct(null); setIsAddingNewBlog(false); setEditingBlog(null); setIsAddingNewCoupon(false); }}
          className={`pb-3 text-xs sm:text-sm font-bold tracking-wider relative uppercase px-2 sm:px-4 ${
            activeSection === 'blogs' ? 'text-amber-600 dark:text-amber-400 font-black' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Blogs
          {activeSection === 'blogs' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
        </button>
        <button
          onClick={() => { setActiveSection('coupons'); setIsAddingNew(false); setEditingProduct(null); setIsAddingNewBlog(false); setEditingBlog(null); setIsAddingNewCoupon(false); }}
          className={`pb-3 text-xs sm:text-sm font-bold tracking-wider relative uppercase px-2 sm:px-4 ${
            activeSection === 'coupons' ? 'text-amber-600 dark:text-amber-400 font-black' : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          Coupons
          {activeSection === 'coupons' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />}
        </button>
      </div>

      {/* ==================== ACTIVE VIEW: ORDERS ==================== */}
      {activeSection === 'orders' && (
        <div className="bg-white dark:bg-stone-900 border border-amber-500/10 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-100 dark:border-stone-850 flex items-center justify-between">
            <h3 className="font-serif font-black text-stone-900 dark:text-amber-300">Customer Shipping Tracker</h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-950 dark:text-stone-400 font-bold">
              {orders.length} entries registered
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-stone-450 dark:text-stone-500 italic text-xs">
               No customer orders found in system yet. Check back shortly.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-950 uppercase text-[10px] text-stone-500 font-mono tracking-wider">
                  <tr>
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Summary items</th>
                    <th className="p-4">Total Value</th>
                    <th className="p-4">Status & Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-850 text-stone-700 dark:text-stone-350">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-amber-500/[0.01]">
                      <td className="p-4">
                        <span className="font-black text-stone-800 dark:text-stone-250 block">{o.id}</span>
                        <span className="text-[10px] text-stone-450 mt-0.5 block font-mono">{o.createdAt.split('T')[0]}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold block text-stone-900 dark:text-stone-100">{o.userName}</span>
                        <span className="text-[10px] text-stone-500 block">{o.email}</span>
                        <span className="text-[9px] text-stone-400 dark:text-stone-500 block">{o.deliveryAddress.street}, {o.deliveryAddress.city}</span>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="space-y-1">
                          {o.items.map((it: any, iIdx: number) => (
                            <span key={iIdx} className="block text-[11px] font-mono leading-tight">
                              • {it.productName} ({it.weight}) x{it.quantity}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-mono">
                        <span className="font-black text-stone-900 dark:text-stone-200 block">${o.total}</span>
                        <span className={`text-[9px] font-bold uppercase rounded p-1 inline-block mt-0.5 ${
                          o.paymentStatus === 'Paid' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
                        }`}>
                          {o.paymentMethod} {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-black ${
                            o.orderStatus === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600' :
                            o.orderStatus === 'Cancelled' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-750 dark:text-amber-300 animate-pulse'
                          }`}>
                            {o.orderStatus}
                          </span>
                          
                          {/* Status Actions */}
                          {o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled' && (
                            <select
                              value={o.orderStatus}
                              onChange={(e) => onUpdateOrderStatus(o.id, e.target.value)}
                              className="text-[10px] border border-stone-200 dark:border-stone-800 p-1 rounded-md bg-stone-50 dark:bg-stone-950 focus:outline-none focus:border-amber-500 dark:text-stone-200"
                            >
                              <option value="Placed">Placed</option>
                              <option value="Processing">Processing</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== ACTIVE VIEW: PLANNERS ==================== */}
      {activeSection === 'planners' && (
        <div className="bg-white dark:bg-stone-900 border border-amber-500/10 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-100 dark:border-stone-850 flex items-center justify-between">
            <h3 className="font-serif font-black text-stone-900 dark:text-amber-300">Gâteau-AI Custom Planner Audits</h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold">
              {pRequests.length} proposal blueprints
            </span>
          </div>

          {pRequests.length === 0 ? (
            <div className="text-center py-12 text-stone-450 dark:text-stone-500 italic text-xs">
              No planner request submissions found yet. Create planner proposals to review here!
            </div>
          ) : (
            <div className="overflow-x-auto font-sans">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-950 uppercase text-[10px] text-stone-500 font-mono tracking-wider">
                  <tr>
                    <th className="p-4">Plan Ref</th>
                    <th className="p-4">Attendees</th>
                    <th className="p-4">Theme & Notes</th>
                    <th className="p-4">Calculations suggested</th>
                    <th className="p-4">Budget / Approve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-850 text-stone-700 dark:text-stone-350">
                  {pRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-amber-500/[0.01]">
                      <td className="p-4">
                        <span className="font-black text-stone-800 dark:text-stone-200 block">{r.id}</span>
                        <span className="text-[10.5px] font-bold text-stone-900 dark:text-stone-100 block mt-0.5">{r.eventType}</span>
                        <span className="text-[9.5px] text-stone-500 block font-mono">Date: {r.eventDate}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold font-mono text-[10.5px]">
                          {r.guests} guests
                        </span>
                        <span className="block text-[10px] text-stone-500 mt-1">{r.deliveryAddress}</span>
                      </td>
                      <td className="p-4 max-w-xs">
                        <span className="font-bold text-stone-800 dark:text-stone-250 block">{r.themeSelection}</span>
                        <p className="text-[10px] text-stone-450 mt-1 italic leading-relaxed">
                          "{r.customNotes || 'No custom notes'}"
                        </p>
                      </td>
                      <td className="p-4 text-[11px] leading-snug">
                        <p>🍰 <strong>Cake:</strong> {r.aiSuggestions.recommendedCake}</p>
                        <p>🍬 <strong>Sweets:</strong> {r.aiSuggestions.recommendedSweets}</p>
                        <p>🌭 <strong>Savour:</strong> {r.aiSuggestions.recommendedSavouries}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-black text-stone-900 dark:text-amber-400 font-serif block">
                            ${r.aiSuggestions.estimatedPrice} Quote
                          </span>
                          
                          <div className="flex gap-1.5 mt-1.5">
                            {r.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => onUpdatePlannerStatus(r.id, 'Approved')}
                                  className="px-2.5 py-1 bg-emerald-500 text-white rounded text-[10px] font-bold flex items-center gap-1 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                                  title="Approve quotation price"
                                >
                                  <Check className="w-3 h-3" /> Approve
                                </button>
                                <button
                                  onClick={() => onUpdatePlannerStatus(r.id, 'Declined')}
                                  className="px-2.5 py-1 bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded text-[10px] font-bold flex items-center gap-1 hover:bg-stone-300 dark:hover:bg-stone-750 active:scale-95 transition-all cursor-pointer"
                                  title="Decline / Revise plan"
                                >
                                  <X className="w-3 h-3" /> Decline
                                </button>
                              </>
                            ) : (
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold capitalize ${
                                r.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                              }`}>
                                {r.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================== ACTIVE VIEW: PRODUCTS ==================== */}
      {activeSection === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inventory Table List */}
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 border border-amber-500/10 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-stone-100 dark:border-stone-850 flex items-center justify-between">
              <h3 className="font-serif font-black text-stone-900 dark:text-amber-300">Catalog Inventory List</h3>
              <button
                onClick={handleAddNewClick}
                className="px-3.5 py-1.5 bg-amber-500 text-stone-950 rounded-full font-bold text-xs flex items-center gap-1 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Product
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-950 uppercase text-[10px] text-stone-400 font-mono tracking-wider sticky top-0">
                  <tr>
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Base price</th>
                    <th className="p-4 text-center">Settings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-850 text-stone-700 dark:text-stone-350">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-amber-500/[0.01]">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg border border-amber-500/10"
                        />
                        <div>
                          <span className="font-black text-stone-800 dark:text-stone-200 block text-sm">{p.name}</span>
                          <span className="text-[10px] text-stone-450 block truncate max-w-[200px]" title={p.description}>
                            {p.description}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-stone-900 dark:text-stone-200">
                        ${p.price} USD
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="p-1.5 bg-stone-100 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 rounded hover:text-amber-850 cursor-pointer"
                            title="Edit metadata values"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you absolutely sure you want to remove ${p.name} from public Sweet Delights catalog?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="p-1.5 bg-rose-50 dark:bg-red-950 text-rose-600 dark:text-red-400 rounded hover:bg-rose-100 dark:hover:bg-red-900 cursor-pointer"
                            title="Remove catalog product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* New / Edit Form */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 border border-amber-500/10 rounded-2xl p-6 shadow-md">
            <h3 className="font-serif font-black text-lg text-stone-900 dark:text-amber-300 border-b border-stone-100 dark:border-stone-850 pb-3 mb-4">
              {isAddingNew ? '✨ Create New Catalog entry' : editingProduct ? `✏️ Adjust metadata: ${editingProduct.name}` : '💡 Select item to Edit or Create'}
            </h3>

            {!isAddingNew && !editingProduct ? (
              <div className="text-center py-16 text-stone-400 dark:text-stone-500 text-xs italic bg-stone-50 dark:bg-stone-950 rounded-xl border border-dashed border-stone-200 dark:border-stone-850">
                 Tap any product's edit icon or select "Add New" button to modify public store inventory metadata dynamically.
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm font-sans">
                
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                    Product Title Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200 focus:outline-none focus:border-amber-500"
                    placeholder="e.g. Saffron Rasgulla Fusion Mini"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200 focus:outline-none"
                    >
                      <option value="Cakes">Cakes</option>
                      <option value="Sweets">Sweets</option>
                      <option value="Savouries">Savouries</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                      Base price ($ USD)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                    Gourmet Photographic URL
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                    Brief appetizing description
                  </label>
                  <textarea
                    rows={2.5}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-stone-200 dark:border-stone-800 p-2 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200"
                    placeholder="Provide poetic gourmet descriptors..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                      Shelf life limits
                    </label>
                    <input
                      type="text"
                      value={formData.shelfLife}
                      onChange={(e) => setFormData({ ...formData, shelfLife: e.target.value })}
                      className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                      Portion weight selection
                    </label>
                    <input
                      type="text"
                      value={formData.weightOptions}
                      onChange={(e) => setFormData({ ...formData, weightOptions: e.target.value })}
                      className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200 text-xs"
                      placeholder="e.g. 500g, 1Kg, 2Kg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                    Ingredients (Comma separated series)
                  </label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-950 dark:text-stone-200"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-full bg-amber-500 text-stone-950 font-bold hover:scale-[1.01] hover:brightness-115 active:scale-95 transition-all text-center cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsAddingNew(false); setEditingProduct(null); }}
                    className="py-2.5 px-4 rounded-full bg-stone-105 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-750 text-stone-700 dark:text-stone-300 font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      )}

      {/* ==================== ACTIVE VIEW: MANAGE BLOGS ==================== */}
      {activeSection === 'blogs' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-amber-500/10 rounded-2xl shadow-sm overflow-hidden p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-850 pb-4 mb-6">
              <div>
                <h3 className="font-serif font-black text-stone-900 dark:text-amber-300 text-lg">Gourmet Blog Articles Manager</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Compose new stories, edit secrets, and view current discussions.</p>
              </div>
              {!isAddingNewBlog && !editingBlog && (
                <button
                  onClick={() => {
                    setIsAddingNewBlog(true);
                    setEditingBlog(null);
                    setBlogFormData({ title: '', category: 'Baking Secrets', image: '', content: '' });
                  }}
                  className="py-2.5 px-5 bg-brand-brown text-[#FAF7F2] dark:bg-brand-gold dark:text-brand-brown rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:scale-102 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Compose Article
                </button>
              )}
            </div>

            {/* Editing / Addition Form */}
            {(isAddingNewBlog || editingBlog) && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const method = editingBlog ? 'PUT' : 'POST';
                    const endpoint = editingBlog ? `/api/blog/${editingBlog.id}` : '/api/blog';
                    const res = await fetch(endpoint, {
                      method,
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                      },
                      body: JSON.stringify({
                        title: blogFormData.title.trim(),
                        category: blogFormData.category,
                        image: blogFormData.image.trim() || undefined,
                        content: blogFormData.content.trim()
                      })
                    });
                    
                    if (res.ok) {
                      setIsAddingNewBlog(false);
                      setEditingBlog(null);
                      await fetchAdminBlogs();
                      alert(editingBlog ? 'Article refreshed successfully!' : 'Article composed successfully!');
                    } else {
                      const data = await res.json();
                      alert(data.error || 'Failed to save blog post.');
                    }
                  } catch (err) {
                    alert('Network error while saving post.');
                  }
                }}
                className="space-y-4 max-w-2xl bg-[#FAF7F2]/40 dark:bg-black/10 p-5 rounded-2xl border border-brand-brown/10 mb-6"
              >
                <h4 className="font-serif font-black text-brand-brown dark:text-brand-cream text-sm">
                  {editingBlog ? 'Modify Gourmet Article' : 'Draft New Masterclass Chronicle'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase mb-1 font-mono">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Secret behind 24K Gold Pastries"
                      value={blogFormData.title}
                      onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                      className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-white dark:bg-stone-950 dark:text-stone-250 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase mb-1 font-mono">
                      Category *
                    </label>
                    <select
                      value={blogFormData.category}
                      onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                      className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-white dark:bg-stone-950 dark:text-stone-250"
                    >
                      <option value="Baking Secrets">Baking Secrets</option>
                      <option value="Inside the Kitchen">Inside the Kitchen</option>
                      <option value="Artisanal Decor">Artisanal Decor</option>
                      <option value="Confectionery Travel">Confectionery Travel</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase mb-1 font-mono">
                    Article Hero Image URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={blogFormData.image}
                    onChange={(e) => setBlogFormData({ ...blogFormData, image: e.target.value })}
                    className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-white dark:bg-stone-950 dark:text-stone-250 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase mb-1 font-mono">
                    Article Body Content * (Headers prefix with ###, lists starting with -)
                  </label>
                  <textarea
                    rows={10}
                    required
                    placeholder="Draft detailed gourmet tips..."
                    value={blogFormData.content}
                    onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                    className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-white dark:bg-stone-950 dark:text-stone-250 text-xs font-sans"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-grow py-2.5 px-6 bg-brand-brown text-[#FAF7F2] dark:bg-brand-gold dark:text-brand-brown rounded-full font-bold text-xs uppercase"
                  >
                    Publish Article
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewBlog(false);
                      setEditingBlog(null);
                    }}
                    className="py-2.5 px-6 rounded-full bg-stone-200 dark:bg-stone-850 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase"
                  >
                    Cancel Draft
                  </button>
                </div>
              </form>
            )}

            {/* Articles Table list */}
            {blogsLoading ? (
              <p className="text-center py-6 text-xs text-stone-400 animate-pulse">Retrieving articles...</p>
            ) : blogs.length === 0 ? (
              <p className="text-center py-12 text-xs italic text-stone-400">No blog articles composed yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-950 uppercase text-[10px] text-stone-500 font-mono tracking-wider">
                    <tr>
                      <th className="p-4">Cover & Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Created Date</th>
                      <th className="p-4">Engagement</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-850">
                    {blogs.map((b) => (
                      <tr key={b.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-950/20">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={b.image} alt={b.title} className="w-10 h-10 object-cover rounded-md" />
                            <span className="font-bold text-brand-brown dark:text-stone-150 line-clamp-1 max-w-[200px]">{b.title}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-brand-gold/15 text-brand-brown/80 font-bold">{b.category}</span>
                        </td>
                        <td className="p-4 text-stone-500 font-mono">
                          {new Date(b.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-mono text-stone-500 text-center">
                          💬 {(b.comments || []).length}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingBlog(b);
                              setIsAddingNewBlog(false);
                              setBlogFormData({
                                title: b.title,
                                category: b.category,
                                image: b.image,
                                content: b.content
                              });
                            }}
                            className="p-1 px-2 hover:bg-stone-100 dark:hover:bg-stone-800 text-brand-gold font-bold inline-flex items-center gap-0.5 cursor-pointer uppercase text-[10px]"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm(`Are you sure you want to delete "${b.title}"?`)) return;
                              try {
                                const res = await fetch(`/api/blog/${b.id}`, {
                                  method: 'DELETE',
                                  headers: { 'Authorization': `Bearer ${authToken}` }
                                });
                                if (res.ok) {
                                  await fetchAdminBlogs();
                                } else {
                                  alert('Could not delete post.');
                                }
                              } catch (e) {
                                alert('Network error deleting post.');
                              }
                            }}
                            className="p-1 px-2 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 inline-flex items-center gap-0.5 cursor-pointer uppercase text-[10px]"
                          >
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== ACTIVE VIEW: MANAGE COUPONS ==================== */}
      {activeSection === 'coupons' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-amber-500/10 rounded-2xl shadow-sm overflow-hidden p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 dark:border-stone-850 pb-4 mb-6">
              <div>
                <h3 className="font-serif font-black text-stone-900 dark:text-amber-300 text-lg">Promo & Coupon Codes Hub</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Configure discount tiers, expirations, and cart threshold criteria.</p>
              </div>
              {!isAddingNewCoupon && (
                <button
                  onClick={() => setIsAddingNewCoupon(true)}
                  className="py-2.5 px-5 bg-brand-brown text-[#FAF7F2] dark:bg-brand-gold dark:text-brand-brown rounded-full font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:scale-102 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Create Coupon
                </button>
              )}
            </div>

            {/* New Coupon Creation Form */}
            {isAddingNewCoupon && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch('/api/coupons', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                      },
                      body: JSON.stringify({
                        code: couponFormData.code.trim().toUpperCase(),
                        discountType: couponFormData.discountType,
                        value: Number(couponFormData.value),
                        expiryDate: couponFormData.expiryDate,
                        minOrderValue: Number(couponFormData.minOrderValue)
                      })
                    });

                    if (res.ok) {
                      setIsAddingNewCoupon(false);
                      setCouponFormData({
                        code: '',
                        discountType: 'percentage',
                        value: 10,
                        expiryDate: '2026-12-31',
                        minOrderValue: 20
                      });
                      await fetchAdminCoupons();
                      alert('Success! Code listed under current promotions.');
                    } else {
                      const data = await res.json();
                      alert(data.error || 'Failed to list coupon code.');
                    }
                  } catch (err) {
                    alert('Network error while listing code.');
                  }
                }}
                className="space-y-4 max-w-xl bg-[#FAF7F2]/40 dark:bg-black/10 p-5 rounded-2xl border border-brand-brown/10 mb-6"
              >
                <h4 className="font-serif font-black text-brand-brown dark:text-brand-cream text-sm">
                  Register New Active Coupon Code
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase mb-1 font-mono">
                      Promo Code (Allcaps) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FESTIVE25"
                      value={couponFormData.code}
                      onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase() })}
                      className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-white dark:bg-stone-950 dark:text-stone-250 focus:outline-none focus:border-amber-500 uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase mb-1 font-mono">
                      Discount Template *
                    </label>
                    <select
                      value={couponFormData.discountType}
                      onChange={(e) => setCouponFormData({ ...couponFormData, discountType: e.target.value as 'percentage' | 'flat' })}
                      className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-white dark:bg-stone-950 dark:text-stone-250"
                    >
                      <option value="percentage">Percentage (e.g. 15% Off)</option>
                      <option value="flat">Flat Dollar (e.g. $15 Off)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase mb-1 font-mono">
                      Promo Value *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={couponFormData.value}
                      onChange={(e) => setCouponFormData({ ...couponFormData, value: Number(e.target.value) })}
                      className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-white dark:bg-stone-950 dark:text-stone-250"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase mb-1 font-mono">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={couponFormData.expiryDate}
                      onChange={(e) => setCouponFormData({ ...couponFormData, expiryDate: e.target.value })}
                      className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-white dark:bg-stone-950 dark:text-stone-250 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase mb-1 font-mono">
                      Min Purchase Subtotal ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={couponFormData.minOrderValue}
                      onChange={(e) => setCouponFormData({ ...couponFormData, minOrderValue: Number(e.target.value) })}
                      className="w-full border border-stone-200 dark:border-stone-800 p-2.5 rounded-lg bg-white dark:bg-stone-950 dark:text-stone-250"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-grow py-2.5 px-6 bg-brand-brown text-[#FAF7F2] dark:bg-brand-gold dark:text-brand-brown rounded-full font-bold text-xs uppercase"
                  >
                    Commit Coupon
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCoupon(false)}
                    className="py-2.5 px-6 rounded-full bg-stone-200 dark:bg-stone-850 text-stone-700 dark:text-stone-300 font-bold text-xs uppercase"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Coupons List Table */}
            {couponsLoading ? (
              <p className="text-center py-6 text-xs text-stone-400 animate-pulse">Retrieving active coupons...</p>
            ) : coupons.length === 0 ? (
              <p className="text-center py-12 text-xs italic text-stone-400">No active coupons listed.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 dark:bg-stone-950 uppercase text-[10px] text-stone-500 font-mono tracking-wider">
                    <tr>
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Value</th>
                      <th className="p-4">Cart Threshold</th>
                      <th className="p-4">Expiration Limit</th>
                      <th className="p-4 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-850">
                    {coupons.map((c) => (
                      <tr key={c.code} className="hover:bg-stone-50/50 dark:hover:bg-stone-950/20">
                        <td className="p-4 font-mono font-bold text-brand-brown dark:text-brand-gold text-sm uppercase">
                          🎟️ {c.code}
                        </td>
                        <td className="p-4 capitalize text-stone-600 dark:text-stone-300">
                          {c.discountType === 'percentage' ? 'Percentage' : 'Flat Discount'}
                        </td>
                        <td className="p-4 font-bold text-stone-900 dark:text-stone-100 text-sm">
                          {c.discountType === 'percentage' ? `${c.value}%` : `$${c.value}`}
                        </td>
                        <td className="p-4 text-stone-500 font-mono">
                          Requires ${c.minOrderValue || 0}
                        </td>
                        <td className="p-4 text-stone-500 font-mono font-bold">
                          {c.expiryDate || 'Unlimited'}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={async () => {
                              if (!confirm(`Are you sure you want to retire code "${c.code}"?`)) return;
                              try {
                                const res = await fetch(`/api/coupons/${c.code}`, {
                                  method: 'DELETE',
                                  headers: { 'Authorization': `Bearer ${authToken}` }
                                });
                                if (res.ok) {
                                  await fetchAdminCoupons();
                                } else {
                                  alert('Could not retire promo code.');
                                }
                              } catch (e) {
                                alert('Network error retiring code.');
                              }
                            }}
                            className="p-1 px-2.5 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-650 cursor-pointer uppercase text-[10px] inline-flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
