import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Flame, 
  ArrowRight, 
  SlidersHorizontal, 
  ShieldCheck, 
  Package, 
  Heart, 
  ShoppingBag,
  RotateCcw,
  CheckCircle,
  Truck,
  Layers,
  Palette
} from 'lucide-react';
import { 
  Product, 
  ProductColor, 
  ProductReview,
  CartItem, 
  Order, 
  User, 
  ThemeId, 
  ProductBaseType, 
  CustomDesignDetails, 
  OrderStatus 
} from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, DEMO_USERS } from './data/products';
import { IntroScreen } from './components/IntroScreen';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CustomStudio } from './components/CustomStudio';
import { AdminTab } from './components/AdminTab';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AnimatedButton } from './components/AnimatedButton';
import { AiAssistant } from './components/AiAssistant';
import { ReviewsFeedbackSection } from './components/ReviewsFeedbackSection';
import { INITIAL_STORE_REVIEWS, StoreFeedbackReview } from './data/reviews';
import confetti from 'canvas-confetti';

export default function App() {
  // Intro Screen State (opens with flying letters merging into BUYLY)
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Active Store Theme
  // Theme Mode (dark | light)
  const [theme, setTheme] = useState<ThemeId>(() => {
    const saved = localStorage.getItem('buyly_theme') as ThemeId;
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  // Active Main Navigation Tab
  const [activeTab, setActiveTab] = useState<'shop' | 'studio' | 'admin' | 'wishlist'>('shop');

  // Product Catalog State (Persists modifications made by Admin)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('buyly_products');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_PRODUCTS;
  });

  // Orders State (for Admin and Checkout)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('buyly_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_ORDERS;
  });

  // Users State
  const [users, setUsers] = useState<User[]>(DEMO_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('buyly_user');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return DEMO_USERS[1]; // Default to Elena (Customer)
  });

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('buyly_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-2']);

  // Filters & Search
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [customizableOnly, setCustomizableOnly] = useState(false);

  // Modals
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [detailsInitialColor, setDetailsInitialColor] = useState<ProductColor | undefined>(undefined);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [studioInitialBase, setStudioInitialBase] = useState<ProductBaseType>('tshirt');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('buyly_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('buyly_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('buyly_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('buyly_theme', theme);
  }, [theme]);

  // Wishlist Toggle
  const handleToggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
      showToast('Removed from saved wishlist');
    } else {
      setWishlist([...wishlist, productId]);
      showToast('Saved to wishlist ❤️');
    }
  };

  // Add standard product to cart
  const handleAddToCart = (product: Product, color: ProductColor, size: string, quantity = 1) => {
    const existingIndex = cart.findIndex(
      item => item.productId === product.id && item.selectedColor.hex === color.hex && item.selectedSize === size && !item.customDesign
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newItem: CartItem = {
        cartItemId: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        product,
        selectedColor: color,
        selectedSize: size,
        quantity
      };
      setCart([...cart, newItem]);
    }

    showToast(`Added ${product.name} (${color.name}) to cart!`);
    setIsCartOpen(true);
  };

  // Add custom studio design to cart
  const handleAddCustomDesignToCart = (customDesign: CustomDesignDetails, size: string) => {
    // Find matching base product or fallback
    const matchingProduct = products.find(p => p.baseType === customDesign.baseProduct) || products[0];

    const newItem: CartItem = {
      cartItemId: `cart-custom-${Date.now()}`,
      productId: matchingProduct.id,
      product: matchingProduct,
      selectedColor: customDesign.baseColor,
      selectedSize: size,
      quantity: 1,
      customDesign
    };

    setCart([...cart, newItem]);
    showToast(`Custom ${customDesign.productName} added to bag!`);
    setIsCartOpen(true);
  };

  // Update Cart Quantity
  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    setCart(cart.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item));
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (cartItemId: string) => {
    setCart(cart.filter(item => item.cartItemId !== cartItemId));
    showToast('Item removed from cart');
  };

  // User Auth handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('buyly_user', JSON.stringify(user));
    showToast(`Welcome back, ${user.name}! (${user.role.toUpperCase()})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('buyly_user');
    showToast('Signed out of BUYLY account');
  };

  // Admin handlers
  const handleAddProduct = (newProd: Product) => {
    setProducts([newProd, ...products]);
    showToast(`Published new product: "${newProd.name}"`);
  };

  const handleAddReview = (productId: string, newReview: ProductReview) => {
    setProducts(prevProducts => {
      const updatedList = prevProducts.map(p => {
        if (p.id !== productId) return p;
        const currentReviews = p.reviews || [];
        const updatedReviews = [newReview, ...currentReviews];
        const sum = updatedReviews.reduce((acc, r) => acc + r.rating, 0);
        const newRating = Number((sum / updatedReviews.length).toFixed(1));
        const updatedProduct: Product = {
          ...p,
          reviews: updatedReviews,
          rating: newRating,
          reviewsCount: updatedReviews.length
        };
        if (detailsProduct && detailsProduct.id === productId) {
          setDetailsProduct(updatedProduct);
        }
        return updatedProduct;
      });
      return updatedList;
    });
    showToast('Verified review submitted! Thank you.');
  };

  // Store-wide Community Reviews & Customer Feedback State
  const [storeReviews, setStoreReviews] = useState<StoreFeedbackReview[]>(() => {
    const saved = localStorage.getItem('buyly_store_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_STORE_REVIEWS;
  });

  const handleAddStoreReview = (newReview: StoreFeedbackReview) => {
    setStoreReviews(prev => {
      const updated = [newReview, ...prev];
      localStorage.setItem('buyly_store_reviews', JSON.stringify(updated));
      return updated;
    });

    // If attached to a specific product, also update that product's rating and review count
    if (newReview.productId) {
      handleAddReview(newReview.productId, {
        id: newReview.id,
        author: newReview.author,
        rating: newReview.rating,
        date: newReview.date,
        comment: newReview.comment,
        verified: true
      });
    }
    showToast('Customer review published! Thank you for your feedback.');
  };

  const handleUpdateProduct = (updated: Product) => {
    setProducts(products.map(p => p.id === updated.id ? updated : p));
    showToast(`Updated product: "${updated.name}"`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    showToast('Product removed from catalog');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId.slice(-4)} updated to ${newStatus}`);
  };

  const handleAddDemoOrder = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const simulatedOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `BUYLY-${Math.floor(2000 + Math.random() * 8000)}`,
      customerName: 'Aiden Tanaka',
      customerEmail: 'aiden.t@streetwear.tokyo',
      date: 'Just now',
      total: randomProduct.price * 2,
      status: 'Processing',
      items: [
        {
          cartItemId: `c-sim-${Date.now()}`,
          productId: randomProduct.id,
          product: randomProduct,
          selectedColor: randomProduct.colors[0],
          selectedSize: 'L',
          quantity: 2
        }
      ],
      shippingAddress: {
        street: '4-12 Harajuku St',
        city: 'Tokyo',
        postalCode: '150-0001',
        country: 'Japan'
      }
    };
    setOrders([simulatedOrder, ...orders]);
    showToast('Simulated order received and recorded!');
  };

  // Filter and sort products
  const displayProducts = products.filter(p => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesCustomizable = !customizableOnly || p.isCustomizable;
    const matchesSearch = !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesCustomizable && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className={`min-h-screen relative flex flex-col font-sans transition-colors duration-500 ${
      theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-neutral-950 text-neutral-100'
    }`}>
      {/* Intro Animated Screen (Letters Flying and Merging into BUYLY) */}
      <AnimatePresence>
        {showIntro && (
          <IntroScreen onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Dynamic Animated Background with floating glowing orbs */}
      <AnimatedBackground theme={theme} />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-22 right-6 z-50 px-4 py-2.5 rounded-2xl bg-neutral-900/90 border border-neutral-700 text-white shadow-2xl text-xs font-semibold backdrop-blur-md flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        currentTheme={theme}
        onChangeTheme={(newTheme) => {
          setTheme(newTheme);
          showToast(`Theme changed to ${newTheme.toUpperCase()}`);
        }}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthInitialTab('login');
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        onOpenCart={() => setIsCartOpen(true)}
        onReplayIntro={() => setShowIntro(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* MAIN VIEW SWITCHER */}
      <main className="flex-1 relative z-10">
        {/* VIEW 1: SHOP ALL CATALOG */}
        {activeTab === 'shop' && (
          <div>
            {/* Streetwear Hero Banner */}
            <section className="relative pt-12 pb-14 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Hero Copy (7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-5">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>FALL / WINTER STREETWEAR DROP</span>
                    </span>
                    <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                      // WORKABLE REAL-TIME DYES
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white leading-[1.08]">
                    Heavy Fabrics.
                    <br />
                    <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-400 bg-clip-text text-transparent">
                      Custom Prints.
                    </span>
                    <br />
                    Zero Latency.
                  </h1>

                  <p className="text-neutral-400 text-sm sm:text-base max-w-xl leading-relaxed">
                    Welcome to BUYLY. Select from 12+ premium apparel blanks, change color swatches in real-time with authentic textile lighting, and design custom merch directly in our interactive studio.
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex items-center gap-3 pt-2 flex-wrap">
                    <AnimatedButton
                      size="lg"
                      variant="glow"
                      onClick={() => setActiveTab('studio')}
                      className="group"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-200" />
                      <span>Launch Custom Studio</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </AnimatedButton>

                    <AnimatedButton
                      size="lg"
                      variant="outline"
                      onClick={() => {
                        const el = document.getElementById('product-catalog-grid');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <span>Explore Catalog</span>
                    </AnimatedButton>

                    <AnimatedButton
                      size="sm"
                      variant="ghost"
                      onClick={() => setActiveTab('admin')}
                      className="text-xs font-mono text-emerald-400 hover:text-emerald-300"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Tab</span>
                    </AnimatedButton>
                  </div>

                  {/* Highlights Bar */}
                  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-800/80 max-w-lg">
                    <div>
                      <span className="block text-xl font-black text-white font-display">280-460</span>
                      <span className="text-[11px] font-mono text-neutral-400">GSM Heavy Cotton</span>
                    </div>
                    <div>
                      <span className="block text-xl font-black text-white font-display">100%</span>
                      <span className="text-[11px] font-mono text-neutral-400">Live Dye Preview</span>
                    </div>
                    <div>
                      <span className="block text-xl font-black text-white font-display">24-48h</span>
                      <span className="text-[11px] font-mono text-neutral-400">Custom Dispatch</span>
                    </div>
                  </div>
                </div>

                {/* Hero Showcase Mockup Card (5 cols) */}
                <div className="lg:col-span-5 flex justify-center">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative w-full max-w-md aspect-square rounded-3xl bg-neutral-900/80 border border-neutral-800 p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md overflow-hidden group"
                  >
                    <div className="flex items-center justify-between z-10">
                      <span className="px-3 py-1 rounded-full bg-neutral-950/80 border border-neutral-800 text-xs font-mono text-neutral-300">
                        FEATURED ITEM #01
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold">
                        IN STOCK
                      </span>
                    </div>

                    <div className="flex-1 flex items-center justify-center my-2">
                      <ProductCard
                        product={products[0]}
                        onOpenDetails={(p, col) => {
                          setDetailsProduct(p);
                          setDetailsInitialColor(col);
                        }}
                        onQuickAddToCart={handleAddToCart}
                        onOpenStudio={(p) => {
                          setStudioInitialBase(p.baseType);
                          setActiveTab('studio');
                        }}
                        isWishlisted={wishlist.includes(products[0].id)}
                        onToggleWishlist={handleToggleWishlist}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Catalog Filter & Category Selector */}
            <section id="product-catalog-grid" className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {[
                    { id: 'all', label: 'All Merch' },
                    { id: 'apparel', label: 'Tees & Hoodies' },
                    { id: 'headwear', label: 'Caps & Hats' },
                    { id: 'accessories', label: 'Bags & Drinkware' },
                    { id: 'tech', label: 'Tech Armor' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        categoryFilter === cat.id
                          ? 'bg-white text-neutral-950 shadow-md font-extrabold'
                          : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Secondary Filters */}
                <div className="flex items-center gap-3">
                  {/* Customizable Only toggle */}
                  <button
                    onClick={() => setCustomizableOnly(!customizableOnly)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold border transition-colors cursor-pointer ${
                      customizableOnly
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-neutral-900/80 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Customizable Only</span>
                  </button>

                  {/* Sort Dropdown */}
                  <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 rounded-2xl px-3 py-1.5 text-xs text-neutral-300">
                    <span className="text-neutral-400 font-mono">SORT:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as unknown as 'featured' | 'price-asc' | 'price-desc' | 'rating')}
                      className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="featured" className="bg-neutral-900">Featured</option>
                      <option value="price-asc" className="bg-neutral-900">Price: Low to High</option>
                      <option value="price-desc" className="bg-neutral-900">Price: High to Low</option>
                      <option value="rating" className="bg-neutral-900">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Active Search/Filter Pill */}
              {(searchQuery || customizableOnly || categoryFilter !== 'all') && (
                <div className="flex items-center gap-2 mt-4 text-xs font-mono text-neutral-400">
                  <span>ACTIVE FILTERS:</span>
                  {searchQuery && (
                    <span className="px-2 py-0.5 rounded-lg bg-neutral-800 text-white flex items-center gap-1">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="hover:text-red-400">✕</button>
                    </span>
                  )}
                  {customizableOnly && (
                    <span className="px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center gap-1">
                      Customizable Only
                      <button onClick={() => setCustomizableOnly(false)} className="hover:text-red-400">✕</button>
                    </span>
                  )}
                  {categoryFilter !== 'all' && (
                    <span className="px-2 py-0.5 rounded-lg bg-neutral-800 text-white flex items-center gap-1">
                      Category: {categoryFilter}
                      <button onClick={() => setCategoryFilter('all')} className="hover:text-red-400">✕</button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCustomizableOnly(false);
                      setCategoryFilter('all');
                    }}
                    className="text-indigo-400 hover:underline ml-2"
                  >
                    Reset all
                  </button>
                </div>
              )}
            </section>

            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
              {displayProducts.length === 0 ? (
                <div className="py-20 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 p-8">
                  <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-1">No products match your criteria</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                    Try adjusting your category filter, clearing your search query, or checking back soon.
                  </p>
                  <AnimatedButton
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                      setCustomizableOnly(false);
                    }}
                  >
                    Clear Filters
                  </AnimatedButton>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetails={(p, col) => {
                        setDetailsProduct(p);
                        setDetailsInitialColor(col);
                      }}
                      onQuickAddToCart={handleAddToCart}
                      onOpenStudio={(p) => {
                        setStudioInitialBase(p.baseType);
                        setActiveTab('studio');
                      }}
                      isWishlisted={wishlist.includes(product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Community Customer Reviews & Feedback Section */}
            <ReviewsFeedbackSection
              reviews={storeReviews}
              products={products}
              currentUser={currentUser}
              onAddReview={handleAddStoreReview}
              onOpenProductDetails={(prodId) => {
                const found = products.find(p => p.id === prodId);
                if (found) {
                  setDetailsProduct(found);
                  setDetailsInitialColor(found.colors[0]);
                }
              }}
            />
          </div>
        )}

        {/* VIEW 2: CUSTOM STUDIO */}
        {activeTab === 'studio' && (
          <CustomStudio
            onAddToCart={handleAddCustomDesignToCart}
            initialBaseType={studioInitialBase}
          />
        )}

        {/* VIEW 3: ADMIN TAB (Gated - Admin must log in first) */}
        {activeTab === 'admin' && (
          <AdminTab
            products={products}
            orders={orders}
            users={users}
            currentUser={currentUser}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onAddDemoOrder={handleAddDemoOrder}
            onLoginAsAdmin={(adminUser) => {
              setCurrentUser(adminUser);
              localStorage.setItem('buyly_user', JSON.stringify(adminUser));
              showToast(`Authenticated as Administrator: ${adminUser.name}`);
            }}
            onOpenAuthModal={() => {
              setAuthInitialTab('login');
              setIsAuthOpen(true);
            }}
          />
        )}

        {/* VIEW 4: SAVED WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="pb-6 border-b border-neutral-800 mb-8">
              <span className="text-xs font-mono text-rose-400">FAVORITES DIRECTORY</span>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
                Your Saved Merch ({wishlistedProducts.length})
              </h1>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="py-20 text-center rounded-3xl bg-neutral-900/40 border border-neutral-800 p-8">
                <Heart className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">Your wishlist is empty</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
                  Tap the heart icon on any product card to save your favorite colorways.
                </p>
                <AnimatedButton
                  size="md"
                  variant="glow"
                  onClick={() => setActiveTab('shop')}
                >
                  Browse Store Catalog
                </AnimatedButton>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistedProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetails={(p, col) => {
                      setDetailsProduct(p);
                      setDetailsInitialColor(col);
                    }}
                    onQuickAddToCart={handleAddToCart}
                    onOpenStudio={(p) => {
                      setStudioInitialBase(p.baseType);
                      setActiveTab('studio');
                    }}
                    isWishlisted={true}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-neutral-800/80 bg-neutral-950 text-neutral-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Col 1: Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold font-display">
                  B
                </div>
                <span className="text-lg font-black font-display text-white">BUYLY</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Next-generation streetwear merchandise laboratory. Featuring authentic fabric shading, real-time workable color dyes, and instant direct-to-garment mockups.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setShowIntro(true)}
                  className="px-3 py-1 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-[11px] font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Replay "BUYLY" Intro</span>
                </button>
              </div>
            </div>

            {/* Col 2: Studio Tools */}
            <div className="space-y-2">
              <span className="font-mono text-white text-xs font-bold block mb-3">CUSTOM LABORATORY</span>
              <ul className="space-y-2">
                <li><button onClick={() => { setStudioInitialBase('tshirt'); setActiveTab('studio'); }} className="hover:text-white cursor-pointer">Heavyweight T-Shirt Studio</button></li>
                <li><button onClick={() => { setStudioInitialBase('hoodie'); setActiveTab('studio'); }} className="hover:text-white cursor-pointer">Thermal Fleece Hoodie Studio</button></li>
                <li><button onClick={() => { setStudioInitialBase('cap'); setActiveTab('studio'); }} className="hover:text-white cursor-pointer">Tactical Snapback Creator</button></li>
                <li><button onClick={() => { setStudioInitialBase('mug'); setActiveTab('studio'); }} className="hover:text-white cursor-pointer">Industrial Ceramic Mug Studio</button></li>
                <li><button onClick={() => { setStudioInitialBase('phonecase'); setActiveTab('studio'); }} className="hover:text-white cursor-pointer">MagSafe Armor Phone Case</button></li>
              </ul>
            </div>

            {/* Col 3: Admin & Security */}
            <div className="space-y-2">
              <span className="font-mono text-white text-xs font-bold block mb-3">STORE PROTOCOLS</span>
              <ul className="space-y-2">
                <li><button onClick={() => setActiveTab('admin')} className="text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Admin Console</button></li>
                <li><button onClick={() => { setAuthInitialTab('login'); setIsAuthOpen(true); }} className="hover:text-white cursor-pointer">Customer Login Tab</button></li>
                <li><button onClick={() => { setAuthInitialTab('register'); setIsAuthOpen(true); }} className="hover:text-white cursor-pointer">Create Account Tab</button></li>
                <li><span className="text-neutral-400">256-Bit SSL Encrypted Checkout</span></li>
                <li><span className="text-neutral-400">Carbon-Neutral Direct Delivery</span></li>
              </ul>
            </div>

            {/* Col 4: Newsletter */}
            <div className="space-y-3">
              <span className="font-mono text-white text-xs font-bold block">DISPATCH NEWSLETTER</span>
              <p className="text-xs text-neutral-400">
                Receive secret drop links, exclusive coupon codes, and custom studio sticker packs.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); showToast('Subscribed to BUYLY Drops!'); }} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter email..."
                  className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500 flex-1"
                />
                <AnimatedButton size="xs" variant="glow" type="submit">
                  Join
                </AnimatedButton>
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
            <span>© 2026 BUYLY STUDIOS. ALL RIGHTS RESERVED.</span>
            <div className="flex items-center gap-4">
              <span>ACTIVE THEME: {theme.toUpperCase()}</span>
              <span>•</span>
              <span className="text-emerald-400">SERVER STATUS: ONLINE</span>
            </div>
          </div>
        </div>
      </footer>

      {/* PRODUCT DETAILS MODAL */}
      <ProductDetailsModal
        product={detailsProduct}
        initialColor={detailsInitialColor}
        onClose={() => setDetailsProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenStudio={(p) => {
          setStudioInitialBase(p.baseType);
          setActiveTab('studio');
        }}
        onAddReview={handleAddReview}
        currentUser={currentUser}
      />

      {/* AI ASSISTANT & STYLIST GUIDE */}
      <AiAssistant
        products={products}
        onOpenProduct={(p) => {
          setDetailsProduct(p);
          setDetailsInitialColor(p.colors[0]);
        }}
        onOpenStudio={(base) => {
          if (base) setStudioInitialBase(base);
          setActiveTab('studio');
        }}
      />

      {/* SHOPPING CART DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* AUTH MODAL (LOGIN & REGISTER TABS) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialTab={authInitialTab}
      />

      {/* CHECKOUT MODAL */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        currentUser={currentUser}
        onOrderSuccess={(order) => {
          setOrders([order, ...orders]);
          setCart([]);
        }}
      />
    </div>
  );
}
