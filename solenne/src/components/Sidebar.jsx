'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  X,
  Menu,
  Sparkles,
  Paintbrush,
  Star,
  Info,
  User,
  UserCircle2,
  Repeat,
  LogOut,
  ChevronDown,
  ChevronUp,
  Settings,
  Gift,
  Phone,
} from 'lucide-react';

export default function Sidebar({ onSidebarToggle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const router = useRouter();

  const handleAction = (action) => {
    const messages = {
      logout: 'Logging out...',
      switch: 'Switching account...',
      profile: 'Loading profile...'
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

  const getLoadingIcon = () => {
    if (loadingAction === 'logout') return 'L';
    if (loadingAction === 'switch') return 'S';
    return '?';
  };

  return (
    <>
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: sidebarOpen ? 0 : -300, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 14 }}
        className="fixed left-0 top-0 bottom-0 w-72 bg-gradient-to-br from-purple-900/80 via-fuchsia-900/90 to-pink-900/80 backdrop-blur-xl border-r border-fuchsia-700 shadow-[0_0_25px_rgba(255,0,255,0.4)] z-40 flex flex-col overflow-hidden"
      >
        <motion.div
          className="px-6 py-5 flex justify-between items-center border-b border-fuchsia-700 bg-fuchsia-800/20 backdrop-blur-md relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            className="absolute left-1/2 transform -translate-x-1/2 text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-md animate-pulse"
            onClick={() => router.push('/')}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          >
            S
          </motion.button>
          <button
            aria-label="Toggle Sidebar"
            onClick={() => setSidebarOpen(false)}
            className="text-fuchsia-300 hover:text-white transition"
          >
            <X size={22} />
          </button>
        </motion.div>

        <motion.nav
          className="flex-1 px-6 py-6 overflow-y-auto space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.05,
              },
            },
          }}
        >
          {[
            {
              title: 'Explore',
              links: [
                { icon: <Sparkles size={20} className="text-fuchsia-400" />, label: 'Jewelry Collections' },
                { icon: <Paintbrush size={20} className="text-indigo-400" />, label: 'Art Galleries' },
                { icon: <Star size={20} className="text-yellow-400" />, label: 'Featured Artists' },
              ]
            },
            {
              title: 'Resources',
              links: [
                { icon: <Info size={20} className="text-cyan-400" />, label: 'How it Works' },
                { icon: <User size={20} className="text-green-400" />, label: 'Community' },
                { icon: <Paintbrush size={20} className="text-pink-400" />, label: 'Art Tutorials' },
                { icon: <Phone size={20} className="text-amber-400" />, label: 'Contact Support' },
                { icon: <Gift size={20} className="text-purple-400" />, label: 'Invite Friends' },
                { icon: <Settings size={20} className="text-fuchsia-400" />, label: 'Settings' },
              ]
            }
          ].map((section) => (
            <motion.div
              key={section.title}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <h3 className="uppercase text-xs font-semibold text-purple-400 mb-3 tracking-widest">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(({ icon, label }) => (
                  <li key={label}>
                    <a href="#" className="flex items-center gap-3 text-purple-200 hover:text-white transition-colors rounded-md px-3 py-2 cursor-pointer hover:bg-fuchsia-800/30">
                      {icon}
                      <span>{label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.nav>

        <motion.div
          className="px-6 py-4 border-t border-fuchsia-700 bg-fuchsia-800/20 backdrop-blur-md flex items-center gap-3 cursor-pointer hover:bg-fuchsia-900/30"
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <img
            src="/user-profile.jpg"
            alt="User profile"
            className="w-12 h-12 rounded-full ring-2 ring-fuchsia-500 shadow-lg"
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-semibold">Jose Solenne</p>
                <p className="text-purple-300 text-xs">Art & Jewelry Enthusiast</p>
              </div>
              {profileDropdownOpen ? <ChevronUp className="text-fuchsia-400" size={16} /> : <ChevronDown className="text-fuchsia-400" size={16} />}
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
                    <button
                      onClick={() => handleAction('profile')}
                      className="flex items-center gap-2 text-purple-200 hover:text-white text-sm"
                    >
                      <UserCircle2 size={18} className="text-fuchsia-500" /> View Profile
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleAction('switch')}
                      className="flex items-center gap-2 text-purple-200 hover:text-white text-sm"
                    >
                      <Repeat size={18} className="text-indigo-400" /> Switch Account
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleAction('logout')}
                      className="flex items-center gap-2 text-purple-200 hover:text-white text-sm"
                    >
                      <LogOut size={18} className="text-red-500" /> Logout
                    </button>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.aside>

      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-50 bg-fuchsia-600 hover:bg-fuchsia-700 text-white p-3 rounded-full shadow-xl shadow-fuchsia-700/50 transition-all duration-300"
          aria-label="Open Sidebar"
        >
          <Menu size={24} />
        </button>
      )}

      <AnimatePresence>
        {loadingAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="p-6 bg-gradient-to-br from-purple-900 via-fuchsia-800 to-pink-700 rounded-xl shadow-2xl text-white flex flex-col items-center gap-4 max-w-xs w-full"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              >
                <div className="w-16 h-16 rounded-full border-4 border-fuchsia-300 flex items-center justify-center text-3xl font-extrabold text-white shadow-inner shadow-fuchsia-800 bg-fuchsia-700/60">
                  {getLoadingIcon()}
                </div>
              </motion.div>
              <p className="text-lg font-medium text-center">
                {loadingAction === 'logout' && 'Logging out...'}
                {loadingAction === 'switch' && 'Switching account...'}
                {loadingAction === 'profile' && 'Loading profile...'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
