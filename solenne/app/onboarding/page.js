'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Tilt from "react-parallax-tilt";
import {
  Sparkles,
  Paintbrush,
} from "lucide-react";
import { toast } from 'sonner';
import Sidebar from "@/components/Sidebar"; 

export default function OnboardingPage() {
  const router = useRouter();

  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [hoveredShop, setHoveredShop] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/shops')
      .then(res => res.json())
      .then(data => setShops(data))
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
      toast.success(`Entering ${selectedShop.name}'s gallery...`);
      router.push("/dashboard");
    } else {
      toast.error("Please select a shop to enter.");
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f001a] via-[#1a002b] to-[#2b0044] text-white overflow-hidden relative font-sans">
      <Sidebar />

      <main className="flex-1 ml-0 sm:ml-72 p-8 relative z-10 overflow-y-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto mb-14"
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
        </motion.div>

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
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 max-w-7xl mx-auto"
        >
          {shops.map((shop) => (
            <Tilt
              glareEnable={true}
              glareMaxOpacity={0.45}
              scale={1.03}
              key={shop.id}
              onEnter={() => setHoveredShop(shop)}
              onLeave={() => setHoveredShop(null)}
              tiltMaxAngleX={15}
              tiltMaxAngleY={15}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative rounded-3xl border border-purple-600/40 p-5 bg-white/5 backdrop-blur-xl shadow-[0_12px_50px_rgba(255,0,255,0.2)] cursor-pointer transition-all duration-300 hover:shadow-fuchsia-500/60 ${
                  selectedShop?.id === shop.id ? "ring-4 ring-fuchsia-400 animate-pulse-slow" : ""
                }`}
                onClick={() => setSelectedShop(shop)}
              >
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-fuchsia-500/50 to-purple-700/20 blur-2xl opacity-0 group-hover:opacity-80 transition-opacity pointer-events-none" />
                <img
                  src={shop.image}
                  alt={shop.name}
                  className="rounded-2xl w-full h-36 object-cover mb-5 shadow-lg"
                />
                <div className="flex justify-center mb-3 z-10 relative">
                  {shop.type === "jewelry" ? (
                    <Sparkles className="w-10 h-10 text-fuchsia-400 drop-shadow-[0_0_6px_rgba(255,0,255,0.8)] animate-pulse" />
                  ) : (
                    <Paintbrush className="w-10 h-10 text-indigo-400 drop-shadow-[0_0_8px_rgba(75,0,130,0.9)] animate-pulse" />
                  )}
                </div>
                <h2 className="text-2xl font-extrabold text-white drop-shadow-lg relative tracking-wide">
                  {shop.name}
                </h2>
                <p className="capitalize text-purple-300 tracking-wide font-medium text-sm">
                  {shop.type}
                </p>
                {hoveredShop?.id === shop.id && (
                  <p className="text-xs text-purple-400 mt-2 font-semibold select-none">
                    Click to explore the {shop.type} collection.
                  </p>
                )}
              </motion.div>
            </Tilt>
          ))}
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
                  You selected:{" "}
                  <span className="font-bold text-fuchsia-400">{selectedShop.name}</span>
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
      </main>
    </div>
  );
}
