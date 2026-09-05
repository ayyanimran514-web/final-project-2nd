import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Clock, 
  Truck, 
  ShieldCheck, 
  Search, 
  Filter, 
  Sparkles,
  AlertTriangle,
  X,
  DollarSign,
  Lock,
  Key,
  ArrowRight
} from 'lucide-react';
import { Product, Order, User, OrderStatus, ProductBaseType, ProductColor } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { ProductVisual } from './ProductVisual';

interface AdminTabProps {
  products: Product[];
  orders: Order[];
  users: User[];
  currentUser: User | null;
  onAddProduct: (newProduct: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onAddDemoOrder: () => void;
  onLoginAsAdmin?: (user: User) => void;
  onOpenAuthModal?: () => void;
}

export const AdminTab: React.FC<AdminTabProps> = ({
  products,
  orders,
  users,
  currentUser,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onAddDemoOrder,
  onLoginAsAdmin,
  onOpenAuthModal
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'products' | 'orders' | 'users'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Admin Gate Form states
  const [adminEmail, setAdminEmail] = useState('admin@buyly.store');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminKey, setAdminKey] = useState('ADMIN2026');
  const [gateError, setGateError] = useState<string | null>(null);
  const [isGateLoading, setIsGateLoading] = useState(false);
  
  // Add/Edit Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states for new product
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [price, setPrice] = useState<number>(45);
  const [category, setCategory] = useState<'apparel' | 'headwear' | 'accessories' | 'tech'>('apparel');
  const [baseType, setBaseType] = useState<ProductBaseType>('tshirt');
  const [stockCount, setStockCount] = useState<number>(50);
  const [isCustomizable, setIsCustomizable] = useState(true);

  // Financial Stats Calculation
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0) + 14280;
  const totalOrdersCount = orders.length + 120;
  const avgOrderValue = Math.round(totalRevenue / totalOrdersCount);

  // Open Edit modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setTagline(p.tagline);
    setPrice(p.price);
    setCategory(p.category);
    setBaseType(p.baseType);
    setStockCount(p.stockCount);
    setIsCustomizable(p.isCustomizable);
    setIsAddModalOpen(true);
  };

  // Open Create modal
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setName('');
    setTagline('');
    setPrice(45);
    setCategory('apparel');
    setBaseType('tshirt');
    setStockCount(50);
    setIsCustomizable(true);
    setIsAddModalOpen(true);
  };

  // Save (Create or Update) Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProduct) {
      // Update
      const updated: Product = {
        ...editingProduct,
        name,
        tagline: tagline || 'Custom engineered premium merchandise.',
        price,
        category,
        baseType,
        stockCount,
        inStock: stockCount > 0,
        isCustomizable
      };
      onUpdateProduct(updated);
    } else {
      // Add New
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name,
        tagline: tagline || 'Engineered with signature heavy fabric and streetwear fit.',
        price,
        originalPrice: price + 15,
        category,
        baseType,
        rating: 5.0,
        reviewsCount: 1,
        isCustomizable,
        inStock: stockCount > 0,
        stockCount,
        isNew: true,
        description: `${name} featuring high-density construction and versatile styling. Ready for direct-to-garment custom studio printing.`,
        features: [
          'High density premium construction',
          'Pre-shrunk fabric with reinforced seams',
          'Designed for streetwear lifestyle'
        ],
        sizes: ['S', 'M', 'L', 'XL', '2XL'],
        colors: [
          { name: 'Onyx Black', hex: '#121214' },
          { name: 'Optic White', hex: '#F8FAFC' },
          { name: 'Charcoal Slag', hex: '#334155' },
          { name: 'Electric Cobalt', hex: '#2563EB' }
        ],
        tags: ['New Release', 'Admin Added', 'Streetwear']
      };
      onAddProduct(newProd);
    }

    setIsAddModalOpen(false);
  };

  // Filter products by search
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter orders by status
  const filteredOrders = orders.filter(o =>
    orderStatusFilter === 'all' ? true : o.status.toLowerCase() === orderStatusFilter.toLowerCase()
  );

  const isAdmin = currentUser?.role === 'admin';

  // Handle Admin Gate Login
  const handleAdminGateSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setGateError(null);

    if (!adminEmail.trim()) {
      setGateError('Please enter administrator email address.');
      return;
    }

    setIsGateLoading(true);
    setTimeout(() => {
      setIsGateLoading(false);
      const adminUser: User = {
        id: 'user-admin-1',
        name: 'Alex Rivera (Store Admin)',
        email: adminEmail.trim(),
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        memberSince: 'Jan 2026',
        ordersCount: 142
      };
      onLoginAsAdmin?.(adminUser);
    }, 500);
  };

  // If user is not an administrator, do NOT show any orders, customers, or financial analytics!
  if (!isAdmin) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-neutral-900/70 border border-neutral-800 p-8 sm:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Gate Header */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto mb-8">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>RESTRICTED PORTAL</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-xs font-mono">
                Admin Authorization Required
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              Please Sign In As Administrator First
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
              Customer order fulfillment, private delivery addresses, inventory restock controls, and live revenue analytics are protected under administrative security.
            </p>
          </div>

          {/* Current User Warning (if logged in as non-admin) */}
          {currentUser && currentUser.role !== 'admin' && (
            <div className="relative z-10 mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Currently Signed in as Customer:</strong>
                <span>{currentUser.name} ({currentUser.email}). Customer accounts do not have clearance to view or edit backend store operations. Please log in with administrator credentials below.</span>
              </div>
            </div>
          )}

          {/* Direct Admin Login Box */}
          <div className="relative z-10 max-w-md mx-auto p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800">
            <form onSubmit={handleAdminGateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Administrator Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@buyly.store"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Store Passkey / Security Code
                </label>
                <input
                  type="text"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="ADMIN2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {gateError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {gateError}
                </div>
              )}

              <AnimatedButton
                size="md"
                variant="glow"
                type="submit"
                disabled={isGateLoading}
                className="w-full py-3 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
              >
                {isGateLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Access Admin Console</span>
                  </>
                )}
              </AnimatedButton>
            </form>

            {/* Instant Demo Admin Button */}
            <div className="mt-4 pt-4 border-t border-neutral-800 text-center">
              <button
                type="button"
                onClick={() => {
                  setAdminEmail('admin@buyly.store');
                  setAdminPassword('admin123');
                  handleAdminGateSubmit();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-750 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Instant 1-Click Demo Admin Login (Alex Rivera)</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Admin Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ADMINISTRATOR CONSOLE</span>
            </span>
            <span className="text-xs font-mono text-neutral-400">STORE MANAGEMENT & ANALYTICS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
            BUYLY Admin Tab
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Manage product inventory, modify workable colors, inspect customer orders, and supervise store growth.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <AnimatedButton
            size="sm"
            variant="outline"
            onClick={onAddDemoOrder}
            title="Simulate incoming customer order"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Simulate Order</span>
          </AnimatedButton>

          <AnimatedButton
            size="md"
            variant="glow"
            onClick={handleOpenCreate}
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </AnimatedButton>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <div className="p-5 rounded-3xl bg-neutral-900/80 border border-neutral-800 flex flex-col gap-1 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>TOTAL REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white font-display">
            ${totalRevenue.toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3 h-3" /> +18.4% this month
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900/80 border border-neutral-800 flex flex-col gap-1 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>ACTIVE ORDERS</span>
            <ShoppingBag className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white font-display">
            {totalOrdersCount}
          </span>
          <span className="text-[11px] text-indigo-400 font-mono">
            {orders.filter(o => o.status === 'Processing' || o.status === 'Pending').length} pending dispatch
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900/80 border border-neutral-800 flex flex-col gap-1 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>AVG ORDER VALUE</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white font-display">
            ${avgOrderValue}
          </span>
          <span className="text-[11px] text-purple-400 font-mono">
            +8.2% from custom studio
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-900/80 border border-neutral-800 flex flex-col gap-1 backdrop-blur-sm">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono">
            <span>TOTAL PRODUCTS</span>
            <Package className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white font-display">
            {products.length}
          </span>
          <span className="text-[11px] text-amber-400 font-mono">
            {products.filter(p => p.isCustomizable).length} customizable
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3 mt-4">
        <button
          onClick={() => setActiveSubTab('products')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'products'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Inventory ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Orders Management ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Customer Accounts ({users.length})</span>
        </button>
      </div>

      {/* SUB-TAB 1: PRODUCT CATALOG MANAGER */}
      {activeSubTab === 'products' && (
        <div className="mt-6 flex flex-col gap-5">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="text-xs font-mono text-neutral-400">
              Showing {filteredProducts.length} of {products.length} products
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-800 text-xs font-mono text-neutral-400 bg-neutral-950/50">
                <tr>
                  <th className="py-3.5 px-4">ITEM / PREVIEW</th>
                  <th className="py-3.5 px-4">CATEGORY</th>
                  <th className="py-3.5 px-4">PRICE</th>
                  <th className="py-3.5 px-4">WORKABLE COLORS</th>
                  <th className="py-3.5 px-4">STOCK</th>
                  <th className="py-3.5 px-4">CUSTOMIZABLE</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Item */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-neutral-950 p-1 flex items-center justify-center border border-neutral-800 shrink-0">
                          <ProductVisual
                            baseType={p.baseType}
                            color={p.colors[0] || { name: 'Dark', hex: '#18181B' }}
                            className="w-full h-full"
                          />
                        </div>
                        <div>
                          <span className="font-bold text-white block">{p.name}</span>
                          <span className="text-xs text-neutral-400 line-clamp-1">{p.tagline}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-mono uppercase">
                        {p.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      ${p.price}
                    </td>

                    {/* Workable Colors */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {p.colors.map(c => (
                          <span
                            key={c.hex}
                            title={c.name}
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                        <span className="text-xs text-neutral-400 ml-1">({p.colors.length})</span>
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="py-3 px-4">
                      {p.stockCount > 10 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono">
                          ● {p.stockCount} in stock
                        </span>
                      ) : p.stockCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono">
                          ⚠ Low ({p.stockCount})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-mono">
                          ✕ Sold Out
                        </span>
                      )}
                    </td>

                    {/* Customizable */}
                    <td className="py-3 px-4">
                      {p.isCustomizable ? (
                        <span className="text-xs font-mono text-indigo-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Enabled
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-neutral-400">Standard</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors cursor-pointer"
                          title="Delete product"
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
      )}

      {/* SUB-TAB 2: ORDERS MANAGEMENT */}
      {activeSubTab === 'orders' && (
        <div className="mt-6 flex flex-col gap-5">
          {/* Order Status Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['all', 'Pending', 'Processing', 'Shipped', 'Delivered'].map(status => (
              <button
                key={status}
                onClick={() => setOrderStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
                  orderStatusFilter.toLowerCase() === status.toLowerCase()
                    ? 'bg-white text-neutral-950 font-bold shadow-md'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {status.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Orders Cards Grid */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="p-12 rounded-3xl bg-neutral-900/40 border border-neutral-800 text-center text-neutral-400">
                No orders found matching this status filter.
              </div>
            ) : (
              filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="p-6 rounded-3xl bg-neutral-900/80 border border-neutral-800 flex flex-col gap-4 backdrop-blur-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-white text-base">
                        #{order.orderNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : order.status === 'Shipped'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : order.status === 'Processing'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="text-xs font-mono text-neutral-400">
                      Placed: {order.date}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-xs font-mono text-neutral-400 block mb-1">CUSTOMER</span>
                      <span className="text-sm font-semibold text-white block">{order.customerName}</span>
                      <span className="text-xs text-neutral-400">{order.customerEmail}</span>
                    </div>

                    <div>
                      <span className="text-xs font-mono text-neutral-400 block mb-1">SHIPPING DESTINATION</span>
                      <span className="text-xs text-neutral-300 block">
                        {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.country}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs font-mono text-neutral-400 block mb-1">ORDER ITEMS & TOTAL</span>
                      <span className="text-xs text-neutral-300 block">
                        {order.items.reduce((acc, it) => acc + it.quantity, 0)} items total
                      </span>
                      <span className="text-base font-black text-white font-mono mt-0.5 block">
                        ${order.total}
                      </span>
                    </div>
                  </div>

                  {/* Advance Order Status Actions */}
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-mono text-neutral-400">UPDATE DISPATCH STATUS:</span>
                    <div className="flex items-center gap-2">
                      <AnimatedButton
                        size="xs"
                        variant={order.status === 'Processing' ? 'primary' : 'outline'}
                        onClick={() => onUpdateOrderStatus(order.id, 'Processing')}
                      >
                        <Clock className="w-3 h-3" />
                        <span>Processing</span>
                      </AnimatedButton>

                      <AnimatedButton
                        size="xs"
                        variant={order.status === 'Shipped' ? 'primary' : 'outline'}
                        onClick={() => onUpdateOrderStatus(order.id, 'Shipped')}
                      >
                        <Truck className="w-3 h-3" />
                        <span>Shipped</span>
                      </AnimatedButton>

                      <AnimatedButton
                        size="xs"
                        variant={order.status === 'Delivered' ? 'primary' : 'outline'}
                        onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>Delivered</span>
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CUSTOMER ACCOUNTS */}
      {activeSubTab === 'users' && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm shadow-xl">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-800 text-xs font-mono text-neutral-400 bg-neutral-950/50">
                <tr>
                  <th className="py-3.5 px-4">USER PROFILE</th>
                  <th className="py-3.5 px-4">EMAIL</th>
                  <th className="py-3.5 px-4">SYSTEM ROLE</th>
                  <th className="py-3.5 px-4">MEMBER SINCE</th>
                  <th className="py-3.5 px-4">LIFETIME ORDERS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-neutral-700"
                        />
                        <span className="font-bold text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-neutral-300">
                      {u.email}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                        u.role === 'admin'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono text-neutral-400">
                      {u.memberSince}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {u.ordersCount} orders
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <h3 className="text-xl font-bold font-display text-white">
                  {editingProduct ? 'Edit Product Item' : 'Add New Streetwear Product'}
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="mt-5 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">PRODUCT TITLE *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Acid Drop Oversized Hoodie"
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">TAGLINE / SHORT SPEC</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. 320 GSM combed cotton with raw distressed hems."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">PRICE ($ USD) *</label>
                    <input
                      type="number"
                      required
                      min="5"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-indigo-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">STOCK QUANTITY *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={stockCount}
                      onChange={(e) => setStockCount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-indigo-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">CATEGORY</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as unknown as 'apparel' | 'headwear' | 'accessories' | 'tech')}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="apparel">Apparel</option>
                      <option value="headwear">Headwear</option>
                      <option value="accessories">Accessories</option>
                      <option value="tech">Tech & Living</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">GARMENT BASE MOCKUP</label>
                    <select
                      value={baseType}
                      onChange={(e) => setBaseType(e.target.value as ProductBaseType)}
                      className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="tshirt">T-Shirt Mockup</option>
                      <option value="hoodie">Hoodie Mockup</option>
                      <option value="mug">Ceramic Mug</option>
                      <option value="cap">Snapback Cap</option>
                      <option value="phonecase">Phone Case</option>
                      <option value="totebag">Canvas Tote</option>
                      <option value="bottle">Water Flask</option>
                      <option value="jacket">Bomber Jacket</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isCustomizable"
                    checked={isCustomizable}
                    onChange={(e) => setIsCustomizable(e.target.checked)}
                    className="w-4 h-4 accent-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="isCustomizable" className="text-sm text-neutral-300 cursor-pointer select-none">
                    Enable for Custom Studio design & printing
                  </label>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                  <AnimatedButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                  >
                    Cancel
                  </AnimatedButton>

                  <AnimatedButton
                    type="submit"
                    variant="glow"
                    size="md"
                  >
                    {editingProduct ? 'Update Product' : 'Publish Product'}
                  </AnimatedButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
