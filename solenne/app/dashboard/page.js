'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import {
  Home,
  Settings, 
  DoorOpen,
  Diamond,
  Gift,
  Info,
  Phone,
  
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  Brush,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Bell,
  CreditCard,
} from 'lucide-react';
import Tilt from 'react-parallax-tilt';

const mockShopData = {
  shop_name: 'Artistic Wonders',
  user: {
    name: 'Jose Maria',
    avatar: 'https://i.pravatar.cc/40',
  },
  news: [
    'New exhibition opening next week!',
    'Free shipping on all orders over $100!',
    'Join our newsletter for exclusive deals.',
  ],
  products: {
    jewelry: {
      necklaces: [
        { id: 1, name: 'Gold Necklace', price: 150, image_url: 'https://via.placeholder.com/400x300?text=Gold+Necklace' },
        { id: 6, name: 'Emerald Necklace', price: 250, image_url: 'https://via.placeholder.com/400x300?text=Emerald+Necklace' },
        { id: 7, name: 'Ruby Necklace', price: 300, image_url: 'https://via.placeholder.com/400x300?text=Ruby+Necklace' },
      ],
      earrings: [
        { id: 2, name: 'Silver Earrings', price: 80, image_url: 'https://via.placeholder.com/400x300?text=Silver+Earrings' },
        { id: 8, name: 'Pearl Earrings', price: 120, image_url: 'https://via.placeholder.com/400x300?text=Pearl+Earrings' },
      ],
      rings: [
        { id: 5, name: 'Diamond Ring', price: 300, image_url: 'https://via.placeholder.com/400x300?text=Diamond+Ring' },
        { id: 9, name: 'Sapphire Ring', price: 280, image_url: 'https://via.placeholder.com/400x300?text=Sapphire+Ring' },
      ],
      bracelets: [
        { id: 10, name: 'Charm Bracelet', price: 95, image_url: 'https://via.placeholder.com/400x300?text=Charm+Bracelet' },
      ],
    },
    art: {
      paintings: [
        { id: 4, name: 'Abstract Painting', price: 100, image_url: 'https://via.placeholder.com/400x300?text=Abstract+Painting' },
        { id: 11, name: 'Landscape Painting', price: 180, image_url: 'https://via.placeholder.com/400x300?text=Landscape+Painting' },
      ],
      sculptures: [
        { id: 3, name: 'Modern Sculpture', price: 250, image_url: 'https://via.placeholder.com/400x300?text=Modern+Sculpture' },
        { id: 12, name: 'Bronze Sculpture', price: 320, image_url: 'https://via.placeholder.com/400x300?text=Bronze+Sculpture' },
      ],
      prints: [
        { id: 13, name: 'Limited Edition Print', price: 70, image_url: 'https://via.placeholder.com/400x300?text=Limited+Edition+Print' },
      ],
    },
  },
};

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  {
    id: 'jewelry',
    label: 'Jewelry',
    icon: Diamond,
    submenu: [
      { id: 'necklaces', label: 'Necklaces', icon: Heart },
      { id: 'earrings', label: 'Earrings', icon: Star },
      { id: 'rings', label: 'Rings', icon: Diamond },
      { id: 'bracelets', label: 'Bracelets', icon: Gift },
    ],
  },
  {
    id: 'art',
    label: 'Art',
    icon: Brush,
    submenu: [
      { id: 'paintings', label: 'Paintings', icon: Brush },
      { id: 'sculptures', label: 'Sculptures', icon: Diamond },
      { id: 'prints', label: 'Prints', icon: Gift },
    ],
  },
  { id: 'collections', label: 'Collections', icon: Star },
  { id: 'offers', label: 'Offers & Discounts', icon: Gift },
  { id: 'about', label: 'About Us', icon: Info },
  { id: 'contact', label: 'Contact', icon: Phone },
];

// Slider component for product lists
function ProductSlider({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = items.length;

  const prev = () => setCurrentIndex((i) => (i - 1 + total) % total);
  const next = () => setCurrentIndex((i) => (i + 1) % total);

  if (total === 0) {
    return <p className="text-purple-300 text-center mt-20 text-xl">No items to show here yet.</p>;
  }

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      <div className="overflow-hidden rounded-3xl shadow-xl ring-1 ring-purple-700 ring-opacity-50">
        <AnimatePresence initial={false}>
          <motion.div
            key={items[currentIndex].id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 p-6 rounded-3xl flex items-center gap-8"
          >
            <img
              src={items[currentIndex].image_url}
              alt={items[currentIndex].name}
              className="w-64 h-48 rounded-2xl object-cover shadow-lg border-4 border-purple-700"
            />
            <div>
              <h2 className="text-4xl font-extrabold text-purple-300 mb-2 drop-shadow-lg">
                {items[currentIndex].name}
              </h2>
              <p className="text-2xl text-purple-200 font-semibold">${items[currentIndex].price}</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 px-6 py-3 bg-purple-700 rounded-full shadow-lg hover:bg-purple-600 transition text-white font-semibold flex items-center gap-2"
                onClick={() => toast.success(`Added ${items[currentIndex].name} to cart!`)}
              >
                <ShoppingCart className="w-5 h-5" /> Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute top-1/2 -left-6 transform -translate-y-1/2 bg-purple-800 bg-opacity-60 rounded-full p-2 text-white hover:bg-purple-700 transition shadow-lg"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-purple-800 bg-opacity-60 rounded-full p-2 text-white hover:bg-purple-700 transition shadow-lg"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 space-x-3">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-4 h-4 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-purple-400' : 'bg-purple-800'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('home');
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [shopData, setShopData] = useState(null);

  useEffect(() => {
    setTimeout(() => setShopData(mockShopData), 1500);
  }, []);

  // Color scheme for main content based on selection
  const mainColors = {
    jewelry: 'from-purple-900 via-purple-700 to-purple-900',
    art: 'from-indigo-900 via-indigo-700 to-indigo-900',
    home: 'from-purple-950 via-purple-900 to-black',
    default: 'from-gray-900 via-gray-800 to-gray-900',
  };

  if (!shopData) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-purple-500 text-8xl font-extrabold"
          >
            A
          </motion.div>
          <div className="w-64 h-1 bg-purple-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-full bg-purple-400"
            />
          </div>
          <p className="text-purple-300 font-semibold text-lg tracking-wide animate-pulse max-w-xs text-center">
            Great Minds Think Alike ... Keep shining!
          </p>
        </div>
      </div>
    );
  }

  const toggleMenu = (id, hasSubmenu) => {
    if (hasSubmenu) {
      if (activeMenu === id) {
        setActiveSubmenu(null);
        setActiveMenu(null);
      } else {
        setActiveMenu(id);
        setActiveSubmenu(null);
      }
    } else {
      setActiveMenu(id);
      setActiveSubmenu(null);
    }
  };

  function renderContent() {
    if (!activeMenu) {
      return <p className="text-purple-400 text-center mt-20 text-xl">Select a category to explore amazing products</p>;
    }

    if (activeMenu === 'home') {
      return (
        <div className="text-center max-w-4xl mx-auto space-y-12">
          <div>
            <h2 className="text-5xl font-extrabold text-purple-300 mb-4 drop-shadow-lg">
              Welcome to {shopData.shop_name}!
            </h2>
            <p className="text-xl text-purple-200">
              Discover rare jewelry and breathtaking artwork crafted by visionary creators. Curated with love and brilliance.
            </p>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Featured Jewelry */}
            <div className="bg-purple-800/20 p-6 rounded-xl border border-purple-600 shadow-xl hover:shadow-2xl transition duration-300">
              <h3 className="text-2xl font-bold text-purple-100 mb-2">🌟 Featured Jewelry</h3>
              <p className="text-purple-300 mb-4">
                Handcrafted crystal necklaces, glowing gemstone rings, and elegant earrings inspired by nature.
              </p>
              <div className="flex justify-center">
                <img
                  src="https://www.orra.co.in/media/catalog/product/cache/0223386358b565e9d65c640854c3ad24/o/s/osn23050.jpg"
                  alt="Jewelry"
                  className="h-40 object-cover rounded-lg border-2 border-purple-700"
                />
              </div>
            </div>
    
            {/* Featured Artwork */}
            <div className="bg-purple-800/20 p-6 rounded-xl border border-purple-600 shadow-xl hover:shadow-2xl transition duration-300">
              <h3 className="text-2xl font-bold text-purple-100 mb-2">🎨 Featured Artwork</h3>
              <p className="text-purple-300 mb-4">
                Vibrant canvases and ethereal digital pieces that speak to the soul. Browse our latest art drops.
              </p>
              <div className="flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa"
                  alt="Artwork"
                  className="h-40 object-cover rounded-lg border-2 border-purple-700"
                />
              </div>
            </div>
          </div>
    
          <div className="bg-purple-900/40 rounded-xl py-8 px-6 border border-purple-700 shadow-inner">
            <h4 className="text-2xl font-bold text-purple-200 mb-2">🧙‍♀️ Join Our Creative Circle</h4>
            <p className="text-purple-300 mb-4">
              Subscribe to get exclusive previews, early product access, and behind-the-scenes content from our artists.
            </p>
            <button className="bg-purple-700 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
              Subscribe Now
            </button>
          </div>
        </div>
      );
    }
    

    if ((activeMenu === 'jewelry' || activeMenu === 'art') && activeSubmenu) {
      const categoryItems =
        activeMenu === 'jewelry'
          ? shopData.products.jewelry[activeSubmenu] || []
          : shopData.products.art[activeSubmenu] || [];

      return (
        <div>
          <h2 className="text-4xl font-bold text-purple-300 mb-8 capitalize drop-shadow-lg">
            {activeSubmenu} {activeMenu === 'jewelry' ? 'Jewelry' : 'Art'}
          </h2>
          <ProductSlider items={categoryItems} />
        </div>
      );
    }

    if ((activeMenu === 'jewelry' || activeMenu === 'art') && !activeSubmenu) {
      return (
        <p className="text-purple-400 text-center mt-20 text-xl">
          Please select a subcategory to view {activeMenu === 'jewelry' ? 'jewelry' : 'art'} products.
        </p>
      );
    }

    return <p className="text-purple-400 text-center mt-20 text-xl">Explore our amazing collections and offers!</p>;
  }

  return (
    <>
      <Toaster richColors />
      <div className="flex h-screen w-screen overflow-hidden bg-gradient-to-br from-black via-purple-900 to-black text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-purple-900 to-purple-700 p-6 flex flex-col">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="text-4xl font-extrabold text-purple-400"
            >
              A
            </motion.div>
            <span className="text-3xl font-extrabold text-purple-300 tracking-widest">rtistic Wonders</span>
          </div>
  
          {/* Menu */}
          <nav className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2">
            {menuItems.map(({ id, label, icon: Icon, submenu }) => {
              const isActive = activeMenu === id;
              return (
                <div key={id}>
                  <button
                    onClick={() => toggleMenu(id, !!submenu)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md ${
                      isActive ? 'bg-purple-700 shadow-lg' : 'hover:bg-purple-800/70'
                    } transition-colors duration-300`}
                    aria-expanded={isActive}
                    aria-controls={`${id}-submenu`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-purple-300" />
                      <span className="text-lg font-semibold text-purple-200">{label}</span>
                    </div>
                    {submenu && (
                      <span className="text-purple-300">
                        {isActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    )}
                  </button>
                  {submenu && isActive && (
                    <div
                      id={`${id}-submenu`}
                      className="flex flex-col ml-10 mt-2 gap-2 border-l border-purple-600 pl-4"
                      role="region"
                      aria-label={`${label} subcategories`}
                    >
                      {submenu.map(({ id: subId, label: subLabel, icon: SubIcon }) => (
                        <button
                          key={subId}
                          onClick={() => setActiveSubmenu(subId)}
                          className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-purple-300 font-medium ${
                            activeSubmenu === subId ? 'bg-purple-600 shadow-inner' : 'hover:bg-purple-700/70'
                          } transition-colors duration-300`}
                          aria-current={activeSubmenu === subId ? 'true' : undefined}
                        >
                          <SubIcon className="w-4 h-4" />
                          {subLabel}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
  
          {/* User info */}
          <div className="mt-auto relative z-50">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)}>
              <img
                src={shopData.user.avatar}
                alt={shopData.user.name}
                className="w-10 h-10 rounded-full ring-2 ring-purple-400 transition-transform duration-300 hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-purple-300 font-semibold">{shopData.user.name}</span>
                <span className="text-purple-500 text-sm">User</span>
              </div>
            </div>
  
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-16 right-0 w-56 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 border border-purple-500/30 shadow-2xl rounded-xl overflow-hidden"
              >
                <div className="flex flex-col text-sm text-purple-200">
                  <button
                    className="flex items-center gap-2 px-4 py-3 hover:bg-purple-600/30 transition-colors"
                    onClick={() => toast('Opening settings...')}
                  >
                    <Settings className="w-4 h-4 text-purple-400" /> Settings
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-3 hover:bg-purple-600/30 transition-colors"
                    onClick={() => toast('Leaving shop...')}
                  >
                    <DoorOpen className="w-4 h-4 text-purple-400" /> Leave Shop
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-3 hover:bg-purple-600/30 text-red-300 transition-colors"
                    onClick={() => toast('Logged out!')}
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </aside>
  
        {/* Main content */}
        <main
          className={`flex-1 overflow-y-auto p-10 bg-gradient-to-br ${
            mainColors[activeMenu] || mainColors.default
          } scrollbar-thin scrollbar-thumb-purple-700 scrollbar-track-black`}
        >
          {renderContent()}
        </main>
      </div>
    </>
  );
}  