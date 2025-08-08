'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Heart, X } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

const API = 'http://localhost:5000/api';

export default function Dashboard() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [spinnerLetter, setSpinnerLetter] = useState('S');
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    setSpinnerLetter(localStorage.getItem('solenne_spinner_letter') || 'S');

    const localCart = JSON.parse(localStorage.getItem('solenne_cart')) || [];
    setCartItems(localCart);

    setTimeout(() => {
      fetch(`${API}/products/`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to fetch products:', err);
          toast.error('Failed to load products');
          setLoading(false);
        });
    }, 1500);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          const dist = Math.sqrt(Math.pow(coords.lat - -1.2921, 2) + Math.pow(coords.lng - 36.8219, 2));
          setDeliveryFee((dist * 100).toFixed(2));
        },
        () => toast.error('Could not get location')
      );
    }
  }, []);

  const addToCart = (product) => {
    const stored = JSON.parse(localStorage.getItem('solenne_cart')) || [];
    const index = stored.findIndex((item) => item.id === product.id);

    if (index !== -1) {
      stored[index].quantity += 1;
    } else {
      stored.push({ ...product, quantity: 1, price: Number(product.price) });
    }

    localStorage.setItem('solenne_cart', JSON.stringify(stored));
    setCartItems(stored);
    toast.success(`${product.name} added to cart ✨`);
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((fid) => fid !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const openModal = (p) => setSelectedProduct(p);
  const closeModal = () => setSelectedProduct(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-purple-500 text-8xl font-extrabold"
          >
            {spinnerLetter}
          </motion.div>
          <div className="w-64 h-1 bg-purple-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-full bg-purple-400"
            />
          </div>
          <p className="text-purple-300 font-semibold text-lg animate-pulse max-w-xs text-center">
            Great minds think alike... Embrace the ethereal energy 🌌
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a001f] via-[#120033] to-[#1f0050] text-white relative overflow-hidden">
      <Sidebar />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`transition-all duration-500 px-6 py-10 md:ml-72`}
      >
        <h1 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-300 drop-shadow-lg tracking-tight">
          Welcome to Solenne Gallery
        </h1>

        {location && (
          <p className="text-purple-300 text-sm mb-4">
            Location: Lat {location.lat.toFixed(2)}, Lng {location.lng.toFixed(2)} — Delivery: <span className="text-fuchsia-400 font-bold">Ksh {deliveryFee}</span>
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 relative z-10">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.05, boxShadow: '0px 0px 30px rgba(236, 72, 153, 0.5)' }}
              className="relative bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-xl group transition-all duration-300 border border-purple-700/30 hover:border-fuchsia-600"
            >
              <div className="relative group">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-52 object-cover rounded-xl mb-4 border-2 border-purple-500/20 group-hover:ring-4 group-hover:ring-fuchsia-500/30 transition"
                  onClick={() => openModal(product)}
                />
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="absolute top-2 right-2"
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart
                    size={22}
                    className={`cursor-pointer transition ${
                      favorites.includes(product.id)
                        ? 'text-fuchsia-500 fill-fuchsia-500 animate-pulse'
                        : 'text-gray-400'
                    }`}
                  />
                </motion.div>
              </div>

              <h2 className="text-lg font-bold text-purple-200">{product.name}</h2>
              <p className="text-sm text-purple-300 mt-1">{product.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-lg font-bold text-fuchsia-300">Ksh {product.price}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="text-sm px-4 py-1 rounded-full bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:scale-105 transition shadow-md"
                >
                  Add
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-purple-900 to-indigo-950 p-6 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-white hover:text-fuchsia-300"
              >
                <X size={22} />
              </button>
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="w-full h-64 object-cover rounded-xl mb-4"
              />
              <h2 className="text-2xl font-bold text-purple-100">{selectedProduct.name}</h2>
              <p className="text-purple-300 mt-2 mb-4">{selectedProduct.description}</p>
              <p className="text-xl text-fuchsia-400 font-semibold mb-4">Ksh {selectedProduct.price}</p>
              <button
                onClick={() => {
                  addToCart(selectedProduct);
                  closeModal();
                }}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-purple-700 hover:scale-105 transition font-bold shadow-xl"
              >
                Add to Cart
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Optional particle or star overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background: `radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.1), transparent 70%), radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.1), transparent 70%)`,
        }}
      />
    </div>
  );
}
