import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Check, 
  Truck,
  Layers,
  Percent,
  Award,
  Zap
} from 'lucide-react';
import { CartItem } from '../types';
import { AnimatedButton } from './AnimatedButton';
import { ProductVisual } from './ProductVisual';
import { BULK_DISCOUNT_TIERS, getBulkDiscountTier, getNextBulkTier } from '../utils/pricing';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalQuantity = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.customDesign ? item.customDesign.totalCustomPrice : item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  // Bulk / Vendor Discount calculation
  const bulkTier = getBulkDiscountTier(totalQuantity);
  const nextBulkTier = getNextBulkTier(totalQuantity);
  const effectiveDiscountPercent = Math.max(bulkTier.discountPercent, couponDiscountPercent);

  const freeShippingThreshold = 80;
  const progressToFreeShipping = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const isFreeShipping = subtotal >= freeShippingThreshold || bulkTier.isVendor;

  const discountAmount = Math.round((subtotal * effectiveDiscountPercent) / 100);
  const shippingFee = isFreeShipping || subtotal === 0 ? 0 : 8;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'BUYLY10') {
      setCouponDiscountPercent(10);
      setPromoMessage('10% VIP streetwear coupon applied!');
    } else if (code === 'VENDOR35') {
      setCouponDiscountPercent(35);
      setPromoMessage('35% Verified Vendor VIP discount unlocked!');
    } else if (code === 'FREESHIP') {
      setCouponDiscountPercent(0);
      setPromoMessage('Free standard shipping unlocked!');
    } else {
      setPromoMessage('Invalid code. Try "BUYLY10" or "VENDOR35"');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
          className="relative w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col justify-between shadow-2xl z-10"
        >
          {/* Header */}
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white font-display">Your Shopping Bag</h2>
              <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-xs font-mono text-neutral-300">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-5 py-3 bg-neutral-950/60 border-b border-neutral-800/80">
            <div className="flex items-center justify-between text-xs font-mono mb-1.5">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Truck className="w-3.5 h-3.5 text-indigo-400" />
                {isFreeShipping ? (
                  <span className="text-emerald-400 font-semibold">You unlocked Free Express Shipping!</span>
                ) : (
                  <span>Add ${(freeShippingThreshold - subtotal).toFixed(0)} more for Free Shipping</span>
                )}
              </span>
              <span className="text-neutral-400">{progressToFreeShipping.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  isFreeShipping ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                }`}
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Bulk & Vendor Discount Incentive Banner */}
          {cartItems.length > 0 && (
            <div className="px-5 py-2.5 bg-gradient-to-r from-indigo-950/50 via-purple-950/40 to-neutral-950/60 border-b border-indigo-900/40">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md ${bulkTier.discountPercent > 0 ? 'bg-indigo-500 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">
                        {bulkTier.discountPercent > 0 ? bulkTier.tierName : 'Bulk & Vendor Pricing'}
                      </span>
                      {bulkTier.discountPercent > 0 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {bulkTier.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-300">
                      {nextBulkTier ? (
                        <span>
                          Add <strong className="text-cyan-300">{nextBulkTier.minQty - totalQuantity}</strong> more pcs to unlock <strong className="text-emerald-400">{nextBulkTier.badge}</strong>
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">Maximum 35% Wholesale Vendor Tier Active!</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-neutral-800/60 flex items-center justify-center text-neutral-500 mb-4">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">Your cart is empty</h3>
                <p className="text-xs text-neutral-400 mb-6 max-w-xs">
                  Discover our heavyweight tees, customized hoodies, and tactical merchandise drops.
                </p>
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                >
                  Start Shopping
                </AnimatedButton>
              </div>
            ) : (
              cartItems.map((item) => {
                const itemPrice = item.customDesign ? item.customDesign.totalCustomPrice : item.product.price;
                return (
                  <div
                    key={item.cartItemId}
                    className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex gap-3.5"
                  >
                    {/* Visual Thumbnail */}
                    <div className="w-16 h-16 rounded-xl bg-neutral-900 border border-neutral-800 p-1 flex items-center justify-center shrink-0">
                      <ProductVisual
                        baseType={item.customDesign ? item.customDesign.baseProduct : item.product.baseType}
                        color={item.selectedColor}
                        textElements={item.customDesign?.textElements}
                        graphicElements={item.customDesign?.graphicElements}
                        className="w-full h-full"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-white truncate">
                            {item.customDesign ? item.customDesign.productName : item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-neutral-500 hover:text-red-400 p-0.5 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Specs */}
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                          <span className="flex items-center gap-1">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-white/20"
                              style={{ backgroundColor: item.selectedColor.hex }}
                            />
                            <span>{item.selectedColor.name}</span>
                          </span>
                          <span>•</span>
                          <span>Size: {item.selectedSize}</span>
                        </div>

                        {item.customDesign && (
                          <div className="flex items-center gap-1 text-[10px] text-indigo-400 font-mono mt-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Custom Printed Spec</span>
                          </div>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/60">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                            className="w-5 h-5 rounded-md bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-xs text-white cursor-pointer"
                          >
                            -
                          </button>
                          <span className="text-xs font-mono text-white w-5 text-center font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                            className="w-5 h-5 rounded-md bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-xs text-white cursor-pointer"
                          >
                            +
                          </button>
                          <button
                            onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 5)}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 hover:bg-indigo-900 cursor-pointer ml-1"
                            title="Add 5 more for bulk order"
                          >
                            +5 bulk
                          </button>
                        </div>

                        <span className="font-mono font-bold text-xs text-white">
                          ${itemPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout & Promo */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-neutral-800 bg-neutral-950/60 flex flex-col gap-3">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Coupon code (BUYLY10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white uppercase placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <AnimatedButton size="xs" variant="secondary" type="submit">
                  Apply
                </AnimatedButton>
              </form>

              {promoMessage && (
                <span className="text-[11px] text-indigo-400 font-mono">
                  {promoMessage}
                </span>
              )}

              {/* Subtotals */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-mono">${subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3 h-3" />
                      <span>
                        {bulkTier.discountPercent >= couponDiscountPercent
                          ? `${bulkTier.tierName} (${bulkTier.discountPercent}% OFF)`
                          : `Promo Coupon (${couponDiscountPercent}% OFF)`}
                      </span>
                    </span>
                    <span className="font-mono">-${discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="text-white font-mono">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-neutral-800">
                  <span>Grand Total</span>
                  <span className="font-mono text-base font-black text-white">
                    ${finalTotal}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <AnimatedButton
                size="md"
                variant="glow"
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full mt-1"
              >
                <span>Checkout Now (${finalTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </AnimatedButton>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
