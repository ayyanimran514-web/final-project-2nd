import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface AnimatedButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow' | 'accent';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg',
    sm: 'px-3 py-1.5 text-xs font-semibold gap-2 rounded-xl',
    md: 'px-4 py-2.5 text-sm font-semibold gap-2.5 rounded-xl',
    lg: 'px-6 py-3.5 text-base font-bold gap-3 rounded-2xl'
  }[size];

  const variantClasses = {
    primary: 'bg-white text-neutral-950 font-bold hover:bg-neutral-100 shadow-md shadow-white/10 hover:shadow-lg hover:shadow-white/20 border border-white/20',
    secondary: 'bg-neutral-800/90 text-white hover:bg-neutral-700/90 border border-neutral-700 shadow-sm',
    outline: 'border border-neutral-700 hover:border-neutral-500 text-neutral-200 hover:text-white bg-neutral-900/40 hover:bg-neutral-800/60 backdrop-blur-sm',
    ghost: 'text-neutral-400 hover:text-white hover:bg-neutral-800/50',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/40',
    glow: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 border border-white/20',
    accent: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30'
  }[variant];

  return (
    <motion.button
      whileHover={disabled || isLoading ? undefined : { scale: 1.025, y: -1 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 450, damping: 22 }}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center cursor-pointer transition-colors select-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
};
