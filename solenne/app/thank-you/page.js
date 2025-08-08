'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      document.title = 'Solenne • Thank You!';
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0015] via-[#1a0028] to-[#10001f] text-white flex items-center justify-center overflow-hidden">

      {/* Floating sparkles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: '120vh', opacity: [0, 0.8, 0] }}
            transition={{
              duration: 6 + Math.random() * 5,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute w-1.5 h-1.5 bg-fuchsia-400 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${-Math.random() * 100}px`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Thank You Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-xl w-full bg-white/10 border border-fuchsia-600/30 backdrop-blur-2xl rounded-3xl shadow-2xl px-10 py-12 text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: [1.2, 0.9, 1] }}
          transition={{ duration: 1.2, type: 'spring' }}
          className="flex justify-center"
        >
          <CheckCircle size={64} className="text-green-400 drop-shadow-glow" />
        </motion.div>

        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-fuchsia-400 to-purple-600 text-transparent bg-clip-text drop-shadow">
          Thank You!
        </h1>

        <p className="text-purple-300 text-lg sm:text-xl">
          Your order has been received. A confirmation email is on its way.
        </p>

        <div className="h-1 w-full bg-gradient-to-r from-transparent via-fuchsia-600 to-transparent rounded-full animate-pulse" />

        <div className="text-purple-400 font-mono text-sm space-y-2">
          <p>🎁 Estimated Delivery: <span className="text-purple-100">3-5 business days</span></p>
          <p>🔐 Transaction Ref: <span className="text-fuchsia-300">#SOL{Date.now().toString().slice(-6)}</span></p>
        </div>

        <div className="flex justify-center gap-4 pt-6">
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-700 rounded-xl text-white font-bold hover:scale-105 transition-all shadow-lg"
          >
            Explore More <ArrowRight size={18} className="inline ml-1" />
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-purple-800 hover:bg-purple-900 rounded-xl text-purple-200 font-semibold transition-all shadow"
          >
            View Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}
