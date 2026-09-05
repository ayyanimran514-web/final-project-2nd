import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Star, 
  Check, 
  Sparkles, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Layers, 
  Eye,
  Camera,
  ThumbsUp,
  Award,
  Send,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, ProductColor, ProductReview } from '../types';
import { ProductVisual } from './ProductVisual';
import { AnimatedButton } from './AnimatedButton';

interface ProductDetailsModalProps {
  product: Product | null;
  initialColor?: ProductColor;
  onClose: () => void;
  onAddToCart: (product: Product, color: ProductColor, size: string, quantity: number) => void;
  onOpenStudio?: (product: Product) => void;
  onAddReview?: (productId: string, review: ProductReview) => void;
  currentUser?: { name: string; email: string } | null;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  initialColor,
  onClose,
  onAddToCart,
  onOpenStudio,
  onAddReview,
  currentUser
}) => {
  if (!product) return null;

  const [activeColor, setActiveColor] = useState<ProductColor>(initialColor || product.colors[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'L');
  const [quantity, setQuantity] = useState<number>(1);
  const [view, setView] = useState<'front' | 'back'>('front');
  const [activeTab, setActiveTab] = useState<'details' | 'features' | 'reviews'>('details');
  const [visualMode, setVisualMode] = useState<'mockup' | 'photo'>(product.imageUrl ? 'photo' : 'mockup');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isLiveOrbit, setIsLiveOrbit] = useState<boolean>(false);

  // Review Form State
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewFit, setReviewFit] = useState<'true_to_size' | 'runs_small' | 'oversized'>('oversized');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setActiveColor(initialColor || product.colors[0]);
      setSelectedSize(product.sizes[0] || 'L');
      setQuantity(1);
      setView('front');
      setSelectedPhotoIndex(0);
      setVisualMode(product.imageUrl ? 'photo' : 'mockup');
      setIsWritingReview(false);
      setReviewSubmitted(false);
    }
  }, [product, initialColor]);

  const photos = [
    product.imageUrl,
    ...(product.galleryUrls || [])
  ].filter(Boolean) as string[];

  const handleHelpfulClick = (revId: string, currentHelpful = 0) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [revId]: (prev[revId] ?? currentHelpful) + 1
    }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || !reviewerName.trim()) return;

    const newReview: ProductReview = {
      id: `rev-${Date.now()}`,
      author: reviewerName.trim(),
      rating: newRating,
      title: reviewTitle.trim() || undefined,
      comment: reviewComment.trim(),
      date: 'Today',
      verified: true,
      helpfulCount: 0
    };

    if (onAddReview) {
      onAddReview(product.id, newReview);
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // safe ignore
    }

    setReviewSubmitted(true);
    setTimeout(() => {
      setIsWritingReview(false);
      setReviewSubmitted(false);
      setReviewTitle('');
      setReviewComment('');
    }, 1800);
  };

  const ratingDescriptions: Record<number, string> = {
    1: '1 Star - Poor quality',
    2: '2 Stars - Fair, has flaws',
    3: '3 Stars - Average piece',
    4: '4 Stars - Great streetwear',
    5: '5 Stars - Exceptional grail piece!'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8 max-h-[92vh] flex flex-col"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-neutral-950/80 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors z-30 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12 overflow-y-auto">
            {/* Left Col: Live Product Visual / High-Res Editorial Photography (6 cols) */}
            <div className="md:col-span-6 p-6 sm:p-8 bg-gradient-to-b from-neutral-950/70 to-neutral-900/90 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-neutral-800">
              {/* Top View and Mode Switches */}
              <div className="w-full flex items-center justify-between gap-2">
                {/* Visual Mode Switch: 3D Dye Mockup vs Realistic Photo */}
                <div className="flex items-center p-1 rounded-xl bg-neutral-950/90 border border-neutral-800">
                  <button
                    onClick={() => setVisualMode('mockup')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      visualMode === 'mockup' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>3D Dye Mockup</span>
                  </button>
                  {photos.length > 0 && (
                    <button
                      onClick={() => setVisualMode('photo')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        visualMode === 'photo' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Realistic Photos</span>
                    </button>
                  )}
                </div>

                {/* Sub-view switcher for 3D mockup */}
                {visualMode === 'mockup' && (
                  <div className="flex items-center gap-1.5">
                    {(product.baseType === 'tshirt' || product.baseType === 'hoodie' || product.baseType === 'jersey') && (
                      <div className="flex items-center p-1 rounded-xl bg-neutral-950/90 border border-neutral-800">
                        <button
                          onClick={() => setView('front')}
                          className={`px-2 py-0.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            view === 'front' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          Front
                        </button>
                        <button
                          onClick={() => setView('back')}
                          className={`px-2 py-0.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            view === 'back' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
                          }`}
                        >
                          Back
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => setIsLiveOrbit(!isLiveOrbit)}
                      className={`px-2.5 py-1 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isLiveOrbit
                          ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-500/30'
                          : 'bg-neutral-950/90 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                      title="Toggle 3D animated live rotation preview"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLiveOrbit ? 'animate-spin' : ''}`} />
                      <span>3D Live</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Central Stage: Either 3D Workable SVG with Realistic Textile Shading OR Realistic Editorial Photo */}
              <div className="relative w-full aspect-square max-h-[360px] flex items-center justify-center my-4">
                {visualMode === 'mockup' ? (
                  <ProductVisual
                    baseType={product.baseType}
                    color={activeColor}
                    view={view}
                    isAnimatedOrbit={isLiveOrbit}
                    className="w-full h-full max-h-[340px]"
                  />
                ) : (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden border border-neutral-800/80 bg-neutral-950/60 flex items-center justify-center group">
                    <img
                      src={photos[selectedPhotoIndex] || product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-neutral-300">
                      EDITORIAL LOOKBOOK
                    </div>
                  </div>
                )}
              </div>

              {/* Realistic Photo Thumbnails if multiple exist */}
              {visualMode === 'photo' && photos.length > 1 && (
                <div className="flex items-center gap-2 mb-3">
                  {photos.map((url, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedPhotoIndex === idx ? 'border-indigo-500 scale-105 ring-2 ring-indigo-500/30' : 'border-neutral-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Confidence Badges & Textile Specs */}
              <div className="w-full grid grid-cols-3 gap-2 pt-4 border-t border-neutral-800/80 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px] text-neutral-400">Fast Express Ship</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] text-neutral-400">
                    {product.fabricGsm ? `${product.fabricGsm} GSM Cotton` : 'Heavyweight Weave'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RefreshCw className="w-4 h-4 text-purple-400" />
                  <span className="text-[10px] text-neutral-400">30-Day Easy Returns</span>
                </div>
              </div>
            </div>

            {/* Right Col: Details, Options, & Custom Reviews (6 cols) */}
            <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between gap-5">
              <div className="flex flex-col gap-4">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-xs font-mono font-semibold uppercase tracking-wider">
                      {product.category}
                    </span>
                    {product.fabricGsm && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold">
                        {product.fabricGsm} GSM
                      </span>
                    )}
                    {product.materialOrigin && (
                      <span className="px-2 py-0.5 rounded-full bg-neutral-800/90 text-neutral-300 text-[10px] font-mono">
                        Origin: {product.materialOrigin}
                      </span>
                    )}
                    {product.isCustomizable && (
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>CUSTOMIZABLE</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                    {product.name}
                  </h2>

                  {/* Rating & Stock */}
                  <div className="flex items-center gap-4 mt-2">
                    <div 
                      onClick={() => setActiveTab('reviews')}
                      className="flex items-center gap-1 text-amber-400 cursor-pointer hover:underline"
                    >
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-sm text-neutral-200">{product.rating}</span>
                      <span className="text-xs text-neutral-400">({product.reviewsCount} reviews)</span>
                    </div>

                    <span className="text-xs font-mono text-emerald-400">
                      ● {product.inStock ? `In Stock (${product.stockCount} units left)` : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-3xl font-black text-white font-display">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-neutral-400 line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* WORKABLE COLOR SELECTION */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-neutral-400">WORKABLE COLOR:</span>
                    <span className="text-xs font-mono font-semibold text-indigo-300">
                      {activeColor.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {product.colors.map(c => {
                      const isSelected = activeColor.hex === c.hex;
                      return (
                        <button
                          key={c.hex}
                          onClick={() => {
                            setActiveColor(c);
                            // Switch to 3D mockup to immediately show workable color change!
                            setVisualMode('mockup');
                          }}
                          className={`group relative flex items-center gap-2 p-1.5 pr-3 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30'
                              : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/40'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center"
                            style={{ backgroundColor: c.hex }}
                          >
                            {isSelected && (
                              <Check className={`w-3 h-3 ${c.hex === '#F8FAFC' || c.hex === '#D6C7A1' ? 'text-black' : 'text-white'}`} />
                            )}
                          </span>
                          <span className="text-xs text-neutral-300 group-hover:text-white">
                            {c.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SIZE SELECTION */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-neutral-400">SELECT SIZE:</span>
                    <span className="text-xs text-neutral-400">Boxy Streetwear Fit</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {product.sizes.map(s => {
                      const isSelected = selectedSize === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-white text-neutral-950 border-white shadow-md'
                              : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* TABS: Description / Specs & Features / Custom Reviews */}
                <div className="pt-2">
                  <div className="flex items-center border-b border-neutral-800 text-xs font-semibold">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={`pb-2 mr-4 transition-colors cursor-pointer ${
                        activeTab === 'details' ? 'text-white border-b-2 border-indigo-500' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setActiveTab('features')}
                      className={`pb-2 mr-4 transition-colors cursor-pointer ${
                        activeTab === 'features' ? 'text-white border-b-2 border-indigo-500' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Specs & Fabric
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`pb-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeTab === 'reviews' ? 'text-white border-b-2 border-indigo-500' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <span>Reviews</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-neutral-800 text-[10px] text-indigo-300">
                        {product.reviews?.length || product.reviewsCount}
                      </span>
                    </button>
                  </div>

                  <div className="pt-3 text-xs text-neutral-400 leading-relaxed max-h-56 overflow-y-auto">
                    {activeTab === 'details' && (
                      <p>{product.description}</p>
                    )}

                    {activeTab === 'features' && (
                      <div className="space-y-3">
                        <ul className="space-y-1.5">
                          {product.features.map((feat, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              <span className="text-neutral-300">{feat}</span>
                            </li>
                          ))}
                        </ul>

                        {product.fabricGsm && (
                          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800 text-[11px] space-y-1">
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Fabric Weight:</span>
                              <span className="font-bold text-white">{product.fabricGsm} GSM Heavyweight</span>
                            </div>
                            {product.materialOrigin && (
                              <div className="flex justify-between">
                                <span className="text-neutral-400">Milled In:</span>
                                <span className="font-bold text-white">{product.materialOrigin}</span>
                              </div>
                            )}
                            <div className="flex justify-between">
                              <span className="text-neutral-400">Care:</span>
                              <span className="text-neutral-300">Machine wash cold inside-out, hang dry</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'reviews' && (
                      <div className="space-y-4">
                        {/* Summary Header & Write Review CTA */}
                        <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800">
                          <div>
                            <div className="flex items-center gap-1.5 text-amber-400">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-base font-bold text-white">{product.rating}</span>
                              <span className="text-xs text-neutral-400">/ 5.0</span>
                            </div>
                            <span className="text-[11px] text-neutral-400">
                              Based on {product.reviews?.length || product.reviewsCount} customer reviews
                            </span>
                          </div>

                          <button
                            onClick={() => setIsWritingReview(!isWritingReview)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors cursor-pointer"
                          >
                            {isWritingReview ? 'Cancel' : 'Write a Review'}
                          </button>
                        </div>

                        {/* Interactive Review Submission Form */}
                        <AnimatePresence>
                          {isWritingReview && (
                            <motion.form
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              onSubmit={handleSubmitReview}
                              className="p-4 rounded-2xl bg-neutral-950 border border-indigo-500/40 space-y-3"
                            >
                              {reviewSubmitted ? (
                                <div className="py-4 flex flex-col items-center justify-center text-center">
                                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-2" />
                                  <h4 className="text-sm font-bold text-white">Review Submitted!</h4>
                                  <p className="text-xs text-neutral-400">Thank you for sharing your feedback with the BUYLY community.</p>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs text-white">Your Rating:</span>
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                          type="button"
                                          key={star}
                                          onMouseEnter={() => setHoverRating(star)}
                                          onMouseLeave={() => setHoverRating(0)}
                                          onClick={() => setNewRating(star)}
                                          className="p-1 text-amber-400 cursor-pointer"
                                        >
                                          <Star
                                            className={`w-5 h-5 transition-transform ${
                                              (hoverRating || newRating) >= star ? 'fill-current scale-110' : 'text-neutral-600'
                                            }`}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-indigo-300 font-mono text-right">
                                    {ratingDescriptions[hoverRating || newRating]}
                                  </p>

                                  <div className="grid grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[10px] font-mono text-neutral-400 block mb-1">YOUR NAME</label>
                                      <input
                                        type="text"
                                        required
                                        value={reviewerName}
                                        onChange={e => setReviewerName(e.target.value)}
                                        placeholder="e.g. Marcus V."
                                        className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-mono text-neutral-400 block mb-1">FIT RATING</label>
                                      <select
                                        value={reviewFit}
                                        onChange={e => setReviewFit(e.target.value as any)}
                                        className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                                      >
                                        <option value="runs_small">Runs Small</option>
                                        <option value="true_to_size">True to Size</option>
                                        <option value="oversized">Oversized Streetwear Fit</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-mono text-neutral-400 block mb-1">HEADLINE / TITLE</label>
                                    <input
                                      type="text"
                                      value={reviewTitle}
                                      onChange={e => setReviewTitle(e.target.value)}
                                      placeholder="e.g. Best heavyweight drop-shoulder tee I own"
                                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-[10px] font-mono text-neutral-400 block mb-1">DETAILED REVIEW</label>
                                    <textarea
                                      required
                                      rows={3}
                                      value={reviewComment}
                                      onChange={e => setReviewComment(e.target.value)}
                                      placeholder="Comment on the fabric weight, drape, stitching, and feel..."
                                      className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                                    />
                                  </div>

                                  <button
                                    type="submit"
                                    className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Post Verified Review</span>
                                  </button>
                                </>
                              )}
                            </motion.form>
                          )}
                        </AnimatePresence>

                        {/* Customer Reviews Feed */}
                        <div className="space-y-3">
                          {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map(rev => {
                              const helpfulCount = helpfulVotes[rev.id] ?? (rev.helpfulCount || 0);
                              return (
                                <div key={rev.id} className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-neutral-200">{rev.author}</span>
                                      {rev.verified !== false && (
                                        <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                                          <ShieldCheck className="w-3 h-3" />
                                          <span>Verified Buyer</span>
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-neutral-500">{rev.date}</span>
                                  </div>

                                  <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, idx) => (
                                      <Star
                                        key={idx}
                                        className={`w-3.5 h-3.5 ${idx < rev.rating ? 'fill-current' : 'text-neutral-700'}`}
                                      />
                                    ))}
                                    {rev.title && (
                                      <span className="ml-2 font-semibold text-xs text-white">
                                        "{rev.title}"
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-[11px] text-neutral-300 leading-relaxed">{rev.comment}</p>

                                  <div className="pt-1 flex items-center justify-between text-[10px] text-neutral-400">
                                    <span>Fit: Oversized Streetwear</span>
                                    <button
                                      type="button"
                                      onClick={() => handleHelpfulClick(rev.id, rev.helpfulCount)}
                                      className="flex items-center gap-1 text-neutral-400 hover:text-indigo-400 cursor-pointer"
                                    >
                                      <ThumbsUp className="w-3 h-3" />
                                      <span>Helpful ({helpfulCount})</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-center py-6 text-neutral-400">
                              No customer reviews yet. Be the first to review!
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Quantity & Add to Cart Controls */}
              <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Quantity adjuster */}
                <div className="flex items-center justify-between sm:justify-start rounded-2xl bg-neutral-950 border border-neutral-800 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono font-bold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-300 hover:text-white hover:bg-neutral-800 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <div className="flex-1 flex items-center gap-2">
                  {product.isCustomizable && onOpenStudio && (
                    <AnimatedButton
                      variant="outline"
                      size="md"
                      onClick={() => {
                        onClose();
                        onOpenStudio(product);
                      }}
                      className="flex-1 text-xs"
                    >
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      <span>Custom Studio</span>
                    </AnimatedButton>
                  )}

                  <AnimatedButton
                    variant="glow"
                    size="md"
                    onClick={() => {
                      onAddToCart(product, activeColor, selectedSize, quantity);
                      onClose();
                    }}
                    className="flex-1 text-xs font-bold"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart (${product.price * quantity})</span>
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

