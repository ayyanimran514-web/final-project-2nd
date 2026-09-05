import React from 'react';
import { motion } from 'motion/react';
import { ProductBaseType, ProductColor, CustomTextElement, CustomGraphicElement } from '../types';

interface ProductVisualProps {
  baseType: ProductBaseType;
  color: ProductColor | { name: string; hex: string };
  view?: 'front' | 'back';
  textElements?: CustomTextElement[];
  graphicElements?: CustomGraphicElement[];
  className?: string;
  isInteractive3D?: boolean;
  isAnimatedOrbit?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  baseType,
  color,
  view = 'front',
  textElements = [],
  graphicElements = [],
  className = 'w-full h-full',
  isAnimatedOrbit = false,
  selectedElementId,
  onSelectElement
}) => {
  const hex = color.hex || '#18181B';

  // Calculate luminance to decide contrast for details/stitch accents
  const getLuminance = (hexCode: string) => {
    const c = hexCode.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  };

  const isLightColor = getLuminance(hex) > 0.65;
  const isVeryDark = getLuminance(hex) < 0.15;

  // Stitch and crease shadow colors based on base tone
  const creaseColor = isLightColor ? 'rgba(0, 0, 0, 0.22)' : 'rgba(0, 0, 0, 0.45)';
  const highlightColor = isLightColor ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.2)';
  const seamColor = isLightColor ? 'rgba(0, 0, 0, 0.18)' : 'rgba(255, 255, 255, 0.15)';

  return (
    <div className={`relative flex items-center justify-center select-none overflow-hidden ${className}`}>
      {/* Dynamic Background Studio Glow corresponding to selected color */}
      <div
        className="absolute inset-0 opacity-25 blur-2xl transition-colors duration-500 rounded-full"
        style={{
          background: `radial-gradient(circle, ${hex} 0%, transparent 70%)`
        }}
      />

      {/* Turntable Floor Glow when Animated Orbit Mode is Active */}
      {isAnimatedOrbit && (
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.35, 0.65, 0.35]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute bottom-3 w-52 h-10 rounded-full border border-indigo-500/50 bg-indigo-500/20 blur-[2px] pointer-events-none"
        />
      )}

      <motion.div
        animate={isAnimatedOrbit ? {
          y: [0, -8, 0, 8, 0],
          rotateY: [0, 10, 0, -10, 0],
          rotateZ: [0, 1, 0, -1, 0]
        } : undefined}
        transition={isAnimatedOrbit ? {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut'
        } : undefined}
        className="w-full h-full flex items-center justify-center"
        style={isAnimatedOrbit ? { perspective: 1000 } : undefined}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full max-h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.35)] transition-all duration-300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
        <defs>
          {/* Shading Gradients for realistic 3D depth */}
          <linearGradient id={`grad-shading-${baseType}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={highlightColor} />
            <stop offset="50%" stopColor="transparent" />
            <stop offset="100%" stopColor={creaseColor} />
          </linearGradient>

          <linearGradient id="body-depth" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="40%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
          </linearGradient>

          <radialGradient id="cylinder-light" cx="45%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="70%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
          </radialGradient>

          {/* Curved path for text */}
          <path id="curve-path" d="M 120 220 Q 250 170 380 220" fill="transparent" />
          <path id="curve-path-back" d="M 100 200 Q 250 150 400 200" fill="transparent" />

          {/* RGB Neon Perimeter Gradient for Gaming Gear */}
          <linearGradient id="rgb-neon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="25%" stopColor="#EC4899" />
            <stop offset="50%" stopColor="#EF4444" />
            <stop offset="75%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>

        {/* ================================================================= */}
        {/* T-SHIRT MOCKUP (FRONT & BACK) */}
        {/* ================================================================= */}
        {baseType === 'tshirt' && (
          <g className="transition-all duration-400 ease-out">
            {/* Base Silhouette */}
            {view === 'front' ? (
              <>
                {/* Left sleeve */}
                <path
                  d="M 155 105 L 60 185 L 105 240 L 165 195 Z"
                  fill={hex}
                  stroke={seamColor}
                  strokeWidth="1.5"
                />
                {/* Right sleeve */}
                <path
                  d="M 345 105 L 440 185 L 395 240 L 335 195 Z"
                  fill={hex}
                  stroke={seamColor}
                  strokeWidth="1.5"
                />
                {/* Main Body */}
                <path
                  d="M 155 105 Q 210 115 250 145 Q 290 115 345 105 L 340 200 L 345 425 Q 250 435 155 425 L 160 200 Z"
                  fill={hex}
                />
                {/* Sleeve shadow creases */}
                <path d="M 155 105 L 165 200" stroke={creaseColor} strokeWidth="3" />
                <path d="M 345 105 L 335 200" stroke={creaseColor} strokeWidth="3" />

                {/* Collar Ribbing */}
                <path
                  d="M 205 110 Q 250 150 295 110 Q 250 120 205 110"
                  fill={isVeryDark ? '#262626' : hex}
                  stroke={seamColor}
                  strokeWidth="2"
                />
                <path
                  d="M 215 110 Q 250 140 285 110"
                  stroke={isLightColor ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="1.5"
                  strokeDasharray="3 2"
                />
                {/* BUYLY woven label inside neck */}
                <rect x="238" y="102" width="24" height="12" rx="2" fill="#111" />
                <text x="250" y="110" fill="#fff" fontSize="6" fontWeight="bold" textAnchor="middle">BUYLY</text>
              </>
            ) : (
              /* Back View */
              <>
                {/* Left sleeve back */}
                <path
                  d="M 155 105 L 60 185 L 105 240 L 165 195 Z"
                  fill={hex}
                  stroke={seamColor}
                  strokeWidth="1.5"
                />
                {/* Right sleeve back */}
                <path
                  d="M 345 105 L 440 185 L 395 240 L 335 195 Z"
                  fill={hex}
                  stroke={seamColor}
                  strokeWidth="1.5"
                />
                {/* Main Body Back */}
                <path
                  d="M 155 105 Q 250 110 345 105 L 340 200 L 345 425 Q 250 435 155 425 L 160 200 Z"
                  fill={hex}
                />
                {/* High back collar */}
                <path
                  d="M 205 105 Q 250 115 295 105"
                  stroke={seamColor}
                  strokeWidth="3"
                />
                {/* Subtle spine seam fold */}
                <path
                  d="M 250 115 L 250 425"
                  stroke={creaseColor}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
              </>
            )}

            {/* Natural Fabric Texture & Folds Overlay */}
            <g opacity="0.35" style={{ mixBlendMode: 'multiply' }}>
              {/* Armpit drape folds */}
              <path d="M 160 200 Q 185 240 175 280" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 340 200 Q 315 240 325 280" stroke="#000" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 165 290 Q 195 320 180 370" stroke="#000" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <path d="M 335 290 Q 305 320 320 370" stroke="#000" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              {/* Bottom hemline double stitch */}
              <path d="M 160 415 Q 250 425 340 415" stroke="#000" strokeWidth="1" strokeDasharray="3 2" />
              <path d="M 160 418 Q 250 428 340 418" stroke="#000" strokeWidth="1" strokeDasharray="3 2" />
            </g>

            {/* Depth highlight sheen */}
            <path
              d="M 170 120 Q 250 130 330 120 L 330 380 Q 250 390 170 380 Z"
              fill="url(#body-depth)"
              opacity="0.6"
              style={{ mixBlendMode: 'overlay' }}
            />
          </g>
        )}

        {/* ================================================================= */}
        {/* HOODIE MOCKUP */}
        {/* ================================================================= */}
        {baseType === 'hoodie' && (
          <g className="transition-all duration-400 ease-out">
            {/* Sleeves */}
            <path d="M 150 120 L 50 240 L 95 280 L 165 210 Z" fill={hex} stroke={seamColor} strokeWidth="1.5" />
            <path d="M 350 120 L 450 240 L 405 280 L 335 210 Z" fill={hex} stroke={seamColor} strokeWidth="1.5" />
            {/* Ribbed wrist cuffs */}
            <path d="M 50 240 L 95 280 L 80 300 L 35 260 Z" fill={isVeryDark ? '#262626' : hex} stroke={seamColor} strokeWidth="1" />
            <path d="M 450 240 L 405 280 L 420 300 L 465 260 Z" fill={isVeryDark ? '#262626' : hex} stroke={seamColor} strokeWidth="1" />
            {/* Torso */}
            <path d="M 150 120 L 350 120 L 340 415 L 160 415 Z" fill={hex} />
            {/* Ribbed Bottom Waistband */}
            <rect x="156" y="415" width="188" height="24" rx="4" fill={isVeryDark ? '#262626' : hex} stroke={seamColor} strokeWidth="1" />
            
            {view === 'front' ? (
              <>
                {/* Heavy Double Lined Hood */}
                <path
                  d="M 155 120 Q 140 30 250 30 Q 360 30 345 120 Q 295 80 250 155 Q 205 80 155 120 Z"
                  fill={hex}
                  stroke={seamColor}
                  strokeWidth="2"
                />
                <path d="M 215 90 Q 250 135 285 90" stroke={creaseColor} strokeWidth="2.5" />
                {/* Drawstrings */}
                <path d="M 228 115 Q 225 180 220 210" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                <circle cx="220" cy="212" r="3" fill="#94A3B8" />
                <path d="M 272 115 Q 275 180 280 210" stroke="#E2E8F0" strokeWidth="3" strokeLinecap="round" />
                <circle cx="280" cy="212" r="3" fill="#94A3B8" />
                {/* Kangaroo Pocket */}
                <path
                  d="M 180 300 L 320 300 L 335 390 L 165 390 Z"
                  fill={hex}
                  stroke={seamColor}
                  strokeWidth="2"
                />
                <path d="M 180 300 L 165 390" stroke={creaseColor} strokeWidth="2" />
                <path d="M 320 300 L 335 390" stroke={creaseColor} strokeWidth="2" />
              </>
            ) : (
              /* Back View */
              <>
                {/* Folded back hood */}
                <path
                  d="M 160 110 Q 250 40 340 110 Q 250 190 160 110 Z"
                  fill={hex}
                  stroke={seamColor}
                  strokeWidth="2"
                />
                <path d="M 200 110 Q 250 160 300 110" stroke={creaseColor} strokeWidth="3" />
              </>
            )}
            {/* Shading */}
            <path d="M 160 120 L 340 120 L 340 415 L 160 415 Z" fill="url(#body-depth)" opacity="0.4" style={{ mixBlendMode: 'multiply' }} />
          </g>
        )}

        {/* ================================================================= */}
        {/* CERAMIC MUG MOCKUP */}
        {/* ================================================================= */}
        {baseType === 'mug' && (
          <g className="transition-all duration-400 ease-out">
            {/* Mug Handle */}
            <path
              d="M 330 180 C 420 180 430 320 330 330 C 310 330 310 295 330 295 C 385 295 385 215 330 215 Z"
              fill={hex}
              stroke={seamColor}
              strokeWidth="2"
            />
            {/* Mug Body Cylinder */}
            <rect x="140" y="130" width="200" height="230" rx="16" fill={hex} />
            {/* Interior top ellipse */}
            <ellipse cx="240" cy="130" rx="100" ry="24" fill={isVeryDark ? '#333' : '#F8FAFC'} stroke={seamColor} strokeWidth="2" />
            <ellipse cx="240" cy="132" rx="90" ry="18" fill="#451A03" opacity="0.85" /> {/* Coffee surface */}
            {/* Cylinder 3D Lighting Sheen */}
            <rect x="140" y="130" width="200" height="230" rx="16" fill="url(#cylinder-light)" opacity="0.65" />
            {/* Base drop shadow */}
            <ellipse cx="240" cy="365" rx="105" ry="14" fill="rgba(0,0,0,0.3)" />
          </g>
        )}

        {/* ================================================================= */}
        {/* SNAPBACK CAP MOCKUP */}
        {/* ================================================================= */}
        {baseType === 'cap' && (
          <g className="transition-all duration-400 ease-out">
            {/* Flat Brim/Visor */}
            <path
              d="M 100 310 Q 250 380 400 310 Q 370 270 250 280 Q 130 270 100 310 Z"
              fill={hex}
              stroke={seamColor}
              strokeWidth="2"
            />
            {/* Visor Stitch rows */}
            <path d="M 120 310 Q 250 365 380 310" stroke={highlightColor} strokeWidth="1.5" strokeDasharray="3 2" />
            <path d="M 135 305 Q 250 350 365 305" stroke={highlightColor} strokeWidth="1.5" strokeDasharray="3 2" />
            {/* Crown Dome (6-Panel) */}
            <path
              d="M 125 285 Q 120 140 250 130 Q 380 140 375 285 Q 250 280 125 285 Z"
              fill={hex}
              stroke={seamColor}
              strokeWidth="2"
            />
            {/* Center Panel Seam */}
            <path d="M 250 130 Q 250 200 250 280" stroke={creaseColor} strokeWidth="2.5" />
            <path d="M 250 130 Q 190 200 160 285" stroke={creaseColor} strokeWidth="1.5" />
            <path d="M 250 130 Q 310 200 340 285" stroke={creaseColor} strokeWidth="1.5" />
            {/* Top Squatchee Button */}
            <ellipse cx="250" cy="130" rx="12" ry="6" fill={isVeryDark ? '#333' : hex} stroke={seamColor} strokeWidth="1.5" />
            {/* Eyelet vents */}
            <circle cx="210" cy="200" r="4" fill="#000" stroke={seamColor} strokeWidth="1" />
            <circle cx="290" cy="200" r="4" fill="#000" stroke={seamColor} strokeWidth="1" />
            {/* Dynamic Dome Light overlay */}
            <path d="M 130 285 Q 125 145 250 135 Q 375 145 370 285 Z" fill="url(#cylinder-light)" opacity="0.45" />
          </g>
        )}

        {/* ================================================================= */}
        {/* PHONE CASE MOCKUP */}
        {/* ================================================================= */}
        {baseType === 'phonecase' && (
          <g className="transition-all duration-400 ease-out">
            {/* Case Chassis */}
            <rect x="150" y="80" width="200" height="340" rx="36" fill={hex} stroke={seamColor} strokeWidth="2" />
            {/* Outer TPU Protective Bumper Edge */}
            <rect x="146" y="76" width="208" height="348" rx="40" stroke="rgba(0,0,0,0.5)" strokeWidth="4" />
            {/* MagSafe Ring */}
            <circle cx="250" cy="250" r="50" stroke={highlightColor} strokeWidth="4" strokeDasharray="6 4" opacity="0.5" />
            <line x1="250" y1="305" x2="250" y2="335" stroke={highlightColor} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
            {/* Camera Island Matrix */}
            <rect x="168" y="100" width="76" height="76" rx="18" fill="#0A0A0A" stroke="#333" strokeWidth="2" />
            {/* 3 Camera Lenses */}
            <circle cx="188" cy="120" r="13" fill="#171717" stroke="#444" strokeWidth="2" />
            <circle cx="188" cy="120" r="6" fill="#0284C7" opacity="0.8" />
            <circle cx="188" cy="156" r="13" fill="#171717" stroke="#444" strokeWidth="2" />
            <circle cx="188" cy="156" r="6" fill="#0284C7" opacity="0.8" />
            <circle cx="224" cy="138" r="13" fill="#171717" stroke="#444" strokeWidth="2" />
            <circle cx="224" cy="138" r="6" fill="#0284C7" opacity="0.8" />
            {/* Flash & LiDAR */}
            <circle cx="224" cy="114" r="5" fill="#FEF08A" />
            <circle cx="224" cy="162" r="3.5" fill="#1E293B" />
            {/* Matte Reflection */}
            <rect x="150" y="80" width="200" height="340" rx="36" fill="url(#cylinder-light)" opacity="0.3" />
          </g>
        )}

        {/* ================================================================= */}
        {/* TOTE BAG MOCKUP */}
        {/* ================================================================= */}
        {baseType === 'totebag' && (
          <g className="transition-all duration-400 ease-out">
            {/* Long Shoulder Straps */}
            <path d="M 195 200 L 195 60 Q 250 40 305 60 L 305 200" stroke={hex} strokeWidth="18" strokeLinecap="round" />
            <path d="M 195 200 L 195 60 Q 250 40 305 60 L 305 200" stroke="rgba(0,0,0,0.15)" strokeWidth="18" strokeLinecap="round" />
            <path d="M 195 190 L 195 160" stroke="#000" strokeWidth="2" strokeDasharray="3 2" />
            <path d="M 305 190 L 305 160" stroke="#000" strokeWidth="2" strokeDasharray="3 2" />
            {/* Bag Main Body */}
            <path d="M 140 180 L 360 180 L 345 420 Q 250 430 155 420 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            {/* Canvas Texture Folds */}
            <path d="M 140 180 Q 250 188 360 180" stroke={creaseColor} strokeWidth="2.5" />
            <path d="M 160 210 Q 185 300 175 410" stroke={creaseColor} strokeWidth="2" opacity="0.5" />
            <path d="M 340 210 Q 315 300 325 410" stroke={creaseColor} strokeWidth="2" opacity="0.5" />
            {/* Depth shading */}
            <path d="M 140 180 L 360 180 L 345 420 Q 250 430 155 420 Z" fill="url(#body-depth)" opacity="0.45" />
          </g>
        )}

        {/* ================================================================= */}
        {/* WATER BOTTLE / FLASK MOCKUP */}
        {baseType === 'bottle' && (
          <g className="transition-all duration-400 ease-out">
            {/* Cap and Carry Loop */}
            <path d="M 230 70 L 270 70 L 270 100 L 230 100 Z" fill="#262626" stroke="#444" strokeWidth="1.5" />
            <path d="M 270 85 C 310 85 310 130 270 130" stroke="#262626" strokeWidth="8" strokeLinecap="round" />
            {/* Bottle Shoulder & Cylinder Body */}
            <path d="M 215 100 L 285 100 L 315 140 L 315 420 Q 250 430 185 420 L 185 140 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            {/* Metallic Curved Highlights */}
            <rect x="185" y="140" width="130" height="280" fill="url(#cylinder-light)" opacity="0.75" />
            <line x1="205" y1="140" x2="205" y2="420" stroke={highlightColor} strokeWidth="6" opacity="0.6" />
          </g>
        )}

        {/* ================================================================= */}
        {/* BOMBER JACKET */}
        {baseType === 'jacket' && (
          <g className="transition-all duration-400 ease-out">
            {/* Sleeves */}
            <path d="M 145 120 L 45 230 L 85 270 L 165 200 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 355 120 L 455 230 L 415 270 L 335 200 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            {/* Main Torso */}
            <path d="M 145 120 L 355 120 L 340 405 L 160 405 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            {/* Orange Quilted Lining Accent at collar */}
            <path d="M 215 120 L 250 165 L 285 120" fill="#EA580C" />
            {/* Heavy Center Gunmetal Zipper */}
            <line x1="250" y1="120" x2="250" y2="405" stroke="#94A3B8" strokeWidth="3.5" strokeDasharray="3 1" />
            {/* Left Arm Utility Flight Pocket */}
            <rect x="65" y="210" width="25" height="35" rx="3" fill="#0F172A" stroke="#333" strokeWidth="1.5" />
            <rect x="68" y="245" width="6" height="24" rx="1" fill="#DC2626" /> {/* Red Remove Before Flight tag */}
            {/* Ribbed Bottom Band */}
            <rect x="156" y="405" width="188" height="24" rx="3" fill="#18181B" stroke={seamColor} strokeWidth="1" />
            <path d="M 145 120 L 355 120 L 340 405 L 160 405 Z" fill="url(#cylinder-light)" opacity="0.4" />
          </g>
        )}

        {/* SHORTS */}
        {baseType === 'shorts' && (
          <g className="transition-all duration-400 ease-out">
            <rect x="140" y="110" width="220" height="35" rx="6" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 140 145 L 115 360 L 235 360 L 250 230 L 265 360 L 385 360 L 360 145 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 250 145 L 250 230" stroke={creaseColor} strokeWidth="2" />
            {/* Drawstrings */}
            <line x1="240" y1="130" x2="235" y2="180" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="round" />
            <line x1="260" y1="130" x2="265" y2="180" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}

        {/* BUCKET HAT */}
        {baseType === 'bucket_hat' && (
          <g className="transition-all duration-400 ease-out">
            <path d="M 90 310 Q 250 350 410 310 L 370 260 Q 250 280 130 260 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 155 265 L 175 160 Q 250 140 325 160 L 345 265 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <ellipse cx="250" cy="160" rx="75" ry="18" fill={hex} stroke={seamColor} strokeWidth="2" />
          </g>
        )}

        {/* CARGO FLIGHT PANTS */}
        {baseType === 'pants' && (
          <g className="transition-all duration-400 ease-out">
            <path
              d="M 160 110 L 340 110 L 375 250 L 345 425 L 265 425 L 250 220 L 235 425 L 155 425 L 125 250 Z"
              fill={hex}
              stroke={seamColor}
              strokeWidth="2"
            />
            {/* Waistband and drawstrings */}
            <rect x="155" y="105" width="190" height="20" rx="4" fill={hex} stroke={seamColor} strokeWidth="1.5" />
            <path d="M 245 125 L 240 170 M 255 125 L 260 170" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
            {/* 3D Articulated Knee Darts */}
            <path d="M 140 280 L 195 285 M 140 300 L 195 305" stroke={seamColor} strokeWidth="2" strokeDasharray="3 2" />
            <path d="M 305 285 L 360 280 M 305 305 L 360 300" stroke={seamColor} strokeWidth="2" strokeDasharray="3 2" />
            {/* Cargo Flap Pockets */}
            <rect x="125" y="210" width="45" height="60" rx="6" fill={hex} stroke={seamColor} strokeWidth="1.5" />
            <path d="M 125 210 L 170 210 L 165 225 L 125 225 Z" fill={highlightColor} stroke={seamColor} strokeWidth="1" />
            <rect x="330" y="210" width="45" height="60" rx="6" fill={hex} stroke={seamColor} strokeWidth="1.5" />
            <path d="M 330 210 L 375 210 L 375 225 L 335 225 Z" fill={highlightColor} stroke={seamColor} strokeWidth="1" />
            {/* Ankle Cinch Cords */}
            <rect x="150" y="418" width="120" height="8" rx="2" fill={seamColor} opacity="0.3" />
            <rect x="230" y="418" width="120" height="8" rx="2" fill={seamColor} opacity="0.3" />
            <path d="M 160 110 L 340 110 L 375 250 L 345 425 L 265 425 L 250 220 L 235 425 L 155 425 L 125 250 Z" fill="url(#body-depth)" opacity="0.45" />
          </g>
        )}

        {/* ACID WASH CREWNECK */}
        {baseType === 'crewneck' && (
          <g className="transition-all duration-400 ease-out">
            <path d="M 140 110 L 35 200 L 70 260 L 140 210 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 360 110 L 465 200 L 430 260 L 360 210 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <polygon points="35,200 70,260 55,270 20,210" fill={hex} stroke={seamColor} strokeWidth="1.5" />
            <polygon points="465,200 430,260 445,270 480,210" fill={hex} stroke={seamColor} strokeWidth="1.5" />
            <path d="M 140 110 Q 250 125 360 110 L 370 380 L 130 380 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 230 132 L 250 162 L 270 132" fill="none" stroke={seamColor} strokeWidth="2.5" />
            <path d="M 195 110 Q 250 145 305 110 Q 250 85 195 110 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <rect x="130" y="380" width="240" height="28" rx="4" fill={hex} stroke={seamColor} strokeWidth="2" />
            <line x1="130" y1="380" x2="370" y2="380" stroke={seamColor} strokeWidth="2" />
            <path d="M 140 110 Q 250 125 360 110 L 370 380 L 130 380 Z" fill="url(#body-depth)" opacity="0.35" />
          </g>
        )}

        {/* CYBER SLING CROSSBODY */}
        {baseType === 'slingbag' && (
          <g className="transition-all duration-400 ease-out">
            <path d="M 50 60 L 450 440 L 420 460 L 20 80 Z" fill="#18181B" stroke="#374151" strokeWidth="2" />
            <rect x="130" y="180" width="240" height="150" rx="24" fill={hex} stroke={seamColor} strokeWidth="2.5" />
            <line x1="160" y1="230" x2="340" y2="230" stroke="#000000" strokeWidth="4" strokeLinecap="round" />
            <line x1="160" y1="230" x2="340" y2="230" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
            <rect x="225" y="270" width="50" height="28" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="250" cy="284" r="5" fill="#EF4444" />
            <rect x="130" y="180" width="240" height="150" rx="24" fill="url(#cylinder-light)" opacity="0.35" />
          </g>
        )}

        {/* REFLECTIVE WINDBREAKER */}
        {baseType === 'windbreaker' && (
          <g className="transition-all duration-400 ease-out">
            <path d="M 130 115 L 30 200 L 75 255 L 140 200 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 370 115 L 470 200 L 425 255 L 360 200 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 130 115 Q 250 120 370 115 L 385 410 L 115 410 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 175 110 Q 250 40 325 110" fill={hex} stroke={seamColor} strokeWidth="2" />
            <line x1="250" y1="115" x2="250" y2="410" stroke="#000000" strokeWidth="4" />
            <line x1="250" y1="115" x2="250" y2="410" stroke="#E2E8F0" strokeWidth="1.5" strokeDasharray="4 2" />
            <path d="M 140 210 L 250 260 L 360 210" stroke="rgba(255,255,255,0.7)" strokeWidth="3" fill="none" strokeDasharray="6 3" />
            <path d="M 130 115 Q 250 120 370 115 L 385 410 L 115 410 Z" fill="url(#body-depth)" opacity="0.3" />
          </g>
        )}

        {/* DUFFLE & SLEEVE */}
        {(baseType === 'duffle' || baseType === 'sleeve') && (
          <g className="transition-all duration-400 ease-out">
            <rect x="120" y="140" width="260" height="210" rx="20" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 120 180 L 380 180" stroke={seamColor} strokeWidth="2" strokeDasharray="4 3" />
            <rect x="120" y="140" width="260" height="210" rx="20" fill="url(#cylinder-light)" opacity="0.4" />
          </g>
        )}

        {/* ================================================================= */}
        {/* GAMING GEAR 1: APEX-X SPEED-WEAVE GAMING DESKMAT (900x400) */}
        {/* ================================================================= */}
        {baseType === 'deskmat' && (
          <g className="transition-all duration-400 ease-out">
            {/* Ambient deskmat drop shadow */}
            <rect x="35" y="165" width="430" height="210" rx="22" fill="rgba(0,0,0,0.5)" filter="blur(6px)" />
            {/* Glowing RGB Edge Piping */}
            <rect x="42" y="146" width="416" height="208" rx="20" fill="none" stroke="url(#rgb-neon)" strokeWidth="4" />
            {/* Rubber anti-slip underlay border */}
            <rect x="46" y="150" width="408" height="200" rx="16" fill="#09090B" stroke="#27272A" strokeWidth="1.5" />
            {/* Micro-weave cordura surface */}
            <rect x="48" y="152" width="404" height="196" rx="14" fill={hex} />
            {/* Micro-weave cloth cross-hatch texture */}
            <rect x="48" y="152" width="404" height="196" rx="14" fill="url(#cylinder-light)" opacity="0.25" />
            {/* Anti-fray 360° perimeter stitching */}
            <rect x="52" y="156" width="396" height="188" rx="12" fill="none" stroke={highlightColor} strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
            {/* Esports Clan Brand Badge tag bottom-right */}
            <rect x="380" y="318" width="55" height="18" rx="4" fill="#000000" stroke="#3F3F46" strokeWidth="1" />
            <text x="407" y="330" textAnchor="middle" fill="#A1A1AA" fontSize="7" fontWeight="bold" fontFamily="monospace">
              900×400
            </text>
          </g>
        )}

        {/* ================================================================= */}
        {/* GAMING GEAR 2: PRO CIRCUIT ESPORTS DRY-FIT JERSEY */}
        {/* ================================================================= */}
        {baseType === 'jersey' && (
          <g className="transition-all duration-400 ease-out">
            {/* Left & Right Athletic Raglan Sleeves with Team Speed Stripes */}
            <path d="M 140 100 L 40 190 L 80 250 L 150 190 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 55 180 L 70 240" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
            <path d="M 360 100 L 460 190 L 420 250 L 350 190 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            <path d="M 445 180 L 430 240" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
            {/* Torso Aero-Mesh Body */}
            <path d="M 140 100 Q 250 115 360 100 L 375 390 Q 250 405 125 390 Z" fill={hex} stroke={seamColor} strokeWidth="2" />
            {/* Breathable Honeycomb Side Mesh Ventilation Panels */}
            <path d="M 145 190 L 125 390 L 160 390 L 175 190 Z" fill="#09090B" opacity="0.6" stroke={seamColor} strokeWidth="1" />
            <path d="M 355 190 L 375 390 L 340 390 L 325 190 Z" fill="#09090B" opacity="0.6" stroke={seamColor} strokeWidth="1" />
            {/* Modern V-Neck Athletic Collar */}
            <polygon points="210,100 250,150 290,100" fill="#09090B" stroke="#06B6D4" strokeWidth="2" />
            <polygon points="225,100 250,135 275,100" fill={hex} />
            {/* Back View: Player Name & Number Plate */}
            {view === 'back' && (
              <g>
                <text x="250" y="210" fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.1em">
                  PLAYER 01
                </text>
                <text x="250" y="310" fill="#FFFFFF" fontSize="72" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                  99
                </text>
              </g>
            )}
            {/* Aerodynamic body depth */}
            <path d="M 140 100 Q 250 115 360 100 L 375 390 Q 250 405 125 390 Z" fill="url(#body-depth)" opacity="0.4" />
          </g>
        )}

        {/* ================================================================= */}
        {/* GAMING GEAR 3: PRO GAMING CONTROLLER SKIN & SHELL */}
        {/* ================================================================= */}
        {baseType === 'controller' && (
          <g className="transition-all duration-400 ease-out">
            {/* Drop Shadow */}
            <ellipse cx="250" cy="390" rx="150" ry="25" fill="rgba(0,0,0,0.4)" filter="blur(4px)" />
            {/* Controller Outer Body Chassis */}
            <path
              d="M 120 180 C 135 140 190 145 250 150 C 310 145 365 140 380 180 C 400 225 435 345 385 375 C 345 398 310 330 285 295 C 270 275 230 275 215 295 C 190 330 155 398 115 375 C 65 345 100 225 120 180 Z"
              fill={hex}
              stroke={seamColor}
              strokeWidth="2.5"
            />
            {/* Textured Ergonomic Diamond Palm Grip Inlays */}
            <path d="M 95 240 C 90 280 105 340 130 360 C 145 340 140 280 125 240 Z" fill="#18181B" opacity="0.75" />
            <path d="M 405 240 C 410 280 395 340 370 360 C 355 340 360 280 375 240 Z" fill="#18181B" opacity="0.75" />
            {/* Center LED Lightbar / Touchpad */}
            <rect x="200" y="160" width="100" height="50" rx="8" fill="#18181B" stroke="#333" strokeWidth="1.5" />
            <rect x="208" y="165" width="84" height="6" rx="3" fill="#06B6D4" filter="drop-shadow(0 0 4px #06B6D4)" />
            {/* D-Pad (Left) */}
            <g transform="translate(145, 205)">
              <rect x="18" y="0" width="14" height="50" rx="3" fill="#27272A" stroke="#3F3F46" strokeWidth="1" />
              <rect x="0" y="18" width="50" height="14" rx="3" fill="#27272A" stroke="#3F3F46" strokeWidth="1" />
            </g>
            {/* ABXY Action Buttons (Right) */}
            <g transform="translate(305, 205)">
              <circle cx="25" cy="5" r="7" fill="#27272A" stroke="#3B82F6" strokeWidth="1.5" /> {/* Y */}
              <circle cx="5" cy="25" r="7" fill="#27272A" stroke="#EF4444" strokeWidth="1.5" /> {/* X */}
              <circle cx="45" cy="25" r="7" fill="#27272A" stroke="#10B981" strokeWidth="1.5" /> {/* B */}
              <circle cx="25" cy="45" r="7" fill="#27272A" stroke="#F59E0B" strokeWidth="1.5" /> {/* A */}
            </g>
            {/* Left & Right Analog Thumbsticks */}
            <circle cx="195" cy="285" r="22" fill="#18181B" stroke="#3F3F46" strokeWidth="2" />
            <circle cx="195" cy="285" r="16" fill="#27272A" stroke="#52525B" strokeWidth="1.5" />
            <circle cx="305" cy="285" r="22" fill="#18181B" stroke="#3F3F46" strokeWidth="2" />
            <circle cx="305" cy="285" r="16" fill="#27272A" stroke="#52525B" strokeWidth="1.5" />
            {/* 3D Curved Light Reflection */}
            <path
              d="M 130 175 C 150 145 200 150 250 155 C 300 150 350 145 370 175"
              stroke={highlightColor}
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
          </g>
        )}

        {/* ================================================================= */}
        {/* GAMING GEAR 4: CYBERPULSE HIGH-FIDELITY GAMING HEADSET */}
        {/* ================================================================= */}
        {baseType === 'headset' && (
          <g className="transition-all duration-400 ease-out">
            {/* Floor Shadow */}
            <ellipse cx="250" cy="415" rx="140" ry="20" fill="rgba(0,0,0,0.4)" filter="blur(5px)" />
            {/* Steel Suspension Headband Arc */}
            <path
              d="M 120 280 C 110 120 390 120 380 280"
              stroke="#27272A"
              strokeWidth="22"
              strokeLinecap="round"
              fill="none"
            />
            {/* Inner Padded Memory Foam Headband */}
            <path
              d="M 140 250 C 145 140 355 140 360 250"
              stroke="#09090B"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            {/* Brushed Metal Extenders */}
            <rect x="112" y="240" width="16" height="40" rx="3" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            <rect x="372" y="240" width="16" height="40" rx="3" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            {/* Left Ear Cushion & Customizable Magnetic Shell */}
            <ellipse cx="120" cy="295" rx="32" ry="50" fill="#09090B" stroke="#27272A" strokeWidth="2" />
            <ellipse cx="120" cy="295" rx="25" ry="42" fill={hex} stroke={seamColor} strokeWidth="2" />
            <ellipse cx="120" cy="295" rx="14" ry="24" fill="none" stroke={highlightColor} strokeWidth="1.5" strokeDasharray="3 2" />
            {/* Right Ear Cushion & Customizable Magnetic Shell */}
            <ellipse cx="380" cy="295" rx="32" ry="50" fill="#09090B" stroke="#27272A" strokeWidth="2" />
            <ellipse cx="380" cy="295" rx="25" ry="42" fill={hex} stroke={seamColor} strokeWidth="2" />
            <ellipse cx="380" cy="295" rx="14" ry="24" fill="none" stroke={highlightColor} strokeWidth="1.5" strokeDasharray="3 2" />
            {/* Swivel Broadcast Boom Microphone */}
            <path d="M 115 320 Q 110 390 180 390" stroke="#27272A" strokeWidth="6" fill="none" strokeLinecap="round" />
            <rect x="175" y="382" width="22" height="16" rx="4" fill="#09090B" stroke="#06B6D4" strokeWidth="1.5" />
            <circle cx="193" cy="390" r="2.5" fill="#EF4444" /> {/* Mic Mute Indicator LED */}
          </g>
        )}

        {/* ================================================================= */}
        {/* CUSTOM GRAPHICS & STICKERS LAYER (Studio Live Rendering) */}
        {/* ================================================================= */}
        <g id="custom-graphics-layer">
          {graphicElements.map((el) => {
            const isSelected = selectedElementId === el.id;
            // Map percentage coordinates (0-100) to svg canvas (500x500)
            const posX = (el.x / 100) * 500;
            const posY = (el.y / 100) * 500;
            const pixelSize = (el.size / 100) * 200;

            return (
              <g
                key={el.id}
                transform={`translate(${posX}, ${posY}) rotate(${el.rotation})`}
                opacity={el.opacity}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement?.(el.id);
                }}
                className="cursor-pointer"
              >
                {/* Render graphic image or sticker symbol */}
                {el.url.startsWith('http') || el.url.startsWith('data:') ? (
                  <image
                    href={el.url}
                    x={-pixelSize / 2}
                    y={-pixelSize / 2}
                    width={pixelSize}
                    height={pixelSize}
                    preserveAspectRatio="xMidYMid meet"
                  />
                ) : (
                  <text
                    x="0"
                    y={pixelSize * 0.35}
                    fontSize={pixelSize}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none filter drop-shadow-md"
                  >
                    {el.url || '⭐'}
                  </text>
                )}

                {/* Selection outline indicator */}
                {isSelected && (
                  <rect
                    x={-pixelSize / 2 - 4}
                    y={-pixelSize / 2 - 4}
                    width={pixelSize + 8}
                    height={pixelSize + 8}
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    rx="4"
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* ================================================================= */}
        {/* CUSTOM TEXT ELEMENTS LAYER (Studio Live Rendering) */}
        {/* ================================================================= */}
        <g id="custom-text-layer">
          {textElements.map((txt) => {
            const isSelected = selectedElementId === txt.id;
            const posX = (txt.x / 100) * 500;
            const posY = (txt.y / 100) * 500;
            const fontSize = Math.max(12, (txt.size / 100) * 75);

            return (
              <g
                key={txt.id}
                transform={`translate(${posX}, ${posY}) rotate(${txt.rotation})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectElement?.(txt.id);
                }}
                className="cursor-pointer"
              >
                <text
                  x="0"
                  y="0"
                  fill={txt.color}
                  fontSize={fontSize}
                  fontFamily={txt.font}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                  stroke={txt.hasOutline ? '#000000' : 'none'}
                  strokeWidth={txt.hasOutline ? fontSize * 0.08 : 0}
                  className="select-none drop-shadow-sm tracking-wide"
                  style={{
                    letterSpacing: '0.04em'
                  }}
                >
                  {txt.text}
                </text>

                {/* Selection outline */}
                {isSelected && (
                  <rect
                    x={-(txt.text.length * fontSize * 0.32) - 8}
                    y={-fontSize * 0.7 - 6}
                    width={txt.text.length * fontSize * 0.64 + 16}
                    height={fontSize * 1.4 + 12}
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    rx="4"
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>
      </motion.div>
    </div>
  );
};
