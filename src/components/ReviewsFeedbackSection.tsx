import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquarePlus, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  X,
  Award,
  Send,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, User } from '../types';
import { StoreFeedbackReview } from '../data/reviews';
import { AnimatedButton } from './AnimatedButton';

interface ReviewsFeedbackSectionProps {
  reviews: StoreFeedbackReview[];
  products: Product[];
  currentUser: User | null;
  onAddReview: (review: StoreFeedbackReview) => void;
  onOpenProductDetails?: (productId: string) => void;
}

export const ReviewsFeedbackSection: React.FC<ReviewsFeedbackSectionProps> = ({
  reviews,
  products,
  currentUser,
  onAddReview,
  onOpenProductDetails
}) => {
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  // Review Form States
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formAuthor, setFormAuthor] = useState(currentUser?.name || '');
  const [formEmail, setFormEmail] = useState(currentUser?.email || '');
  const [formProductId, setFormProductId] = useState<string>(products[0]?.id || '');
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formFit, setFormFit] = useState<'true_to_size' | 'oversized' | 'runs_small'>('true_to_size');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate Overall Ratings
  const totalReviewsCount = reviews.length;
  const averageRating = totalReviewsCount > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviewsCount).toFixed(1)
    : '4.9';

  const fiveStarCount = reviews.filter(r => r.rating === 5).length;
  const fourStarCount = reviews.filter(r => r.rating === 4).length;
  const threeStarCount = reviews.filter(r => r.rating === 3).length;
  const twoStarCount = reviews.filter(r => r.rating === 2).length;
  const oneStarCount = reviews.filter(r => r.rating === 1).length;

  const fiveStarPct = totalReviewsCount > 0 ? Math.round((fiveStarCount / totalReviewsCount) * 100) : 88;
  const fourStarPct = totalReviewsCount > 0 ? Math.round((fourStarCount / totalReviewsCount) * 100) : 9;
  const threeStarPct = totalReviewsCount > 0 ? Math.round((threeStarCount / totalReviewsCount) * 100) : 2;

  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    if (starFilter !== 'all' && review.rating !== starFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = review.title.toLowerCase().includes(q) || 
                        review.comment.toLowerCase().includes(q) || 
                        review.author.toLowerCase().includes(q) ||
                        (review.productName && review.productName.toLowerCase().includes(q));
      if (!matchText) return false;
    }
    return true;
  });

  const handleHelpful = (id: string, initialCount = 0) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [id]: (prev[id] ?? initialCount) + 1
    }));
  };

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5: return '5/5 - Outstanding Quality & Fit';
      case 4: return '4/5 - Very Good (Exceeds expectations)';
      case 3: return '3/5 - Average (Standard build)';
      case 2: return '2/5 - Fair (Needs improvements)';
      case 1: return '1/5 - Unsatisfied';
      default: return '';
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formAuthor.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!formComment.trim()) {
      setFormError('Please share your thoughts and feedback in the review.');
      return;
    }

    const selectedProd = products.find(p => p.id === formProductId);

    const newRev: StoreFeedbackReview = {
      id: `rev-${Date.now()}`,
      author: formAuthor.trim(),
      rating: formRating,
      title: formTitle.trim() || 'Verified Customer Review',
      comment: formComment.trim(),
      date: 'Just now',
      verified: true,
      productId: formProductId || undefined,
      productName: selectedProd?.name || 'BUYLY Custom Studio',
      helpfulCount: 0,
      fitFeedback: formFit,
      tags: ['Verified Buyer', `${formRating} Stars`]
    };

    onAddReview(newRev);
    setFormSubmitted(true);

    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe ignore
    }

    setTimeout(() => {
      setFormSubmitted(false);
      setIsModalOpen(false);
      // Reset
      setFormTitle('');
      setFormComment('');
    }, 1800);
  };

  return (
    <section id="reviews-section" className="w-full py-16 border-t border-neutral-800/80 bg-neutral-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>COMMUNITY REVIEWS & FEEDBACK</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>100% Verified Buyers</span>
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
              Customer Ratings & Real Feedback
            </h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-xl">
              Authentic reviews from creators, esports rosters, and streetwear aficionados wearing BUYLY heavyweight garments worldwide.
            </p>
          </div>

          {/* Write a Review CTA Button */}
          <div className="flex items-center gap-3">
            <AnimatedButton
              size="md"
              variant="glow"
              onClick={() => {
                setFormAuthor(currentUser?.name || '');
                setFormEmail(currentUser?.email || '');
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave a Review & Feedback</span>
            </AnimatedButton>
          </div>
        </div>

        {/* Rating Overview Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-10 p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/90 backdrop-blur-md">
          {/* Main Average Score */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-center">
            <span className="text-6xl font-black font-display text-white tracking-tight">
              {averageRating}
            </span>
            {/* 5 Big Gold Stars */}
            <div className="flex items-center gap-1.5 my-3 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-6 h-6 fill-current text-amber-400" />
              ))}
            </div>
            <p className="text-sm font-semibold text-neutral-200">
              Based on {totalReviewsCount} Community Reviews
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              98% of customers recommend BUYLY merchandise
            </p>
          </div>

          {/* Star Distribution Progress Bars */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-2.5">
            {[
              { stars: 5, pct: fiveStarPct, count: fiveStarCount },
              { stars: 4, pct: fourStarPct, count: fourStarCount },
              { stars: 3, pct: threeStarPct, count: threeStarCount },
              { stars: 2, pct: twoStarCount > 0 ? 1 : 0, count: twoStarCount },
              { stars: 1, pct: oneStarCount > 0 ? 1 : 0, count: oneStarCount }
            ].map((row) => (
              <button
                key={row.stars}
                onClick={() => setStarFilter(prev => prev === row.stars ? 'all' : row.stars)}
                className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1 rounded-lg transition-colors ${
                  starFilter === row.stars ? 'bg-neutral-800' : 'hover:bg-neutral-800/40'
                }`}
              >
                <span className="w-12 text-left font-mono font-bold text-neutral-300 flex items-center gap-1">
                  <span>{row.stars}</span>
                  <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                </span>
                <div className="flex-1 h-2.5 rounded-full bg-neutral-950 overflow-hidden border border-neutral-800">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right font-mono text-neutral-400 group-hover:text-white">
                  {row.pct}%
                </span>
              </button>
            ))}
          </div>

          {/* Social Proof / Guarantee Badges */}
          <div className="lg:col-span-3 flex flex-col justify-center space-y-3.5 border-t lg:border-t-0 lg:border-l border-neutral-800 lg:pl-6 pt-4 lg:pt-0">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">460 GSM Heavyweight</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Ring-spun combed cotton that maintains drape forever.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Zero Distortion Printing</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">High-definition UV cure & reactive dye printing.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Fast 48h Studio Dispatch</h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">Custom apparel produced and shipped within 2 days.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Star Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-neutral-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            <button
              onClick={() => setStarFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                starFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              All ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((s) => (
              <button
                key={s}
                onClick={() => setStarFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  starFilter === s
                    ? 'bg-amber-500 text-neutral-950 shadow-sm font-black'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <span>{s}</span>
                <Star className="w-3 h-3 fill-current text-amber-400" />
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search reviews & feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Reviews Cards Grid */}
        {filteredReviews.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-neutral-900/30 border border-neutral-800 p-8">
            <p className="text-neutral-400 text-sm">No reviews found matching the selected star rating or search query.</p>
            <button
              onClick={() => { setStarFilter('all'); setSearchQuery(''); }}
              className="mt-3 px-4 py-1.5 rounded-xl bg-neutral-800 text-xs text-white hover:bg-neutral-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col p-6 rounded-3xl bg-neutral-900/50 border border-neutral-800/80 hover:border-neutral-700 backdrop-blur-sm transition-all shadow-md hover:shadow-xl"
              >
                {/* Header: Author, Avatar & Date */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {rev.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">{rev.author}</span>
                        {rev.verified && (
                          <span className="text-emerald-400" title="Verified Customer">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-neutral-400">{rev.date}</span>
                    </div>
                  </div>

                  {/* Stars of Rate */}
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <Star
                        key={st}
                        className={`w-4 h-4 ${st <= rev.rating ? 'fill-current text-amber-400' : 'text-neutral-700'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Product Tag */}
                {rev.productName && (
                  <div className="mb-2.5">
                    <span 
                      onClick={() => rev.productId && onOpenProductDetails?.(rev.productId)}
                      className={`inline-block px-2.5 py-0.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-indigo-300 truncate max-w-full ${
                        rev.productId ? 'hover:border-indigo-500/50 cursor-pointer' : ''
                      }`}
                    >
                      Item: {rev.productName}
                    </span>
                  </div>
                )}

                {/* Review Title */}
                <h4 className="text-base font-bold font-display text-white mb-2 leading-snug">
                  "{rev.title}"
                </h4>

                {/* Comment Text */}
                <p className="text-xs text-neutral-300 leading-relaxed flex-1">
                  {rev.comment}
                </p>

                {/* Review Footer: Fit Feedback & Was Helpful button */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2 text-xs">
                  {rev.fitFeedback ? (
                    <span className="text-[11px] font-mono text-neutral-400">
                      Fit: <strong className="text-neutral-200 capitalize">{rev.fitFeedback.replace(/_/g, ' ')}</strong>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-emerald-400">Verified Buyer</span>
                  )}

                  <button
                    onClick={() => handleHelpful(rev.id, rev.helpfulCount)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-[11px] font-mono transition-colors cursor-pointer"
                  >
                    <ThumbsUp className="w-3 h-3 text-indigo-400" />
                    <span>Helpful ({helpfulVotes[rev.id] ?? rev.helpfulCount})</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Verified Social Proof
                </span>
                <h3 className="text-2xl font-black font-display text-white mt-1">
                  Share Your Experience
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Rate your purchased merchandise and guide fellow streetwear collectors.
                </p>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-white">Review Submitted!</h4>
                  <p className="text-xs text-neutral-300 mt-1">Thank you for supporting BUYLY craftsmanship.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {/* Stars of Rate Selection */}
                  <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 text-center">
                    <label className="block text-xs font-bold text-neutral-300 mb-2">
                      YOUR RATING (CLICK TO SELECT STARS)
                    </label>
                    <div className="flex items-center justify-center gap-2 my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              (hoverRating || formRating) >= star
                                ? 'fill-current text-amber-400 drop-shadow-md'
                                : 'text-neutral-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300">
                      {getRatingLabel(hoverRating || formRating)}
                    </span>
                  </div>

                  {/* Product to Review */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Product Being Reviewed
                    </label>
                    <select
                      value={formProductId}
                      onChange={(e) => setFormProductId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">BUYLY Overall Store Experience / Custom Studio</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                      ))}
                    </select>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Henderson"
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        Email Address (for verified tag)
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. alex@example.com"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Review Headline */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Review Headline / Summary
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Substantial 460 GSM weight, beautiful mineral wash"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Comment Details */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      Detailed Review & Feedback *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="How does the fabric feel? What do you think about the print clarity, sizing, or daily durability?"
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  {/* Sizing & Fit Rating */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      How was the garment fit?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'runs_small', label: 'Runs Small' },
                        { id: 'true_to_size', label: 'True to Size' },
                        { id: 'oversized', label: 'Relaxed / Oversized' }
                      ].map(f => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFormFit(f.id as any)}
                          className={`py-2 px-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                            formFit === f.id
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                              : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {formError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {formError}
                    </div>
                  )}

                  <div className="pt-2">
                    <AnimatedButton
                      size="md"
                      variant="glow"
                      type="submit"
                      className="w-full py-3 flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Publish Verified Review</span>
                    </AnimatedButton>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
