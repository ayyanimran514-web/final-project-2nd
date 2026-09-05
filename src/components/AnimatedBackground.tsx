import React from 'react';
import { motion } from 'motion/react';
import { ThemeId } from '../types';

interface AnimatedBackgroundProps {
  theme: ThemeId;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ theme }) => {
  // Theme color maps for background orbs (Dark vs Light)
  const themeColors: Record<ThemeId, { orb1: string; orb2: string; orb3: string; gridColor: string }> = {
    dark: {
      orb1: 'rgba(99, 102, 241, 0.16)', // Indigo
      orb2: 'rgba(236, 72, 153, 0.12)', // Pink/Magenta
      orb3: 'rgba(6, 182, 212, 0.12)',  // Cyan
      gridColor: 'rgba(255, 255, 255, 0.04)'
    },
    light: {
      orb1: 'rgba(99, 102, 241, 0.08)',
      orb2: 'rgba(168, 85, 247, 0.06)',
      orb3: 'rgba(59, 130, 246, 0.06)',
      gridColor: 'rgba(0, 0, 0, 0.04)'
    }
  };

  const colors = themeColors[theme] || themeColors.dark;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Animated Glowing Orbs */}
      <motion.div
        animate={{
          x: [0, 80, -60, 0],
          y: [0, -100, 40, 0],
          scale: [1, 1.25, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full blur-[130px]"
        style={{ backgroundColor: colors.orb1 }}
      />

      <motion.div
        animate={{
          x: [0, -90, 70, 0],
          y: [0, 120, -50, 0],
          scale: [1, 1.15, 1.3, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full blur-[140px]"
        style={{ backgroundColor: colors.orb2 }}
      />

      <motion.div
        animate={{
          x: [0, 60, -80, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.3, 0.85, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full blur-[150px]"
        style={{ backgroundColor: colors.orb3 }}
      />

      {/* Cyber Subtle Grid Matrix overlay */}
      <div
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `linear-gradient(to right, ${colors.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${colors.gridColor} 1px, transparent 1px)`,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />

      {/* Floating dust stars */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: `${(i * 19) % 100}vw`,
            y: `${(i * 23) % 100}vh`,
            opacity: 0.15,
          }}
          animate={{
            y: [`${(i * 23) % 100}vh`, `${((i * 23 + 40) % 100)}vh`],
            opacity: [0.1, 0.45, 0.1],
          }}
          transition={{
            duration: 12 + (i % 8) * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute w-1 h-1 rounded-full bg-white/40 blur-[0.5px]"
        />
      ))}
    </div>
  );
};
