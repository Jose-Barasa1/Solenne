'use client';

import { Bell, ShoppingCart, UserCircle2, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Navbar({ cartCount = 0, notificationCount = 0 }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-950/70 via-fuchsia-900/60 to-indigo-900/70 backdrop-blur-lg shadow-xl px-6 py-3 flex items-center justify-between border-b border-fuchsia-700">
      
      {/* Left: Spinning S + Solenne */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-md"
        >
          S
        </motion.div>
        <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-wide drop-shadow">
          olenne
        </h1>
      </div>

      {/* Right: Notifications, Cart, Profile */}
      <div className="flex items-center gap-6 text-white relative">
        {/* Notifications */}
        <div className="relative cursor-pointer hover:text-fuchsia-300 transition">
          <Bell size={22} />
          {notificationCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full shadow-md">
              {notificationCount}
            </span>
          )}
        </div>

        {/* Cart */}
        <div className="relative cursor-pointer hover:text-purple-300 transition">
          <ShoppingCart size={22} />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-purple-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full shadow-md">
              {cartCount}
            </span>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 hover:text-fuchsia-300 transition"
          >
            <UserCircle2 size={24} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-3 w-48 bg-gradient-to-br from-purple-800/80 to-fuchsia-900/90 shadow-xl backdrop-blur-md rounded-lg overflow-hidden border border-purple-600 z-50"
              >
                <button
                  onClick={() => router.push('/profile')}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-fuchsia-800/50 flex items-center gap-2"
                >
                  <UserCircle2 size={18} /> View Profile
                </button>
                <button
                  onClick={() => router.push('/settings')}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-fuchsia-800/50 flex items-center gap-2"
                >
                  <Settings size={18} /> Settings
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="w-full text-left px-4 py-3 text-sm text-white hover:bg-fuchsia-800/50 flex items-center gap-2"
                >
                  <LogOut size={18} className="text-red-400" /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
