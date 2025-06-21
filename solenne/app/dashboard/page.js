'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Heart, ShoppingCart, X, Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

const API = 'http://localhost:5000/api';

export default function Dashboard() {
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [spinnerLetter, setSpinnerLetter] = useState('');
  const [loading, setLoading] = useState(true);

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
  }, []);

  const addToCart = (product) => {
    const existing = cartItems.find((item) => item.product_id === product.id);
    let updated;

    if (existing) {
      updated = cartItems.map((item) =>
        item.product_id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updated = [
        ...cartItems,
        {
          product_id: product.id,
          name: product.name,
          image_url: product.image_url,
          price: parseFloat(product.price),
          quantity: 1
        }
      ];
    }

    toast.success(`${product.name} added to cart`);
    setCartItems(updated);
    localStorage.setItem('solenne_cart', JSON.stringify(updated));
  };

  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  const openModal = (product) => setSelectedProduct(product);
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
          <p className="text-purple-300 font-semibold text-lg tracking-wide animate-pulse max-w-xs text-center">
            Great Minds Think Alike ... Keep shining!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#100020] via-[#180030] to-[#1f0040] text-white">
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="relative flex items-center justify-between px-6 py-3 bg-gradient-to-r from-purple-950/70 via-fuchsia-900/60 to-indigo-900/70 backdrop-blur-lg shadow-xl border-b border-fuchsia-700">
          <Navbar cartCount={cartItems.length} notificationCount={2} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white hover:text-fuchsia-300 md:hidden"
          >
            <Menu size={26} />
          </button>
        </div>
      </div>

      <div className="flex pt-[72px]">
        {sidebarOpen && (
          <div className="hidden md:block h-[calc(100vh-72px)] pt-[0px] fixed top-[72px] left-0 z-40">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        )}

        <main
          className={`transition-all duration-300 px-6 py-10 w-full ${
            sidebarOpen ? 'md:ml-72' : 'ml-0'
          }`}
        >
          <h1 className="text-4xl font-extrabold mb-8 text-white tracking-tight">
            Welcome to Solenne Gallery
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.05 }}
                className="relative bg-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg group transition-all duration-300"
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-52 object-cover rounded-xl mb-4 group-hover:shadow-purple-500/50"
                  onClick={() => openModal(product)}
                />
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-purple-200">{product.name}</h2>
                  <button onClick={() => toggleFavorite(product.id)}>
                    <Heart
                      size={20}
                      className={`transition ${
                        favorites.includes(product.id)
                          ? 'text-fuchsia-500 fill-fuchsia-500'
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
                <p className="text-sm text-purple-300 mt-1">{product.description}</p>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-lg font-bold text-fuchsia-300">Ksh {product.price}</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="text-sm px-4 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
                  >
                    Add
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          >
            <div className="bg-gradient-to-br from-purple-900 to-indigo-950 p-6 rounded-2xl shadow-2xl w-full max-w-lg relative">
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
                className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {cartItems.length > 0 && (
        <div className="fixed bottom-5 right-5 bg-fuchsia-900/80 backdrop-blur-md shadow-lg text-white px-5 py-3 rounded-full flex items-center space-x-4 z-50">
          <ShoppingCart size={20} />
          <p className="text-sm">Cart: {cartItems.length} item{cartItems.length > 1 && 's'}</p>
          <button
            onClick={() => router.push('/checkout')}
            className="text-sm bg-purple-700 px-3 py-1 rounded-lg hover:bg-purple-800"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}
