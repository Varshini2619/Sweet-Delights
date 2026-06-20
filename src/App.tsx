import React, { useState, useEffect } from 'react';
import { PRODUCTS, CATEGORIES } from './data';
import { Product, CartItem, Order, PlannerRequest, User } from './types';
import Navbar from './components/Navbar';
import RotatingCake3D from './components/RotatingCake3D';
import AIChatbot from './components/AIChatbot';
import EventPlanner from './components/EventPlanner';
import AdminPanel from './components/AdminPanel';
import Dashboard from './components/Dashboard';
import CartList from './components/CartList';
import CheckoutModal from './components/CheckoutModal';
import BlogSection from './components/BlogSection';
import { Sparkles, Heart, Star, Eye, ShieldAlert, Award, ShieldCheck, ThumbsUp, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { onAuthStateChange, getUserProfile, logoutUser, type UserProfile } from './services/authService';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './firebase';

export default function App() {
  // Application Page Tab State: 'home' | 'menu' | 'planner' | 'dashboard' | 'admin' | 'checkout'
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('Popularity');
  const [openSearchQuery, setOpenSearchQuery] = useState<string>('');

  // Active Catalog Products state (seeded from data.ts, dynamically editable by Admin)
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Sizing & Review states inside popups
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');

  // Shared Cart & Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sweet_delights_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sweet_delights_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [couponApplied, setCouponApplied] = useState<any | null>(null);

  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  // Database lists fetched from server
  const [orders, setOrders] = useState<Order[]>([]);
  const [plannerRequests, setPlannerRequests] = useState<PlannerRequest[]>([]);

  // Page accordion states
  const [faqOpenIndices, setFaqOpenIndices] = useState<number[]>([]);

  // Dark light mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sweet_delights_theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Sync theme class with Document Element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sweet_delights_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sweet_delights_theme', 'light');
    }
  }, [darkMode]);

  // Sync local cookies
  useEffect(() => {
    localStorage.setItem('sweet_delights_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('sweet_delights_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Get user token for API calls
          const token = await firebaseUser.getIdToken();
          setAuthToken(token);
          
          // Fetch user profile from Firestore
          const profile = await getUserProfile(firebaseUser.uid);
          
          // Convert UserProfile to User type
          const user: User = {
            uid: profile.uid,
            name: profile.name,
            email: profile.email,
            isAdmin: profile.role === 'admin',
            addresses: [] // Will be fetched separately
          };
          
          setUser(user);
          
          // Fetch user addresses from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.addresses) {
              user.addresses = userData.addresses;
              setUser({ ...user });
            }
            if (userData.wishlist) {
              setWishlistIds(userData.wishlist);
            }
          }
          
          // Load orders & planning requests
          fetchOrders();
          fetchPlannerRequests();
        } catch (error) {
          console.error("Error loading user profile:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        setAuthToken(null);
        setOrders([]);
        setPlannerRequests([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (e) {}
  };

  const fetchPlannerRequests = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/planner-requests', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPlannerRequests(data.requests);
      }
    } catch (e) {}
  };

  // ==================== AUTH CONTROLS ====================
  const handleLogin = async (credentials: any) => {
    // Firebase Auth handles login in Dashboard component
    // This is kept for compatibility with existing Dashboard props
    return true;
  };

  const handleRegister = async (fields: any) => {
    // Firebase Auth handles registration in Dashboard component
    // This is kept for compatibility with existing Dashboard props
    return true;
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setAuthToken(null);
      setOrders([]);
      setPlannerRequests([]);
      setCouponApplied(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // ==================== BASKET CONTROLS ====================
  const handleAddToCart = (product: Product, weight: string, quantity: number) => {
    // Determine dynamic price multipliers
    // 500g: base price, 1Kg: 1.8x base, 2Kg: 3.2x base
    let finalItemPrice = product.price;
    if (weight === '1Kg') finalItemPrice = Math.round(product.price * 1.8);
    else if (weight === '2Kg') finalItemPrice = Math.round(product.price * 3.2);

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === product.id && item.weight === weight
      );

      if (existingIdx > -1) {
        const newList = [...prev];
        newList[existingIdx].quantity += quantity;
        return newList;
      } else {
        return [
          ...prev,
          {
            productId: product.id,
            productName: product.name,
            weight,
            price: finalItemPrice,
            quantity,
            image: product.image,
          },
        ];
      }
    });

    // Flash small alert
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (productId: string, weight: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId, weight);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.weight === weight
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, weight: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.weight === weight))
    );
  };

  const handleToggleWishlist = async (productId: string) => {
    if (!user) {
      // Local toggle for guests
      setWishlistIds((prev) => {
        const index = prev.indexOf(productId);
        if (index > -1) {
          const next = [...prev];
          next.splice(index, 1);
          return next;
        } else {
          return [...prev, productId];
        }
      });
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      const isInWishlist = wishlistIds.includes(productId);
      
      if (isInWishlist) {
        await updateDoc(userRef, {
          wishlist: arrayRemove(productId)
        });
        setWishlistIds((prev) => prev.filter(id => id !== productId));
      } else {
        await updateDoc(userRef, {
          wishlist: arrayUnion(productId)
        });
        setWishlistIds((prev) => [...prev, productId]);
      }
    } catch (e) {
      console.error("Error toggling wishlist:", e);
    }
  };

  // ==================== INLINE REVIEW SUMISSIONS ====================
  const handleAddReview = (prodId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) {
      alert("Please fill your name and feedback message.");
      return;
    }

    const newReview = {
      name: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0],
    };

    setProductsList((prev) =>
      prev.map((prod) => {
        if (prod.id === prodId) {
          const updatedReviews = [newReview, ...prod.reviews];
          const avgRating = Number(
            (updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1)
          );
          return {
            ...prod,
            reviews: updatedReviews,
            rating: avgRating,
          };
        }
        return prod;
      })
    );

    // Save selection sync
    setSelectedProduct((prev) => {
      if (prev && prev.id === prodId) {
        const updatedReviews = [newReview, ...prev.reviews];
        const avg = Number((updatedReviews.reduce((x, y) => x + y.rating, 0) / updatedReviews.length).toFixed(1));
        return { ...prev, reviews: updatedReviews, rating: avg };
      }
      return prev;
    });

    // Clear submission fields
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
  };

  // ==================== ADMINISTRATOR MUTATORS ====================
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders(); // reload
      }
    } catch (e) {}
  };

  const handleUpdatePlannerStatus = async (planId: string, status: string) => {
    try {
      const res = await fetch(`/api/planner-requests/${planId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchPlannerRequests(); // reload
      }
    } catch (e) {}
  };

  const handleAddOrUpdateProduct = (updatedProduct: any) => {
    setProductsList((prev) => {
      const exists = prev.some((p) => p.id === updatedProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      } else {
        return [updatedProduct, ...prev];
      }
    });
    alert(`Public store inventory listing successfully stored!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== productId));
  };

  // Open Details popup helper
  const handleOpenDetailModal = (prod: Product) => {
    setSelectedProduct(prod);
    setSelectedWeight(prod.weightOptions[0] || '500g');
    setReviewRating(5);
    setReviewName('');
    setReviewComment('');
  };

  // Filter Catalog menu search / categories
  const filteredProducts = productsList.filter((prod) => {
    const matchesCategory = activeCategoryFilter === 'All' || prod.category.toLowerCase() === activeCategoryFilter.toLowerCase();
    const matchesSearch =
      prod.name.toLowerCase().includes(openSearchQuery.toLowerCase()) ||
      prod.description.toLowerCase().includes(openSearchQuery.toLowerCase()) ||
      prod.ingredients.some((i) => i.toLowerCase().includes(openSearchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Sort helper
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'Price: Low to High') return a.price - b.price;
    if (sortOption === 'Price: High to Low') return b.price - a.price;
    return b.rating - a.rating; // Default popularity sorting
  });

  // Accordion toggle helper
  const toggleFaq = (idx: number) => {
    setFaqOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const faqItems = [
    { q: "What is the shelf life of your artisanal confectioneries?", a: "To ensure absolute food safety, our luxury cream cakes last 3 to 4 days under refrigeration. Standard milk-reduction dry traditional sweets (like Kaju Katli) remain pristine up to 10 days, while savoury puff pastries taste best when consumed within 48 hours or reheated gently." },
    { q: "Are custom party theme shapes supported in your kitchen?", a: "Yes, infinitely! You can submit guest count limits, requested flavours, and design custom blueprints inside our 'Event & Function Planner' tab. Our master chefs draft custom royal gold sheets and physical tiered designs to match your precise blueprints." },
    { q: "How does Gâteau-AI calculate quantities?", a: "Our smart culinary assistant employs average guest serving metrics (~80g cake, ~1.5 sweets pieces, and ~1.2 savoury items per attendee) and correlates it with your requested luxury tier to suggest estimates and approximate prices instantly." },
    { q: "What are your delivery modes and insulation specs?", a: "We operate specialised climate-controlled premium transport couches across Bengaluru. Cakes are packed in dynamic insulated cold boxes to preserve ivory icing shapes in perfect pristine condition during transit." },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream dark:bg-stone-950 text-brand-brown dark:text-[#F5EFE6] transition-colors duration-300 font-sans">
      
      {/* NAVBAR */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        openSearchQuery={openSearchQuery}
        setOpenSearchQuery={(q) => {
          setOpenSearchQuery(q);
          if (q && currentTab !== 'menu') setCurrentTab('menu');
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        user={user}
        logout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* WORKSPACE VIEWS CONTAINER */}
      <main className="flex-1">
        
        {/* ==================== VIEW: HOME LANDING ==================== */}
        {currentTab === 'home' && (
          <div className="animate-in fade-in duration-500">
            
            {/* Elegant Hero Cover */}
            <section className="relative overflow-hidden py-12 md:py-20 lg:py-24 border-b border-brand-brown/10">
              <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-gold-light/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left Pitch content */}
                <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold dark:text-brand-gold-light font-bold px-3 py-1 rounded-full text-xs uppercase tracking-widest font-mono">
                    <Sparkles className="w-3.5 h-3.5" />
                    Gold Ribbon Confectioners
                  </div>
                  
                  <h1 className="font-serif text-4.5xl sm:text-6xl font-black text-brand-brown dark:text-brand-cream tracking-tight leading-none">
                    Decadent Pleasures, <br />
                    <span className="italic font-normal text-brand-gold">Baked to Perfection</span>
                  </h1>

                  <p className="text-brand-brown/80 dark:text-brand-cream/80 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-light">
                    Indulge in <strong className="font-semibold text-brand-brown dark:text-brand-cream">Sweet Delights'</strong> premium multi-tiered celebration cakes, pure-vark silver luxury sweets, and golden flaky butter puffs. Refined recipes crafted solely with Ecuador Single-Origin cocoa and authentic saffron.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
                    <button
                      onClick={() => { setCurrentTab('menu'); setActiveCategoryFilter('All'); }}
                      className="px-8 py-3.5 rounded-full bg-brand-brown text-[#FAF7F2] dark:bg-brand-gold dark:text-brand-brown font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-102 active:scale-98 transition-all text-center cursor-pointer"
                    >
                      Browse Haute Menu Collection
                    </button>
                    <button
                      onClick={() => setCurrentTab('planner')}
                      className="px-8 py-3.5 rounded-full border-2 border-brand-brown/10 dark:border-stone-800 font-bold text-xs uppercase tracking-wider text-brand-brown dark:text-brand-cream hover:bg-brand-gold/5 shadow-xs transition-all text-center cursor-pointer"
                    >
                      Plan Bespoke Event
                    </button>
                  </div>

                  {/* Trust factors */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-brown/10 dark:border-stone-850 text-center lg:text-left">
                    <div>
                      <span className="block text-xl sm:text-2xl font-serif font-black text-brand-gold">37+</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-brand-brown/65 dark:text-stone-450">Fine Recipes</span>
                    </div>
                    <div>
                      <span className="block text-xl sm:text-2xl font-serif font-black text-brand-gold">100%</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-brand-brown/65 dark:text-stone-450">Insulated Coaches</span>
                    </div>
                    <div>
                      <span className="block text-xl sm:text-2xl font-serif font-black text-brand-gold">Gâteau</span>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-brand-brown/65 dark:text-stone-450">AI Calculator</span>
                    </div>
                  </div>
                </div>

                {/* Right Luxury 3D Rotating Canvas */}
                <div className="lg:col-span-6 bg-white/40 dark:bg-stone-900/40 rounded-3xl border border-brand-brown/10 p-4 shadow-sm relative overflow-hidden backdrop-blur-md">
                  <div className="absolute top-4 left-4 bg-brand-cream/90 dark:bg-stone-950/90 px-3 py-1 rounded text-[10px] font-mono border border-brand-brown/10 text-brand-brown dark:text-brand-gold uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                    Realistic 3D Cake Showcase
                  </div>
                  <RotatingCake3D />
                </div>

              </div>
            </section>

            {/* Specialties & Story Elements */}
            <section className="py-16 bg-[#FAF7F2]/40 dark:bg-stone-900/10 border-b border-brand-brown/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center max-w-xl mx-auto mb-12">
                  <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-brand-gold">The Fine Culinary standard</span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-black italic text-brand-brown dark:text-brand-cream mt-1">
                     What makes Sweet Delights unique?
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Card 1 */}
                  <div className="glass p-8 rounded-2xl relative transition-all hover:scale-[1.01]">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4">
                      <Award className="w-5 h-5 animate-pulse" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-brand-brown dark:text-brand-cream">The 24K Gold Leaf Standard</h3>
                    <p className="text-brand-brown/75 dark:text-brand-cream/75 text-xs sm:text-sm mt-2 leading-relaxed">
                      We hand-sculpt edible **99.9% Pure French Gold Flakes** onto signature sponge tiers and silver-gilded traditional box suites for a deep, luxury vibe.
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="glass p-8 rounded-2xl relative transition-all hover:scale-[1.01]">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-brand-brown dark:text-brand-cream">Gâteau-AI Estimation Calculations</h3>
                    <p className="text-brand-brown/75 dark:text-brand-cream/75 text-xs sm:text-sm mt-2 leading-relaxed">
                      Powered by **Gemini 3.5-flash**, our smart assistant details exact cake kilograms, sweets layouts, and savory estimates to ensure Zero party waste.
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="glass p-8 rounded-2xl relative transition-all hover:scale-[1.01]">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-brand-brown dark:text-brand-cream">Climate-Insulated Transit</h3>
                    <p className="text-brand-brown/75 dark:text-brand-cream/75 text-xs sm:text-sm mt-2 leading-relaxed">
                      Our cakes are dispatched in specialized **insulated cooling coaches** to safeguard delicate chocolate tiers from melting or sliding in city heat.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* Featured Bento Carousel Products */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-gold block">Chef's Signature Selections</span>
                    <h2 className="font-serif text-3xl font-black text-brand-brown dark:text-brand-cream italic mt-0.5">
                      Prélude of Featured Masterpieces
                    </h2>
                  </div>
                  <button
                    onClick={() => { setCurrentTab('menu'); setActiveCategoryFilter('All'); }}
                    className="text-xs sm:text-sm font-bold text-brand-gold hover:text-brand-gold/80 transition-colors flex items-center gap-1 cursor-pointer font-mono uppercase tracking-wider"
                  >
                    Explore all 37 products →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {productsList.slice(0, 3).map((prod) => (
                    <div
                      key={prod.id}
                      className="glass rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full"
                    >
                      <div className="h-56 relative overflow-hidden bg-stone-100">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-550"
                        />
                        <button
                          onClick={() => handleToggleWishlist(prod.id)}
                          className="absolute top-4 right-4 p-2 rounded-full bg-white/80 dark:bg-stone-950/80 backdrop-blur-md shadow text-brand-brown hover:text-rose-600 transition-colors cursor-pointer"
                          title="Bookmark item"
                        >
                          <Heart className={`w-4 h-4 ${wishlistIds.includes(prod.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <span className="absolute bottom-4 left-4 text-[9px] uppercase font-mono tracking-wider font-bold bg-[#FAF7F2]/90 dark:bg-stone-950/90 text-brand-brown dark:text-brand-gold px-2.5 py-1 rounded border border-brand-brown/10">
                          {prod.category}
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif font-black text-brand-brown dark:text-brand-cream text-base group-hover:text-brand-gold transition-colors">
                              {prod.name}
                            </h3>
                            <div className="flex items-center gap-0.5 text-brand-gold font-mono text-xs">
                              <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold" />
                              <span className="font-bold">{prod.rating}</span>
                            </div>
                          </div>
                          <p className="text-brand-brown/70 dark:text-brand-cream/75 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                            {prod.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-brand-brown/10 dark:border-stone-850">
                          <span className="font-serif text-lg font-black text-brand-gold">${prod.price}</span>
                          <button
                            onClick={() => handleOpenDetailModal(prod)}
                            className="text-xs uppercase tracking-wider font-bold text-[#FAF7F2] bg-brand-brown hover:bg-brand-brown/90 dark:bg-brand-gold dark:text-brand-brown hover:scale-102 transition-all px-5 py-2 rounded-full cursor-pointer"
                          >
                            Details & Purchase
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* FAQ ACCORDION SECTION */}
            <section className="py-16 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-900">
              <div className="max-w-4xl mx-auto px-4 sm:px-6">
                
                <div className="text-center mb-10">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-black italic text-stone-900 dark:text-amber-100">
                    Artisanal Common Questions FAQ
                  </h2>
                </div>

                <div className="divide-y divide-stone-200/60 dark:divide-stone-850">
                  {faqItems.map((faq, fIdx) => (
                    <div key={fIdx} className="py-4">
                      <button
                        onClick={() => toggleFaq(fIdx)}
                        className="w-full flex items-center justify-between text-left font-serif font-black text-xs sm:text-sm text-stone-850 dark:text-stone-200 dark:text-amber-200/90 py-1 cursor-pointer focus:outline-none hover:text-amber-600 transition-colors"
                      >
                        <span>✨ {faq.q}</span>
                        {faqOpenIndices.includes(fIdx) ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
                      </button>
                      
                      {faqOpenIndices.includes(fIdx) && (
                        <p className="mt-3 text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-sans animate-in fade-in slide-in-from-top-1 pl-4">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            </section>

          </div>
        )}

        {/* ==================== VIEW: CATALOG MENU COLLECTION ==================== */}
        {currentTab === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-300" id="sweet-delights-catalog-collection-page">
            
            {/* Upper Category covers */}
            <div className="mb-10 text-center max-w-xl mx-auto">
              <h1 className="font-serif text-3.5xl md:text-5xl font-black tracking-tight text-brand-brown dark:text-brand-cream">
                Menu Collection
              </h1>
              <p className="text-brand-brown/80 dark:text-brand-cream/80 text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                 Browse all our 37 fine recipe configurations, filtered seamlessly inside sandbox constraints.
              </p>
            </div>

            {/* Filter and sorting elements bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-brown/10 dark:border-stone-800 pb-4 mb-8 gap-4 text-xs font-mono">
              
              {/* Category buttons tab */}
              <div className="flex flex-wrap items-center gap-1.5">
                {['All', 'Cakes', 'Sweets', 'Savouries'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-4.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeCategoryFilter === cat
                        ? 'bg-brand-brown text-[#FAF7F2] dark:bg-brand-gold dark:text-brand-brown font-black shadow-xs'
                        : 'glass text-brand-brown/85 dark:text-brand-cream/85 hover:bg-brand-brown/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sorting selectors */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <span className="text-brand-brown/80 dark:text-brand-cream/80 text-[10px] uppercase font-bold tracking-wider">Sort List:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-brand-brown/10 dark:border-stone-800 p-2 rounded-lg bg-white/60 dark:bg-stone-900 text-[11px] dark:text-stone-200 focus:outline-none font-mono"
                >
                  <option>Popularity</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
                <span className="text-stone-400 font-mono text-[10px] whitespace-nowrap bg-white/40 dark:bg-stone-950 px-2.5 py-2.5 rounded-lg border border-brand-brown/5">
                  {sortedProducts.length} items found
                </span>
              </div>
            </div>

            {/* Products grid cards */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 text-stone-450 dark:text-stone-500 text-sm italic font-light">
                 No custom dessert satisfies matching context search query. Clear search input.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="glass rounded-2xl overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all group flex flex-col h-full"
                  >
                    <div className="h-48 relative overflow-hidden bg-stone-100">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-550"
                      />
                      <button
                        onClick={() => handleToggleWishlist(prod.id)}
                        className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/80 dark:bg-stone-950/80 backdrop-blur-md shadow text-brand-brown hover:text-rose-600 transition-colors cursor-pointer"
                        title="Bookmark"
                      >
                        <Heart className={`w-4 h-4 ${wishlistIds.includes(prod.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>
                      <span className="absolute bottom-3.5 left-3.5 text-[9px] uppercase font-mono tracking-wider font-extrabold bg-[#FAF7F2]/90 dark:bg-stone-950/90 text-brand-brown dark:text-brand-gold px-2.5 py-1 rounded border border-brand-brown/10">
                        {prod.category}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif font-black text-brand-brown dark:text-brand-cream text-xs sm:text-sm font-bold truncate max-w-[170px]" title={prod.name}>
                            {prod.name}
                          </h3>
                          <div className="flex items-center gap-0.5 text-brand-gold font-mono text-[11px]">
                            <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
                            <span className="font-black">{prod.rating}</span>
                          </div>
                        </div>
                        <p className="text-brand-brown/70 dark:text-brand-cream/70 text-[11.5px] mt-1 line-clamp-2 leading-relaxed font-light">
                          {prod.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2.5 border-t border-brand-brown/10 dark:border-stone-850 text-xs">
                        <span className="font-serif font-bold text-brand-gold text-sm">${prod.price}</span>
                        <button
                          onClick={() => handleOpenDetailModal(prod)}
                          className="font-bold text-xs uppercase tracking-wider text-[#FAF7F2] bg-brand-brown hover:bg-brand-brown/90 dark:bg-brand-gold dark:text-brand-brown px-4 py-2 rounded-lg cursor-pointer transition-all"
                        >
                          Configure portion
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== VIEW: EVENT PLANNER ==================== */}
        {currentTab === 'planner' && (
          <EventPlanner
            user={user}
            authToken={authToken}
            onNavigateToTab={setCurrentTab}
            savedRequests={plannerRequests}
            fetchSavedRequests={fetchPlannerRequests}
          />
        )}

        {/* ==================== VIEW: SECURE CUSTOMER DASHBOARD ==================== */}
        {currentTab === 'dashboard' && (
          <Dashboard
            user={user}
            authToken={authToken}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onLogout={handleLogout}
            orders={orders}
            pProducts={productsList}
            onToggleWishlist={handleToggleWishlist}
            wishlistProductIds={wishlistIds}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* ==================== VIEW: ADMIN COMPANION PORTAL ==================== */}
        {currentTab === 'admin' && (
          <AdminPanel
            user={user}
            authToken={authToken}
            products={productsList}
            orders={orders}
            pRequests={plannerRequests}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onUpdatePlannerStatus={handleUpdatePlannerStatus}
            onAddOrUpdateProduct={handleAddOrUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {/* ==================== VIEW: SECURE CHECKOUTmodal BILLING ==================== */}
        {currentTab === 'checkout' && (
          <CheckoutModal
            user={user}
            authToken={authToken}
            cartItems={cartItems}
            couponApplied={couponApplied}
            onClearCart={() => setCartItems([])}
            onNavigateToTab={setCurrentTab}
          />
        )}

        {/* ==================== VIEW: JOURNAL (BLOG) ==================== */}
        {currentTab === 'blog' && (
          <BlogSection
            currentUser={user}
            authToken={authToken}
          />
        )}

      </main>

      {/* ==================== POPOVER OVERLAY MODAL: PRODUCT DETAILS ==================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-sans" id="sweet-delights-product-details-modal">
          <div className="relative bg-white dark:bg-stone-900 rounded-3xl border border-amber-500/10 shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button absolute */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-stone-150 hover:bg-stone-200 dark:bg-stone-950/80 hover:text-rose-600 transition-colors text-stone-500 dark:text-stone-300 cursor-pointer"
              title="Close Panel"
            >
              CLOSE ✕
            </button>

            {/* Left Image Section */}
            <div className="md:w-1/2 h-56 md:h-auto relative bg-stone-50">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover rounded-t-3xl md:rounded-l-3xl md:rounded-t-none"
              />
              <span className="absolute bottom-4 left-4 text-[9.5px] uppercase font-mono tracking-widest font-black bg-[#FAF8F5]/90 dark:bg-stone-950/90 text-amber-900 dark:text-amber-400 px-3 py-1 rounded border border-amber-500/10">
                {selectedProduct.category}
              </span>
            </div>

            {/* Right Information & interactive reviews section */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between font-sans space-y-6">
              
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <h3 className="font-serif text-2xl font-black text-stone-900 dark:text-amber-300">
                    {selectedProduct.name}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span className="font-black">{selectedProduct.rating}</span>
                    </div>
                    <span>•</span>
                    <span className="font-mono">Shelf life: {selectedProduct.shelfLife}</span>
                    <span>•</span>
                    <span className="font-mono">{selectedProduct.reviews.length} reviews</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-sans">
                  {selectedProduct.description}
                </p>

                {/* Ingredients list */}
                <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200/40 dark:border-stone-850 text-xs">
                  <span className="block text-[10px] uppercase font-mono font-black text-stone-450 dark:text-stone-500 mb-1">
                     Organic Whole Ingredients
                  </span>
                  <p className="text-stone-605 text-stone-650 dark:text-stone-400 capitalize">
                    {selectedProduct.ingredients.join(', ')}
                  </p>
                </div>

                {/* Sizing dropdown selectors (Cakes, Sweets, Savouries have custom weights) */}
                <div className="space-y-2">
                  <span className="block text-[10px] uppercase font-mono font-black text-stone-450 dark:text-stone-550">
                    Select Sizing Portion
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.weightOptions.map((wOpt) => (
                      <button
                        key={wOpt}
                        type="button"
                        onClick={() => setSelectedWeight(wOpt)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase border cursor-pointer transition-all ${
                          selectedWeight === wOpt
                            ? 'bg-amber-500 border-amber-500 text-stone-950 font-black'
                            : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900'
                        }`}
                      >
                        {wOpt}
                        {wOpt === '1Kg' && ' (1.8x price)'}
                        {wOpt === '2Kg' && ' (3.2x price)'}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action purchase controls */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-850 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-stone-450 dark:text-stone-500 block">Settle price</span>
                  <span className="font-serif text-xl sm:text-2xl font-black text-amber-70s text-amber-600 dark:text-amber-400">
                    ${selectedWeight === '1Kg' ? Math.round(selectedProduct.price * 1.8) : selectedWeight === '2Kg' ? Math.round(selectedProduct.price * 3.2) : selectedProduct.price}
                  </span>
                  <span className="text-[9px] text-stone-400 font-mono block">USD Net</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct, selectedWeight, 1);
                      setSelectedProduct(null);
                    }}
                    className="px-6 py-2.5 bg-stone-950 text-amber-400 dark:bg-amber-500 dark:text-stone-950 text-xs sm:text-sm font-bold rounded-full hover:scale-105 active:scale-95 transition-all text-center cursor-pointer shadow-md"
                  >
                     Toss into Basket
                  </button>
                </div>
              </div>

              {/* REVIEWS INLINE SUBMISSIONS */}
              <div className="border-t border-stone-100 dark:border-stone-850 pt-4 space-y-4 font-sans">
                <h4 className="font-serif font-black text-stone-950 dark:text-amber-300 text-sm">
                   Reviews & Customer Wording
                </h4>

                {/* Submit New Review Form */}
                <form onSubmit={(e) => handleAddReview(selectedProduct.id, e)} className="p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200/40 dark:border-stone-850 rounded-xl space-y-2.5 text-xs font-sans">
                  <span className="block text-[10px] uppercase font-mono font-bold text-amber-700 dark:text-amber-400">
                    Write verified customer feedback:
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2 leading-none">
                    <input
                      type="text"
                      required
                      placeholder="My full name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="border border-stone-200 dark:border-stone-800 p-2 rounded bg-white dark:bg-stone-900 dark:text-stone-200 text-xs text-stone-800 leading-none"
                    />
                    
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="border border-stone-200 dark:border-stone-800 p-2 rounded bg-white dark:bg-stone-900 dark:text-stone-200 text-xs"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                      <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                      <option value="3">⭐⭐⭐ 3 Stars</option>
                      <option value="2">⭐⭐ 2 Stars</option>
                      <option value="1">⭐ 1 Star</option>
                    </select>
                  </div>

                  <textarea
                    required
                    rows={1.5}
                    placeholder="Poetic gourmet taste comment..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full border border-stone-200 dark:border-stone-800 p-2 rounded bg-white dark:bg-stone-900 dark:text-stone-200 text-xs text-stone-800 leading-normal"
                  />

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-stone-900 text-amber-400 dark:bg-stone-800 dark:text-amber-200 rounded font-bold text-[10.5px] cursor-pointer"
                  >
                     Publish verified review
                  </button>
                </form>

                {/* List dynamic reviews */}
                <div className="space-y-2.5 max-h-[140px] overflow-y-auto pr-1">
                  {selectedProduct.reviews.length === 0 ? (
                    <p className="text-[11px] text-stone-400 italic text-center py-2">
                       Be the first client to publish verified words for this masterpiece recipe!
                    </p>
                  ) : (
                    selectedProduct.reviews.map((rev, rIdx) => (
                      <div key={rIdx} className="p-2.5 bg-stone-50/50 dark:bg-stone-950/20 border border-stone-150/40 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-stone-800 dark:text-stone-300">{rev.name}</span>
                          <span className="text-[9px] text-stone-400 mt-0.5 block font-mono">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500 font-mono text-[10px]">
                          {Array.from({ length: rev.rating }).map((_, stIdx) => (
                            <Star key={stIdx} className="w-2.5 h-2.5 fill-amber-500" />
                          ))}
                        </div>
                        <p className="text-stone-500 dark:text-stone-400 italic font-sans text-xs pt-1">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* FOOTER COOPERATIVE PANEL */}
      <footer className="bg-stone-950 text-stone-300 border-t border-amber-500/10 py-12 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <span className="font-serif text-lg font-black text-amber-400 tracking-wide">Sweet Delights</span>
            <p className="text-stone-450 leading-relaxed max-w-xs text-[11px]">
              Artisanal pastry baking, ghee sweet reduction standard, and elite gold-leaf celebration designs.
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase text-amber-500 tracking-wider text-[11px] font-mono mb-3">Chef Kitchen Hours</h4>
            <p className="text-stone-400 text-[11px] space-y-1 font-mono">
              Morning Batch: &nbsp;06:00 AM - Noon <br />
              Sunset Cakes: &nbsp; &nbsp;03:00 PM - 09:00 PM <br />
              Insulated Delivery: 10:00 AM - 11:00 PM
            </p>
          </div>

          <div>
            <h4 className="font-bold uppercase text-amber-500 tracking-wider text-[11px] font-mono mb-3">Menu Directory</h4>
            <div className="flex flex-col gap-1.5 font-mono text-[11px]">
              <button onClick={() => { setCurrentTab('menu'); setActiveCategoryFilter('Cakes'); }} className="text-left text-stone-400 hover:text-amber-400 transition-colors">🍰 Cakes</button>
              <button onClick={() => { setCurrentTab('menu'); setActiveCategoryFilter('Sweets'); }} className="text-left text-stone-400 hover:text-amber-400 transition-colors">🍡 Ghee Sweets</button>
              <button onClick={() => { setCurrentTab('menu'); setActiveCategoryFilter('Savouries'); }} className="text-left text-stone-400 hover:text-amber-400 transition-colors">🥐 Butter Savouries</button>
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase text-amber-500 tracking-wider text-[11px] font-mono mb-3">Admin Overrides</h4>
            <p className="text-stone-450 text-[11px] leading-relaxed">
              Log in as Admin using <strong>admin@sweetdelights.com</strong> (password: <strong>admin123</strong>) to manage orders, planner details, and update inventory.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-850 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 font-mono gap-4">
          <span>&copy; {new Date().getFullYear()} Sweet Delights Luxury Confectioneries Private Limited. All Rights Reserved.</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Preserved in sandbox preview container
          </span>
        </div>
      </footer>

      {/* REAL-TIME SLIDING CART DRAWER */}
      <CartList
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        couponApplied={couponApplied}
        onApplyCoupon={setCouponApplied}
        onRemoveCoupon={() => setCouponApplied(null)}
        onTriggerCheckoutTab={() => setCurrentTab('checkout')}
      />

      {/* FLOATING GÂTEAU AI ASSISTANT CHATBOT */}
      <AIChatbot />

    </div>
  );
}
