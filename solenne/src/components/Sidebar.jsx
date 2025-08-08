'use client';

import { useState, useEffect } from 'react';
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
  const [cartOpen, setCartOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  // Load orders and products
  useEffect(() => {
    if (active === 'orders') loadOrders();
    if (active === 'products' || active === 'art' || active === 'jewelry') loadProducts(active);
  }, [active]);

  // Cart sync
  useEffect(() => {
    const syncCart = () => {
      const stored = JSON.parse(localStorage.getItem('solenne_cart')) || [];
      setCartItems(stored);
    };

    syncCart();
    window.addEventListener('storage', syncCart);
    const interval = setInterval(syncCart, 1000);
    return () => {
      window.removeEventListener('storage', syncCart);
      clearInterval(interval);
    };
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Fetch orders failed:', err);
    }
  };

  const loadProducts = async (type = null) => {
    try {
      let url = '/api/products';
      if (type && (type === 'art' || type === 'jewelry')) {
        url += `?type=${type}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Fetch products failed:', err);
    }
  };

  const handleNavigation = (id) => {
    setActive(id);
    if (['profile', 'cart', 'wishlist', 'settings'].includes(id)) {
      router.push(`/${id}`);
    }
  };

  const handleAction = (action) => {
    const messages = {
      logout: 'Logging out...',
      switch: 'Switching account...',
      profile: 'Loading profile...',
    };
    toast.success(messages[action]);
    setTimeout(() => {
      if (action === 'logout' || action === 'switch') {
        router.push('/login');
      } else if (action === 'profile') {
        router.push('/profile');
      }
    }, 1500);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'profile', label: 'Profile', icon: <UserCircle2 size={20} /> },
    { id: 'products', label: 'All Products', icon: <ShoppingCart size={20} /> },
    {
      id: 'categories', label: 'Categories', icon: <Diamond size={20} />, submenu: [
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

  const totalQuantity = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  return (
    <>
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: sidebarOpen ? 0 : -300, opacity: sidebarOpen ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 14 }}
        className="w-72 min-h-screen relative bg-gradient-to-br from-purple-950 via-fuchsia-900 to-indigo-900 overflow-hidden shadow-[0_0_25px_rgba(255,0,255,0.3)] border-r border-fuchsia-700 flex flex-col pt-[72px] fixed top-0 left-0 z-40"
      >
        <motion.div
          animate={{ y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-b from-pink-600/20 to-purple-900/30 blur-2xl opacity-30"
        />

        <div className="flex items-center mb-10 relative px-6">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            className="text-3xl font-extrabold text-fuchsia-500 mr-1"
          >
            S
          </motion.span>
          <span className="text-2xl font-bold text-white tracking-widest glow-text">olenne</span>
        </div>

        <nav className="flex-1 px-6 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-fuchsia-700 scrollbar-track-transparent">
          <ul className="space-y-3">
            {navItems.map(item => (
              <li key={item.id}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md transition-all ${
                    active === item.id
                      ? 'bg-fuchsia-800/60 text-white shadow-lg shadow-fuchsia-700/60 ring-2 ring-fuchsia-500'
                      : 'hover:bg-fuchsia-700/30 text-purple-300'
                  }`}
                >
                  <div className="flex items-center gap-3 group">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="group-hover:text-fuchsia-300 transition"
                    >
                      {item.icon}
                    </motion.div>
                    <span>{item.label}</span>
                  </div>
                  {item.submenu && (
                    <ChevronRight className="text-fuchsia-400" size={16} />
                  )}
                </motion.button>

                {item.submenu && active === item.id && (
                  <ul className="ml-6 mt-2 space-y-2">
                    {item.submenu.map(sub => (
                      <li key={sub.id}>
                        <button
                          onClick={() => handleNavigation(sub.id)}
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

          <div className="flex items-center justify-around mt-8 text-purple-300">
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative hover:text-fuchsia-300 transition"
            >
              <ShoppingCart size={22} />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-xs text-white w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                  {totalQuantity}
                </span>
              )}
            </button>

            <button className="hover:text-fuchsia-300 transition">
              <Bell size={22} />
            </button>
          </div>

          <AnimatePresence>
            {cartOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-72 top-16 w-80 bg-gradient-to-br from-purple-900 to-fuchsia-900 shadow-2xl backdrop-blur-lg rounded-xl overflow-hidden border border-fuchsia-600 z-50 p-4"
              >
                <h3 className="text-lg font-semibold text-white mb-2">Your Cart</h3>
                {cartItems.length === 0 ? (
                  <p className="text-sm text-purple-300">Your cart is empty.</p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-fuchsia-700/70 pr-2">
                      {cartItems.map((item, index) => (
                        <div key={index} className="bg-purple-800/40 p-2 rounded-md">
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-sm text-purple-300">
                            {item.quantity || 1} × KES {item.price} ={' '}
                            <span className="font-semibold text-pink-400">
                              KES {item.price * (item.quantity || 1)}
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-between items-center text-white font-semibold">
                      <span>Total:</span>
                      <span className="text-pink-400">
                        KES {totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        router.push('/checkout');
                      }}
                      className="w-full mt-3 bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-semibold"
                    >
                      Proceed to Checkout
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
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
                      <LogOut size={18} className="text-red-400" /> Logout
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
    </>
  );
}
