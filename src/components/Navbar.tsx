import { useState } from 'react';
import { ShoppingBag, Heart, Sun, Moon, Search, Menu, X, User as UserIcon, ShieldAlert } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  openSearchQuery: string;
  setOpenSearchQuery: (query: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  user: User | null;
  logout: () => void;
  onOpenCart: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  cartCount,
  wishlistCount,
  openSearchQuery,
  setOpenSearchQuery,
  darkMode,
  setDarkMode,
  user,
  logout,
  onOpenCart,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavLink = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF7F2]/80 dark:bg-stone-950/80 border-b border-brand-brown/10 transition-colors duration-300 shadow-xs" id="sweet-delights-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavLink('home')}>
            <div className="relative w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-brand-gold to-brand-gold-light text-white shadow-sm">
              <span className="font-serif font-black text-lg">S</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold-light opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-gold"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-black tracking-tighter text-brand-brown dark:text-brand-cream leading-tight">
                SWEET<span className="text-brand-gold font-normal">DELIGHTS</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-brand-gold dark:text-brand-gold-light font-bold font-mono">
                Artisanal Confectionery
              </span>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center relative w-64 max-w-xs">
            <span className="absolute left-3 text-stone-400 dark:text-stone-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search vanilla, truffle, kaju..."
              value={openSearchQuery}
              onChange={(e) => setOpenSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-brand-brown/10 dark:border-stone-850 rounded-full text-xs text-brand-brown dark:text-brand-cream bg-white/50 dark:bg-stone-900/40 focus:border-brand-gold focus:outline-none transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600 font-mono"
            />
            {openSearchQuery && (
              <button onClick={() => setOpenSearchQuery('')} className="absolute right-3 text-xs text-stone-400 hover:text-brand-brown dark:hover:text-brand-gold">
                clear
              </button>
            )}
          </div>

          {/* Desktop Navigation links */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => handleNavLink('home')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all relative ${
                currentTab === 'home'
                  ? 'bg-brand-gold/10 text-brand-brown dark:text-brand-gold font-black'
                  : 'text-brand-brown/70 dark:text-brand-cream/70 hover:text-brand-gold'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavLink('menu')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all relative ${
                currentTab === 'menu' || currentTab.startsWith('category-')
                  ? 'bg-brand-gold/10 text-brand-brown dark:text-brand-gold font-black'
                  : 'text-brand-brown/70 dark:text-brand-cream/70 hover:text-brand-gold'
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => handleNavLink('planner')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all relative ${
                currentTab === 'planner'
                  ? 'bg-brand-gold/10 text-brand-brown dark:text-brand-gold font-black'
                  : 'text-brand-brown/70 dark:text-brand-cream/70 hover:text-brand-gold'
              }`}
            >
              Event Planner
            </button>
            <button
              onClick={() => handleNavLink('blog')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all relative ${
                currentTab === 'blog'
                  ? 'bg-brand-gold/10 text-brand-brown dark:text-brand-gold font-black'
                  : 'text-brand-brown/70 dark:text-brand-cream/70 hover:text-brand-gold'
              }`}
            >
              Journal
            </button>
            {user?.isAdmin && (
              <button
                onClick={() => handleNavLink('admin')}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all text-red-600 dark:text-red-405 hover:bg-red-500/10 ${
                  currentTab === 'admin' ? 'bg-red-500/15' : ''
                }`}
              >
                <ShieldAlert className="w-4 h-4 animate-pulse" />
                Admin
              </button>
            )}
            <button
              onClick={() => handleNavLink('dashboard')}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all relative ${
                currentTab === 'dashboard'
                  ? 'bg-brand-gold/10 text-brand-brown dark:text-brand-gold font-black'
                  : 'text-brand-brown/70 dark:text-brand-cream/70 hover:text-brand-gold'
              }`}
            >
              {user ? 'My Portal' : 'Login'}
            </button>
          </div>

          {/* Icon Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Toggle Theme */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full text-brand-brown dark:text-brand-cream hover:bg-brand-gold/10 transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-brand-gold-light" /> : <Moon className="w-5 h-5 text-brand-brown" />}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNavLink('dashboard')}
              className="p-2 rounded-full text-brand-brown dark:text-brand-cream hover:bg-brand-gold/10 transition-all relative cursor-pointer"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="p-2 sm:px-5 py-2.5 rounded-full bg-brand-brown text-[#FAF7F2] dark:bg-brand-gold dark:text-brand-brown font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-brand-gold-light dark:text-brand-brown" />
              <span className="hidden sm:inline font-bold">Cart ({cartCount})</span>
              <span className="text-brand-gold-light dark:text-brand-brown font-mono text-[10px] px-1 font-black">
                —
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-full text-stone-600 dark:text-stone-300 hover:bg-amber-500/10 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-amber-500/10 bg-white dark:bg-stone-900 px-4 py-4 space-y-3 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <div className="relative w-full mb-3">
            <span className="absolute left-3 top-2.5 text-stone-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search vanilla, truffle, kaju..."
              value={openSearchQuery}
              onChange={(e) => setOpenSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-amber-500/20 rounded-full text-xs text-stone-800 dark:text-stone-100 bg-amber-50/20 dark:bg-stone-950/40 focus:border-amber-500 focus:outline-none placeholder:text-stone-400 dark:placeholder:text-stone-600 font-mono"
            />
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleNavLink('home')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                currentTab === 'home' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold' : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavLink('menu')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                currentTab === 'menu' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold' : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => handleNavLink('planner')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                currentTab === 'planner' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold' : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              Event Planner
            </button>
            <button
              onClick={() => handleNavLink('blog')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                currentTab === 'blog' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold' : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              Gourmet Journal
            </button>
            {user?.isAdmin && (
              <button
                onClick={() => handleNavLink('admin')}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-2 ${
                  currentTab === 'admin' ? 'bg-red-500/10' : ''
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}
            <button
              onClick={() => handleNavLink('dashboard')}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                currentTab === 'dashboard' ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold' : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              {user ? 'My Account Panel' : 'Sign In / Register'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
