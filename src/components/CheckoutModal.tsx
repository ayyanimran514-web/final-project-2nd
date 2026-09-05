import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  Truck, 
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CartItem, Order, User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser: User | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onOrderSuccess
}) => {
  const [name, setName] = useState(currentUser?.name || 'Marcus Vance');
  const [email, setEmail] = useState(currentUser?.email || 'marcus.v@creativestudio.io');
  const [street, setStreet] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('San Francisco');
  const [postalCode, setPostalCode] = useState('94107');
  const [country, setCountry] = useState('United States');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple' | 'paypal' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.customDesign ? item.customDesign.totalCustomPrice : item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);
  const shipping = subtotal >= 80 ? 0 : 8;
  const grandTotal = subtotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: `BUYLY-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: name,
        customerEmail: email,
        date: 'Just now',
        items: [...cartItems],
        total: grandTotal,
        status: 'Processing',
        shippingAddress: {
          street,
          city,
          postalCode,
          country
        }
      };

      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);

      // Trigger celebration confetti
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {completedOrder ? (
            /* Order Success Receipt Screen */
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>

              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-mono font-bold mb-2">
                ORDER CONFIRMED #{completedOrder.orderNumber}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                Thank You For Your Order!
              </h2>

              <p className="text-xs text-neutral-400 max-w-md mt-2 leading-relaxed">
                We're spinning up our textile printers and assembling your order. A dispatch confirmation receipt has been sent to <strong className="text-white">{completedOrder.customerEmail}</strong>.
              </p>

              <div className="w-full mt-6 p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-left text-xs font-mono space-y-2">
                <div className="flex justify-between text-neutral-400">
                  <span>DISPATCH DESTINATION:</span>
                  <span className="text-white">{completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.country}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>ITEMS PURCHASED:</span>
                  <span className="text-white">{completedOrder.items.length} unique line items</span>
                </div>
                <div className="flex justify-between text-neutral-400 pt-2 border-t border-neutral-800">
                  <span>TOTAL CHARGED:</span>
                  <span className="text-emerald-400 font-bold text-sm">${completedOrder.total}</span>
                </div>
              </div>

              <AnimatedButton
                size="md"
                variant="glow"
                onClick={onClose}
                className="mt-6"
              >
                <span>Continue Browsing BUYLY</span>
              </AnimatedButton>
            </div>
          ) : (
            /* Main Checkout Form */
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-xs font-mono text-neutral-300">
                  SECURE CHECKOUT
                </span>
                <span className="text-xs font-mono text-neutral-400">256-BIT ENCRYPTION</span>
              </div>
              <h2 className="text-2xl font-black text-white font-display mb-6">
                Shipping & Payment Protocol
              </h2>

              <form onSubmit={handlePlaceOrder} className="flex flex-col gap-6">
                {/* 1. Contact Info */}
                <div>
                  <h3 className="text-xs font-mono text-neutral-400 mb-3">1. CUSTOMER INFORMATION</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* 2. Shipping Address */}
                <div>
                  <h3 className="text-xs font-mono text-neutral-400 mb-3">2. SHIPPING DESTINATION</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Street Address"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Payment Method */}
                <div>
                  <h3 className="text-xs font-mono text-neutral-400 mb-3">3. PAYMENT METHOD</h3>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                        paymentMethod === 'card'
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                        paymentMethod === 'apple'
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      <span>Pay</span>
                      <span>Apple Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                        paymentMethod === 'paypal'
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      <span>🅿️</span>
                      <span>PayPal</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('crypto')}
                      className={`p-2.5 rounded-xl text-xs font-semibold border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                        paymentMethod === 'crypto'
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                      }`}
                    >
                      <span>⚡</span>
                      <span>Crypto</span>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-2 p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800">
                      <input
                        type="text"
                        required
                        placeholder="Card Number"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                        />
                        <input
                          type="text"
                          required
                          placeholder="CVC"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <div className="pt-2 border-t border-neutral-800">
                  <AnimatedButton
                    type="submit"
                    variant="glow"
                    size="lg"
                    isLoading={isProcessing}
                    className="w-full"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authorize Payment & Place Order (${grandTotal})</span>
                  </AnimatedButton>
                </div>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
