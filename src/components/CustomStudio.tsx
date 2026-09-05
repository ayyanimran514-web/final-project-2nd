import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  RotateCw, 
  Trash2, 
  Plus, 
  ShoppingCart, 
  Download, 
  Upload, 
  Layers, 
  Type, 
  Sticker as StickerIcon, 
  Palette, 
  Check, 
  Wand2, 
  Eye,
  Sliders,
  Move
} from 'lucide-react';
import { 
  ProductBaseType, 
  ProductColor, 
  CustomTextElement, 
  CustomGraphicElement, 
  CustomDesignDetails 
} from '../types';
import { ProductVisual } from './ProductVisual';
import { AnimatedButton } from './AnimatedButton';
import { STICKER_LIBRARY, SLOGAN_SUGGESTIONS } from '../data/products';
import confetti from 'canvas-confetti';

interface CustomStudioProps {
  onAddToCart: (customDesign: CustomDesignDetails, size: string) => void;
  initialBaseType?: ProductBaseType;
}

const AVAILABLE_BASES: Array<{ type: ProductBaseType; label: string; basePrice: number; icon: string }> = [
  { type: 'tshirt', label: 'Boxy Heavy Tee', basePrice: 44, icon: '👕' },
  { type: 'hoodie', label: 'Thermal Fleece Hoodie', basePrice: 88, icon: '🧥' },
  { type: 'deskmat', label: 'Gaming Deskmat (900×400)', basePrice: 39, icon: '⚡' },
  { type: 'jersey', label: 'Pro Esports Jersey', basePrice: 59, icon: '🎮' },
  { type: 'controller', label: 'Pro Controller Skin', basePrice: 45, icon: '🕹️' },
  { type: 'headset', label: 'Spatial Audio Headset', basePrice: 119, icon: '🎧' },
  { type: 'cap', label: 'Tactical Snapback', basePrice: 34, icon: '🧢' },
  { type: 'mug', label: 'Ceramic Mug 14oz', basePrice: 22, icon: '☕' },
  { type: 'phonecase', label: 'Armor Phone Case', basePrice: 36, icon: '📱' },
  { type: 'totebag', label: 'Canvas 16oz Tote', basePrice: 28, icon: '👜' },
  { type: 'bottle', label: 'Steel Vacuum Flask', basePrice: 32, icon: '🍶' }
];

const STUDIO_COLORS: ProductColor[] = [
  { name: 'Onyx Black', hex: '#121214' },
  { name: 'Optic White', hex: '#F8FAFC' },
  { name: 'Charcoal Slag', hex: '#334155' },
  { name: 'Electric Cobalt', hex: '#2563EB' },
  { name: 'Crimson Scarlet', hex: '#DC2626' },
  { name: 'Forest Moss', hex: '#15803D' },
  { name: 'Pastel Lavender', hex: '#A855F7' },
  { name: 'Sunset Terracotta', hex: '#EA580C' },
  { name: 'Desert Sand Tan', hex: '#D6C7A1' },
  { name: 'Cyber Cyan', hex: '#06B6D4' }
];

const TEXT_FONTS = [
  { name: 'Syne Display', value: "'Syne', sans-serif" },
  { name: 'Outfit Bold', value: "'Outfit', sans-serif" },
  { name: 'JetBrains Code', value: "'JetBrains Mono', monospace" },
  { name: 'Impact Heavy', value: "Impact, sans-serif" },
  { name: 'Georgia Serif', value: "Georgia, serif" }
];

const TEXT_PALETTE = [
  '#FFFFFF', '#000000', '#F43F5E', '#EC4899', '#A855F7', 
  '#6366F1', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'
];

export const CustomStudio: React.FC<CustomStudioProps> = ({ 
  onAddToCart,
  initialBaseType = 'tshirt'
}) => {
  const [baseType, setBaseType] = useState<ProductBaseType>(initialBaseType);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(STUDIO_COLORS[0]);
  const [view, setView] = useState<'front' | 'back'>('front');
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [activeToolTab, setActiveToolTab] = useState<'color' | 'text' | 'stickers' | 'upload' | 'ai'>('color');
  const [isLiveOrbit, setIsLiveOrbit] = useState<boolean>(false);

  // Interactive Custom Elements
  const [textElements, setTextElements] = useState<CustomTextElement[]>([
    {
      id: 'txt-default',
      text: 'BUYLY',
      font: "'Syne', sans-serif",
      color: '#FFFFFF',
      size: 48,
      x: 50,
      y: 38,
      rotation: 0,
      hasOutline: false
    }
  ]);
  const [graphicElements, setGraphicElements] = useState<CustomGraphicElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>('txt-default');

  // Input states for new / editing text
  const [currentText, setCurrentText] = useState('BUYLY');
  const [currentFont, setCurrentFont] = useState("'Syne', sans-serif");
  const [currentTextColor, setCurrentTextColor] = useState('#FFFFFF');
  const [currentTextSize, setCurrentTextSize] = useState(48);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [currentHasOutline, setCurrentHasOutline] = useState(false);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Current Base details
  const currentBaseInfo = AVAILABLE_BASES.find(b => b.type === baseType) || AVAILABLE_BASES[0];
  const printCost = (textElements.length > 0 ? 5 : 0) + (graphicElements.length * 4);
  const totalPrice = currentBaseInfo.basePrice + printCost;

  // Sync selected element to input panel
  const handleSelectElement = (id: string) => {
    setSelectedElementId(id);
    const txt = textElements.find(t => t.id === id);
    if (txt) {
      setCurrentText(txt.text);
      setCurrentFont(txt.font);
      setCurrentTextColor(txt.color);
      setCurrentTextSize(txt.size);
      setCurrentRotation(txt.rotation);
      setCurrentHasOutline(!!txt.hasOutline);
      setActiveToolTab('text');
    }
  };

  // Add new Text Element
  const handleAddText = () => {
    const newId = `txt-${Date.now()}`;
    const newElem: CustomTextElement = {
      id: newId,
      text: currentText || 'CUSTOM TEXT',
      font: currentFont,
      color: currentTextColor,
      size: currentTextSize,
      x: 50,
      y: 42,
      rotation: 0,
      hasOutline: currentHasOutline
    };
    setTextElements([...textElements, newElem]);
    setSelectedElementId(newId);
  };

  // Update existing Text Element
  const updateActiveText = (key: keyof CustomTextElement, val: unknown) => {
    if (!selectedElementId) return;
    setTextElements(prev =>
      prev.map(el => (el.id === selectedElementId ? { ...el, [key]: val } : el))
    );
  };

  // Delete active element
  const handleDeleteActive = () => {
    if (!selectedElementId) return;
    setTextElements(prev => prev.filter(el => el.id !== selectedElementId));
    setGraphicElements(prev => prev.filter(el => el.id !== selectedElementId));
    setSelectedElementId(null);
  };

  // Add sticker
  const handleAddSticker = (stickerIcon: string, name: string) => {
    const newId = `stk-${Date.now()}`;
    const newGraphic: CustomGraphicElement = {
      id: newId,
      url: stickerIcon,
      name,
      size: 40,
      x: 50,
      y: 50,
      rotation: 0,
      opacity: 1
    };
    setGraphicElements([...graphicElements, newGraphic]);
    setSelectedElementId(newId);
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const newId = `img-${Date.now()}`;
        const newGraphic: CustomGraphicElement = {
          id: newId,
          url: result,
          name: file.name,
          size: 55,
          x: 50,
          y: 46,
          rotation: 0,
          opacity: 1
        };
        setGraphicElements([...graphicElements, newGraphic]);
        setSelectedElementId(newId);
      }
    };
    reader.readAsDataURL(file);
  };

  // AI Streetwear Slogan Generator
  const handleGenerateAISlogan = () => {
    const randomSlogan = SLOGAN_SUGGESTIONS[Math.floor(Math.random() * SLOGAN_SUGGESTIONS.length)];
    setCurrentText(randomSlogan);
    if (selectedElementId) {
      updateActiveText('text', randomSlogan);
    } else {
      const newId = `txt-${Date.now()}`;
      setTextElements([
        ...textElements,
        {
          id: newId,
          text: randomSlogan,
          font: "'Syne', sans-serif",
          color: currentTextColor,
          size: 38,
          x: 50,
          y: 42,
          rotation: 0
        }
      ]);
      setSelectedElementId(newId);
    }
  };

  // Preset Placement shortcuts
  const handleSetPlacement = (preset: 'chest' | 'pocket' | 'back' | 'lower') => {
    if (!selectedElementId) return;
    if (preset === 'chest') {
      updateActiveText('x', 50);
      updateActiveText('y', 36);
      updateActiveText('size', 44);
    } else if (preset === 'pocket') {
      updateActiveText('x', 36);
      updateActiveText('y', 30);
      updateActiveText('size', 24);
    } else if (preset === 'back') {
      setView('back');
      updateActiveText('x', 50);
      updateActiveText('y', 42);
      updateActiveText('size', 56);
    } else if (preset === 'lower') {
      updateActiveText('x', 50);
      updateActiveText('y', 70);
    }
  };

  // Add to Cart
  const handleAddCustomToCart = () => {
    const customDetails: CustomDesignDetails = {
      baseProduct: baseType,
      productName: `Custom ${currentBaseInfo.label}`,
      baseColor: selectedColor,
      view,
      textElements,
      graphicElements,
      totalCustomPrice: totalPrice,
      createdAt: new Date().toLocaleTimeString()
    };

    onAddToCart(customDetails, selectedSize);

    // Confetti celebration
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-semibold">
              LABORATORY V2.6
            </span>
            <span className="text-xs font-mono text-neutral-400">REAL-TIME COLOR & TEXTILE ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display tracking-tight text-white">
            Custom Merch Studio
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Pick your base garment, adjust color in real-time, position custom text & stickers, and export high-resolution mockups.
          </p>
        </div>

        {/* Action Buttons Top */}
        <div className="flex items-center gap-3">
          <AnimatedButton
            size="sm"
            variant="outline"
            onClick={() => {
              // Export / Download design notification
              alert("Mockup design snapshot ready for high-resolution print rendering!");
            }}
          >
            <Download className="w-4 h-4" />
            <span>Download Mockup</span>
          </AnimatedButton>

          <AnimatedButton
            size="md"
            variant="glow"
            onClick={handleAddCustomToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add Custom Design (${totalPrice})</span>
          </AnimatedButton>
        </div>
      </div>

      {/* Base Garment Selector Carousel */}
      <div className="py-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 min-w-max pb-2">
          {AVAILABLE_BASES.map(b => {
            const isCurrent = b.type === baseType;
            return (
              <motion.button
                key={b.type}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setBaseType(b.type)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all border cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30'
                    : 'bg-neutral-900/80 text-neutral-300 hover:text-white border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span className="text-lg">{b.icon}</span>
                <span>{b.label}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isCurrent ? 'bg-indigo-700 text-white' : 'bg-neutral-800 text-neutral-400'}`}>
                  ${b.basePrice}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Left / Center: Live Interactive Visual Mockup Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full aspect-square max-w-[540px] bg-neutral-900/60 rounded-3xl border border-neutral-800 p-6 flex flex-col items-center justify-between shadow-2xl backdrop-blur-sm overflow-hidden">
            {/* Top Canvas Controls: View Flip & Color Indicator */}
            <div className="w-full flex items-center justify-between z-10">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950/80 border border-neutral-800 backdrop-blur-md">
                <span 
                  className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span className="text-xs font-mono font-medium text-neutral-300">
                  {selectedColor.name}
                </span>
              </div>

              {/* Front / Back Flip Button (for tshirts, hoodies, and jerseys) */}
              {(baseType === 'tshirt' || baseType === 'hoodie' || baseType === 'jersey') && (
                <div className="flex items-center p-1 rounded-xl bg-neutral-950/80 border border-neutral-800 backdrop-blur-md">
                  <button
                    onClick={() => setView('front')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      view === 'front' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Front View
                  </button>
                  <button
                    onClick={() => setView('back')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      view === 'back' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Back View
                  </button>
                </div>
              )}

              {/* 3D Animated Live Preview Toggle */}
              <button
                onClick={() => setIsLiveOrbit(!isLiveOrbit)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isLiveOrbit
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-neutral-950/80 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
                title="Toggle floating 3D animated live rotation preview"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isLiveOrbit ? 'animate-spin text-cyan-300' : ''}`} />
                <span>{isLiveOrbit ? '3D Orbit Active' : '3D Live Preview'}</span>
              </button>
            </div>

            {/* THE LIVE PREVIEW WITH REAL-TIME COLOR UPDATE & 3D ANIMATION */}
            <div className="relative w-full flex-1 flex items-center justify-center my-2">
              <ProductVisual
                baseType={baseType}
                color={selectedColor}
                view={view}
                textElements={textElements}
                graphicElements={graphicElements}
                selectedElementId={selectedElementId}
                onSelectElement={handleSelectElement}
                isAnimatedOrbit={isLiveOrbit}
                className="w-full h-full max-h-[420px]"
              />
            </div>

            {/* Bottom Canvas Controls: Size Selector & Live Zoom Notice */}
            <div className="w-full flex items-center justify-between z-10 pt-2 border-t border-neutral-800/80">
              {/* Size Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-neutral-400 mr-1">SIZE:</span>
                {['S', 'M', 'L', 'XL', '2XL'].map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'bg-white text-neutral-950 shadow-sm'
                        : 'bg-neutral-800/70 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Elements Count */}
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>{textElements.length + graphicElements.length} Layers</span>
              </div>
            </div>
          </div>

          {/* Quick Placement Bar */}
          <div className="w-full max-w-[540px] mt-4 flex items-center justify-between px-2 text-xs text-neutral-400">
            <span className="font-mono">PRESET ALIGNMENTS:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSetPlacement('chest')}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
              >
                Center Chest
              </button>
              <button
                onClick={() => handleSetPlacement('pocket')}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
              >
                Left Pocket
              </button>
              <button
                onClick={() => handleSetPlacement('back')}
                className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
              >
                Full Back
              </button>
            </div>
          </div>
        </div>

        {/* Right: Studio Customization Tools (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Tool Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-neutral-900/90 rounded-2xl border border-neutral-800 backdrop-blur-sm">
            <button
              onClick={() => setActiveToolTab('color')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeToolTab === 'color'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Base Color</span>
            </button>

            <button
              onClick={() => setActiveToolTab('text')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeToolTab === 'text'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>

            <button
              onClick={() => setActiveToolTab('stickers')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeToolTab === 'stickers'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <StickerIcon className="w-3.5 h-3.5" />
              <span>Badges</span>
            </button>

            <button
              onClick={() => setActiveToolTab('upload')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeToolTab === 'upload'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>

            <button
              onClick={() => setActiveToolTab('ai')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeToolTab === 'ai'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-indigo-400 hover:text-indigo-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Slogan</span>
            </button>
          </div>

          {/* Active Tool Content Box */}
          <div className="bg-neutral-900/60 rounded-3xl border border-neutral-800 p-6 flex flex-col gap-6 backdrop-blur-sm">
            {/* 1. COLOR TAB */}
            {activeToolTab === 'color' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Garment Dye Color</h3>
                    <p className="text-xs text-neutral-400">Selecting any color changes the mock preview in real-time.</p>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
                    {selectedColor.name}
                  </span>
                </div>

                {/* 10 Workable Color Swatches */}
                <div className="grid grid-cols-5 gap-3 pt-2">
                  {STUDIO_COLORS.map(c => {
                    const isSelected = selectedColor.hex === c.hex;
                    return (
                      <motion.button
                        key={c.hex}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedColor(c)}
                        className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30'
                            : 'border-neutral-800 hover:border-neutral-700 bg-neutral-950/40'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full shadow-inner border border-white/20 flex items-center justify-center transition-transform"
                          style={{ backgroundColor: c.hex }}
                        >
                          {isSelected && (
                            <Check className={`w-4 h-4 ${c.hex === '#F8FAFC' || c.hex === '#D6C7A1' ? 'text-neutral-950' : 'text-white'}`} />
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-neutral-400 group-hover:text-white truncate max-w-[54px] text-center">
                          {c.name.split(' ')[0]}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. TEXT TAB */}
            {activeToolTab === 'text' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white font-display">Typography Layer</h3>
                  {selectedElementId && (
                    <button
                      onClick={handleDeleteActive}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* Text String Input */}
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">ENTER TEXT CONTENT</label>
                  <input
                    type="text"
                    value={currentText}
                    onChange={(e) => {
                      setCurrentText(e.target.value);
                      updateActiveText('text', e.target.value);
                    }}
                    placeholder="Enter custom slogan or name..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:border-indigo-500 focus:outline-none transition-colors"
                  />
                </div>

                {/* Font Family Selector */}
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">FONT STYLE</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TEXT_FONTS.map(f => (
                      <button
                        key={f.name}
                        onClick={() => {
                          setCurrentFont(f.value);
                          updateActiveText('font', f.value);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                          currentFont === f.value
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                        }`}
                        style={{ fontFamily: f.value }}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Color Picker */}
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1.5">TEXT COLOR</label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {TEXT_PALETTE.map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setCurrentTextColor(c);
                          updateActiveText('color', c);
                        }}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                          currentTextColor === c ? 'border-indigo-400 scale-110' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Size & Position Sliders */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
                      <span>SIZE</span>
                      <span>{currentTextSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="90"
                      value={currentTextSize}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCurrentTextSize(val);
                        updateActiveText('size', val);
                      }}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
                      <span>ROTATION</span>
                      <span>{currentRotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      value={currentRotation}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCurrentRotation(val);
                        updateActiveText('rotation', val);
                      }}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Position Nudge Controls */}
                <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
                  <span className="text-xs font-mono text-neutral-400">MOVE POSITION</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        const txt = textElements.find(t => t.id === selectedElementId);
                        if (txt) updateActiveText('y', Math.max(10, txt.y - 4));
                      }}
                      className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => {
                        const txt = textElements.find(t => t.id === selectedElementId);
                        if (txt) updateActiveText('y', Math.min(90, txt.y + 4));
                      }}
                      className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => {
                        const txt = textElements.find(t => t.id === selectedElementId);
                        if (txt) updateActiveText('x', Math.max(10, txt.x - 4));
                      }}
                      className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() => {
                        const txt = textElements.find(t => t.id === selectedElementId);
                        if (txt) updateActiveText('x', Math.min(90, txt.x + 4));
                      }}
                      className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                <AnimatedButton
                  size="sm"
                  variant="secondary"
                  onClick={handleAddText}
                  className="mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Text Element</span>
                </AnimatedButton>
              </div>
            )}

            {/* 3. STICKERS / BADGES TAB */}
            {activeToolTab === 'stickers' && (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Streetwear Graphics & Badges</h3>
                  <p className="text-xs text-neutral-400">Click any badge to stamp it onto the garment mockup.</p>
                </div>

                <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
                  {STICKER_LIBRARY.map(stk => (
                    <motion.button
                      key={stk.id}
                      whileHover={{ scale: 1.12, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddSticker(stk.icon, stk.name)}
                      className="flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-indigo-500/50 hover:bg-neutral-800/40 transition-all cursor-pointer group"
                    >
                      <span className="text-3xl mb-1 filter drop-shadow-md group-hover:scale-110 transition-transform">
                        {stk.icon}
                      </span>
                      <span className="text-[10px] text-neutral-400 group-hover:text-white truncate max-w-full">
                        {stk.name}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. UPLOAD TAB */}
            {activeToolTab === 'upload' && (
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-base font-bold text-white font-display">Upload Custom Artwork</h3>
                  <p className="text-xs text-neutral-400">Upload your brand logo, illustration, or photo (PNG, SVG, JPG supported).</p>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-700 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-neutral-950/40 hover:bg-neutral-900/60 transition-colors group"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-white">Click or drag & drop artwork here</span>
                  <span className="text-xs text-neutral-400 mt-1">High-res PNG with transparent background recommended</span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* 5. AI SLOGAN GENERATOR */}
            {activeToolTab === 'ai' && (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-base font-bold text-white font-display">AI Streetwear Concept Engine</h3>
                  </div>
                  <p className="text-xs text-neutral-400">Generate avant-garde cyberpunk, Tokyo techwear, or minimalist slogans automatically.</p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 flex flex-col gap-3">
                  <span className="text-xs font-mono text-indigo-300">INSTANT SLOGAN IDEAS</span>
                  <div className="flex flex-wrap gap-2">
                    {SLOGAN_SUGGESTIONS.slice(0, 6).map((slog, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentText(slog);
                          if (selectedElementId) updateActiveText('text', slog);
                          else handleAddText();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-neutral-900/80 hover:bg-indigo-600 border border-neutral-700 hover:border-indigo-400 text-xs font-semibold text-neutral-200 hover:text-white transition-colors cursor-pointer"
                      >
                        {slog}
                      </button>
                    ))}
                  </div>

                  <AnimatedButton
                    size="sm"
                    variant="glow"
                    onClick={handleGenerateAISlogan}
                    className="mt-2 w-full"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>Roll Random Streetwear Slogan</span>
                  </AnimatedButton>
                </div>
              </div>
            )}
          </div>

          {/* Pricing Breakdown & Checkout Card */}
          <div className="p-5 rounded-3xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-neutral-400 block">TOTAL ESTIMATE</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white font-display">${totalPrice}</span>
                <span className="text-xs text-neutral-400">
                  Base (${currentBaseInfo.basePrice}) + Print (${printCost})
                </span>
              </div>
            </div>

            <AnimatedButton
              size="md"
              variant="glow"
              onClick={handleAddCustomToCart}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </AnimatedButton>
          </div>
        </div>
      </div>
    </div>
  );
};
