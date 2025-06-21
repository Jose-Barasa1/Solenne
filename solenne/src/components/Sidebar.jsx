'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  X, Menu, Home, ShoppingCart, Diamond, Brush, Heart, CreditCard,
  Bell, Settings, UserCircle2, Repeat, LogOut, ChevronDown, ChevronUp, ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [active, setActive] = useState('home');
  const router = useRouter();

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'products', label: 'All Products', icon: <ShoppingCart size={20} /> },
    {
      id: 'categories', label: 'Categories', icon: <Diamond size={20} />,
      submenu: [
        { id: 'art', label: 'Art', icon: <Brush size={18} /> },
        { id: 'jewelry', label: 'Jewelry', icon: <Diamond size={18} /> },
      ],
    },
    { id: 'wishlist', label: 'Wishlist', icon: <Heart size={20} /> },
    { id: 'cart', label: 'Cart', icon: <ShoppingCart size={20} /> },
    { id: 'orders', label: 'Orders', icon: <CreditCard size={20} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleAction = (action) => {
    const messages = {
      logout: 'Logging out...',
      switch: 'Switching account...',
      profile: 'Loading profile...',
    };
    setLoadingAction(action);
    toast.success(messages[action]);
    setTimeout(() => {
      setLoadingAction(null);
      if (action === 'logout' || action === 'switch') {
        router.push('/login');
      } else if (action === 'profile') {
        router.push('/profile');
      }
    }, 2000);
  };

  return (
    <>
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: sidebarOpen ? 0 : -300, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 14 }}
        className="w-72 min-h-screen bg-gradient-to-br from-purple-950 via-fuchsia-900 to-indigo-900 text-white shadow-[0_0_25px_rgba(255,0,255,0.3)] border-r border-fuchsia-700 flex flex-col pt-[72px] fixed top-0 left-0 z-40"
      >
        <div className="px-6 py-5 flex justify-end items-center border-b border-fuchsia-700 bg-fuchsia-800/20 backdrop-blur-md">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-fuchsia-300 hover:text-white transition"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 px-6 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-fuchsia-700 scrollbar-track-transparent">
          <ul className="space-y-3">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActive(item.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md transition-all ${
                    active === item.id
                      ? 'bg-fuchsia-800/60 text-white shadow-inner shadow-fuchsia-900'
                      : 'hover:bg-fuchsia-700/30 text-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.submenu && (
                    <ChevronRight className="text-fuchsia-400" size={16} />
                  )}
                </button>

                {item.submenu && active === item.id && (
                  <ul className="ml-6 mt-2 space-y-2">
                    {item.submenu.map(sub => (
                      <li key={sub.id}>
                        <button
                          onClick={() => setActive(sub.id)}
                          className={`flex items-center gap-2 text-sm px-3 py-1 rounded-md w-full ${
                            active === sub.id
                              ? 'bg-fuchsia-700/50 text-white'
                              : 'hover:bg-fuchsia-700/30 text-purple-300'
                          }`}
                        >
                          {sub.icon}
                          {sub.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="px-6 py-4 border-t border-fuchsia-700 bg-fuchsia-800/20 backdrop-blur-md flex items-center gap-3 cursor-pointer hover:bg-fuchsia-900/30"
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
        >
          <img
            src="/user-profile.jpg"
            alt="User"
            className="w-12 h-12 rounded-full ring-2 ring-fuchsia-500 shadow-lg"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Jose Solenne</p>
                <p className="text-purple-300 text-xs">Buyer</p>
              </div>
              {profileDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            <AnimatePresence>
              {profileDropdownOpen && (
                <motion.ul
                  className="mt-4 space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <li>
                    <button onClick={() => handleAction('profile')} className="flex items-center gap-2 text-sm text-purple-200 hover:text-white">
                      <UserCircle2 size={18} /> View Profile
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleAction('switch')} className="flex items-center gap-2 text-sm text-purple-200 hover:text-white">
                      <Repeat size={18} /> Switch Account
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleAction('logout')} className="flex items-center gap-2 text-sm text-purple-200 hover:text-white">
                      <LogOut size={18} /> Logout
                    </button>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-[80px] left-6 z-50 bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-600 hover:scale-105 text-white p-3 rounded-full shadow-lg shadow-pink-500/40 transition-transform duration-300"
        >
          <Menu size={24} />
        </button>
      )}

      <AnimatePresence>
        {loadingAction && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div className="p-6 bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-700 rounded-xl text-white text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}>
                <div className="w-16 h-16 rounded-full border-4 border-fuchsia-300 flex items-center justify-center text-3xl font-extrabold">
                  {loadingAction[0]?.toUpperCase()}
                </div>
              </motion.div>
              <p className="mt-4 text-lg">{loadingAction}...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
