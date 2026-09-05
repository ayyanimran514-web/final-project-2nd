import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  Check
} from 'lucide-react';
import { User } from '../types';
import { AnimatedButton } from './AnimatedButton';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = 'login'
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [step, setStep] = useState<'form' | 'verify' | 'google_select'>('form');
  
  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email_password' | 'google' | 'email_code'>('email_password');

  // Verification Code State
  const [generatedCode, setGeneratedCode] = useState('739412');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendCountdown, setResendCountdown] = useState(30);
  const [codeSentToast, setCodeSentToast] = useState(false);
  
  // Status states
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setStep('form');
      setError(null);
    }
  }, [isOpen, initialTab]);

  // Resend Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'verify' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  if (!isOpen) return null;

  // Generate a random 6-digit code
  const generateNewCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    return code;
  };

  // Quick autofill demo accounts
  const handleQuickFill = (type: 'customer' | 'admin') => {
    if (type === 'admin') {
      setEmail('admin@buyly.store');
      setPassword('admin123');
      setName('Alex Rivera (Admin)');
      setRole('admin');
    } else {
      setEmail('elena@streetwear.io');
      setPassword('streetwear123');
      setName('Elena Rostova');
      setRole('customer');
    }
    setError(null);
  };

  // Send verification code to email
  const initiateEmailVerification = (targetEmail: string, targetName: string, method: 'google' | 'email_code' | 'email_password') => {
    setIsLoading(true);
    const code = generateNewCode();
    setAuthMethod(method);

    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
      setResendCountdown(30);
      setCodeSentToast(true);
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => setCodeSentToast(false), 4500);
      setTimeout(() => {
        digitInputRefs.current[0]?.focus();
      }, 200);
    }, 600);
  };

  // Google Continue Clicked
  const handleGoogleContinue = () => {
    setStep('google_select');
  };

  // Pick Google Account
  const handleSelectGoogleAccount = (googleEmail: string, googleName: string) => {
    setEmail(googleEmail);
    setName(googleName);
    initiateEmailVerification(googleEmail, googleName, 'google');
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (tab === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!password.trim()) {
        setError('Please create a secure password.');
        return;
      }
      // New accounts require email verification code!
      initiateEmailVerification(email.trim(), name.trim(), 'email_password');
      return;
    }

    // Direct Login with password
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      completeAuthentication(email.trim(), name || email.split('@')[0], role);
    }, 600);
  };

  // Digit box change
  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (cleanVal.length > 1) {
      // Paste handling
      const pastedChars = cleanVal.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pastedChars[i] || '';
      }
      setOtpDigits(newDigits);
      const nextIndex = Math.min(pastedChars.length, 5);
      digitInputRefs.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    if (cleanVal && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    }
  };

  // Auto-fill demo OTP
  const handleAutofillCode = () => {
    const chars = generatedCode.split('');
    setOtpDigits(chars);
    digitInputRefs.current[5]?.focus();
  };

  // Verify submitted OTP code
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length < 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    if (enteredCode !== generatedCode && enteredCode !== '123456') {
      setError(`Invalid verification code. Please enter ${generatedCode} or request a new one.`);
      return;
    }

    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
      completeAuthentication(email, name || email.split('@')[0], role);
    }, 700);
  };

  const completeAuthentication = (userEmail: string, userName: string, userRole: 'customer' | 'admin') => {
    const isAdminLogin = userEmail.toLowerCase().includes('admin') || userRole === 'admin';
    const authenticatedUser: User = {
      id: `usr-${Date.now()}`,
      name: isAdminLogin ? 'Alex Rivera (Admin)' : (userName || userEmail.split('@')[0]),
      email: userEmail.trim(),
      role: isAdminLogin ? 'admin' : 'customer',
      avatar: isAdminLogin 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      memberSince: 'Just now',
      ordersCount: isAdminLogin ? 14 : 1
    };

    onLoginSuccess(authenticatedUser);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md"
        />

        {/* Auth Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800/80 text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Toast Notification when Code is sent */}
          <AnimatePresence>
            {codeSentToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-3 left-4 right-14 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 shadow-lg z-20 backdrop-blur-md"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span className="truncate">Verification code sent to <strong>{email}</strong></span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Brand Header */}
          <div className="text-center mb-5">
            <span className="text-2xl font-black font-display tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              BUYLY
            </span>
            <p className="text-xs text-neutral-400 mt-1 font-mono">
              STREETWEAR & CUSTOM MERCH MEMBER PORTAL
            </p>
          </div>

          {/* STEP 1: FORM (LOGIN OR REGISTER) */}
          {step === 'form' && (
            <>
              {/* Working Login Tab & Create Account Tab */}
              <div className="flex items-center p-1 rounded-2xl bg-neutral-950 border border-neutral-800 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tab === 'login'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setError(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    tab === 'register'
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Continue with Google Button */}
              <button
                type="button"
                onClick={handleGoogleContinue}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-600 text-white text-xs font-semibold flex items-center justify-center gap-3 transition-all shadow-sm cursor-pointer mb-4 group"
              >
                {/* Official Google G SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="h-px bg-neutral-800 flex-1" />
                <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                  or with email {tab === 'register' ? '& verification' : ''}
                </span>
                <div className="h-px bg-neutral-800 flex-1" />
              </div>

              {/* Demo Quick Fill Buttons */}
              <div className="mb-4 p-2.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-400">DEMO PRESETS:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickFill('customer')}
                    className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-[11px] font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickFill('admin')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 transition-colors cursor-pointer"
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                {tab === 'register' && (
                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1">FULL NAME *</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Marcus Vance"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1">EMAIL ADDRESS *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono text-neutral-400">PASSWORD *</label>
                    {tab === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (!email.trim()) {
                            setError('Please enter your email above to receive a login code.');
                            return;
                          }
                          initiateEmailVerification(email.trim(), name || email.split('@')[0], 'email_code');
                        }}
                        className="text-[11px] text-indigo-400 hover:underline cursor-pointer"
                      >
                        Email Me A Login Code
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Role selector for demo ease */}
                {tab === 'register' && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-mono text-neutral-400">ACCOUNT TYPE:</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          checked={role === 'customer'}
                          onChange={() => setRole('customer')}
                          className="accent-indigo-500"
                        />
                        Customer
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-emerald-400 cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          checked={role === 'admin'}
                          onChange={() => setRole('admin')}
                          className="accent-emerald-500"
                        />
                        Admin
                      </label>
                    </div>
                  </div>
                )}

                <AnimatedButton
                  type="submit"
                  variant="glow"
                  size="md"
                  isLoading={isLoading}
                  className="w-full mt-1.5"
                >
                  <span>
                    {tab === 'login'
                      ? 'Sign In to BUYLY'
                      : 'Send Email Verification Code'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </AnimatedButton>
              </form>
            </>
          )}

          {/* STEP 2: GOOGLE ACCOUNT SELECTION SIMULATOR */}
          {step === 'google_select' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <span className="text-xs font-mono text-neutral-400">GOOGLE IDENTITY</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 mb-4">
                <p className="text-xs text-neutral-300 mb-3">
                  Choose a Google account to continue to <strong>BUYLY</strong>. An email verification code will be dispatched to confirm your identity.
                </p>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleSelectGoogleAccount('elena.rostova@gmail.com', 'Elena Rostova')}
                    className="w-full p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 flex items-center gap-3 text-left transition-colors cursor-pointer"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white">Elena Rostova</div>
                      <div className="text-[11px] text-neutral-400 font-mono truncate">elena.rostova@gmail.com</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-500" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectGoogleAccount('alex.rivera@buyly.store', 'Alex Rivera (Admin)')}
                    className="w-full p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 flex items-center gap-3 text-left transition-colors cursor-pointer"
                  >
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border border-emerald-500/40"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-emerald-300">Alex Rivera (Admin)</div>
                      <div className="text-[11px] text-neutral-400 font-mono truncate">alex.rivera@buyly.store</div>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: 6-DIGIT EMAIL VERIFICATION CODE SCREEN */}
          {step === 'verify' && (
            <form onSubmit={handleVerifyOtp}>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex items-center gap-1 text-xs text-neutral-400 hover:text-white"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Email</span>
                </button>
                <span className="text-[11px] font-mono text-indigo-400 flex items-center gap-1">
                  <KeyRound className="w-3 h-3" />
                  <span>2FA SECURED</span>
                </span>
              </div>

              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-2 text-indigo-400">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Enter Verification Code</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  We've sent a 6-digit confirmation code to:
                </p>
                <p className="text-xs font-mono font-bold text-indigo-300 mt-0.5">{email}</p>
              </div>

              {/* Demo Helper Banner with Auto-fill */}
              <div className="mb-4 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/60 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-indigo-300">DEMO INBOX SIMULATION:</div>
                  <div className="text-xs font-mono font-bold text-white tracking-widest mt-0.5">
                    Code: {generatedCode}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleAutofillCode}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-colors cursor-pointer"
                >
                  Autofill Code
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                  {error}
                </div>
              )}

              {/* 6 Individual Digit Inputs */}
              <div className="flex items-center justify-between gap-2 mb-5">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (digitInputRefs.current[idx] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-12 sm:w-12 sm:h-14 text-center font-mono font-bold text-xl rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                  />
                ))}
              </div>

              {/* Submit Verification Button */}
              <AnimatedButton
                type="submit"
                variant="glow"
                size="md"
                isLoading={isLoading}
                className="w-full"
              >
                <span>Verify Code & Enter BUYLY</span>
                <Check className="w-4 h-4" />
              </AnimatedButton>

              {/* Resend Timer & Action */}
              <div className="text-center mt-4">
                {resendCountdown > 0 ? (
                  <span className="text-xs font-mono text-neutral-400">
                    Resend code in <strong className="text-white">{resendCountdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => initiateEmailVerification(email, name, authMethod)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Code to Email</span>
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Footnote */}
          <p className="text-center text-[11px] text-neutral-400 mt-5">
            By continuing, you agree to BUYLY's Terms of Streetwear Service and Privacy Protocol.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
