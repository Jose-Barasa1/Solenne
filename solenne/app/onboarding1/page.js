'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Onboarding1() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);
  const [doorOpen, setDoorOpen] = useState(false);

  useEffect(() => {
    if (selectedRole) {
      setDoorOpen(true);
      setTimeout(() => {
        if (selectedRole === 'buyer') {
          router.push('/onboarding');
        } else if (selectedRole === 'vendor') {
          router.push('/shops/create');
        }
      }, 1200);
    }
  }, [selectedRole]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-900 px-6 py-12 text-white font-sans overflow-hidden">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Text Block */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="flex flex-col justify-center text-left"
        >
          <h1 className="text-5xl font-extrabold leading-tight text-purple-300 mb-4 drop-shadow-lg">
            Begin Your
            <span className="text-white ml-2">Journey</span>
          </h1>
          <p className="text-white/70 text-lg max-w-md mb-6">
            Choose your path on Solenne. Whether you're here to explore timeless creations or launch your own showcase, we’ve crafted the perfect experience for you.
          </p>
        </motion.div>

        {/* Right Card Selector */}
        <div className="flex flex-col items-center justify-center space-y-6 relative">
          <AnimatePresence>
            {!doorOpen && (
              <>
                <motion.div
                  whileHover={{ rotateY: 10 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer w-full"
                  onClick={() => setSelectedRole('buyer')}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <Card className={`relative bg-gradient-to-br from-purple-600/20 to-indigo-600/10 backdrop-blur-lg border border-purple-400/30 shadow-[0_0_50px_#9333ea88] rounded-3xl p-8 transition-all duration-700 transform ${selectedRole === 'buyer' ? 'scale-95 rotateY-6' : ''}`}>
                    <h2 className="text-3xl font-bold text-purple-200 mb-2">I am a Buyer</h2>
                    <p className="text-white/80 text-sm mb-2">
                      Discover and collect beautiful creations across our curated marketplace.
                    </p>
                    {selectedRole === 'buyer' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur rounded-3xl">
                        <Sparkles className="text-purple-300 animate-ping" size={28} />
                      </div>
                    )}
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ rotateY: -10 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer w-full"
                  onClick={() => setSelectedRole('vendor')}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                >
                  <Card className={`relative bg-gradient-to-br from-purple-600/20 to-indigo-600/10 backdrop-blur-lg border border-purple-400/30 shadow-[0_0_50px_#9333ea88] rounded-3xl p-8 transition-all duration-700 transform ${selectedRole === 'vendor' ? 'scale-95 rotateY-6' : ''}`}>
                    <h2 className="text-3xl font-bold text-purple-200 mb-2">I am a Shop Vendor</h2>
                    <p className="text-white/80 text-sm mb-2">
                      Open your storefront and showcase your exclusive products to the Solenne universe.
                    </p>
                    {selectedRole === 'vendor' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur rounded-3xl">
                        <Sparkles className="text-purple-300 animate-ping" size={28} />
                      </div>
                    )}
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Door Opening Animation */}
          {doorOpen && (
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-900 z-50 origin-left"
            />
          )}
        </div>
      </div>
    </div>
  );
}
