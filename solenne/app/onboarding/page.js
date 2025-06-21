'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  Sparkles,
  Paintbrush
} from "lucide-react";
import { toast } from 'sonner';

export default function OnboardingPage() {
  const router = useRouter();

  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [hoveredShop, setHoveredShop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spinnerLetter, setSpinnerLetter] = useState('');
  const [hint, setHint] = useState('Step 1: Hover over a shop to discover its details');
  const [shopStats, setShopStats] = useState({ total: 0, jewelry: 0, art: 0 });
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('http://localhost:5000/api/shops')
      .then(res => res.json())
      .then(data => {
        setShops(data);
        const jewelry = data.filter(s => s.type === 'jewelry').length;
        const art = data.filter(s => s.type === 'art').length;
        setShopStats({ total: data.length, jewelry, art });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const stars = document.createElement("div");
    stars.className =
      "pointer-events-none fixed inset-0 z-0 bg-[url('/sparkle.svg')] bg-cover opacity-10 animate-pulse";
    document.body.appendChild(stars);
    return () => document.body.removeChild(stars);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/trail.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  function enterGallery() {
    if (selectedShop) {
      const letter = selectedShop.name?.charAt(0)?.toUpperCase() || 'S';
      setSpinnerLetter(letter);
      localStorage.setItem("solenne_spinner_letter", letter);
      setLoading(true);
      setHint("Step 3: Entering the gallery...");
      setTimeout(() => {
        toast.success(`Entering ${selectedShop.name}'s gallery...`);
        router.push("/dashboard" );
      }, 2000);
    } else {
      toast.error("Please select a shop to enter.");
    }
  }

  

  const filteredShops = filter === 'All' ? shops : shops.filter(shop => shop.type.toLowerCase() === filter.toLowerCase());

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f001a] via-[#1a002b] to-[#2b0044] text-white overflow-hidden relative font-sans">
      <main className="flex-1 px-10 py-12 relative z-10 overflow-y-auto min-h-screen max-w-screen-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-300 to-fuchsia-500 bg-clip-text text-transparent animate-text-glow">
            Welcome to <span className="text-fuchsia-300">Solenne</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl italic text-purple-200 max-w-2xl mx-auto drop-shadow-lg">
            Discover rare artisan jewelry and mystical artwork crafted by visionaries.
          </p>
          <p className="mt-3 text-purple-400 italic text-sm animate-pulse tracking-wide">
            Hover over a shop to learn more. Click to explore its gallery!
          </p>
          <p className="mt-4 text-sm text-fuchsia-300 font-medium">
            🛍️ {shopStats.total} Shops · 💍 {shopStats.jewelry} Jewelry · 🎨 {shopStats.art} Art
          </p>
        </motion.div>

        <div className="flex justify-center gap-4 mb-12">
          {['All', 'Art', 'Jewelry'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 text-sm tracking-wide
                ${filter === cat
                  ? 'bg-fuchsia-600 text-white shadow-lg'
                  : 'bg-purple-900/50 text-purple-300 hover:bg-purple-800'}
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-16 max-w-screen-2xl mx-auto px-4"
        >
          {filteredShops.map((shop) => (
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.45}
              scale={1.03}
              key={shop.id}
              onEnter={() => {
                setHoveredShop(shop);
                setHint(`Step 2: Click '${shop.name}' to enter`);
              }}
              onLeave={() => {
                setHoveredShop(null);
                setHint('Step 1: Hover over a shop to discover its details');
              }}
              tiltMaxAngleX={15}
              tiltMaxAngleY={15}
            >
              <motion.div
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.97 }}
                className={`group relative rounded-3xl border border-purple-600/40 p-6 bg-white/5 backdrop-blur-xl shadow-[0_12px_50px_rgba(255,0,255,0.2)] cursor-pointer transition-all duration-300 hover:shadow-fuchsia-500/60 min-h-[400px] ${
                  selectedShop?.id === shop.id ? "ring-4 ring-fuchsia-400 animate-pulse-slow" : ""
                }`}
                onClick={() => setSelectedShop(shop)}
              >
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-fuchsia-500/50 to-purple-700/20 blur-2xl opacity-0 group-hover:opacity-80 transition-opacity pointer-events-none" />
                <div className="aspect-[4/3] overflow-hidden rounded-2xl mb-5">
                  <img
                    src={shop.image_url?.startsWith('http') ? shop.image_url : `http://localhost:5000/uploads/${shop.image_url}`}
                    alt={shop.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-500 ease-in-out hover:scale-105"
                  />
                </div>
                <div className="flex justify-center mb-3 z-10 relative">
                  {shop.type === "jewelry" ? (
                    <Sparkles className="w-10 h-10 text-fuchsia-400 drop-shadow-[0_0_6px_rgba(255,0,255,0.8)] animate-pulse" />
                  ) : (
                    <Paintbrush className="w-10 h-10 text-indigo-400 drop-shadow-[0_0_8px_rgba(75,0,130,0.9)] animate-pulse" />
                  )}
                </div>
                <h2 className="text-3xl font-bold text-white drop-shadow-lg relative tracking-wide text-center">
                  {shop.name}
                </h2>
                <p className="capitalize text-purple-300 tracking-wide font-medium text-base text-center">
                  {shop.type}
                </p>
                {hoveredShop?.id === shop.id && (
                  <p className="text-sm text-purple-400 mt-2 font-semibold select-none text-center">
                    Click to explore the {shop.type} collection.
                  </p>
                )}
              </motion.div>
            </Tilt>
          ))}
        </motion.div>

        <motion.div
          className="fixed bottom-4 right-4 bg-fuchsia-900/80 text-white p-4 rounded-xl shadow-2xl max-w-xs z-40 border border-fuchsia-500 backdrop-blur-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-fuchsia-200 italic">🔮 {hint}</p>
        </motion.div>

        <AnimatePresence>
          {selectedShop && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#170022cc] backdrop-blur-md p-6 border-t border-purple-700 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto"
            >
              <div>
                <p className="text-xl text-purple-100">
                  You selected: <span className="font-bold text-fuchsia-400">{selectedShop.name}</span>
                </p>
                <p className="text-sm text-purple-300 tracking-wide capitalize">
                  Type: {selectedShop.type}
                </p>
              </div>
              <button
                onClick={enterGallery}
                className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-8 py-3 rounded-full font-semibold shadow-xl hover:shadow-fuchsia-500/60 transition-all duration-300 animate-glow"
              >
                Enter the Gallery
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 text-white"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="flex flex-col items-center gap-6"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="w-24 h-24 rounded-full border-[6px] border-fuchsia-400 flex items-center justify-center text-5xl font-bold bg-gradient-to-br from-fuchsia-600 to-purple-800 shadow-2xl text-white"
                >
                  {spinnerLetter}
                </motion.div>
                <p className="text-xl font-semibold animate-pulse text-fuchsia-300">
                  WE ON GO 
                </p>
                <p className="text-sm text-purple-300 opacity-80">
                  Preparing {selectedShop?.name}'s gallery for you...
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
