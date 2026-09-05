import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Sun,
  Moon, 
  User as UserIcon, 
  Search, 
  Layers, 
  Play, 
  Menu, 
  X,
  LogOut,
  ChevronDown,
  Star,
  Lock
} from 'lucide-react';
import { ThemeId, User } from '../types';
import { AnimatedButton } from './AnimatedButton';

interface NavbarProps {
  activeTab: 'shop' | 'studio' | 'admin' | 'wishlist';
  onSelectTab: (tab: 'shop' | 'studio' | 'admin' | 'wishlist') => void;
  cartCount: number;
  wishlistCount: number;
  currentTheme: ThemeId;
  onChangeTheme: (theme: ThemeId) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenCart: () => void;
  onReplayIntro: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  wishlistCount,
  currentTheme,
  onChangeTheme,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenCart,
  onReplayIntro,
  searchQuery,
  onSearchChange
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Intro Replay */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onSelectTab('shop')}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-600/30 group-hover:shadow-indigo-600/50 transition-shadow">
              <div className="w-full h-full bg-neutral-950 rounded-[14px] flex items-center justify-center">
                <span className="font-display font-black text-lg text-white">B</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black font-display tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                BUYLY
              </span>
              <span className="text-[9px] font-mono text-neutral-400 -mt-1 tracking-widest">
                CUSTOM MERCH
              </span>
            </div>
          </div>

          {/* Replay Intro Button */}
          <button
            onClick={onReplayIntro}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Replay website launch intro animation"
          >
            <Play className="w-3 h-3 text-indigo-400 fill-current" />
            <span>Replay Intro</span>
          </button>
        </div>

        {/* Desktop Primary Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-neutral-900/70 border border-neutral-800 rounded-2xl">
          <button
            onClick={() => onSelectTab('shop')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'shop'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Shop All
          </button>

          <button
            onClick={() => onSelectTab('studio')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-indigo-400 hover:text-indigo-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Custom Studio</span>
          </button>

          {/* Community Reviews Link */}
          <button
            onClick={() => {
              onSelectTab('shop');
              setTimeout(() => {
                const el = document.getElementById('reviews-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-amber-400 hover:text-amber-300 transition-all cursor-pointer"
            title="Browse Verified Customer Reviews & Feedback"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Reviews</span>
          </button>

          {/* Dedicated Admin Tab */}
          <button
            onClick={() => onSelectTab('admin')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : currentUser?.role === 'admin'
                ? 'text-emerald-400 hover:text-emerald-300'
                : 'text-neutral-400 hover:text-white'
            }`}
            title={currentUser?.role === 'admin' ? 'Open Store Admin Dashboard' : 'Admin Portal (Login Required)'}
          >
            {currentUser?.role === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Admin Tab</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-neutral-400" />
                <span>Admin Portal</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSelectTab('wishlist')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'wishlist'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            {wishlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-mono">
                {wishlistCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Tools: Theme Switcher, Search, Auth & Cart */}
        <div className="flex items-center gap-2.5">
          {/* Search Toggle */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search merchandise..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="w-40 sm:w-56 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Search products"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => onChangeTheme(currentTheme === 'dark' ? 'light' : 'dark')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              currentTheme === 'dark'
                ? 'bg-neutral-900/80 border-neutral-800 text-neutral-200 hover:border-neutral-700 hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-950 shadow-sm'
            }`}
            title={currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle light/dark theme"
          >
            {currentTheme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline font-mono text-[11px] tracking-wider uppercase">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline font-mono text-[11px] tracking-wider uppercase">Dark</span>
              </>
            )}
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
              >
                <span className="text-xs font-semibold text-white hidden sm:inline max-w-[80px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-neutral-700"
                />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-2 z-50">
                  <div className="p-2 border-b border-neutral-800">
                    <span className="font-bold text-white text-xs block truncate">{currentUser.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono block truncate">{currentUser.email}</span>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                      currentUser.role === 'admin'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}>
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        onSelectTab('admin');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Admin Management</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <AnimatedButton
              size="xs"
              variant="outline"
              onClick={onOpenAuth}
              className="text-xs"
            >
              <UserIcon className="w-3.5 h-3.5 text-neutral-300" />
              <span>Sign In</span>
            </AnimatedButton>
          )}

          {/* Shopping Cart Trigger */}
          <AnimatedButton
            size="sm"
            variant="glow"
            onClick={onOpenCart}
            className="relative px-3 py-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-mono text-xs font-bold">{cartCount}</span>
          </AnimatedButton>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden p-4 bg-neutral-950 border-b border-neutral-800 flex flex-col gap-2">
          <button
            onClick={() => {
              onSelectTab('shop');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold ${
              activeTab === 'shop' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
            }`}
          >
            Shop All
          </button>

          <button
            onClick={() => {
              onSelectTab('studio');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
              activeTab === 'studio' ? 'bg-indigo-600 text-white' : 'text-indigo-400'
            }`}
          >
            <span>Custom Merch Studio</span>
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              onSelectTab('shop');
              setIsMobileMenuOpen(false);
              setTimeout(() => {
                const el = document.getElementById('reviews-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 120);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-amber-400 hover:text-amber-300"
          >
            <span>Community Reviews & Feedback</span>
            <Star className="w-3.5 h-3.5 fill-current" />
          </button>

          <button
            onClick={() => {
              onSelectTab('admin');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
              activeTab === 'admin' ? 'bg-emerald-600 text-white' : 'text-emerald-400'
            }`}
          >
            <span>Admin Management</span>
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              onSelectTab('wishlist');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
              activeTab === 'wishlist' ? 'bg-neutral-800 text-white' : 'text-neutral-400'
            }`}
          >
            <span>Saved Wishlist ({wishlistCount})</span>
            <Heart className="w-3.5 h-3.5" />
          </button>

          {/* User Sign In / Account in Mobile Drawer */}
          {currentUser ? (
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <div className="text-xs font-bold text-white truncate max-w-[140px]">{currentUser.name}</div>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-xs text-red-400 font-semibold cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/20"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In / Create Account</span>
            </button>
          )}

          <button
            onClick={() => {
              onReplayIntro();
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400" />
            <span>Replay Launch Intro</span>
          </button>
        </div>
      )}
    </header>
  );
};
