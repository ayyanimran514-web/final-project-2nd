import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Heart, Eye, ShoppingCart, Sparkles, Camera, Palette } from 'lucide-react';
import { Product, ProductColor } from '../types';
import { ProductVisual } from './ProductVisual';
import { AnimatedButton } from './AnimatedButton';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product, initialColor?: ProductColor) => void;
  onQuickAddToCart: (product: Product, color: ProductColor, size: string) => void;
  onOpenStudio?: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickAddToCart,
  onOpenStudio,
  isWishlisted = false,
  onToggleWishlist
}) => {
  // WORKABLE COLOR: Selected color defaults to first color in product's available colors
  const [activeColor, setActiveColor] = useState<ProductColor>(product.colors[0] || { name: 'Default', hex: '#18181B' });
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'L');
  // Visual view mode: photorealistic studio photo vs interactive color dye mockup
  const [cardVisualMode, setCardVisualMode] = useState<'photo' | 'mockup'>(
    product.imageUrl ? 'photo' : 'mockup'
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col rounded-3xl bg-neutral-900/60 border border-neutral-800/90 hover:border-neutral-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm"
    >
      {/* Top Floating Badges */}
      <div className="absolute top-3 inset-x-3 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {product.isBestseller && (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold font-mono tracking-wider">
              BESTSELLER
            </span>
          )}
          {product.isCustomizable && (
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold font-mono tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>CUSTOMIZE</span>
            </span>
          )}
        </div>

        {/* Top Right: Wishlist & View Switcher */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {product.imageUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCardVisualMode(prev => prev === 'photo' ? 'mockup' : 'photo');
              }}
              className="px-2 py-1 rounded-full backdrop-blur-md bg-neutral-950/80 border border-neutral-750 text-[10px] font-mono text-neutral-300 hover:text-white flex items-center gap-1 transition-all cursor-pointer shadow-sm hover:border-neutral-600"
              title={cardVisualMode === 'photo' ? 'Switch to 3D/Dye Live Mockup' : 'Switch to Realistic Photography'}
            >
              {cardVisualMode === 'photo' ? (
                <>
                  <Palette className="w-2.5 h-2.5 text-indigo-400" />
                  <span>Dye</span>
                </>
              ) : (
                <>
                  <Camera className="w-2.5 h-2.5 text-amber-400" />
                  <span>Photo</span>
                </>
              )}
            </button>
          )}

          {/* Wishlist Heart Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist?.(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md border transition-colors cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30'
                : 'bg-neutral-950/70 text-neutral-400 hover:text-white border-neutral-800'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Product Stage: Realistic Photography OR Interactive Color Dye Visual */}
      <div 
        onClick={() => onOpenDetails(product, activeColor)}
        className="relative w-full aspect-square p-4 flex items-center justify-center bg-gradient-to-b from-neutral-900/80 to-neutral-950/80 cursor-pointer overflow-hidden group-hover:bg-neutral-900/40 transition-colors"
      >
        {cardVisualMode === 'photo' && product.imageUrl ? (
          <div className="w-full h-full relative rounded-2xl overflow-hidden flex items-center justify-center bg-neutral-950">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-neutral-950/75 border border-neutral-800 backdrop-blur-sm text-[9px] font-mono text-neutral-300 flex items-center gap-1">
              <Camera className="w-2.5 h-2.5 text-emerald-400" />
              <span>Studio Photo</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            <ProductVisual
              baseType={product.baseType}
              color={activeColor}
              view="front"
              className="w-full h-full max-h-[220px] transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-neutral-950/75 border border-neutral-800 backdrop-blur-sm text-[9px] font-mono text-neutral-300 flex items-center gap-1">
              <Palette className="w-2.5 h-2.5 text-indigo-400" />
              <span>{activeColor.name}</span>
            </div>
          </div>
        )}

        {/* Quick View overlay on hover */}
        <div className="absolute inset-0 bg-neutral-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="px-3 py-1.5 rounded-xl bg-neutral-900/90 text-xs font-semibold text-white border border-neutral-700 shadow-lg flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Product Info & Workable Color Swatches */}
      <div className="flex-1 flex flex-col p-5 gap-3">
        {/* Rating & Stock */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold text-neutral-200">{product.rating}</span>
            <span className="text-neutral-400">({product.reviewsCount})</span>
          </div>

          <span className="text-[11px] font-mono text-emerald-400">
            {product.inStock ? `${product.stockCount} in stock` : 'Sold out'}
          </span>
        </div>

        {/* Title & Tagline */}
        <div>
          <h3 
            onClick={() => onOpenDetails(product, activeColor)}
            className="text-base font-bold text-white font-display hover:text-indigo-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        {/* WORKABLE COLOR PICKER SWATCHES: Clicking updates color AND switches to Live Dye visual */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {product.colors.map(color => {
              const isSelected = activeColor.hex === color.hex;
              return (
                <button
                  key={color.hex}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveColor(color);
                    setCardVisualMode('mockup');
                  }}
                  title={`Select ${color.name} (Preview in Live Dye)`}
                  className={`relative w-5 h-5 rounded-full border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-400 scale-125 ring-2 ring-indigo-500/30'
                      : 'border-white/20 hover:scale-110 opacity-75 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <span className="sr-only">{color.name} selected</span>
                  )}
                </button>
              );
            })}
          </div>

          <span className="text-[11px] font-mono text-neutral-400 truncate max-w-[90px] text-right">
            {activeColor.name}
          </span>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-white font-display">${product.price}</span>
              {product.originalPrice && (
                <span className="text-xs text-neutral-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {product.isCustomizable && onOpenStudio && (
              <AnimatedButton
                size="xs"
                variant="outline"
                onClick={() => onOpenStudio(product)}
                title="Design in Custom Studio"
                className="text-[11px] px-2"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Studio</span>
              </AnimatedButton>
            )}

            <AnimatedButton
              size="xs"
              variant="glow"
              onClick={() => onQuickAddToCart(product, activeColor, selectedSize)}
              className="text-[11px] px-2.5"
            >
              <ShoppingCart className="w-3 h-3" />
              <span>Add</span>
            </AnimatedButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
