import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'jumping' | 'merging' | 'revealed'>('jumping');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play synthesized audio impact
  const playImpactSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Whoosh sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

      // Low bass impact thud
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(160, ctx.currentTime + 0.22);
      bass.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.8);
      bassGain.gain.setValueAtTime(0.001, ctx.currentTime);
      bassGain.gain.setValueAtTime(0.4, ctx.currentTime + 0.25);
      bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      bass.connect(bassGain);
      bassGain.connect(ctx.destination);

      osc.start();
      bass.start(ctx.currentTime + 0.22);
      osc.stop(ctx.currentTime + 0.45);
      bass.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio context might be restricted before gesture, safe ignore
    }
  };

  useEffect(() => {
    // Sequence timing: Letters jump dynamically for 1.8s, then sudden violent merge!
    const t1 = setTimeout(() => {
      setPhase('merging');
      playImpactSound();
    }, 1900);

    const t2 = setTimeout(() => {
      setPhase('revealed');
    }, 2500);

    // Auto complete after reveal if user doesn't click
    const t3 = setTimeout(() => {
      onComplete();
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const letters = [
    { char: 'B', targetX: -160, jumpDelay: 0, color: '#6366F1', glow: 'rgba(99, 102, 241, 0.8)' },
    { char: 'U', targetX: -80, jumpDelay: 0.15, color: '#8B5CF6', glow: 'rgba(139, 92, 246, 0.8)' },
    { char: 'Y', targetX: 0, jumpDelay: 0.3, color: '#EC4899', glow: 'rgba(236, 72, 153, 0.8)' },
    { char: 'L', targetX: 80, jumpDelay: 0.45, color: '#3B82F6', glow: 'rgba(59, 130, 246, 0.8)' },
    { char: 'Y', targetX: 160, jumpDelay: 0.6, color: '#10B981', glow: 'rgba(16, 185, 129, 0.8)' }
  ];

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.7, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 overflow-hidden select-none"
    >
      {/* Background Animated Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0,transparent_70%)]" />
      
      {/* Cyber Grid perspective floor */}
      <div 
        className="absolute inset-x-0 bottom-0 h-1/2 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'bottom'
        }}
      />

      {/* Floating particles */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: (i % 4 - 1.5) * 300,
            y: (Math.floor(i / 4) - 1.5) * 200,
            opacity: 0,
            scale: 0.5
          }}
          animate={{
            x: [(i % 4 - 1.5) * 320, (i % 4 - 1.5) * 280],
            y: [(Math.floor(i / 4) - 1.5) * 220, (Math.floor(i / 4) - 1.5) * 180],
            opacity: [0.2, 0.7, 0.2],
            scale: [0.8, 1.4, 0.8]
          }}
          transition={{
            repeat: Infinity,
            duration: 3 + (i % 3),
            ease: 'easeInOut'
          }}
          className="absolute w-1.5 h-1.5 rounded-full bg-indigo-400 blur-[0.5px]"
        />
      ))}

      {/* Controls at Top */}
      <div className="absolute top-6 inset-x-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>BUYLY // MERCH ENGINE v2.6</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
          </button>

          <AnimatedButton
            size="xs"
            variant="outline"
            onClick={onComplete}
            className="text-xs font-mono"
          >
            Skip Intro →
          </AnimatedButton>
        </div>
      </div>

      {/* Shockwave Ring on Merge */}
      <AnimatePresence>
        {phase === 'merging' && (
          <motion.div
            initial={{ scale: 0.2, opacity: 1, borderWidth: 16 }}
            animate={{ scale: 4.5, opacity: 0, borderWidth: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute rounded-full border-indigo-500 pointer-events-none w-64 h-64 shadow-[0_0_80px_rgba(99,102,241,0.8)]"
          />
        )}
      </AnimatePresence>

      {/* Central Flash on Merge */}
      <AnimatePresence>
        {phase === 'merging' && (
          <motion.div
            initial={{ opacity: 0.9, scale: 0.5 }}
            animate={{ opacity: 0, scale: 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute w-96 h-96 rounded-full bg-white blur-3xl pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Letters Stage */}
      <div className="relative z-10 flex items-center justify-center h-52">
        {phase === 'jumping' ? (
          <div className="relative flex items-center justify-center w-full max-w-xl">
            {letters.map((l, index) => (
              <div
                key={index}
                className="absolute flex flex-col items-center justify-center"
                style={{
                  transform: `translateX(${l.targetX}px)`
                }}
              >
                {/* Jumping Letter Character */}
                <motion.div
                  animate={{
                    y: [0, -110, 0, -85, 0, -45, 0],
                    scaleY: [1, 1.22, 0.82, 1.15, 0.88, 1.05, 1],
                    scaleX: [1, 0.88, 1.18, 0.92, 1.12, 0.96, 1],
                    rotate: [0, -12, 0, 10, 0, -5, 0]
                  }}
                  transition={{
                    duration: 1.8,
                    delay: l.jumpDelay,
                    ease: 'easeInOut',
                    times: [0, 0.25, 0.45, 0.65, 0.8, 0.92, 1]
                  }}
                  className="text-7xl sm:text-9xl font-black font-display tracking-tighter select-none cursor-default"
                  style={{
                    color: l.color,
                    textShadow: `0 0 40px ${l.glow}`
                  }}
                >
                  {l.char}
                </motion.div>

                {/* Jumping Ground Shadow beneath each letter */}
                <motion.div
                  animate={{
                    scale: [1, 0.35, 1, 0.5, 1, 0.7, 1],
                    opacity: [0.6, 0.15, 0.6, 0.25, 0.6, 0.4, 0.6]
                  }}
                  transition={{
                    duration: 1.8,
                    delay: l.jumpDelay,
                    ease: 'easeInOut',
                    times: [0, 0.25, 0.45, 0.65, 0.8, 0.92, 1]
                  }}
                  className="w-12 h-3.5 rounded-full bg-black/60 blur-[3px] mt-2"
                />
              </div>
            ))}
          </div>
        ) : (
          /* Merged "BUYLY" Word */
          <motion.div
            initial={{ scale: 3.5, filter: 'blur(15px)', letterSpacing: '0.6em', opacity: 0 }}
            animate={{ scale: 1, filter: 'blur(0px)', letterSpacing: '-0.02em', opacity: 1 }}
            transition={{ type: 'spring', stiffness: 420, damping: 22 }}
            className="relative flex flex-col items-center justify-center"
          >
            <h1 className="text-7xl sm:text-9xl font-black font-display tracking-tight text-white drop-shadow-[0_15px_40px_rgba(99,102,241,0.6)]">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                BUYLY
              </span>
            </h1>

            {/* Neon Underline Glow */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
              className="absolute -bottom-4 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-[0_0_25px_#6366f1]"
            />
          </motion.div>
        )}
      </div>

      {/* Tagline and Enter CTA */}
      <AnimatePresence>
        {phase === 'revealed' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-14 flex flex-col items-center text-center px-4 z-20 max-w-lg"
          >
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs font-mono text-indigo-400 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>CUSTOM MERCH & STREETWEAR LABORATORY</span>
            </div>

            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mb-8">
              Workable real-time product colors, interactive studio mockups, live preview rendering, and premium streetwear drops.
            </p>

            <AnimatedButton
              size="lg"
              variant="glow"
              onClick={onComplete}
              className="px-8 py-3.5 text-base font-bold group"
            >
              <span>ENTER BUYLY</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </AnimatedButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom status bar */}
      <div className="absolute bottom-6 inset-x-6 flex items-center justify-between text-[11px] font-mono text-neutral-400">
        <span>© 2026 BUYLY STUDIOS</span>
        <span className="hidden sm:inline">CLICK 'ENTER' OR ESCAPE TO PROCEED</span>
        <span>STATUS: SYSTEM OPERATIONAL</span>
      </div>
    </motion.div>
  );
};
