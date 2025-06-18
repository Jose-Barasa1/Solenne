'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, CheckCircle, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function OnboardingLoginPage() {
  const [currentFact, setCurrentFact] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginComplete, setLoginComplete] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [blinkerVisible, setBlinkerVisible] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  

  const router = useRouter();

  const facts = [
    "Crystal clarity inspires timeless beauty.",
    "Art transcends value—Solenne captures both.",
    "Each Solenne piece tells a story.",
    "Luxury lives where passion meets craft.",
    "Beauty is eternal when shared through art."
  ];

  const strengthMessages = [
    "Too delicate, like raw clay.",
    "Sculpting strength with subtle detail.",
    "Gleaming with elegance—nearly there.",
    "A masterpiece of protection and grace."
  ];

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact(i => (i + 1) % facts.length);
    }, 8000);
    return () => clearInterval(factInterval);
  }, []);

  useEffect(() => {
    const strength = password.length >= 12 ? 100 : password.length >= 8 ? 70 : password.length >= 5 ? 40 : password.length > 0 ? 20 : 0;
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinkerVisible(v => !v);
    }, 600);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async () => {
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
    setIsLoggingIn(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Login successful!');
        setLoginComplete(true);
        setTimeout(() => {
          
          setTimeout(() => router.push('/onboarding'), 1000);
        }, 1000);
      }
      
      
    } catch (err) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

 
  
  
  

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-950 via-black to-fuchsia-900 text-white flex items-center justify-center overflow-hidden">
      <div className="flex w-full h-[95vh] max-w-[1700px] rounded-3xl overflow-hidden shadow-[0_0_60px_#a855f7aa] border border-purple-800/30 backdrop-blur-xl">

        {/* Left visual side */}
        <div className="w-1/2 hidden md:flex flex-col items-center justify-center relative bg-gradient-to-b from-purple-900/80 via-black/50 to-fuchsia-950/90 p-10 gap-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-800/20 via-purple-800/10 to-transparent animate-pulse" />

          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="z-10 text-center"
          >
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600 mb-4 drop-shadow-xl">
              Solenne
            </h1>
            <p className="text-purple-200 text-lg max-w-md mx-auto">
              {facts[currentFact]}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full max-w-sm text-center text-sm text-fuchsia-300 italic z-10"
          >
            “Where crystals breathe elegance, and every curve is intentional.”
          </motion.div>

          <div className="absolute bottom-6 left-6 text-xs text-purple-500/40">
            Solenne 2025 ©
          </div>
        </div>

        {/* Right side - login */}
        <div className="w-full md:w-1/2 p-14 flex items-center justify-center bg-gradient-to-br from-zinc-900 via-purple-950 to-black rounded-l-3xl relative overflow-hidden">
          <div className="absolute top-6 left-6 z-10 text-purple-300 text-3xl font-bold select-none pointer-events-none">
            S
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full max-w-xl space-y-8 relative z-10"
          >
            <div className="text-center mb-4">
              <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500 drop-shadow-md z-10">
                Login to Solenne
              </h2>
              <p className="text-sm text-white/60 tracking-wide">
                Your gateway to luxury creations
              </p>
              <p className="text-xs text-fuchsia-200 mt-2 italic animate-pulse">
                {facts[currentFact]}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <button className="p-3 bg-zinc-800/70 rounded-xl hover:bg-zinc-700 border border-purple-600/40">
                <FaGoogle className="text-white text-xl" />
              </button>
              <button className="p-3 bg-zinc-800/70 rounded-xl hover:bg-zinc-700 border border-purple-600/40">
                <FaGithub className="text-white text-xl" />
              </button>
              <button className="p-3 bg-zinc-800/70 rounded-xl hover:bg-zinc-700 border border-purple-600/40">
                <FaFacebook className="text-white text-xl" />
              </button>
            </div>

            <div className="text-center text-sm text-purple-300/80">
              {email && (
                <span className="flex justify-center items-center gap-2">
                  <UserCheck size={16} className="text-green-400 animate-pulse" />
                  Signing in as <strong>{email}</strong>
                  <span className={`ml-1 font-bold text-fuchsia-400 ${blinkerVisible ? 'opacity-100' : 'opacity-0'}`}>
                    |
                  </span>
                </span>
              )}
            </div>

            <div className="space-y-5">
              <div className={`flex items-center bg-zinc-800/70 rounded-xl px-5 py-4 border ${email ? 'border-green-500/40' : 'border-purple-700/30'} shadow-inner`}>
                <Mail className="h-5 w-5 text-purple-400 mr-3" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-transparent text-white placeholder:text-white/50 border-none focus:ring-0 focus:outline-none"
                />
              </div>

              <div className={`flex items-center bg-zinc-800/70 rounded-xl px-5 py-4 border ${password.length >= 6 ? 'border-green-500/40' : 'border-purple-700/30'} shadow-inner relative`}>
                <Lock className="h-5 w-5 text-purple-400 mr-3" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-transparent text-white placeholder:text-white/50 border-none focus:ring-0 focus:outline-none pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-white/40 hover:text-white transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {password && (
                <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${passwordStrength}%` }}
                  ></div>
                </div>
              )}
              {password && <p className="text-xs text-purple-200 text-center mt-1">{strengthMessages[Math.floor(passwordStrength / 30)]}</p>}

              <div className="flex items-center justify-between text-sm text-white/50">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300 ${
                    rememberMe ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 border-purple-400 text-white shadow-lg shadow-fuchsia-600/20' : 'bg-zinc-800/60 border-zinc-700 text-purple-200 hover:bg-zinc-700'
                  }`}
                >
                  {rememberMe ? '✓ Remembered' : 'Remember me'}
                </button>
                <span className="hover:underline cursor-pointer text-purple-400">Forgot password?</span>
              </div>

              <Button
                onClick={handleLogin}
                disabled={isLoggingIn || loginComplete}
                className={`w-full py-3 font-bold rounded-xl transition-all duration-300 ${
                  isLoggingIn
                    ? 'bg-purple-700/60 cursor-wait'
                    : 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 hover:scale-105'
                }`}
              >
                {isLoggingIn ? 'Authenticating...' : loginComplete ? 'Welcome back!' : 'Log In'}
              </Button>
            </div>

            <AnimatePresence>
              {loginComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-green-400 text-center flex justify-center items-center gap-2 mt-4"
                >
                  <CheckCircle size={20} />
                  You’re logged in, enjoy your journey.
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center text-sm text-white/50">
              Don’t have an account?{' '}
              <a href="/signup" className="text-purple-400 hover:underline hover:text-fuchsia-400 transition-colors">
                Sign up
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
